// Build de produção: gera a pasta dist/ com tudo otimizado. Rodar com: npm run build
//
//   CSS      5 arquivos -> 1 (css/estilos.min.css), minificado pelo esbuild
//   JS       16 módulos -> 1 pacote (js/main.min.js), minificado, com source map
//   HTML     comentários e espaços removidos; links trocados pelos arquivos .min
//   Imagens  SVG otimizado (svgo); JPG, PNG e WebP recomprimidos (sharp)
//
// A estrutura de pastas (html/, css/, js/, imagens/) é a mesma do código-fonte,
// então os caminhos relativos (../imagens/...) continuam funcionando.

import { rm, mkdir, readFile, writeFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import * as esbuild from 'esbuild';
import { minify as minificarHtml } from 'html-minifier-terser';
import { optimize as otimizarSvg } from 'svgo';
import sharp from 'sharp';

const DIST = 'dist';
const ARQUIVOS_CSS = ['design-system', 'layout', 'componentes', 'interatividade', 'temas'];
const NAVEGADORES = ['chrome100', 'firefox100', 'safari15', 'edge100'];

const relatorio = [];

async function tamanho(arquivo) {
  return (await stat(arquivo)).size;
}

function registrar(tipo, antes, depois, gzip) {
  relatorio.push({ tipo, antes, depois, gzip });
}

async function somarTamanhos(arquivos) {
  const tamanhos = await Promise.all(arquivos.map(tamanho));
  return tamanhos.reduce((total, t) => total + t, 0);
}

async function construirCss() {
  const destino = `${DIST}/css/estilos.min.css`;
  // Um "arquivo virtual" com os @import na ordem certa; o esbuild junta e minifica
  await esbuild.build({
    stdin: {
      contents: ARQUIVOS_CSS.map((nome) => `@import "./${nome}.css";`).join('\n'),
      resolveDir: 'css',
      loader: 'css'
    },
    bundle: true,
    minify: true,
    target: NAVEGADORES,
    outfile: destino,
    logLevel: 'warning'
  });
  const conteudo = await readFile(destino);
  registrar('CSS', await somarTamanhos(ARQUIVOS_CSS.map((n) => `css/${n}.css`)), conteudo.length, gzipSync(conteudo).length);
}

async function listarJs(pasta) {
  const itens = await readdir(pasta, { withFileTypes: true, recursive: true });
  return itens.filter((i) => i.isFile() && i.name.endsWith('.js')).map((i) => path.join(i.parentPath, i.name));
}

async function construirJs() {
  // Módulos da SPA: o esbuild segue os import a partir do main.js e gera um arquivo só
  await esbuild.build({
    entryPoints: ['js/main.js'],
    bundle: true,
    minify: true,
    format: 'esm',
    target: NAVEGADORES,
    sourcemap: 'linked', // o DevTools mostra o código original ao depurar
    outfile: `${DIST}/js/main.min.js`,
    logLevel: 'warning'
  });
  // Script do tema: continua separado porque precisa rodar antes da página aparecer
  await esbuild.build({
    entryPoints: ['js/tema-inicial.js'],
    minify: true,
    target: NAVEGADORES,
    outfile: `${DIST}/js/tema-inicial.min.js`,
    logLevel: 'warning'
  });

  const gerados = [`${DIST}/js/main.min.js`, `${DIST}/js/tema-inicial.min.js`];
  const conteudo = Buffer.concat(await Promise.all(gerados.map((a) => readFile(a))));
  registrar('JavaScript', await somarTamanhos(await listarJs('js')), conteudo.length, gzipSync(conteudo).length);
}

const OPCOES_HTML = {
  collapseWhitespace: true,
  conservativeCollapse: true, // mantém um espaço onde havia quebra de linha entre textos
  removeComments: true,
  removeRedundantAttributes: true,
  minifyCSS: true,
  minifyJS: true
};

async function construirHtml() {
  let html = await readFile('html/index.html', 'utf8');

  // Troca os 5 <link> de CSS por um só, preservando o primeiro lugar da lista
  const links = ARQUIVOS_CSS.map((nome) => `<link rel="stylesheet" href="../css/${nome}.css">`);
  if (!links.every((link) => html.includes(link))) {
    throw new Error('html/index.html: algum <link> de CSS mudou; atualize ARQUIVOS_CSS em scripts/build.js');
  }
  html = html.replace(links[0], '<link rel="stylesheet" href="../css/estilos.min.css">');
  links.slice(1).forEach((link) => { html = html.replace(link, ''); });

  // O script do tema tem menos de 0.5 KB e bloqueia a renderização: embutido no HTML
  // economiza uma requisição antes da primeira pintura (por isso o JS é construído antes)
  const temaInicial = (await readFile(`${DIST}/js/tema-inicial.min.js`, 'utf8')).trim();
  html = html
    .replace('<script src="../js/tema-inicial.js"></script>', () => `<script>${temaInicial}</script>`)
    .replace('src="../js/main.js"', 'src="../js/main.min.js"');

  const paginas = [['html/index.html', `${DIST}/html/index.html`], ['index.html', `${DIST}/index.html`]];
  let antes = 0;
  let depois = Buffer.alloc(0);
  for (const [origem, destino] of paginas) {
    const fonte = origem === 'html/index.html' ? html : await readFile(origem, 'utf8');
    const minificado = await minificarHtml(fonte, OPCOES_HTML);
    await mkdir(path.dirname(destino), { recursive: true });
    await writeFile(destino, minificado);
    antes += await tamanho(origem);
    depois = Buffer.concat([depois, Buffer.from(minificado)]);
  }
  registrar('HTML', antes, depois.length, gzipSync(depois).length);
}

async function otimizarImagem(origem, destino) {
  const extensao = path.extname(origem);
  if (extensao === '.svg') {
    const { data } = otimizarSvg(await readFile(origem, 'utf8'), { multipass: true });
    await writeFile(destino, data);
  } else {
    const imagem = sharp(origem);
    if (extensao === '.jpg') imagem.jpeg({ quality: 75, mozjpeg: true });
    if (extensao === '.png') imagem.png({ compressionLevel: 9, palette: true });
    if (extensao === '.webp') imagem.webp({ quality: 75 });
    await imagem.toFile(destino);
  }
  // Se a "otimização" ficou maior que o original, fica o original
  if ((await tamanho(destino)) > (await tamanho(origem))) {
    await writeFile(destino, await readFile(origem));
  }
}

async function construirImagens() {
  await mkdir(`${DIST}/imagens`, { recursive: true });
  const arquivos = (await readdir('imagens')).filter((a) => /\.(svg|jpe?g|png|webp)$/.test(a));
  await Promise.all(arquivos.map((a) => otimizarImagem(`imagens/${a}`, `${DIST}/imagens/${a}`)));
  registrar('Imagens',
    await somarTamanhos(arquivos.map((a) => `imagens/${a}`)),
    await somarTamanhos(arquivos.map((a) => `${DIST}/imagens/${a}`)),
    null);
}

function kb(bytes) {
  return bytes === null ? '-' : `${(bytes / 1024).toFixed(1)} KB`;
}

const inicio = performance.now();
await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });
await Promise.all([construirCss(), construirJs(), construirImagens()]);
await construirHtml(); // depois do JS: embute o tema-inicial.min.js

console.log(`\nBuild concluído em ${Math.round(performance.now() - inicio)} ms -> pasta ${DIST}/\n`);
console.table(relatorio.map(({ tipo, antes, depois, gzip }) => ({
  Tipo: tipo,
  Original: kb(antes),
  Minificado: kb(depois),
  Economia: `${Math.round((1 - depois / antes) * 100)}%`,
  'Com gzip': kb(gzip)
})));
