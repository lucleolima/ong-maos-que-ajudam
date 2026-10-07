// Regras de validação do cadastro.
// Funções puras: recebem o valor e devolvem '' (válido) ou a mensagem de erro.
// Não acessam o DOM, por isso podem ser testadas fora do navegador (ver /testes).

export const IDADE_MINIMA = 16;

export function somenteDigitos(valor) {
  return String(valor ?? '').replace(/\D/g, '');
}

export function obrigatorio(valor, mensagem) {
  return String(valor ?? '').trim() === '' ? mensagem : '';
}

export function validarNome(valor) {
  const nome = String(valor ?? '').trim();
  if (nome === '') return 'Informe seu nome completo.';
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(nome)) return 'Use apenas letras no nome.';
  // Nome completo = pelo menos duas palavras com 2+ letras (ex.: "Ana Souza")
  const partes = nome.split(/\s+/).filter((parte) => parte.length >= 2);
  if (partes.length < 2) return 'Informe nome e sobrenome.';
  return '';
}

export function validarEmail(valor) {
  const email = String(valor ?? '').trim();
  if (email === '') return 'Informe seu e-mail.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return 'Digite um e-mail válido, como nome@exemplo.com.';
  return '';
}

// CPF: além do formato, confere os dois dígitos verificadores
export function cpfValido(valor) {
  const cpf = somenteDigitos(valor);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const digitoVerificador = (quantidade) => {
    let soma = 0;
    for (let i = 0; i < quantidade; i++) {
      soma += Number(cpf[i]) * (quantidade + 1 - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  return digitoVerificador(9) === Number(cpf[9]) && digitoVerificador(10) === Number(cpf[10]);
}

export function validarCPF(valor) {
  const digitos = somenteDigitos(valor);
  if (digitos === '') return 'Informe seu CPF.';
  if (digitos.length !== 11) return 'O CPF deve ter 11 números.';
  if (!cpfValido(digitos)) return 'CPF inválido. Confira os números digitados.';
  return '';
}

export function validarTelefone(valor) {
  const digitos = somenteDigitos(valor);
  if (digitos === '') return 'Informe um telefone para contato.';
  if (digitos.length !== 10 && digitos.length !== 11) return 'Digite o telefone com DDD: (00) 00000-0000.';
  if (Number(digitos.slice(0, 2)) < 11) return 'DDD inválido.';
  if (digitos.length === 11 && digitos[2] !== '9') return 'Celular deve começar com 9 após o DDD.';
  return '';
}

export function validarCEP(valor) {
  const digitos = somenteDigitos(valor);
  if (digitos === '') return 'Informe o CEP.';
  if (digitos.length !== 8) return 'O CEP deve ter 8 números (00000-000).';
  return '';
}

// "hoje" é parâmetro para os testes não dependerem da data em que rodam
export function calcularIdade(dataISO, hoje = new Date()) {
  const [ano, mes, dia] = dataISO.split('-').map(Number);
  let idade = hoje.getFullYear() - ano;
  const aindaNaoFezAniversario =
    hoje.getMonth() + 1 < mes || (hoje.getMonth() + 1 === mes && hoje.getDate() < dia);
  if (aindaNaoFezAniversario) idade--;
  return idade;
}

export function validarNascimento(valor, hoje = new Date()) {
  if (!valor) return 'Informe sua data de nascimento.';
  const data = new Date(valor + 'T00:00:00');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor) || Number.isNaN(data.getTime())) return 'Data inválida.';
  if (data > hoje) return 'A data não pode estar no futuro.';
  const idade = calcularIdade(valor, hoje);
  if (idade < IDADE_MINIMA) return `É preciso ter pelo menos ${IDADE_MINIMA} anos para se cadastrar.`;
  if (idade > 120) return 'Confira o ano de nascimento.';
  return '';
}
