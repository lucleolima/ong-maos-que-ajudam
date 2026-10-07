# Como contribuir

## Fluxo de branches (GitFlow)

| Branch | Para que serve | Sai de | Volta para |
|---|---|---|---|
| `main` | Versão publicada. Cada merge aqui dispara o deploy no GitHub Pages | - | - |
| `develop` | Integração do que está pronto para a próxima versão | `main` | `release/*` |
| `feature/nome` | Uma funcionalidade ou melhoria | `develop` | `develop` (pull request) |
| `release/x.y.z` | Ajustes finais de uma versão (número, CHANGELOG) | `develop` | `main` e `develop` |
| `hotfix/x.y.z` | Correção urgente do que já está no ar | `main` | `main` e `develop` |

Ninguém faz commit direto em `main` ou `develop`: tudo entra por pull request.

```bash
git checkout develop
git pull
git checkout -b feature/minha-melhoria
# ... commits ...
git push -u origin feature/minha-melhoria
# abrir o pull request para develop no GitHub
```

## Mensagens de commit (Conventional Commits)

Formato: `tipo(escopo opcional): descrição no imperativo`

| Tipo | Quando usar | Efeito na versão |
|---|---|---|
| `feat` | nova funcionalidade | minor (1.**1**.0) |
| `fix` | correção de bug | patch (1.0.**1**) |
| `docs` | só documentação | - |
| `style` | formatação, sem mudar comportamento | - |
| `refactor` | reorganização de código | - |
| `perf` | melhoria de desempenho | patch |
| `test` | testes | - |
| `build` | build, dependências | - |
| `ci` | GitHub Actions | - |
| `chore` | manutenção geral | - |

Exemplos: `feat(a11y): adiciona modo de alto contraste`, `fix(menu): fecha o submenu com Esc`.

Mudança que quebra compatibilidade leva `!` (`feat!: ...`) e sobe a versão major.

## Versões (SemVer)

As versões seguem o [Versionamento Semântico](https://semver.org/lang/pt-BR/) (`MAJOR.MINOR.PATCH`), marcadas com tags `vX.Y.Z` e descritas no [CHANGELOG](CHANGELOG.md).
