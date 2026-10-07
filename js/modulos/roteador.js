// Roteador da SPA baseado em hash (#/rota).
// O hash não recarrega a página: ao mudar, o roteador troca só o conteúdo do <main>.
// Funciona em qualquer hospedagem estática (GitHub Pages, Live Server), sem servidor.
//
// Formato: #/nome-da-rota/parametro
//   #/projetos           -> página de projetos
//   #/projetos/doacoes   -> página de projetos rolando até a seção "doacoes"
//   #/cadastro/projeto-educacao -> cadastro com o projeto já marcado

export function lerRota(hash, rotaPadrao) {
  if (!hash.startsWith('#/')) return { nome: rotaPadrao, parametro: null };
  const [nome, parametro] = hash.slice(2).split('/');
  return { nome: nome || rotaPadrao, parametro: parametro ? decodeURIComponent(parametro) : null };
}

export function criarRoteador({ rotas, raiz, rotaPadrao = 'inicio', rotaNaoEncontrada, nomeSite, aoNavegar }) {
  let rotaAtual = null;
  let limparPaginaAtual = null;

  // Página recém-desenhada rola direto (instant); dentro da mesma página, usa a rolagem suave do CSS
  function rolarAte(id, comportamento = 'auto') {
    const alvo = document.getElementById(id);
    if (!alvo) return false;
    alvo.scrollIntoView({ behavior: comportamento });
    return true;
  }

  function navegar() {
    // Âncoras comuns (ex.: #lista-projetos) não são rotas: o navegador cuida delas
    if (location.hash && !location.hash.startsWith('#/') && rotaAtual) return;

    const { nome, parametro } = lerRota(location.hash, rotaPadrao);

    // Mesma página, só mudou a seção: rola sem renderizar de novo
    if (nome === rotaAtual && parametro && rolarAte(parametro)) return;

    const rota = rotas[nome] ?? rotaNaoEncontrada;
    const primeiraCarga = rotaAtual === null;

    // Desfaz o que a página anterior montou (listeners globais, máscaras etc.)
    if (limparPaginaAtual) limparPaginaAtual();

    raiz.innerHTML = rota.template();
    limparPaginaAtual = rota.montar ? rota.montar(raiz, parametro) : null;
    rotaAtual = nome;

    document.title = `${rota.titulo} | ${nomeSite}`;
    if (aoNavegar) aoNavegar(rotas[nome] ? nome : null);

    if (parametro && rolarAte(parametro, 'instant')) return;
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Leitores de tela não percebem a troca de conteúdo sozinhos:
    // levar o foco ao novo título anuncia a página (exceto na primeira carga)
    if (!primeiraCarga) raiz.querySelector('h1')?.focus();
  }

  return {
    iniciar() {
      window.addEventListener('hashchange', navegar);
      navegar();
    }
  };
}
