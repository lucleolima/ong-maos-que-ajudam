// Cadastros salvos no navegador (simula o banco de dados que um back-end teria)
// e rascunho do formulário, para a pessoa não perder o que digitou.

import { armazenamento as armazenamentoPadrao } from './armazenamento.js';
import { somenteDigitos } from './validacao.js';

export const EVENTO_CADASTROS_ALTERADOS = 'cadastros:alterados';

export function criarRepositorioCadastros(armazenamento = armazenamentoPadrao) {
  const CHAVE = 'cadastros';
  const CHAVE_RASCUNHO = 'rascunho-cadastro';

  // Avisa o resto da aplicação (ex.: contador do menu) que a lista mudou
  function avisarAlteracao(total) {
    if (typeof document === 'undefined') return;
    document.dispatchEvent(new CustomEvent(EVENTO_CADASTROS_ALTERADOS, { detail: { total } }));
  }

  function listar() {
    const lista = armazenamento.ler(CHAVE, []);
    return Array.isArray(lista) ? lista : [];
  }

  function gravar(lista) {
    const salvou = armazenamento.salvar(CHAVE, lista);
    avisarAlteracao(lista.length);
    return salvou;
  }

  return {
    listar,

    adicionar(dados) {
      const cadastro = {
        ...dados,
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        criadoEm: new Date().toISOString()
      };
      const salvou = gravar([cadastro, ...listar()]);
      return salvou ? cadastro : null;
    },

    remover(id) {
      gravar(listar().filter((cadastro) => cadastro.id !== id));
    },

    limpar() {
      gravar([]);
    },

    cpfJaCadastrado(cpf) {
      const digitos = somenteDigitos(cpf);
      return listar().some((cadastro) => somenteDigitos(cadastro.cpf) === digitos);
    },

    lerRascunho: () => armazenamento.ler(CHAVE_RASCUNHO, null),
    salvarRascunho: (dados) => armazenamento.salvar(CHAVE_RASCUNHO, dados),
    apagarRascunho: () => armazenamento.remover(CHAVE_RASCUNHO)
  };
}

export const cadastros = criarRepositorioCadastros();
