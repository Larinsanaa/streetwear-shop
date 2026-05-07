// Obter ID do produto da URL
const urlParams = new URLSearchParams(window.location.search);
const produtoId = urlParams.get('id');

// Preencher dados do produto na página
function preencherProduto(produto) {
  document.getElementById('produtoNome').textContent = produto.nome;
  document.getElementById('produtoPreco').textContent = `R$ ${produto.preco.toFixed(2)}`;
  document.getElementById('produtoDescricao').textContent = produto.descricao;
  document.getElementById('produtoCategoria').textContent = produto.categoria;
  document.getElementById('produtoImagem').src = produto.imagem;
  document.getElementById('produtoImagem').alt = produto.nome;
}

// Carregar detalhes do produto
async function carregarProduto() {
  if (!produtoId) {
    document.getElementById('produtoNome').textContent = 'ID do produto não especificado';
    return;
  }

  // Usa dados do sessionStorage imediatamente (mesma imagem do card clicado)
  const cache = sessionStorage.getItem('produtoAtual');
  if (cache) {
    const produtoCache = JSON.parse(cache);
    if (String(produtoCache.id) === String(produtoId)) {
      preencherProduto(produtoCache);
    }
  }

  // Tenta atualizar com dados frescos do backend
  try {
    const response = await fetch(`http://localhost:3000/api/produtos/${produtoId}`);
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
    const produto = await response.json();
    if (produto.erro) throw new Error(produto.erro);
    preencherProduto(produto);
  } catch (erro) {
    if (!cache) {
      document.getElementById('produtoNome').textContent = 'Produto não encontrado';
    }
  }

  await atualizarCarrinho();
}

// Adicionar ao localStorage como fallback na página de detalhes
function adicionarLocalStorageDetalhes(produtoId, quantidade) {
  const nome = document.getElementById('produtoNome')?.textContent || '';
  const precoTexto = document.getElementById('produtoPreco')?.textContent?.replace('R$ ', '').replace(',', '.') || '0';
  const preco = parseFloat(precoTexto) || 0;
  const imagem = document.getElementById('produtoImagem')?.src || '';
  const id = parseInt(produtoId);

  const carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
  const existente = carrinho.find(i => i.produtoId === id);

  if (existente) {
    existente.quantidade += quantidade;
  } else {
    carrinho.push({ id, produtoId: id, nome, preco, imagem, quantidade });
  }
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Adicionar ao carrinho com quantidade
async function adicionarAoCarrinhoDetalhes(btnClicado) {
  const quantidade = parseInt(document.getElementById('quantidade').value) || 1;

  try {
    await adicionarAoCarrinho(produtoId, quantidade);
  } catch (erro) {
    console.warn('Backend indisponível, salvando no localStorage:', erro);
    adicionarLocalStorageDetalhes(produtoId, quantidade);
  }

  await atualizarCarrinho();

  // Feedback visual
  const btn = btnClicado || event?.currentTarget || event?.target;
  if (btn) {
    const btnReal = btn.closest('button') || btn;
    const textoOriginal = btnReal.innerHTML;
    btnReal.innerHTML = '<i class="bi bi-check-lg"></i> Adicionado ao carrinho!';
    btnReal.disabled = true;
    setTimeout(() => {
      btnReal.innerHTML = textoOriginal;
      btnReal.disabled = false;
    }, 1500);
  }
}

// Inicializar
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', carregarProduto);
}

if (typeof module !== 'undefined') {
  module.exports = {
    preencherProduto,
    adicionarLocalStorageDetalhes
  };
}
