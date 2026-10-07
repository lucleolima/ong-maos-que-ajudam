// Testes do armazenamento (com um localStorage falso), dos templates, das máscaras,
// do filtro de projetos e do roteador.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { criarArmazenamento } from '../js/modulos/armazenamento.js';
import { criarRepositorioCadastros } from '../js/modulos/cadastros.js';
import { escaparHtml, cartaoInscricao, mascararCPF } from '../js/templates/componentes.js';
import { formatarCPF, formatarTelefone, formatarCEP } from '../js/modulos/mascaras.js';
import { filtrarProjetos } from '../js/modulos/projetos.js';
import { lerRota } from '../js/modulos/roteador.js';
import { projetos } from '../js/dados/conteudo.js';

function storageFalso() {
  const dados = new Map();
  return {
    getItem: (chave) => (dados.has(chave) ? dados.get(chave) : null),
    setItem: (chave, valor) => dados.set(chave, String(valor)),
    removeItem: (chave) => dados.delete(chave),
    dados
  };
}

test('Armazenamento: salva e lê objetos em JSON, com prefixo nas chaves', () => {
  const storage = storageFalso();
  const armazenamento = criarArmazenamento(storage);
  armazenamento.salvar('teste', { a: 1 });
  assert.deepEqual(armazenamento.ler('teste'), { a: 1 });
  assert.ok(storage.dados.has('maos-que-ajudam:teste'));
});

test('Armazenamento: JSON corrompido ou storage bloqueado não derrubam a aplicação', () => {
  const storage = storageFalso();
  storage.setItem('maos-que-ajudam:quebrado', '{isso não é json');
  assert.equal(criarArmazenamento(storage).ler('quebrado', 'padrão'), 'padrão');

  const bloqueado = criarArmazenamento({
    getItem() { throw new Error('SecurityError'); },
    setItem() { throw new Error('QuotaExceededError'); },
    removeItem() { throw new Error('SecurityError'); }
  });
  assert.equal(bloqueado.ler('x', []).length, 0);
  assert.equal(bloqueado.salvar('x', 1), false);
});

test('Cadastros: adiciona, detecta CPF repetido e remove', () => {
  const repositorio = criarRepositorioCadastros(criarArmazenamento(storageFalso()));
  const salvo = repositorio.adicionar({ nome: 'Ana Souza', cpf: '529.982.247-25' });

  assert.ok(salvo.id);
  assert.equal(repositorio.listar().length, 1);
  assert.equal(repositorio.cpfJaCadastrado('52998224725'), true);

  repositorio.remover(salvo.id);
  assert.equal(repositorio.listar().length, 0);
});

test('Templates: dados digitados pelo usuário são escapados (sem XSS)', () => {
  assert.equal(escaparHtml('<img src=x onerror="alert(1)">'), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');

  const html = cartaoInscricao(
    { id: '1', nome: '<script>alert(1)</script>', email: 'a@b.com', cpf: '52998224725', cidade: 'X', estado: 'SP', tipo: 'doador', criadoEm: new Date().toISOString() },
    {}
  );
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('***.982.247-**'));
});

test('Templates: CPF aparece mascarado na lista de inscrições', () => {
  assert.equal(mascararCPF('529.982.247-25'), '***.982.247-**');
});

test('Máscaras próprias (reserva do IMask)', () => {
  assert.equal(formatarCPF('52998224725'), '529.982.247-25');
  assert.equal(formatarTelefone('11987654321'), '(11) 98765-4321');
  assert.equal(formatarTelefone('1130000000'), '(11) 3000-0000');
  assert.equal(formatarCEP('01001000'), '01001-000');
});

test('Filtro de projetos: categoria e busca sem diferenciar acentos', () => {
  assert.equal(filtrarProjetos(projetos, 'todos', '').length, projetos.length);
  assert.equal(filtrarProjetos(projetos, 'educacao', '').length, 1);
  assert.equal(filtrarProjetos(projetos, 'todos', 'EDUCACAO')[0].id, 'projeto-educacao');
  assert.equal(filtrarProjetos(projetos, 'alimentacao', 'musica').length, 0);
});

test('Roteador: interpreta o hash em rota e parâmetro', () => {
  assert.deepEqual(lerRota('', 'inicio'), { nome: 'inicio', parametro: null });
  assert.deepEqual(lerRota('#/projetos/doacoes', 'inicio'), { nome: 'projetos', parametro: 'doacoes' });
  assert.deepEqual(lerRota('#/', 'inicio'), { nome: 'inicio', parametro: null });
  assert.deepEqual(lerRota('#conteudo', 'inicio'), { nome: 'inicio', parametro: null });
});

test('CEP: converte a resposta do ViaCEP e trata CEP inexistente (fetch falso, sem internet)', async () => {
  const { buscarEnderecoPorCep } = await import('../js/modulos/cep.js');
  const fetchFalso = (resposta) => async () => ({ ok: true, json: async () => resposta });

  assert.deepEqual(
    await buscarEnderecoPorCep('01001000', fetchFalso({ logradouro: 'Praça da Sé', localidade: 'São Paulo', uf: 'SP' })),
    { logradouro: 'Praça da Sé', cidade: 'São Paulo', estado: 'SP' }
  );
  assert.equal(await buscarEnderecoPorCep('99999999', fetchFalso({ erro: true })), null);
  await assert.rejects(buscarEnderecoPorCep('01001000', async () => ({ ok: false, status: 500 })));
});
