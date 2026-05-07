// Variável para armazenar itens do carrinho
let carrinhoItens = [];

// Salvar carrinho no localStorage
function salvarCarrinhoLocal() {
  localStorage.setItem('carrinho', JSON.stringify(carrinhoItens));
}

// Carregar carrinho do localStorage
function carregarCarrinhoLocal() {
  const dados = localStorage.getItem('carrinho');
  return dados ? JSON.parse(dados) : [];
}

// Atualizar a exibição do carrinho
async function atualizarCarrinho() {
  try {
    carrinhoItens = await carregarCarrinho();
    salvarCarrinhoLocal();
  } catch (erro) {
    console.warn('Falha ao carregar do backend, usando localStorage:', erro);
    carrinhoItens = carregarCarrinhoLocal();
  }
  renderizarCarrinho();
  atualizarContadorCarrinho();
}

// Renderizar itens do carrinho
function renderizarCarrinho() {
  const container = document.getElementById('carrinhoItems');
  const totalDiv = document.getElementById('carrinhoTotal');

  if (carrinhoItens.length === 0) {
    container.innerHTML = '<p class="text-muted">Seu carrinho está vazio</p>';
    totalDiv.style.display = 'none';
    return;
  }

  let html = '';
  let total = 0;

  carrinhoItens.forEach(item => {
    const subtotal = item.preco * item.quantidade;
    total += subtotal;

    html += `
      <div class="carrinho-item">
        <img src="${item.imagem}" alt="${item.nome}" onerror="this.src='/img/logo.png'">
        <div class="carrinho-item-info">
          <div class="carrinho-item-nome">${item.nome}</div>
          <div class="carrinho-item-preco">
            R$ ${item.preco.toFixed(2)}
          </div>
          <div class="carrinho-item-quantidade">
            <button class="btn btn-sm btn-outline-secondary" onclick="alterarQuantidade(${item.id}, -1)">
              <i class="bi bi-dash"></i>
            </button>
            <span class="mx-2">${item.quantidade}</span>
            <button class="btn btn-sm btn-outline-secondary" onclick="alterarQuantidade(${item.id}, 1)">
              <i class="bi bi-plus"></i>
            </button>
          </div>
          <div class="carrinho-item-subtotal">
            Subtotal: R$ ${subtotal.toFixed(2)}
          </div>
        </div>
        <button class="btn-remover" onclick="removerItem(${item.id})">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `;
  });

  html += `<button class="btn btn-danger w-100 mt-3" onclick="limparCarrinho()">Limpar Carrinho</button>`;

  container.innerHTML = html;
  document.getElementById('totalPrice').textContent = total.toFixed(2);
  totalDiv.style.display = 'block';
}

// Remover item do carrinho
async function removerItem(carrinhoId) {
  try {
    await removerDoCarrinho(carrinhoId);
  } catch (erro) {
    console.warn('Backend indisponível, removendo do localStorage:', erro);
    const carrinho = carregarCarrinhoLocal().filter(i => i.id !== carrinhoId);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
  }
  await atualizarCarrinho();
}

// Alterar quantidade de um item
async function alterarQuantidade(carrinhoId, delta) {
  const item = carrinhoItens.find(i => i.id === carrinhoId);
  if (!item) return;

  const novaQuantidade = item.quantidade + delta;

  if (novaQuantidade <= 0) {
    await removerItem(carrinhoId);
    return;
  }

  try {
    await atualizarQuantidade(carrinhoId, novaQuantidade);
  } catch (erro) {
    console.warn('Backend indisponível, atualizando localStorage:', erro);
    const carrinho = carregarCarrinhoLocal();
    const local = carrinho.find(i => i.id === carrinhoId);
    if (local) {
      local.quantidade = novaQuantidade;
      localStorage.setItem('carrinho', JSON.stringify(carrinho));
    }
  }
  await atualizarCarrinho();
}

// Limpar todo o carrinho
async function limparCarrinho() {
  if (!confirm('Tem certeza que deseja limpar o carrinho?')) {
    return;
  }

  const itemsToRemove = [...carrinhoItens];
  for (const item of itemsToRemove) {
    await removerItem(item.id);
  }
}

// Atualizar contador do carrinho
function atualizarContadorCarrinho() {
  const contador = document.getElementById('carrinhoCount');
  let total = 0;
  carrinhoItens.forEach(item => {
    total += item.quantidade;
  });
  contador.textContent = total;
}

// Adicionar ao localStorage como fallback
function adicionarLocalStorage(produtoId, quantidade) {
  const produto = todosProdutos.find(p => p.id === produtoId);
  if (!produto) return;

  const carrinho = carregarCarrinhoLocal();
  const existente = carrinho.find(i => i.produtoId === produtoId);

  if (existente) {
    existente.quantidade += quantidade;
  } else {
    carrinho.push({
      id: produtoId,
      produtoId: produtoId,
      nome: produto.nome,
      preco: produto.preco,
      imagem: produto.imagem,
      quantidade: quantidade
    });
  }
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Adicionar produto ao carrinho
async function adicionarProdutoAoCarrinho(produtoId, btnClicado) {
  try {
    await adicionarAoCarrinho(produtoId, 1);
  } catch (erro) {
    console.warn('Backend indisponível, salvando no localStorage:', erro);
    adicionarLocalStorage(produtoId, 1);
  }
  await atualizarCarrinho();

  // Feedback visual no botão
  const btn = btnClicado || event?.currentTarget || event?.target;
  if (btn) {
    const btnReal = btn.closest('button') || btn;
    const textoOriginal = btnReal.innerHTML;
    btnReal.innerHTML = '<i class="bi bi-check-lg"></i> Adicionado!';
    btnReal.disabled = true;
    setTimeout(() => {
      btnReal.innerHTML = textoOriginal;
      btnReal.disabled = false;
    }, 1500);
  }
}

if (typeof module !== 'undefined') {
  module.exports = {
    __setCarrinhoItens: (itens) => {
      carrinhoItens = itens;
    },
    salvarCarrinhoLocal,
    carregarCarrinhoLocal,
    renderizarCarrinho,
    atualizarContadorCarrinho,
    adicionarLocalStorage
  };
}
