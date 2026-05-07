const {
  __setCarrinhoItens,
  carregarCarrinhoLocal,
  renderizarCarrinho,
  atualizarContadorCarrinho
} = require('../js/carrinho');

beforeEach(() => {
  document.body.innerHTML = `
    <div id="carrinhoItems"></div>
    <div id="carrinhoTotal"><span id="totalPrice"></span></div>
    <span id="carrinhoCount"></span>
  `;
  localStorage.clear();
});

describe('carrinho.js', () => {
  test('carregarCarrinhoLocal retorna array vazio sem dados salvos', () => {
    expect(carregarCarrinhoLocal()).toEqual([]);
  });

  test('renderizarCarrinho mostra total e itens', () => {
    __setCarrinhoItens([
      { id: 1, produtoId: 1, nome: 'Camiseta', preco: 50, imagem: '/img/logo.png', quantidade: 2 }
    ]);

    renderizarCarrinho();

    expect(document.getElementById('carrinhoItems').textContent).toContain('Camiseta');
    expect(document.getElementById('totalPrice').textContent).toBe('100.00');
    expect(document.getElementById('carrinhoTotal').style.display).toBe('block');
  });

  test('atualizarContadorCarrinho soma as quantidades', () => {
    __setCarrinhoItens([
      { quantidade: 2 },
      { quantidade: 3 }
    ]);

    atualizarContadorCarrinho();

    expect(document.getElementById('carrinhoCount').textContent).toBe('5');
  });
});
