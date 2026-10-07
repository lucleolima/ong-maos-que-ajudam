// Ponto de entrada da aplicação: registra as rotas e liga os módulos.
// Cada página tem um template (HTML) e, se precisar de interatividade,
// uma função montar() que adiciona os eventos e devolve como desfazê-los.

import { criarRoteador } from './modulos/roteador.js';
import { iniciarMenu, fecharMenu, destacarLinkAtual } from './modulos/menu.js';
import { iniciarModais, fecharModais } from './modulos/feedback.js';
import { iniciarPreferencias } from './modulos/preferencias.js';
import { cadastros, EVENTO_CADASTROS_ALTERADOS } from './modulos/cadastros.js';
import { montarProjetos } from './modulos/projetos.js';
import { montarCadastro } from './modulos/formulario.js';
import { montarInscricoes } from './modulos/inscricoes.js';
import {
  paginaInicio, paginaProjetos, paginaCadastro, paginaInscricoes, paginaNaoEncontrada
} from './templates/paginas.js';

const rotas = {
  inicio: { titulo: 'Início', template: paginaInicio },
  projetos: { titulo: 'Projetos', template: paginaProjetos, montar: montarProjetos },
  cadastro: { titulo: 'Cadastro', template: paginaCadastro, montar: montarCadastro },
  inscricoes: { titulo: 'Inscrições', template: paginaInscricoes, montar: montarInscricoes }
};

// Contador de inscrições ao lado do link do menu
function atualizarContador(total) {
  const contador = document.querySelector('[data-contador-inscricoes]');
  contador.textContent = total;
  contador.hidden = total === 0;
}

function iniciarPularConteudo() {
  // Sem JS o link "#conteudo" funciona sozinho; com JS evitamos mexer no hash das rotas
  document.querySelector('.pular-conteudo').addEventListener('click', (evento) => {
    evento.preventDefault();
    document.getElementById('conteudo').focus();
  });
}

iniciarMenu();
iniciarPreferencias();
iniciarModais();
iniciarPularConteudo();

atualizarContador(cadastros.listar().length);
document.addEventListener(EVENTO_CADASTROS_ALTERADOS, (evento) => atualizarContador(evento.detail.total));

criarRoteador({
  rotas,
  raiz: document.getElementById('conteudo'),
  rotaNaoEncontrada: { titulo: 'Página não encontrada', template: paginaNaoEncontrada },
  nomeSite: 'ONG Mãos que Ajudam',
  aoNavegar(rota) {
    destacarLinkAtual(rota);
    fecharMenu();
    fecharModais();
  }
}).iniciar();
