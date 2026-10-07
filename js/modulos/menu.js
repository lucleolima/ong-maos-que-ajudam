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

  iniciarSubmenus();
}

// No desktop o submenu abre no hover e no foco. A WCAG 1.4.13 pede que esse
// conteúdo possa ser fechado sem mover o mouse ou o foco: Esc esconde o submenu
// até o mouse ou o foco saírem do item.
function iniciarSubmenus() {
  document.querySelectorAll('.menu-item-com-submenu').forEach((item) => {
    const reabrir = () => item.classList.remove('submenu-fechado');

    item.addEventListener('keydown', (evento) => {
      if (evento.key !== 'Escape' || item.classList.contains('submenu-fechado')) return;
      item.classList.add('submenu-fechado');
      item.querySelector('.menu-link').focus();
    });

    item.addEventListener('mouseleave', reabrir);
    item.addEventListener('focusout', (evento) => {
      if (!item.contains(evento.relatedTarget)) reabrir();
    });
  });

  // Ao voltar para tela grande, o estado do celular não fica preso
  window.matchMedia('(min-width: 768px)').addEventListener('change', fecharMenu);
}
