# Changelog

Todas as mudanças relevantes do projeto. Formato baseado no [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e versões no [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.0.2] - 2026-10-07

### Desempenho
- O rodapé não pula mais quando a página carrega: o <main> reserva a altura da tela. CLS no Lighthouse mobile de 0.559 para 0.048.
- Script do tema (menos de 0.5 KB) embutido no HTML pelo build, eliminando uma requisição que bloqueava a renderização.

### Corrigido
- Ordem do foco do cabeçalho no celular: os botões de tema apareciam antes do botão Menu, mas recebiam o foco depois (WCAG 2.4.3). Novo teste automático compara a ordem do Tab com a posição na tela.

## [1.0.1] - 2026-10-07

### Corrigido
- Rolagem horizontal do cabeçalho em telas de 320px quando as fontes são um pouco mais largas, detectada pelo teste de reflow no GitHub Actions (Linux). O botão "Menu" mostra só o ícone abaixo de 400px e o texto continua disponível para leitores de tela.
- Teste de reflow agora também verifica 300px, para ter folga entre sistemas operacionais.

## [1.0.0] - 2026-10-07

Primeira versão de produção (Experiência Prática 4).

### Adicionado
- Modo escuro e modo de alto contraste, com botões no cabeçalho (`aria-pressed`), escolha salva no `localStorage` e respeito às preferências do sistema (`prefers-color-scheme`, `prefers-contrast`).
- Tecla Esc fecha o submenu suspenso (WCAG 1.4.13).
- Testes automáticos de acessibilidade com axe-core no Chrome headless: 4 páginas × 3 temas, teclado e reflow em 320px (`npm run test:a11y`).
- Build de produção (`npm run build`): CSS e JS unificados e minificados com esbuild, HTML minificado, imagens otimizadas com svgo e sharp.
- Deploy automático no GitHub Pages pelo GitHub Actions, só depois de testes, build e auditoria de acessibilidade passarem.
- Servidor local sem dependências (`npm start` e `npm run preview`).
- `CONTRIBUTING.md` (GitFlow e Conventional Commits), modelo de pull request, `.editorconfig` e `.gitattributes`.

### Corrigido
- Contorno de foco com contraste de 2.08:1 sobre o branco; agora 8.06:1 (amarelo sobre as faixas escuras).
- Borda dos campos do formulário com contraste de 1.53:1; agora 3.66:1.

### Alterado
- Cores fixas do CSS trocadas por variáveis do design system.
- README reescrito com instalação, scripts, acessibilidade, build, deploy e manutenção.

## [0.3.0] - 2026-10-07

Estado final da Experiência Prática 3: SPA em JavaScript com roteamento por hash, templates, validação de formulário, ViaCEP, localStorage e máscaras com IMask.

[1.0.2]: https://github.com/lucleolima/ong-maos-que-ajudam/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/lucleolima/ong-maos-que-ajudam/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/lucleolima/ong-maos-que-ajudam/compare/v0.3.0...v1.0.0
[0.3.0]: https://github.com/lucleolima/ong-maos-que-ajudam/releases/tag/v0.3.0
