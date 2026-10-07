// Camada de acesso ao localStorage.
// Centraliza o prefixo das chaves e a conversão JSON, e não deixa a aplicação
// quebrar quando o armazenamento está indisponível (modo privado, cota cheia etc.).

const PREFIXO = 'maos-que-ajudam:';

// "storage" é injetável: no navegador é o localStorage; nos testes, um objeto falso
export function criarArmazenamento(storage) {
  return {
    ler(chave, valorPadrao = null) {
      try {
        const texto = storage.getItem(PREFIXO + chave);
        return texto === null ? valorPadrao : JSON.parse(texto);
      } catch {
        return valorPadrao; // JSON corrompido ou acesso bloqueado
      }
    },

    salvar(chave, valor) {
      try {
        storage.setItem(PREFIXO + chave, JSON.stringify(valor));
        return true;
      } catch {
        return false;
      }
    },

    remover(chave) {
      try {
        storage.removeItem(PREFIXO + chave);
      } catch {
        // nada a fazer: se não dá para acessar, também não há o que remover
      }
    }
  };
}

function localStorageSeguro() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

// Sem localStorage, usa um Map em memória: os dados duram só até recarregar a página
function armazenamentoEmMemoria() {
  const dados = new Map();
  return {
    getItem: (chave) => (dados.has(chave) ? dados.get(chave) : null),
    setItem: (chave, valor) => dados.set(chave, String(valor)),
    removeItem: (chave) => dados.delete(chave)
  };
}

export const armazenamento = criarArmazenamento(localStorageSeguro() ?? armazenamentoEmMemoria());
