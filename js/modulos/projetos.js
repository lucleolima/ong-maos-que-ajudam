// Página de projetos: filtro por área, busca por texto e cópia da chave PIX.
// O filtro escolhido fica salvo no localStorage e volta quando a pessoa retorna.

import { projetos, categorias } from '../dados/conteudo.js';
import { cardProjeto, estadoVazio, lista } from '../templates/componentes.js';
import { armazenamento } from './armazenamento.js';
import { mostrarToast } from './feedback.js';

const CHAVE_FILTRO = 'filtro-projetos';

// Ignora maiúsculas e acentos: "educacao" encontra "Educação"
function normalizar(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export function filtrarProjetos(listaProjetos, categoria, busca) {
  const termo = normalizar(busca.trim());
  return listaProjetos.filter((projeto) => {
    const daCategoria = categoria === 'todos' || projeto.categoria === categoria;
    const textoDoProjeto = normalizar([projeto.nome, projeto.descricao, ...projeto.tags].join(' '));
    return daCategoria && textoDoProjeto.includes(termo);
  });
}

export function montarProjetos(raiz) {
  const containerLista = raiz.querySelector('#lista-projetos');
  const contagem = raiz.querySelector('#contagem-projetos');
  const campoBusca = raiz.querySelector('#busca-projeto');
  const botoesFiltro = raiz.querySelectorAll('[data-filtro]');

  // Um valor salvo que não existe mais (ex.: categoria removida) volta para "todos"
  const filtroSalvo = armazenamento.ler(CHAVE_FILTRO, 'todos');
  let categoriaAtual = categorias.some((categoria) => categoria.valor === filtroSalvo) ? filtroSalvo : 'todos';

  function atualizar() {
    const encontrados = filtrarProjetos(projetos, categoriaAtual, campoBusca.value);

    botoesFiltro.forEach((botao) => {
      botao.setAttribute('aria-pressed', String(botao.dataset.filtro === categoriaAtual));
    });

    containerLista.innerHTML = encontrados.length
      ? lista(encontrados, cardProjeto)
      : `<div class="col-12">${estadoVazio('Nenhum projeto encontrado.', 'Tente outra palavra ou escolha "Todos".')}</div>`;

    contagem.textContent = encontrados.length === 1
      ? '1 projeto encontrado'
      : `${encontrados.length} projetos encontrados`;
  }

  // Delegação de eventos: um único listener no <main> atende todos os botões,
  // inclusive os que forem criados depois pelo template
  function aoClicar(evento) {
    const botaoFiltro = evento.target.closest('[data-filtro]');
    if (botaoFiltro) {
      categoriaAtual = botaoFiltro.dataset.filtro;
      armazenamento.salvar(CHAVE_FILTRO, categoriaAtual);
      atualizar();
      return;
    }

    const botaoCopiar = evento.target.closest('[data-copiar]');
    if (botaoCopiar) {
      const texto = botaoCopiar.dataset.copiar;
      navigator.clipboard.writeText(texto)
        .then(() => mostrarToast('Chave PIX copiada!'))
        .catch(() => mostrarToast(`Não foi possível copiar. Chave: ${texto}`, 'erro'));
    }
  }

  raiz.addEventListener('click', aoClicar);
  campoBusca.addEventListener('input', atualizar);
  atualizar();

  // O <main> continua existindo nas outras páginas: o listener precisa sair junto com a página
  return () => raiz.removeEventListener('click', aoClicar);
}
