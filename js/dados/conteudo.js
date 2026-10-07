// Conteúdo do site separado da marcação: os templates leem estes dados
// e geram o HTML. Para incluir um projeto novo, basta acrescentar um objeto aqui.

export const projetos = [
  {
    id: 'projeto-educacao',
    nome: 'Aprender Juntos',
    categoria: 'educacao',
    imagem: { arquivo: 'projeto-educacao', alt: 'Ilustração de livros abertos', largura: 400, altura: 240 },
    legenda: 'Aulas de reforço escolar no contraturno.',
    tags: ['Educação', '6 a 14 anos'],
    descricao: 'Reforço escolar gratuito em português e matemática para crianças de 6 a 14 anos, com acompanhamento individual e oficinas de leitura.',
    comoParticipar: ['Seja voluntário como educador(a) ou monitor(a)', 'Doe livros e material escolar'],
    situacao: { texto: 'Precisa de voluntários', tipo: 'aviso' }
  },
  {
    id: 'projeto-alimentacao',
    nome: 'Mesa Solidária',
    categoria: 'alimentacao',
    imagem: { arquivo: 'projeto-alimentacao', alt: 'Ilustração de uma tigela com alimentos', largura: 400, altura: 240 },
    legenda: 'Distribuição mensal de cestas básicas.',
    tags: ['Alimentação', 'Famílias'],
    descricao: 'Arrecadação e distribuição de cestas básicas e refeições para famílias em situação de vulnerabilidade, em parceria com mercados do bairro.',
    comoParticipar: ['Ajude na triagem e montagem das cestas', 'Doe alimentos não perecíveis'],
    situacao: { texto: 'Inscrições abertas', tipo: 'sucesso' }
  },
  {
    id: 'projeto-convivencia',
    nome: 'Sábado em Comunidade',
    categoria: 'convivencia',
    imagem: { arquivo: 'voluntarios', alt: 'Ilustração de três voluntários lado a lado', largura: 600, altura: 300 },
    legenda: 'Oficinas abertas para toda a família aos sábados.',
    tags: ['Convivência', 'Todas as idades'],
    descricao: 'Oficinas de esporte, música e artesanato aos sábados, aproximando famílias e fortalecendo os vínculos do bairro.',
    comoParticipar: ['Conduza uma oficina do que você sabe fazer', 'Ajude na organização dos eventos'],
    situacao: { texto: 'Inscrições abertas', tipo: 'sucesso' }
  }
];

export const categorias = [
  { valor: 'todos', rotulo: 'Todos' },
  { valor: 'educacao', rotulo: 'Educação' },
  { valor: 'alimentacao', rotulo: 'Alimentação' },
  { valor: 'convivencia', rotulo: 'Convivência' }
];

export const impacto = [
  { numero: '1.200', texto: 'crianças atendidas no reforço escolar' },
  { numero: '8 toneladas', texto: 'de alimentos distribuídos por ano' },
  { numero: '150', texto: 'voluntários ativos' }
];

export const passosVoluntariado = [
  'Escolha o projeto com o qual mais se identifica.',
  'Preencha o nosso <a href="#/cadastro">formulário de cadastro</a>.',
  'Participe de uma conversa de acolhimento com nossa equipe.',
  'Comece a atuar de acordo com a sua disponibilidade.'
];

export const tiposParticipacao = [
  { valor: 'voluntario', rotulo: 'Voluntário' },
  { valor: 'doador', rotulo: 'Doador' },
  { valor: 'ambos', rotulo: 'Ambos' }
];

export const estados = [
  ['AC', 'Acre'], ['AL', 'Alagoas'], ['AP', 'Amapá'], ['AM', 'Amazonas'], ['BA', 'Bahia'],
  ['CE', 'Ceará'], ['DF', 'Distrito Federal'], ['ES', 'Espírito Santo'], ['GO', 'Goiás'],
  ['MA', 'Maranhão'], ['MT', 'Mato Grosso'], ['MS', 'Mato Grosso do Sul'], ['MG', 'Minas Gerais'],
  ['PA', 'Pará'], ['PB', 'Paraíba'], ['PR', 'Paraná'], ['PE', 'Pernambuco'], ['PI', 'Piauí'],
  ['RJ', 'Rio de Janeiro'], ['RN', 'Rio Grande do Norte'], ['RS', 'Rio Grande do Sul'],
  ['RO', 'Rondônia'], ['RR', 'Roraima'], ['SC', 'Santa Catarina'], ['SP', 'São Paulo'],
  ['SE', 'Sergipe'], ['TO', 'Tocantins']
];
