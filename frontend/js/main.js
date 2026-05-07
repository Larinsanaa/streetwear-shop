// Registrar ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Armazenar todos os produtos globalmente
let todosProdutos = [];

// Inicializar aplicação
async function inicializar() {
  console.log('Iniciando aplicação...');

  // Carregar produtos
  todosProdutos = await carregarProdutos();
  filtrarProdutos();

  // Carregar carrinho
  await atualizarCarrinho();

  // Configurar filtros
  configurarFiltros();

  // Configurar animações
  configurarAnimacoesScroll();
}

// Configurar event listeners dos filtros
function configurarFiltros() {
  document.getElementById('busca').addEventListener('input', filtrarProdutos);
  document.getElementById('filtroCategoria').addEventListener('change', filtrarProdutos);
  document.getElementById('ordenacao').addEventListener('change', filtrarProdutos);
}

// Filtrar e ordenar produtos
function filtrarProdutos() {
  let produtosFiltrados = [...todosProdutos];

  // Filtro por busca
  const busca = document.getElementById('busca').value.toLowerCase();
  if (busca) {
    produtosFiltrados = produtosFiltrados.filter(p =>
      p.nome.toLowerCase().includes(busca) ||
      p.descricao.toLowerCase().includes(busca)
    );
  }

  // Filtro por categoria
  const categoria = document.getElementById('filtroCategoria').value;
  if (categoria) {
    produtosFiltrados = produtosFiltrados.filter(p => p.categoria === categoria);
  }

  // Ordenação por preço
  const ordenacao = document.getElementById('ordenacao').value;
  if (ordenacao === 'menor') {
    produtosFiltrados.sort((a, b) => a.preco - b.preco);
  } else if (ordenacao === 'maior') {
    produtosFiltrados.sort((a, b) => b.preco - a.preco);
  }

  renderizarProdutos(produtosFiltrados);
}

// Renderizar produtos na página
function renderizarProdutos(produtos) {
  const container = document.getElementById('produtosContainer');
  if (!container) return;

  if (produtos.length === 0) {
    container.innerHTML = '<p class="text-center">Nenhum produto disponível</p>';
    return;
  }

  let html = '';

  produtos.forEach((produto, index) => {
    html += `
      <div class="col-lg-4 col-md-6 col-sm-12 scroll-reveal">
        <div class="card produto-card" style="cursor: pointer;" onclick="irParaDetalhes(${produto.id})">
          <div class="produto-img-container">
            <img src="${produto.imagem}" alt="${produto.nome}" class="produto-img" onerror="this.src='/img/logo.png'">
            <span class="produto-categoria">${produto.categoria}</span>
          </div>
          <div class="produto-info">
            <h5 class="produto-nome">${produto.nome}</h5>
            <p class="produto-descricao">${produto.descricao}</p>
            <div class="produto-preco">R$ ${produto.preco.toFixed(2)}</div>
            <button class="btn btn-adicionar" onclick="event.stopPropagation(); adicionarProdutoAoCarrinho(${produto.id}, this)">
              <i class="bi bi-cart-plus"></i> Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  // Animar cards após renderizar
  animarCardsEntrada();
}

// Animação de entrada dos cards
function animarCardsEntrada() {
  const cards = document.querySelectorAll('.scroll-reveal');

  cards.forEach((card, index) => {
    gsap.from(card, {
      duration: 0.6,
      opacity: 0,
      y: 50,
      delay: index * 0.1,
      ease: 'power2.out'
    });
  });
}

// Configurar animações de scroll
function configurarAnimacoesScroll() {
  // Animar seção de produtos ao scroll
  if (document.querySelector('.produtos-section')) {
    gsap.to('.produtos-section', {
    scrollTrigger: {
      trigger: '.produtos-section',
      start: 'top 80%',
      end: 'top 20%',
      toggleClass: 'active',
      once: true
    }
    });
  }

  // Parallax no hero
  gsap.to('.hero-image', {
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    },
    y: 100
  });

  // Observador para scroll reveal
  const observador = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observador.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  // Observar todos os elementos com classe scroll-reveal
  document.querySelectorAll('.scroll-reveal').forEach(el => {
    observador.observe(el);
  });
}

// Smooth scroll para links âncora
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Ir para página de detalhes do produto
function irParaDetalhes(produtoId, imagemFallback) {
  const produto = todosProdutos.find(p => p.id === produtoId);
  if (produto) {
    sessionStorage.setItem('produtoAtual', JSON.stringify(produto));
  } else if (imagemFallback) {
    const atual = sessionStorage.getItem('produtoAtual');
    const cache = atual ? JSON.parse(atual) : {};
    if (String(cache.id) !== String(produtoId)) {
      sessionStorage.setItem('produtoAtual', JSON.stringify({ id: produtoId, imagem: imagemFallback }));
    }
  }
  window.location.href = `product-detail.html?id=${produtoId}`;
}

// Iniciar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', inicializar);
