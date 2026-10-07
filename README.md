# ONG Mãos que Ajudam

[![Testes e deploy](https://github.com/lucleolima/ong-maos-que-ajudam/actions/workflows/deploy.yml/badge.svg)](https://github.com/lucleolima/ong-maos-que-ajudam/actions/workflows/deploy.yml)

Site da ONG fictícia **Mãos que Ajudam**: apresenta os projetos sociais e recebe o cadastro de voluntários e doadores. É uma Single Page Application (SPA) em HTML, CSS e JavaScript puros, sem framework.

**Site no ar:** https://lucleolima.github.io/ong-maos-que-ajudam/

Projeto da disciplina de Desenvolvimento Front-End (Análise e Desenvolvimento de Sistemas), construído em quatro etapas:

| Etapa | Tema | Repositório |
|---|---|---|
| Experiência Prática 1 | HTML5 semântico | [projeto-ong](https://github.com/lucleolima/projeto-ong) |
| Experiência Prática 2 | CSS3, design system e layouts responsivos | [ong-maos-que-ajudam-css](https://github.com/lucleolima/ong-maos-que-ajudam-css) |
| Experiência Prática 3 | JavaScript: SPA, validação, localStorage | [ong-maos-que-ajudam-js](https://github.com/lucleolima/ong-maos-que-ajudam-js) |
| **Experiência Prática 4** | **Git/GitFlow, acessibilidade WCAG 2.1 AA, build e deploy** | **este repositório** |

## Sumário

- [Funcionalidades](#funcionalidades)
- [Acessibilidade](#acessibilidade)
- [Instalação e uso](#instalação-e-uso)
- [Scripts](#scripts)
- [Build de produção](#build-de-produção)
- [Deploy](#deploy)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Fluxo de trabalho com Git](#fluxo-de-trabalho-com-git)
- [Manutenção](#manutenção)

## Funcionalidades

- Navegação SPA por hash (`#/projetos`, `#/cadastro/projeto-educacao`), com título da aba e link ativo atualizados e página 404.
- Projetos com filtro por área e busca por texto (sem diferenciar acentos).
- Cadastro de voluntário/doador com validação campo a campo (CPF com dígitos verificadores, idade mínima, telefone, CEP), resumo de erros com links e endereço preenchido pelo CEP (API ViaCEP).
- Inscrições, rascunho do formulário e último filtro guardados no `localStorage`.
- Máscaras de CPF, telefone e CEP com a biblioteca IMask (com máscaras próprias se a CDN falhar).
- **Modo escuro e alto contraste**, escolhidos pelos botões do cabeçalho ou pela configuração do sistema operacional.

## Acessibilidade

O objetivo é a conformidade com a **WCAG 2.1, nível AA**.

| Critério | O que foi feito |
|---|---|
| 1.3.1 Informações e relações | HTML semântico (`header`, `nav`, `main`, `footer`, `fieldset`/`legend`), rótulos ligados aos campos, erros ligados por `aria-describedby` |
| 1.4.3 Contraste (texto) | Todas as combinações medidas: no mínimo 4.5:1 nos três temas |
| 1.4.10 Reflow | Layout mobile-first sem rolagem horizontal em 320px (equivale a zoom de 400%) |
| 1.4.11 Contraste (não texto) | Contorno de foco e borda dos campos corrigidos para no mínimo 3:1 (antes 2.08:1 e 1.53:1) |
| 1.4.13 Conteúdo em hover/foco | Submenu suspenso fecha com Esc |
| 2.1.1 Teclado | Tudo funciona pelo teclado: menu, submenu, filtros, formulário, modais (`<dialog>`) |
| 2.4.1 Ignorar blocos | Link "Pular para o conteúdo" é o primeiro item do Tab |
| 2.4.3 Ordem do foco | A cada troca de página o foco vai para o título (`h1`), que o leitor de tela anuncia |
| 2.4.7 Foco visível | Contorno de 3px em todos os elementos focáveis |
| 4.1.2 Nome, função, valor | `aria-expanded` no botão do menu, `aria-pressed` nos filtros e botões de tema, `aria-current` no link ativo |
| 4.1.3 Mensagens de status | Toast com `role="status"`, contagem de resultados com `aria-live` |

Também: `prefers-reduced-motion` desliga as animações, as imagens têm texto alternativo e as decorativas usam `alt=""`/`aria-hidden`.

**Como é verificado:** `npm run test:a11y` abre o site num Chrome sem janela e roda o [axe-core](https://github.com/dequelabs/axe-core) nas 4 páginas e nos 3 temas (12 auditorias), além de testes de teclado e de reflow. O mesmo teste roda no GitHub Actions antes de cada deploy. Testes automáticos não pegam tudo (por exemplo, se um texto alternativo faz sentido), por isso vale conferir à mão com o teclado e com um leitor de tela como o NVDA a cada mudança grande.

## Instalação e uso

Requisitos: [Node.js](https://nodejs.org/) 20 ou superior e Git. Para os testes de acessibilidade, Google Chrome ou Microsoft Edge instalado.

```bash
git clone https://github.com/lucleolima/ong-maos-que-ajudam.git
cd ong-maos-que-ajudam
npm install
npm start
```

Abra http://localhost:5500/ no navegador.

> Os arquivos JavaScript são módulos ES (`import`/`export`), que o navegador não carrega abrindo o HTML direto do disco (`file://`). Por isso é preciso um servidor local: `npm start` ou a extensão Live Server do VS Code.

## Scripts

| Comando | O que faz |
|---|---|
| `npm start` | Serve o código-fonte em http://localhost:5500 |
| `npm test` | Testes de unidade (validação, armazenamento, temas, rotas...) com `node:test` |
| `npm run test:a11y` | Auditoria de acessibilidade com axe-core + testes de teclado e reflow |
| `npm run build` | Gera a versão de produção na pasta `dist/` |
| `npm run preview` | Serve a pasta `dist/` em http://localhost:5501 |
| `npm run test:a11y:dist` | Auditoria de acessibilidade na pasta `dist/` |

Se o Chrome estiver num lugar diferente do padrão, informe o caminho: `CHROME_PATH="/caminho/do/chrome" npm run test:a11y`.

## Build de produção

`npm run build` ([scripts/build.js](scripts/build.js)) gera `dist/` com a mesma estrutura de pastas do código-fonte:

| Tipo | Ferramenta | Original | Produção | Com gzip |
|---|---|---|---|---|
| CSS (5 arquivos → 1) | esbuild | 38.3 KB | 23.2 KB | 4.9 KB |
| JavaScript (16 módulos → 1 pacote) | esbuild | 59.7 KB | 34.8 KB | 11.6 KB |
| HTML | html-minifier-terser | 7.0 KB | 5.0 KB | 1.8 KB |
| Imagens (SVG, JPG, PNG, WebP) | svgo e sharp | 30.9 KB | 19.2 KB | - |

Além do tamanho, a página passa de 21 requisições de CSS/JS para 3. O JavaScript ganha um *source map*, então o DevTools continua mostrando o código original na depuração.

## Deploy

O deploy é automático pelo **GitHub Actions** ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)):

1. Em todo pull request: `npm ci`, testes de unidade, build e auditoria de acessibilidade na pasta `dist/`.
2. Em todo push na `main` (merge de uma release ou hotfix): os mesmos passos e, se tudo passar, a pasta `dist/` é publicada no **GitHub Pages**. Se algum teste falhar, a versão no ar não muda.

Configuração necessária uma única vez no GitHub: *Settings > Pages > Build and deployment > Source: **GitHub Actions***.

## Estrutura de pastas

```
├── index.html                  redireciona para html/index.html
├── html/index.html             casca da SPA: cabeçalho, <main>, rodapé, toast e modais
├── css/
│   ├── design-system.css       variáveis (cores, tipografia, espaçamento), reset e base
│   ├── layout.css              grid de 12 colunas, cabeçalho, hero e rodapé
│   ├── componentes.css         menu, botões, cartões, formulários, alertas, toast e modal
│   ├── interatividade.css      estados criados pelo JS (erros, filtros, inscrições)
│   └── temas.css               modo escuro, alto contraste e botões de preferência
├── js/
│   ├── tema-inicial.js         aplica o tema antes da página aparecer
│   ├── main.js                 ponto de entrada: rotas e módulos
│   ├── dados/conteudo.js       textos dos projetos, categorias, estados
│   ├── templates/              funções que geram o HTML das páginas e componentes
│   └── modulos/                roteador, menu, preferências, validação, formulário...
├── imagens/                    SVG com WebP/JPG/PNG de reserva
├── testes/
│   ├── *.test.js               testes de unidade
│   └── a11y/                   testes de acessibilidade (axe-core + Chrome headless)
├── scripts/
│   ├── build.js                build de produção
│   └── servidor.js             servidor local sem dependências
├── .github/
│   ├── workflows/deploy.yml    CI/CD
│   └── pull_request_template.md
├── CHANGELOG.md                histórico de versões
└── CONTRIBUTING.md             GitFlow e padrão de commits
```

## Fluxo de trabalho com Git

O repositório segue o **GitFlow** e os commits seguem o padrão **Conventional Commits** (`feat:`, `fix:`, `docs:`, `build:`, `ci:`...). As versões usam versionamento semântico e são marcadas com tags (`v1.0.0`). Detalhes no [CONTRIBUTING.md](CONTRIBUTING.md) e no [CHANGELOG.md](CHANGELOG.md).

```
main      ●──────────────────────────────●  v1.0.0  (publicado)
           \                            /
develop     ●───●───────●───────●──────●
                 \     / \     /
feature/...       ●───●   ●───●
```

## Manutenção

- **Incluir ou editar um projeto:** altere o array `projetos` em [js/dados/conteudo.js](js/dados/conteudo.js). O cartão, o filtro e a opção no formulário são gerados a partir dele.
- **Trocar cores:** altere as variáveis em [css/design-system.css](css/design-system.css) e os equivalentes dos temas em [css/temas.css](css/temas.css). Depois rode `npm run test:a11y`: o axe acusa qualquer texto que fique abaixo do contraste mínimo.
- **Novo arquivo CSS:** inclua o `<link>` em `html/index.html` e o nome na lista `ARQUIVOS_CSS` de [scripts/build.js](scripts/build.js) (o build avisa se esquecer).
- **Nova página:** crie o template em `js/templates/paginas.js`, registre a rota em `js/main.js` e acrescente o nome na lista `ROTAS` do teste de acessibilidade.
- **Antes de abrir um pull request:** `npm test`, `npm run build` e `npm run test:a11y:dist`.

## Autor

Lucas Leo — estudante de Análise e Desenvolvimento de Sistemas.
