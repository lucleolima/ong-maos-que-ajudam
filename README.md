# ONG Mãos que Ajudam: SPA em JavaScript

Projeto da disciplina de Desenvolvimento Front-End.

- **Experiência Prática 1:** estrutura em HTML5 semântico ([projeto-ong](https://github.com/lucleolima/projeto-ong)).
- **Experiência Prática 2:** estilização e layouts com CSS3 ([ong-maos-que-ajudam-css](https://github.com/lucleolima/ong-maos-que-ajudam-css)).
- **Experiência Prática 3 (este repositório):** o site estático virou uma Single Page Application (SPA) em JavaScript puro, com templates, eventos, validação de formulário e localStorage.

## Como abrir

O JavaScript usa módulos ES (`import`/`export`), que o navegador não carrega direto do disco (`file://`).
Versão online: https://lucleolima.github.io/ong-maos-que-ajudam-js/

Para rodar no computador, abra com um servidor local, por exemplo a extensão **Live Server** do VS Code, clicando com o botão direito em `html/index.html` > *Open with Live Server*.

O `index.html` da raiz só redireciona para `html/index.html` (útil no GitHub Pages).

## Funcionalidades

| Recurso | Onde |
|---|---|
| Navegação SPA por hash (`#/projetos`, `#/cadastro/projeto-educacao`), título da aba, link ativo no menu, foco no título a cada troca de página e página 404 | `js/modulos/roteador.js` |
| Templates: páginas e componentes gerados por funções a partir dos dados em `js/dados/conteudo.js` | `js/templates/` |
| Filtro de projetos por área (botões com `aria-pressed`) e busca por texto sem diferenciar acentos | `js/modulos/projetos.js` |
| Validação do cadastro campo a campo (CPF com dígitos verificadores, idade mínima, telefone, CEP...), resumo de erros com links para os campos | `js/modulos/validacao.js`, `js/modulos/formulario.js` |
| Endereço preenchido automaticamente pelo CEP (API ViaCEP) | `js/modulos/cep.js`, `js/modulos/formulario.js` |
| localStorage: inscrições salvas, rascunho automático do formulário e último filtro escolhido | `js/modulos/armazenamento.js`, `js/modulos/cadastros.js` |
| Página de inscrições com filtro por tipo e remoção confirmada em modal (`<dialog>`) | `js/modulos/inscricoes.js` |
| Biblioteca externa **IMask** (máscaras de CPF, telefone e CEP), com máscaras próprias de reserva se a CDN falhar | `js/modulos/mascaras.js` |

## Estrutura

```
├── index.html                 redireciona para html/index.html
├── html/
│   └── index.html             casca da SPA: cabeçalho, <main> vazio, rodapé, toast e modais
├── css/
│   ├── design-system.css      variáveis, reset e base (Exp. 2)
│   ├── layout.css             grid de 12 colunas, cabeçalho e rodapé (Exp. 2)
│   ├── componentes.css        botões, cartões, formulários, alertas, toast e modal (Exp. 2)
│   └── interatividade.css     estados criados pelo JS: erros, filtros, contador, inscrições
├── js/
│   ├── main.js                ponto de entrada: registra as rotas e liga os módulos
│   ├── dados/
│   │   └── conteudo.js        projetos, categorias, números de impacto, estados
│   ├── templates/
│   │   ├── componentes.js     cartões, campos, botões de filtro, escape de HTML
│   │   └── paginas.js         uma função por página
│   └── modulos/
│       ├── roteador.js        navegação SPA
│       ├── menu.js            menu responsivo e link ativo
│       ├── feedback.js        toast e modais
│       ├── validacao.js       regras de validação (funções puras)
│       ├── mascaras.js        IMask + máscaras de reserva
│       ├── armazenamento.js   acesso seguro ao localStorage
│       ├── cadastros.js       inscrições e rascunho
│       ├── cep.js             consulta à API ViaCEP (só rede, sem DOM)
│       ├── formulario.js      eventos do cadastro
│       ├── projetos.js        filtro e busca de projetos
│       └── inscricoes.js      lista de inscrições
├── imagens/                   SVG, WebP e JPG/PNG
└── testes/                    testes automatizados (node:test)
```

## Testes

Com o Node.js instalado (versão 20 ou superior):

```
npm test
```

São 17 testes das partes que não dependem da tela: validação (CPF, nome, e-mail, telefone, CEP, idade), armazenamento (incluindo JSON corrompido e localStorage bloqueado), cadastros, consulta de CEP (com um fetch falso, sem internet), escape de HTML contra XSS, máscaras, filtro de projetos e leitura das rotas.

As telas também foram testadas manualmente no navegador (envio vazio, CPF inválido e repetido, busca de CEP, rascunho após trocar de página, remoção de inscrições) e o HTML gerado de cada página passou no validador do W3C sem erros.
