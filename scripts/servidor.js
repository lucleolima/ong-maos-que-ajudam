// Servidor estático mínimo, sem dependências.
// Os módulos ES (import/export) não funcionam abrindo o arquivo direto (file://).
//   npm start        -> serve o código-fonte em http://localhost:5500
//   npm run preview  -> serve a pasta dist/ (resultado do build) em http://localhost:5501
// Também é usado pelo teste de acessibilidade (testes/a11y).

import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon'
};

export function criarServidor(pastaRaiz) {
  const raiz = path.resolve(pastaRaiz);

  return http.createServer(async (requisicao, resposta) => {
    const caminho = decodeURIComponent(new URL(requisicao.url, 'http://localhost').pathname);
    let arquivo = path.join(raiz, caminho);

    // Impede sair da pasta com ../
    if (!arquivo.startsWith(raiz)) {
      resposta.writeHead(403).end();
      return;
    }

    try {
      if ((await stat(arquivo)).isDirectory()) arquivo = path.join(arquivo, 'index.html');
      const conteudo = await readFile(arquivo);
      resposta.writeHead(200, { 'Content-Type': TIPOS[path.extname(arquivo)] ?? 'application/octet-stream' });
      resposta.end(conteudo);
    } catch {
      resposta.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Arquivo não encontrado');
    }
  });
}

// Executado direto pelo terminal: node scripts/servidor.js [pasta] [porta]
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [pasta = '.', porta = '5500'] = process.argv.slice(2);
  criarServidor(pasta).listen(Number(porta), () => {
    console.log(`Servindo ${pasta} em http://localhost:${porta}/`);
  });
}
