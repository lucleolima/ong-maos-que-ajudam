// Comunicação com a API pública ViaCEP.
// Fica separada do formulário: aqui só há rede e tratamento da resposta, nada de DOM.

const TEMPO_LIMITE_MS = 5000;

// Devolve { logradouro, cidade, estado } ou null se o CEP não existir.
// Lança erro se a rede falhar ou demorar mais que o tempo limite.
export async function buscarEnderecoPorCep(cep, buscar = fetch) {
  const resposta = await buscar(`https://viacep.com.br/ws/${cep}/json/`, {
    signal: AbortSignal.timeout(TEMPO_LIMITE_MS)
  });
  if (!resposta.ok) throw new Error(`ViaCEP respondeu ${resposta.status}`);

  const dados = await resposta.json();
  if (dados.erro) return null;
  return { logradouro: dados.logradouro, cidade: dados.localidade, estado: dados.uf };
}
