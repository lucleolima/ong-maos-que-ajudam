// Componentes de feedback compartilhados: toast e janelas modais (<dialog>).

let temporizadorToast;

// tipo "erro" troca a cor e o ícone do toast
export function mostrarToast(mensagem, tipo = 'sucesso') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = mensagem;
  toast.classList.toggle('toast-erro', tipo === 'erro');
  toast.classList.add('toast-visivel');
  clearTimeout(temporizadorToast);
  temporizadorToast = setTimeout(() => toast.classList.remove('toast-visivel'), 3500);
}

// Modal de sucesso do cadastro: o nome entra por textContent (nunca innerHTML)
export function mostrarSucessoCadastro(primeiroNome) {
  const modal = document.getElementById('modal-sucesso');
  modal.querySelector('[data-nome]').textContent = primeiroNome;
  modal.showModal();
}

// Substitui o confirm() do navegador por um <dialog> estilizado.
// Devolve uma Promise: true se a pessoa confirmar, false se cancelar ou apertar Esc.
export function confirmar({ titulo, mensagem, textoConfirmar = 'Confirmar' }) {
  const modal = document.getElementById('modal-confirmacao');
  modal.querySelector('[data-titulo]').textContent = titulo;
  modal.querySelector('[data-mensagem]').textContent = mensagem;
  modal.querySelector('[value="confirmar"]').textContent = textoConfirmar;
  modal.returnValue = '';
  modal.showModal();

  return new Promise((resolver) => {
    modal.addEventListener('close', () => resolver(modal.returnValue === 'confirmar'), { once: true });
  });
}

export function fecharModais() {
  document.querySelectorAll('dialog[open]').forEach((modal) => modal.close());
}

export function iniciarModais() {
  document.querySelectorAll('dialog').forEach((modal) => {
    // Clique no fundo escuro (fora da caixa) fecha a janela
    modal.addEventListener('click', (evento) => {
      if (evento.target === modal) modal.close();
    });
  });
}
