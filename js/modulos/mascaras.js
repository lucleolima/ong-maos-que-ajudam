// Máscaras de CPF, telefone e CEP.
// Usa a biblioteca externa IMask (carregada por CDN no index.html). Se a CDN
// falhar ou a pessoa estiver sem internet, cai nas máscaras próprias abaixo,
// que eram as da Experiência Prática 1: o formulário continua funcionando.

import { somenteDigitos } from './validacao.js';

export function formatarCPF(valor) {
  return somenteDigitos(valor)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function formatarTelefone(valor) {
  const digitos = somenteDigitos(valor).slice(0, 11);
  if (digitos.length === 0) return '';
  if (digitos.length <= 2) return '(' + digitos;
  // Celular tem 9 dígitos após o DDD; fixo tem 8
  const tamanhoPrefixo = digitos.length === 11 ? 5 : 4;
  const prefixo = digitos.slice(2, 2 + tamanhoPrefixo);
  const sufixo = digitos.slice(2 + tamanhoPrefixo);
  return `(${digitos.slice(0, 2)}) ${prefixo}${sufixo ? '-' + sufixo : ''}`;
}

export function formatarCEP(valor) {
  return somenteDigitos(valor).slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');
}

const CONFIGURACOES = {
  cpf: { imask: { mask: '000.000.000-00' }, reserva: formatarCPF },
  // Duas máscaras: o IMask escolhe a que comporta os dígitos digitados (fixo ou celular)
  telefone: { imask: { mask: [{ mask: '(00) 0000-0000' }, { mask: '(00) 00000-0000' }] }, reserva: formatarTelefone },
  cep: { imask: { mask: '00000-000' }, reserva: formatarCEP }
};

// Aplica as máscaras nos campos do formulário e devolve uma função de limpeza,
// chamada pelo roteador quando a pessoa sai da página de cadastro.
export function aplicarMascaras(formulario) {
  const instancias = [];

  Object.entries(CONFIGURACOES).forEach(([nome, config]) => {
    const campo = formulario.elements[nome];
    if (!campo) return;

    if (window.IMask) {
      instancias.push(window.IMask(campo, config.imask));
    } else {
      const formatar = () => { campo.value = config.reserva(campo.value); };
      campo.addEventListener('input', formatar);
      instancias.push({ updateValue: formatar, destroy: () => campo.removeEventListener('input', formatar) });
    }
  });

  return {
    usandoBiblioteca: Boolean(window.IMask),
    // Necessário após reset() ou preenchimento por código: sincroniza a máscara com o campo
    sincronizar: () => instancias.forEach((instancia) => instancia.updateValue()),
    destruir: () => instancias.forEach((instancia) => instancia.destroy())
  };
}
