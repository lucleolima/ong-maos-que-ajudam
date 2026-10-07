// Botões "Modo escuro" e "Alto contraste" do cabeçalho.
// O tema inicial já foi aplicado por js/tema-inicial.js; aqui os botões só
// refletem o estado (aria-pressed), trocam o atributo do <html> e salvam a escolha.

import { armazenamento } from './armazenamento.js';

export const PREFERENCIAS = {
  tema: { ativo: 'escuro', inativo: 'claro', consulta: '(prefers-color-scheme: dark)' },
  contraste: { ativo: 'alto', inativo: 'normal', consulta: '(prefers-contrast: more)' }
};

// Escolha salva tem prioridade; sem escolha (null), vale o sistema operacional
export function decidirPreferencia(valorSalvo, preferencia, sistemaAtivo) {
  if (valorSalvo === preferencia.ativo) return true;
  if (valorSalvo === preferencia.inativo) return false;
  return sistemaAtivo;
}

function aplicar(nome, ligado) {
  const raiz = document.documentElement;
  if (ligado) {
    raiz.setAttribute(`data-${nome}`, PREFERENCIAS[nome].ativo);
  } else {
    raiz.removeAttribute(`data-${nome}`);
  }
  document.querySelector(`[data-preferencia="${nome}"]`)?.setAttribute('aria-pressed', String(ligado));
}

export function iniciarPreferencias() {
  Object.entries(PREFERENCIAS).forEach(([nome, preferencia]) => {
    const consulta = window.matchMedia(preferencia.consulta);
    aplicar(nome, decidirPreferencia(armazenamento.ler(nome), preferencia, consulta.matches));

    document.querySelector(`[data-preferencia="${nome}"]`)?.addEventListener('click', (evento) => {
      const ligar = evento.currentTarget.getAttribute('aria-pressed') !== 'true';
      aplicar(nome, ligar);
      armazenamento.salvar(nome, ligar ? preferencia.ativo : preferencia.inativo);
    });

    // Sem escolha salva, acompanha quando a pessoa muda o tema do sistema com o site aberto
    consulta.addEventListener('change', (evento) => {
      if (armazenamento.ler(nome) === null) aplicar(nome, evento.matches);
    });
  });
}
