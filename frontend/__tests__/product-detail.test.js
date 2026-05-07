const { preencherProduto } = require('../js/product-detail');

beforeEach(() => {
  document.body.innerHTML = `
    <h1 id="produtoNome"></h1>
    <span id="produtoPreco"></span>
    <p id="produtoDescricao"></p>
    <span id="produtoCategoria"></span>
    <img id="produtoImagem" />
  `;
});

describe('product-detail.js', () => {
  test('preencherProduto atualiza os dados da tela', () => {
    preencherProduto({
      nome: 'Jaqueta Denim',
      preco: 279.9,
      descricao: 'Jaqueta jeans classica',
      categoria: 'Jaquetas',
      imagem: '/img/homi1.png'
    });

    expect(document.getElementById('produtoNome').textContent).toBe('Jaqueta Denim');
    expect(document.getElementById('produtoPreco').textContent).toBe('R$ 279.90');
    expect(document.getElementById('produtoCategoria').textContent).toBe('Jaquetas');
    expect(document.getElementById('produtoImagem').getAttribute('src')).toBe('/img/homi1.png');
  });
});
