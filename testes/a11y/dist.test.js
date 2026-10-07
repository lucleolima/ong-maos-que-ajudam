// Mesmos testes de acessibilidade, mas no resultado do build (pasta dist/).
// Garante que a minificação não quebrou nada. Rodar com: npm run test:a11y:dist
process.env.PASTA_SITE = 'dist';
await import('./acessibilidade.test.js');
