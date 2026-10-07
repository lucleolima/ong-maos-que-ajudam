// Menu responsivo: no celular, o botão "Menu" abre e fecha a navegação.
// A classe "js" no <html> avisa o CSS que o JavaScript está ativo;
// sem ela, o menu fica sempre visível.

let botaoMenu;
let menu;

function alternarMenu(abrir) {
  if (!botaoMenu || !menu) return;
  botaoMenu.setAttribute('aria-expanded', String(abrir));
  menu.classList.toggle('menu-aberto', abrir);
}

export function fecharMenu() {
  alternarMenu(false);
}

// Marca o link da página atual (aria-current também é usado pelo CSS)
export function destacarLinkAtual(rota) {
  document.querySelectorAll('.menu-link').forEach((link) => {
    if (link.dataset.rota === rota) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

export function iniciarMenu() {
  document.documentElement.classList.add('js');
  botaoMenu = document.querySelector('.botao-menu');
  menu = document.getElementById('menu-principal');
  if (!botaoMenu || !menu) return;

  botaoMenu.addEventListener('click', () => {
    alternarMenu(botaoMenu.getAttribute('aria-expanded') !== 'true');
  });

  // Esc fecha o menu e devolve o foco ao botão
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && menu.classList.contains('menu-aberto')) {
      alternarMenu(false);
      botaoMenu.focus();
    }
  });

  // Ao voltar para tela grande, o estado do celular não fica preso
  window.matchMedia('(min-width: 768px)').addEventListener('change', fecharMenu);
}
