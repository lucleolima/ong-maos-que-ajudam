// Formulário de cadastro: validação com feedback por campo, rascunho automático,
// preenchimento do endereço pelo CEP e gravação da inscrição no localStorage.

import {
  validarNome, validarEmail, validarCPF, validarNascimento, validarTelefone, validarCEP,
  obrigatorio, somenteDigitos
} from './validacao.js';
import { cadastros } from './cadastros.js';
import { aplicarMascaras } from './mascaras.js';
import { buscarEnderecoPorCep } from './cep.js';
import { mostrarToast, mostrarSucessoCadastro } from './feedback.js';

// Uma regra por campo. Cada regra recebe o valor e devolve '' ou a mensagem de erro.
const REGRAS = {
  nome: validarNome,
  email: validarEmail,
  cpf: (valor) => validarCPF(valor) || (cadastros.cpfJaCadastrado(valor) ? 'Este CPF já possui cadastro.' : ''),
  nascimento: (valor) => validarNascimento(valor),
  telefone: validarTelefone,
  cep: validarCEP,
  logradouro: (valor) => obrigatorio(valor, 'Informe a rua ou avenida.'),
  numero: (valor) => obrigatorio(valor, 'Informe o número (ou "s/n").'),
  cidade: (valor) => obrigatorio(valor, 'Informe a cidade.'),
  estado: (valor) => obrigatorio(valor, 'Selecione o estado.'),
  tipo: (valor) => obrigatorio(valor, 'Escolha como deseja participar.'),
  consentimento: (marcado) => (marcado ? '' : 'É preciso autorizar o uso dos dados para concluir.')
};

const ROTULOS = {
  nome: 'Nome completo', email: 'E-mail', cpf: 'CPF', nascimento: 'Data de nascimento',
  telefone: 'Telefone', cep: 'CEP', logradouro: 'Endereço', numero: 'Número', cidade: 'Cidade',
  estado: 'Estado', tipo: 'Tipo de participação', consentimento: 'Autorização LGPD'
};

const CAMPOS_DO_RASCUNHO = [
  'nome', 'email', 'cpf', 'nascimento', 'telefone', 'cep', 'logradouro', 'numero',
  'complemento', 'cidade', 'estado', 'tipo', 'mensagem'
];

// Lê os dados do formulário em um objeto simples
export function lerDados(formulario) {
  const dados = Object.fromEntries(
    CAMPOS_DO_RASCUNHO.map((nome) => [nome, (formulario.elements[nome]?.value ?? '').trim()])
  );
  dados.interesses = [...formulario.querySelectorAll('[name="interesses"]:checked')].map((caixa) => caixa.value);
  dados.consentimento = formulario.elements.consentimento.checked;
  return dados;
}

export function montarCadastro(raiz, projetoEscolhido) {
  const formulario = raiz.querySelector('#form-cadastro');
  const alertaErro = raiz.querySelector('#alerta-erro');
  const contador = raiz.querySelector('#contador-mensagem');
  const dicaCep = raiz.querySelector('#dica-cep');
  const camposTocados = new Set();
  let temporizadorRascunho;
  let ultimoCepBuscado = '';

  // ---------- Exibição dos erros ----------

  // Elemento que recebe o destaque visual: o próprio campo ou o grupo de rádios
  function elementoDoCampo(nome) {
    return nome === 'tipo' ? formulario.querySelector('#grupo-tipo') : formulario.elements[nome];
  }

  function exibirErro(nome, mensagem) {
    const elemento = elementoDoCampo(nome);
    const span = formulario.querySelector(`#erro-${nome}`);
    elemento.setAttribute('aria-invalid', String(Boolean(mensagem)));
    span.textContent = mensagem;
    span.classList.toggle('visivel', Boolean(mensagem));
  }

  function validarCampo(nome) {
    const elemento = formulario.elements[nome];
    const valor = nome === 'consentimento' ? elemento.checked : elemento.value;
    const mensagem = REGRAS[nome](valor);
    exibirErro(nome, mensagem);
    return mensagem;
  }

  function validarTudo() {
    return Object.keys(REGRAS)
      .map((nome) => ({ nome, mensagem: validarCampo(nome) }))
      .filter((erro) => erro.mensagem);
  }

  // Resumo no topo com links que levam direto ao campo com problema
  function mostrarResumo(erros) {
    alertaErro.innerHTML = `
      <div>
        <p><strong>${erros.length === 1 ? 'Há 1 campo' : `Há ${erros.length} campos`} para corrigir:</strong></p>
        <ul class="lista-erros">
          ${erros.map((erro) => `<li><a href="#${erro.nome}" data-ir-para="${erro.nome}">${ROTULOS[erro.nome]}</a></li>`).join('')}
        </ul>
      </div>`;
    alertaErro.hidden = false;
  }

  function esconderResumo() {
    alertaErro.hidden = true;
    alertaErro.innerHTML = '';
  }

  // ---------- Rascunho ----------

  function gravarRascunhoAgora() {
    cancelarRascunhoPendente();
    const { consentimento, ...rascunho } = lerDados(formulario);
    cadastros.salvarRascunho(rascunho);
  }

  // debounce: grava 400 ms depois que a pessoa para de digitar, não a cada tecla
  function salvarRascunho() {
    clearTimeout(temporizadorRascunho);
    temporizadorRascunho = setTimeout(gravarRascunhoAgora, 400);
  }

  function cancelarRascunhoPendente() {
    clearTimeout(temporizadorRascunho);
    temporizadorRascunho = null;
  }

  function restaurarRascunho() {
    const rascunho = cadastros.lerRascunho();
    if (!rascunho) return false;

    CAMPOS_DO_RASCUNHO.forEach((nome) => {
      if (nome === 'tipo') {
        const radio = formulario.querySelector(`[name="tipo"][value="${rascunho.tipo}"]`);
        if (radio) radio.checked = true;
      } else if (formulario.elements[nome] && rascunho[nome]) {
        formulario.elements[nome].value = rascunho[nome];
      }
    });
    (rascunho.interesses ?? []).forEach((id) => marcarInteresse(id));
    return Object.values(rascunho).some((valor) => (Array.isArray(valor) ? valor.length : valor));
  }

  function marcarInteresse(id) {
    const caixa = formulario.querySelector(`[name="interesses"][value="${CSS.escape(id)}"]`);
    if (caixa) caixa.checked = true;
  }

  // ---------- Endereço pelo CEP (API pública ViaCEP) ----------

  async function buscarEndereco(cep) {
    if (cep === ultimoCepBuscado) return;
    ultimoCepBuscado = cep;
    dicaCep.textContent = 'Buscando endereço...';

    try {
      const endereco = await buscarEnderecoPorCep(cep);
      if (!endereco) {
        dicaCep.textContent = 'CEP não encontrado. Preencha o endereço manualmente.';
        return;
      }
      Object.entries(endereco).forEach(([nome, valor]) => {
        if (valor) {
          formulario.elements[nome].value = valor;
          if (camposTocados.has(nome)) validarCampo(nome);
        }
      });
      dicaCep.textContent = 'Endereço encontrado. Confira e informe o número.';
      salvarRascunho();
    } catch {
      dicaCep.textContent = 'Não foi possível buscar o CEP agora. Preencha o endereço manualmente.';
    }
  }

  // ---------- Eventos ----------

  // focusout borbulha (blur não): um listener no form atende todos os campos
  formulario.addEventListener('focusout', (evento) => {
    const nome = evento.target.name;
    if (!REGRAS[nome] || nome === 'tipo' || nome === 'consentimento') return;
    camposTocados.add(nome);
    validarCampo(nome);
  });

  formulario.addEventListener('input', (evento) => {
    const nome = evento.target.name;
    // Depois do primeiro erro, a mensagem some assim que o valor fica certo
    if (camposTocados.has(nome)) validarCampo(nome);

    if (nome === 'mensagem') contador.textContent = `${evento.target.value.length} de 500 caracteres`;

    if (nome === 'cep') {
      const cep = somenteDigitos(evento.target.value);
      if (cep.length === 8) buscarEndereco(cep);
    }

    if (nome !== 'consentimento') salvarRascunho();
  });

  // Rádios, checkboxes e select avisam pelo evento change
  formulario.addEventListener('change', (evento) => {
    const nome = evento.target.name;
    if (nome === 'tipo' || nome === 'consentimento' || nome === 'estado') {
      camposTocados.add(nome);
      validarCampo(nome);
    }
    salvarRascunho();
  });

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    Object.keys(REGRAS).forEach((nome) => camposTocados.add(nome));

    const erros = validarTudo();
    if (erros.length) {
      mostrarResumo(erros);
      focarCampo(erros[0].nome);
      return;
    }

    const { consentimento, ...dados } = lerDados(formulario);
    if (!cadastros.adicionar(dados)) {
      mostrarToast('Não foi possível salvar no navegador. Tente novamente.', 'erro');
      return;
    }

    cancelarRascunhoPendente();
    formulario.reset(); // o evento reset abaixo limpa erros e rascunho
    mostrarSucessoCadastro(dados.nome.split(' ')[0]);
  });

  formulario.addEventListener('reset', () => {
    cancelarRascunhoPendente();
    cadastros.apagarRascunho();
    camposTocados.clear();
    ultimoCepBuscado = '';
    esconderResumo();
    Object.keys(REGRAS).forEach((nome) => exibirErro(nome, ''));
    formulario.querySelectorAll('[aria-invalid]').forEach((elemento) => elemento.removeAttribute('aria-invalid'));
    contador.textContent = '0 de 500 caracteres';
    dicaCep.textContent = 'Preenchemos o endereço pelo CEP.';
    // reset() limpa os valores depois deste evento; só então a máscara pode sincronizar
    setTimeout(() => mascaras.sincronizar());
  });

  function focarCampo(nome) {
    const alvo = nome === 'tipo' ? formulario.querySelector('[name="tipo"]') : formulario.elements[nome];
    alvo.focus();
  }

  alertaErro.addEventListener('click', (evento) => {
    const link = evento.target.closest('[data-ir-para]');
    if (!link) return;
    evento.preventDefault(); // o href "#campo" mudaria o hash da página
    focarCampo(link.dataset.irPara);
  });

  // ---------- Inicialização ----------

  const recuperouRascunho = restaurarRascunho();
  if (projetoEscolhido) marcarInteresse(projetoEscolhido);
  contador.textContent = `${formulario.elements.mensagem.value.length} de 500 caracteres`;
  const mascaras = aplicarMascaras(formulario); // depois do rascunho, para formatar os valores restaurados
  if (recuperouRascunho) mostrarToast('Rascunho recuperado: continue de onde parou.');

  // Fechar ou recarregar a aba dentro dos 400 ms do debounce perderia as últimas letras
  function gravarPendente() {
    if (temporizadorRascunho) gravarRascunhoAgora();
  }
  window.addEventListener('pagehide', gravarPendente);

  // Ao sair da página pela SPA, também grava o que ainda estava esperando o debounce
  return () => {
    gravarPendente();
    window.removeEventListener('pagehide', gravarPendente);
    mascaras.destruir();
  };
}
