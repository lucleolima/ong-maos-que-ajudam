// Testes da regra dos temas (escolha salva x preferência do sistema operacional)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { decidirPreferencia, PREFERENCIAS } from '../js/modulos/preferencias.js';

const { tema, contraste } = PREFERENCIAS;

test('Tema: a escolha salva vale mais que o sistema operacional', () => {
  assert.equal(decidirPreferencia('escuro', tema, false), true);
  assert.equal(decidirPreferencia('claro', tema, true), false);
  assert.equal(decidirPreferencia('alto', contraste, false), true);
  assert.equal(decidirPreferencia('normal', contraste, true), false);
});

test('Tema: sem escolha salva (ou valor desconhecido), segue o sistema', () => {
  assert.equal(decidirPreferencia(null, tema, true), true);
  assert.equal(decidirPreferencia(null, tema, false), false);
  assert.equal(decidirPreferencia('roxo', contraste, true), true);
});
