// Templates de componentes reutilizáveis.
// Cada função recebe dados e devolve uma string de HTML; as páginas montam
// esses pedaços como peças de Lego. Todo texto que vem do usuário passa por
// escaparHtml() antes de entrar no HTML, para evitar injeção de código (XSS).

const CARACTERES_ESPECIAIS = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escaparHtml(valor) {
  return String(valor ?? '').replace(/[&<>"']/g, (caractere) => CARACTERES_ESPECIAIS[caractere]);
}

// Junta o resultado de um template aplicado a cada item da lista
export function lista(itens, template) {
  return itens.map(template).join('');
}

// <picture> com SVG, WebP e JPG de reserva (mesma estratégia da Experiência Prática 1)
export function imagem({ arquivo, alt, largura, altura }) {
  return `
    <picture>
      <source srcset="../imagens/${arquivo}.svg" type="image/svg+xml">
      <source srcset="../imagens/${arquivo}.webp" type="image/webp">
      <img src="../imagens/${arquivo}.jpg" alt="${escaparHtml(alt)}" width="${largura}" height="${altura}" loading="lazy">
    </picture>`;
}

export function cabecalhoPagina(titulo, texto, botoes = '') {
  return `
    <div class="hero">
      <div class="container">
        <h1 tabindex="-1">${titulo}</h1>
        <p>${texto}</p>
        ${botoes}
      </div>
    </div>`;
}

export function cardProjeto(projeto) {
  return `
    <article id="${projeto.id}" class="col-md-6 col-lg-4 card" data-categoria="${projeto.categoria}">
      <figure class="card-imagem">
        ${imagem(projeto.imagem)}
        <figcaption>${projeto.legenda}</figcaption>
      </figure>
      <div class="card-corpo">
        <h3>${projeto.nome}</h3>
        <ul class="tags" aria-label="Categorias">
          ${lista(projeto.tags, (tag) => `<li class="tag">${tag}</li>`)}
        </ul>
        <p>${projeto.descricao}</p>
        <h4>Como participar</h4>
        <ul>
          ${lista(projeto.comoParticipar, (item) => `<li>${item}</li>`)}
        </ul>
      </div>
      <div class="card-rodape">
        <span class="badge badge-${projeto.situacao.tipo}">${projeto.situacao.texto}</span>
        <a class="botao botao-primario" href="#/cadastro/${projeto.id}">Participar <span class="sr-only">do ${projeto.nome}</span></a>
      </div>
    </article>`;
}

export function cardNumero(item) {
  return `<li class="col-sm-6 col-lg-4 card card-numero"><strong>${item.numero}</strong> ${item.texto}</li>`;
}

export function botaoFiltro(categoria, ativa) {
  return `
    <button class="botao botao-filtro" type="button" data-filtro="${categoria.valor}"
            aria-pressed="${categoria.valor === ativa}">${categoria.rotulo}</button>`;
}

export function estadoVazio(titulo, texto, acao = '') {
  return `
    <div class="estado-vazio">
      <p class="estado-vazio-titulo">${titulo}</p>
      <p>${texto}</p>
      ${acao}
    </div>`;
}

// ---------- Formulário ----------

// Campo de texto padrão: label + input + mensagem de erro ligada por aria-describedby
export function campo({ id, rotulo, tipo = 'text', classe = 'campo-metade', obrigatorio = true, atributos = '' }) {
  return `
    <div class="campo ${classe}">
      <label for="${id}">${rotulo}${obrigatorio ? ' *' : ''}</label>
      <input type="${tipo}" id="${id}" name="${id}" ${obrigatorio ? 'required' : ''} ${atributos}
             aria-describedby="erro-${id}">
      <span id="erro-${id}" class="mensagem-erro" aria-live="polite"></span>
    </div>`;
}

export function opcao({ tipo, nome, valor, rotulo, id = `${nome}-${valor}` }) {
  return `
    <div class="opcao">
      <input type="${tipo}" id="${id}" name="${nome}" value="${valor}">
      <label for="${id}">${rotulo}</label>
    </div>`;
}

// ---------- Inscrições salvas ----------

const ROTULOS_TIPO = { voluntario: 'Voluntário', doador: 'Doador', ambos: 'Voluntário e doador' };

// Mostra só o meio do CPF: dado pessoal não precisa aparecer inteiro na tela
export function mascararCPF(cpf) {
  const digitos = String(cpf ?? '').replace(/\D/g, '');
  return digitos.length === 11 ? `***.${digitos.slice(3, 6)}.${digitos.slice(6, 9)}-**` : '***';
}

export function cartaoInscricao(cadastro, nomesProjetos) {
  const projetos = (cadastro.interesses ?? []).map((id) => nomesProjetos[id] ?? id);
  const data = new Date(cadastro.criadoEm).toLocaleDateString('pt-BR');
  return `
    <li class="card card-simples cartao-inscricao" data-id="${escaparHtml(cadastro.id)}">
      <div class="cartao-inscricao-topo">
        <h3>${escaparHtml(cadastro.nome)}</h3>
        <span class="badge badge-info">${ROTULOS_TIPO[cadastro.tipo] ?? 'Apoiador'}</span>
      </div>
      <dl class="dados-inscricao">
        <dt>E-mail</dt><dd>${escaparHtml(cadastro.email)}</dd>
        <dt>CPF</dt><dd>${mascararCPF(cadastro.cpf)}</dd>
        <dt>Cidade</dt><dd>${escaparHtml(cadastro.cidade)} - ${escaparHtml(cadastro.estado)}</dd>
        <dt>Projetos</dt><dd>${projetos.length ? escaparHtml(projetos.join(', ')) : 'Nenhum escolhido'}</dd>
        <dt>Cadastrado em</dt><dd>${data}</dd>
      </dl>
      <button class="botao botao-perigo botao-pequeno" type="button" data-remover="${escaparHtml(cadastro.id)}">
        Remover <span class="sr-only">${escaparHtml(cadastro.nome)}</span>
      </button>
    </li>`;
}
