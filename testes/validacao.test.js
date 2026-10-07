// Testes das regras de validação. Rodar com: npm test (ou node --test testes/)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  cpfValido, validarCPF, validarNome, validarEmail, validarTelefone, validarCEP,
  validarNascimento, calcularIdade
} from '../js/modulos/validacao.js';

const HOJE = new Date(2026, 9, 7); // 07/10/2026 fixo: o teste não muda com o passar do tempo

test('CPF: aceita CPFs com dígitos verificadores corretos, com ou sem máscara', () => {
  assert.equal(cpfValido('529.982.247-25'), true);
  assert.equal(cpfValido('52998224725'), true);
  assert.equal(cpfValido('111.444.777-35'), true);
});

test('CPF: recusa dígito verificador errado, números repetidos e tamanho incorreto', () => {
  assert.equal(cpfValido('529.982.247-24'), false);
  assert.equal(cpfValido('111.111.111-11'), false);
  assert.equal(cpfValido('123'), false);
  assert.equal(validarCPF(''), 'Informe seu CPF.');
  assert.equal(validarCPF('123.456'), 'O CPF deve ter 11 números.');
});

test('Nome: exige nome e sobrenome, só com letras', () => {
  assert.equal(validarNome('Ana Souza'), '');
  assert.equal(validarNome('José da Silva'), '');
  assert.equal(validarNome('Ana'), 'Informe nome e sobrenome.');
  assert.equal(validarNome('Ana 123'), 'Use apenas letras no nome.');
  assert.equal(validarNome('   '), 'Informe seu nome completo.');
});

test('E-mail: formato nome@dominio.extensao', () => {
  assert.equal(validarEmail('ana@exemplo.com'), '');
  assert.notEqual(validarEmail('ana@exemplo'), '');
  assert.notEqual(validarEmail('ana exemplo.com'), '');
});

test('Telefone: fixo (10 dígitos) ou celular (11 dígitos começando com 9)', () => {
  assert.equal(validarTelefone('(11) 3000-0000'), '');
  assert.equal(validarTelefone('(11) 98765-4321'), '');
  assert.equal(validarTelefone('(11) 88765-4321'), 'Celular deve começar com 9 após o DDD.');
  assert.equal(validarTelefone('(01) 3000-0000'), 'DDD inválido.');
  assert.notEqual(validarTelefone('3000-0000'), '');
});

test('CEP: 8 dígitos', () => {
  assert.equal(validarCEP('01001-000'), '');
  assert.notEqual(validarCEP('0100'), '');
});

test('Idade: considera se a pessoa já fez aniversário no ano', () => {
  assert.equal(calcularIdade('2010-10-07', HOJE), 16); // aniversário hoje
  assert.equal(calcularIdade('2010-10-08', HOJE), 15); // aniversário amanhã
});

test('Nascimento: idade mínima de 16 anos e nada de datas futuras', () => {
  assert.equal(validarNascimento('2000-05-20', HOJE), '');
  assert.equal(validarNascimento('2010-10-07', HOJE), '');
  assert.match(validarNascimento('2010-10-08', HOJE), /pelo menos 16 anos/);
  assert.equal(validarNascimento('2030-01-01', HOJE), 'A data não pode estar no futuro.');
  assert.equal(validarNascimento('', HOJE), 'Informe sua data de nascimento.');
});
