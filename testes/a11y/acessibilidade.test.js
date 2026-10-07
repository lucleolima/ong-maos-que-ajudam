// Testes automáticos de acessibilidade (WCAG 2.1 A e AA) num Chrome sem janela (headless).
// Rodar com: npm run test:a11y          (código-fonte)
//            npm run test:a11y:dist     (pasta dist/, depois do build)
//
// - axe-core audita as 4 páginas nos 3 temas (claro, escuro e alto contraste)
// - navegação por teclado: link "pular conteúdo", submenu com Esc, botões de tema
// - reflow: em 320px de largura não pode haver rolagem horizontal (WCAG 1.4.10)
//
// Usa o Chrome já instalado (puppeteer-core não baixa navegador). Se ele estiver
// em outro lugar, informe o caminho em CHROME_PATH.

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import puppeteer from 'puppeteer-core';
import { criarServidor } from '../../scripts/servidor.js';

const require = createRequire(import.meta.url);
const axeFonte = require('axe-core').source;

const PASTA = process.env.PASTA_SITE ?? '.';
const PORTA = 5599;
const PAGINA = `http://localhost:${PORTA}/html/index.html`;
const ROTAS = ['inicio', 'projetos', 'cadastro', 'inscricoes'];
const TEMAS = {
  claro: { tema: 'claro', contraste: 'normal' },
  escuro: { tema: 'escuro', contraste: 'normal' },
  'alto contraste': { tema: 'claro', contraste: 'alto' }
};

function caminhoDoChrome() {
  const candidatos = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  ];
  const caminho = candidatos.find((c) => c && existsSync(c));
  if (!caminho) throw new Error('Chrome não encontrado: defina a variável CHROME_PATH');
  return caminho;
}

let servidor;
let navegador;

before(async () => {
  servidor = criarServidor(PASTA);
  await new Promise((pronto) => servidor.listen(PORTA, pronto));
  navegador = await puppeteer.launch({
    executablePath: caminhoDoChrome(),
    headless: true,
    // O Ubuntu do GitHub Actions bloqueia a sandbox do Chrome; no CI a máquina já é isolada
    args: process.env.CI ? ['--no-sandbox'] : []
  });
});

after(async () => {
  await navegador?.close();
  servidor?.close();
});

// Abre uma rota já com o tema salvo no localStorage (como se a pessoa tivesse escolhido antes)
async function abrir(rota, preferencias = TEMAS.claro, largura = 1280) {
  const pagina = await navegador.newPage();
  await pagina.setViewport({ width: largura, height: 800 });
  await pagina.evaluateOnNewDocument((p) => {
    localStorage.setItem('maos-que-ajudam:tema', JSON.stringify(p.tema));
    localStorage.setItem('maos-que-ajudam:contraste', JSON.stringify(p.contraste));
  }, preferencias);
  await pagina.goto(`${PAGINA}#/${rota}`, { waitUntil: 'networkidle0' });
  await pagina.waitForSelector('#conteudo h1');
  // Espera a animação de entrada terminar: no meio dela as cores ainda estão transparentes
  await pagina.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
  return pagina;
}

for (const [nomeTema, preferencias] of Object.entries(TEMAS)) {
  for (const rota of ROTAS) {
    test(`axe (WCAG 2.1 AA): #/${rota} no tema ${nomeTema}`, async () => {
      const pagina = await abrir(rota, preferencias);
      await pagina.evaluate(axeFonte);
      const resultado = await pagina.evaluate(() => axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] }
      }));
      await pagina.close();

      const problemas = resultado.violations.map((v) =>
        `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
      assert.deepEqual(problemas, [], problemas.join('\n'));
    });
  }
}

test('Teclado: o primeiro Tab mostra "Pular para o conteúdo" e Enter leva o foco ao <main>', async () => {
  const pagina = await abrir('inicio');
  await pagina.keyboard.press('Tab');
  assert.equal(await pagina.evaluate(() => document.activeElement.textContent.trim()), 'Pular para o conteúdo');
  await pagina.keyboard.press('Enter');
  assert.equal(await pagina.evaluate(() => document.activeElement.id), 'conteudo');
  await pagina.close();
});

test('Teclado: o submenu abre com o foco e fecha com Esc, devolvendo o foco a "Projetos"', async () => {
  const pagina = await abrir('inicio');
  const fimDasTransicoes = () => pagina.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
  const visibilidade = () => pagina.$eval('.submenu', (s) => getComputedStyle(s).visibility);

  // Caminho real do teclado: foco em "Projetos" abre o submenu e o Tab entra nele
  await pagina.focus('.menu-link[data-rota="projetos"]');
  await pagina.keyboard.press('Tab');
  await fimDasTransicoes();
  assert.equal(await visibilidade(), 'visible');
  assert.equal(await pagina.evaluate(() => document.activeElement.textContent), 'Aprender Juntos');

  await pagina.keyboard.press('Escape');
  await fimDasTransicoes();
  assert.equal(await visibilidade(), 'hidden');
  assert.equal(await pagina.evaluate(() => document.activeElement.dataset.rota), 'projetos');
  await pagina.close();
});

test('Teclado: botões de tema funcionam com Espaço e informam o estado (aria-pressed)', async () => {
  const pagina = await abrir('inicio');
  await pagina.focus('[data-preferencia="tema"]');
  await pagina.keyboard.press('Space');
  const estado = await pagina.evaluate(() => ({
    pressionado: document.querySelector('[data-preferencia="tema"]').getAttribute('aria-pressed'),
    tema: document.documentElement.dataset.tema,
    salvo: localStorage.getItem('maos-que-ajudam:tema')
  }));
  assert.deepEqual(estado, { pressionado: 'true', tema: 'escuro', salvo: '"escuro"' });
  await pagina.close();
});

// A WCAG pede 320px; testar também 300px dá folga para fontes mais largas
// (no Linux do GitHub Actions o cabeçalho estourava 10px e no Windows não)
test('Reflow: nenhuma página rola na horizontal com 320px de largura (zoom de 400%)', async () => {
  for (const largura of [320, 300]) {
    for (const rota of ROTAS) {
      const pagina = await abrir(rota, TEMAS.claro, largura);
      const larguraDaPagina = await pagina.evaluate(() => document.documentElement.scrollWidth);
      await pagina.close();
      assert.ok(larguraDaPagina <= largura, `#/${rota} tem ${larguraDaPagina}px numa tela de ${largura}px`);
    }
  }
});
