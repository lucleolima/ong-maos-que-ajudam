// Aplica o tema escuro e o alto contraste ANTES da página ser desenhada.
// É um script comum no <head> (sem defer nem type="module"), porque os módulos
// só rodam depois da página pronta e o tema claro "piscaria" na tela.
// A regra é a mesma de decidirPreferencia() em js/modulos/preferencias.js:
// vale a escolha salva; sem escolha, segue o sistema operacional.
(function () {
  var raiz = document.documentElement;

  function ler(chave) {
    try {
      return JSON.parse(localStorage.getItem('maos-que-ajudam:' + chave));
    } catch (erro) {
      return null; // localStorage bloqueado ou valor inválido
    }
  }

  function sistemaPede(consulta) {
    return Boolean(window.matchMedia && window.matchMedia(consulta).matches);
  }

  var tema = ler('tema');
  if (tema === 'escuro' || (tema === null && sistemaPede('(prefers-color-scheme: dark)'))) {
    raiz.setAttribute('data-tema', 'escuro');
  }

  var contraste = ler('contraste');
  if (contraste === 'alto' || (contraste === null && sistemaPede('(prefers-contrast: more)'))) {
    raiz.setAttribute('data-contraste', 'alto');
  }
})();
