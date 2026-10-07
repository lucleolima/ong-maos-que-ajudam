// Templates das páginas da SPA. O roteador chama a função da rota atual
// e coloca o HTML devolvido dentro de <main id="conteudo">.

import { impacto, passosVoluntariado, projetos, categorias, estados, tiposParticipacao } from '../dados/conteudo.js';
import {
  cabecalhoPagina, cardNumero, cardProjeto, botaoFiltro, imagem, lista, campo, opcao, estadoVazio
} from './componentes.js';

export function paginaInicio() {
  return `
    ${cabecalhoPagina(
      'Mãos que Ajudam: transformando a comunidade desde 2010',
      'Educação, alimentação e convivência para crianças, jovens e famílias de bairros de baixa renda.',
      `<div class="grupo-botoes">
         <a class="botao botao-claro" href="#/cadastro">Quero ser voluntário</a>
         <a class="botao botao-contorno botao-contorno-claro" href="#/projetos/doacoes">Fazer uma doação</a>
       </div>`
    )}

    <section id="sobre" class="secao">
      <div class="container grid grid-centro">
        <div class="col-md-6">
          <h2>Quem somos</h2>
          <p>
            A ONG Mãos que Ajudam é uma organização sem fins lucrativos que atua em bairros
            de baixa renda, oferecendo apoio educacional, distribuição de alimentos e
            atividades de convivência para crianças, jovens e famílias.
          </p>
        </div>
        <figure class="col-md-6 card-imagem">
          ${imagem({ arquivo: 'voluntarios', alt: 'Ilustração de três voluntários lado a lado', largura: 600, altura: 300 })}
          <figcaption>Nossa equipe é formada principalmente por voluntários da própria comunidade.</figcaption>
        </figure>
      </div>
    </section>

    <section id="missao-visao-valores" class="secao secao-alternada">
      <div class="container">
        <h2 class="secao-titulo">Missão, visão e valores</h2>
        <div class="grid">
          <article class="col-md-6 col-lg-4 card card-simples">
            <h3>Missão</h3>
            <p>Promover inclusão social por meio da educação, da alimentação e do fortalecimento de vínculos comunitários.</p>
          </article>
          <article class="col-md-6 col-lg-4 card card-simples">
            <h3>Visão</h3>
            <p>Ser referência regional em projetos sociais transparentes e construídos junto com a comunidade.</p>
          </article>
          <article class="col-md-12 col-lg-4 card card-simples">
            <h3>Valores</h3>
            <ul>
              <li>Transparência na gestão de recursos</li>
              <li>Respeito à diversidade</li>
              <li>Compromisso com a comunidade</li>
              <li>Voluntariado como forma de cidadania</li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <section id="impacto" class="secao">
      <div class="container">
        <h2 class="secao-titulo">Nosso impacto</h2>
        <ul class="grid lista-limpa">${lista(impacto, cardNumero)}</ul>
      </div>
    </section>

    <section id="como-ajudar" class="secao secao-alternada">
      <div class="container texto-centro">
        <h2>Como você pode ajudar</h2>
        <p>
          Você pode doar, divulgar nosso trabalho ou se tornar voluntário.
          Conheça nossos <a href="#/projetos">projetos sociais</a> ou
          <a href="#/cadastro">faça seu cadastro</a> para participar.
        </p>
        <div class="grupo-botoes grupo-botoes-centro">
          <a class="botao botao-primario" href="#/cadastro">Fazer meu cadastro</a>
          <a class="botao botao-contorno" href="#/projetos">Ver projetos</a>
        </div>
      </div>
    </section>`;
}

export function paginaProjetos() {
  return `
    ${cabecalhoPagina(
      'Nossos projetos sociais',
      'Cada projeto nasce de uma necessidade real da comunidade e é mantido com o apoio de voluntários e doadores. Conheça as iniciativas em andamento.'
    )}

    <section id="projetos-ativos" class="secao">
      <div class="container">
        <h2 class="secao-titulo">Projetos em andamento</h2>

        <!-- Filtros: os cartões abaixo são gerados de novo pelo JS a cada clique ou digitação -->
        <div class="barra-filtros">
          <div class="filtros" role="group" aria-label="Filtrar por área">
            ${lista(categorias, (categoria) => botaoFiltro(categoria, 'todos'))}
          </div>
          <div class="campo campo-busca">
            <label for="busca-projeto">Buscar projeto</label>
            <input type="search" id="busca-projeto" placeholder="Ex.: leitura, cestas, música">
          </div>
        </div>
        <p id="contagem-projetos" class="resultado-contagem" aria-live="polite"></p>

        <div id="lista-projetos" class="grid">${lista(projetos, cardProjeto)}</div>
      </div>
    </section>

    <section id="voluntariado" class="secao secao-alternada">
      <div class="container">
        <div class="secao-titulo">
          <h2>Seja voluntário</h2>
          <p>Doe seu tempo e seus conhecimentos. Veja como participar:</p>
        </div>
        <ol class="grid lista-limpa passos">
          ${lista(passosVoluntariado, (passo) => `<li class="col-sm-6 col-lg-3 card card-simples">${passo}</li>`)}
        </ol>
      </div>
    </section>

    <section id="doacoes" class="secao">
      <div class="container">
        <h2 class="secao-titulo">Faça uma doação</h2>
        <div class="alerta alerta-info" role="note">
          <p>Toda contribuição é aplicada diretamente nos projetos e prestada em contas no nosso relatório anual.</p>
        </div>
        <div class="grid">
          <article id="doacao-financeira" class="col-md-6 card card-simples">
            <h3>Doação financeira</h3>
            <ul>
              <li><strong>PIX:</strong> contato@maosqueajudam.org</li>
              <li><strong>Transferência:</strong> Banco Exemplo, agência 0001, conta 12345-6</li>
            </ul>
            <button class="botao botao-secundario" type="button" data-copiar="contato@maosqueajudam.org">Copiar chave PIX</button>
          </article>
          <article id="doacao-itens" class="col-md-6 card card-simples">
            <h3>Doação de itens</h3>
            <p>
              Recebemos alimentos não perecíveis, livros e material escolar de segunda a sexta,
              das 9h às 17h, no endereço informado no rodapé.
            </p>
          </article>
        </div>
      </div>
    </section>`;
}

export function paginaCadastro() {
  return `
    ${cabecalhoPagina(
      'Faça parte da nossa rede',
      'Cadastre-se como voluntário, doador ou ambos. Entraremos em contato em até 5 dias úteis.'
    )}

    <section id="formulario-cadastro" class="secao">
      <div class="container">
        <div class="secao-titulo">
          <h2>Cadastro de voluntários e apoiadores</h2>
          <p>Campos marcados com * são obrigatórios. O que você digitar fica salvo como rascunho neste navegador.</p>
        </div>

        <!-- Resumo dos erros: preenchido pelo JS quando o envio é bloqueado -->
        <div id="alerta-erro" class="alerta alerta-erro" role="alert" tabindex="-1" hidden></div>

        <form id="form-cadastro" class="formulario" novalidate>
          <fieldset>
            <legend>Dados pessoais</legend>
            <div class="campos">
              ${campo({ id: 'nome', rotulo: 'Nome completo', classe: '', atributos: 'maxlength="100" autocomplete="name"' })}
              ${campo({ id: 'email', rotulo: 'E-mail', tipo: 'email', atributos: 'autocomplete="email" placeholder="nome@exemplo.com"' })}
              ${campo({ id: 'cpf', rotulo: 'CPF', atributos: 'inputmode="numeric" placeholder="000.000.000-00"' })}
              ${campo({ id: 'nascimento', rotulo: 'Data de nascimento', tipo: 'date', atributos: 'min="1900-01-01" autocomplete="bday"' })}
              ${campo({ id: 'telefone', rotulo: 'Telefone', tipo: 'tel', atributos: 'inputmode="numeric" autocomplete="tel" placeholder="(00) 00000-0000"' })}
            </div>
          </fieldset>

          <fieldset>
            <legend>Endereço</legend>
            <div class="campos">
              <div class="campo campo-terco">
                <label for="cep">CEP *</label>
                <input type="text" id="cep" name="cep" required inputmode="numeric" autocomplete="postal-code"
                       placeholder="00000-000" aria-describedby="erro-cep dica-cep">
                <span id="dica-cep" class="dica-campo" aria-live="polite">Preenchemos o endereço pelo CEP.</span>
                <span id="erro-cep" class="mensagem-erro" aria-live="polite"></span>
              </div>
              ${campo({ id: 'logradouro', rotulo: 'Endereço (rua/avenida)', classe: 'campo-dois-tercos', atributos: 'autocomplete="address-line1"' })}
              ${campo({ id: 'numero', rotulo: 'Número', classe: 'campo-terco', atributos: 'maxlength="10"' })}
              ${campo({ id: 'complemento', rotulo: 'Complemento', classe: 'campo-dois-tercos', obrigatorio: false, atributos: 'autocomplete="address-line2"' })}
              ${campo({ id: 'cidade', rotulo: 'Cidade', atributos: 'autocomplete="address-level2"' })}
              <div class="campo campo-metade">
                <label for="estado">Estado *</label>
                <select id="estado" name="estado" required autocomplete="address-level1" aria-describedby="erro-estado">
                  <option value="">Selecione</option>
                  ${lista(estados, ([sigla, nome]) => `<option value="${sigla}">${nome}</option>`)}
                </select>
                <span id="erro-estado" class="mensagem-erro" aria-live="polite"></span>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Como deseja participar</legend>
            <div class="campos">
              <fieldset class="campo" id="grupo-tipo" aria-describedby="erro-tipo">
                <legend>Tipo de participação *</legend>
                <div class="opcoes">
                  ${lista(tiposParticipacao, (tipo) => opcao({ tipo: 'radio', nome: 'tipo', valor: tipo.valor, rotulo: tipo.rotulo }))}
                </div>
                <span id="erro-tipo" class="mensagem-erro" aria-live="polite"></span>
              </fieldset>

              <fieldset class="campo">
                <legend>Projetos de interesse</legend>
                <div class="opcoes">
                  ${lista(projetos, (projeto) => opcao({ tipo: 'checkbox', nome: 'interesses', valor: projeto.id, rotulo: projeto.nome }))}
                </div>
              </fieldset>

              <div class="campo">
                <label for="mensagem">Conte um pouco sobre você (opcional)</label>
                <textarea id="mensagem" name="mensagem" rows="4" maxlength="500" aria-describedby="contador-mensagem"></textarea>
                <span id="contador-mensagem" class="dica-campo">0 de 500 caracteres</span>
              </div>
            </div>
          </fieldset>

          <!-- Fora do .campos: um .campo aqui (span 12) criaria 12 colunas no grid do formulário -->
          <div class="campo-consentimento">
            <div class="opcao">
              <input type="checkbox" id="consentimento" name="consentimento" required aria-describedby="erro-consentimento">
              <label for="consentimento">Autorizo o uso dos meus dados para contato da ONG, conforme a LGPD. *</label>
            </div>
            <span id="erro-consentimento" class="mensagem-erro" aria-live="polite"></span>
          </div>

          <div class="grupo-botoes">
            <button class="botao botao-primario" type="submit">Enviar cadastro</button>
            <button class="botao botao-contorno" type="reset">Limpar</button>
          </div>
        </form>
      </div>
    </section>`;
}

export function paginaInscricoes() {
  return `
    ${cabecalhoPagina(
      'Inscrições recebidas',
      'Cadastros feitos neste navegador. Os dados ficam guardados no localStorage, sem envio para servidor.'
    )}

    <section class="secao">
      <div class="container">
        <div class="barra-filtros">
          <div class="campo">
            <label for="filtro-tipo">Mostrar</label>
            <select id="filtro-tipo">
              <option value="todos">Todos os tipos</option>
              ${lista(tiposParticipacao, (tipo) => `<option value="${tipo.valor}">${tipo.rotulo}</option>`)}
            </select>
          </div>
          <button class="botao botao-contorno botao-pequeno" type="button" data-limpar-tudo>Remover todas</button>
        </div>
        <p id="contagem-inscricoes" class="resultado-contagem" aria-live="polite" tabindex="-1"></p>
        <ul id="lista-inscricoes" class="lista-limpa lista-inscricoes"></ul>
      </div>
    </section>`;
}

export function paginaNaoEncontrada() {
  return `
    ${cabecalhoPagina('Página não encontrada', 'O endereço acessado não existe ou foi alterado.')}
    <section class="secao">
      <div class="container">
        ${estadoVazio('Que tal recomeçar?', 'Volte para a página inicial ou conheça nossos projetos.',
          '<a class="botao botao-primario" href="#/inicio">Ir para o início</a>')}
      </div>
    </section>`;
}
