// Configuração da API
const API_URL = 'http://localhost:3000/api';

// FUNÇÕES DE PRODUTOS
async function carregarProdutos() {
  try {
    const response = await fetch(`${API_URL}/produtos`);
    const produtos = await response.json();
    return produtos;
  } catch (erro) {
    console.error('Erro ao carregar produtos:', erro);
    return [];
  }
}

// FUNÇÕES DE CARRINHO
async function carregarCarrinho() {
  const response = await fetch(`${API_URL}/carrinho`);
  const itens = await response.json();
  return itens;
}

async function adicionarAoCarrinho(produtoId, quantidade = 1) {
  const response = await fetch(`${API_URL}/carrinho`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ produtoId, quantidade })
  });
  const resultado = await response.json();
  return resultado;
}

async function removerDoCarrinho(carrinhoId) {
  try {
    const response = await fetch(`${API_URL}/carrinho/${carrinhoId}`, {
      method: 'DELETE'
    });
    const resultado = await response.json();
    return resultado;
  } catch (erro) {
    console.error('Erro ao remover do carrinho:', erro);
  }
}

async function atualizarQuantidade(carrinhoId, quantidade) {
  try {
    const response = await fetch(`${API_URL}/carrinho/${carrinhoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantidade })
    });
    const resultado = await response.json();
    return resultado;
  } catch (erro) {
    console.error('Erro ao atualizar quantidade:', erro);
    throw erro;
  }
}

if (typeof module !== 'undefined') {
  module.exports = {
    API_URL,
    carregarProdutos,
    carregarCarrinho,
    adicionarAoCarrinho,
    removerDoCarrinho,
    atualizarQuantidade
  };
}
