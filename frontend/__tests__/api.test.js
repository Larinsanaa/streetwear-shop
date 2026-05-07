const {
  carregarProdutos,
  adicionarAoCarrinho,
  removerDoCarrinho
} = require('../js/api');

beforeEach(() => {
  global.fetch = jest.fn();
});

describe('api.js', () => {
  test('carregarProdutos retorna os produtos da API', async () => {
    const produtos = [{ id: 1, nome: 'Camiseta', preco: 89.9 }];
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(produtos)
    });

    await expect(carregarProdutos()).resolves.toEqual(produtos);
    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/produtos');
  });

  test('carregarProdutos retorna array vazio quando a API falha', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    fetch.mockRejectedValueOnce(new Error('offline'));

    await expect(carregarProdutos()).resolves.toEqual([]);
  });

  test('adicionarAoCarrinho envia produto e quantidade', async () => {
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ mensagem: 'Produto adicionado ao carrinho' })
    });

    await adicionarAoCarrinho(2, 3);

    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/carrinho', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ produtoId: 2, quantidade: 3 })
    });
  });

  test('removerDoCarrinho usa DELETE no item informado', async () => {
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ mensagem: 'Produto removido do carrinho' })
    });

    await removerDoCarrinho(10);

    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/carrinho/10', {
      method: 'DELETE'
    });
  });
});
