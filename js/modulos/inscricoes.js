// Página "Inscrições": lista os cadastros salvos no localStorage,
// com filtro por tipo e remoção (individual ou de todos).

import { projetos } from '../dados/conteudo.js';
import { cartaoInscricao, estadoVazio, lista } from '../templates/componentes.js';
import { cadastros } from './cadastros.js';
import { confirmar, mostrarToast } from './feedback.js';

const NOMES_PROJETOS = Object.fromEntries(projetos.map((projeto) => [projeto.id, projeto.nome]));

export function montarInscricoes(raiz) {
  const containerLista = raiz.querySelector('#lista-inscricoes');
  const contagem = raiz.querySelector('#contagem-inscricoes');
  const filtroTipo = raiz.querySelector('#filtro-tipo');
  const botaoLimparTudo = raiz.querySelector('[data-limpar-tudo]');

  function atualizar() {
    const todos = cadastros.listar();
    const tipo = filtroTipo.value;
    const visiveis = tipo === 'todos' ? todos : todos.filter((cadastro) => cadastro.tipo === tipo);

    botaoLimparTudo.disabled = todos.length === 0;
    contagem.textContent = `${visiveis.length} de ${todos.length} ${todos.length === 1 ? 'inscrição' : 'inscrições'}`;

    if (todos.length === 0) {
      contagem.textContent = 'Nenhuma inscrição salva';
      containerLista.innerHTML = `<li class="item-vazio">${estadoVazio(
        'Ainda não há inscrições.',
        'Os cadastros feitos no formulário aparecem aqui.',
        '<a class="botao botao-primario" href="#/cadastro">Fazer um cadastro</a>'
      )}</li>`;
      return;
    }

    containerLista.innerHTML = visiveis.length
      ? lista(visiveis, (cadastro) => cartaoInscricao(cadastro, NOMES_PROJETOS))
      : `<li class="item-vazio">${estadoVazio('Nenhuma inscrição deste tipo.', 'Escolha outra opção em "Mostrar".')}</li>`;
  }

  async function aoClicar(evento) {
    const botaoRemover = evento.target.closest('[data-remover]');
    if (botaoRemover) {
      const nome = botaoRemover.closest('.cartao-inscricao').querySelector('h3').textContent;
      const confirmou = await confirmar({
        titulo: 'Remover inscrição?',
        mensagem: `A inscrição de ${nome} será apagada deste navegador.`,
        textoConfirmar: 'Remover'
      });
      if (!confirmou) return;
      cadastros.remover(botaoRemover.dataset.remover);
      atualizar();
      mostrarToast('Inscrição removida.');
      contagem.focus(); // o botão clicado deixou de existir: o foco não pode se perder
      return;
    }

    if (evento.target.closest('[data-limpar-tudo]')) {
      const confirmou = await confirmar({
        titulo: 'Remover todas as inscrições?',
        mensagem: 'Todos os cadastros salvos neste navegador serão apagados.',
        textoConfirmar: 'Remover todas'
      });
      if (!confirmou) return;
      cadastros.limpar();
      atualizar();
      mostrarToast('Todas as inscrições foram removidas.');
    }
  }

  raiz.addEventListener('click', aoClicar);
  filtroTipo.addEventListener('change', atualizar);
  atualizar();

  return () => raiz.removeEventListener('click', aoClicar);
}
