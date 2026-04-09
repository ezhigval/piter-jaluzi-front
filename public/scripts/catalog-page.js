import { fetchJson } from '/scripts/api.js';
import { hydrateAssetImages } from '/scripts/asset-loader.js';
import { renderProductEntry } from '/scripts/product-markup.js';

const ITEMS_PER_PAGE = 12;

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let currentCategory = 'Все';

function renderPagination(totalItems) {
  const pagination = document.getElementById('pagination');
  if (!pagination) return;

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }

  const buttons = [];

  buttons.push(`<button class="btn page-btn" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>◀</button>`);

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
      const active = i === currentPage ? 'style="background:#2563EB;color:white;border-color:#2563EB;"' : '';
      buttons.push(`<button class="btn page-btn" data-page="${i}" ${active}>${i}</button>`);
    } else if (i === currentPage - 3 || i === currentPage + 3) {
      buttons.push(`<span style="padding:0.5rem 1rem;color:#64748b;">...</span>`);
    }
  }

  buttons.push(`<button class="btn page-btn" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>▶</button>`);

  pagination.innerHTML = buttons.join('');

  pagination.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const page = parseInt(e.currentTarget.dataset.page);
      if (page && page !== currentPage) {
        currentPage = page;
        renderProducts();
        renderPagination(filteredProducts.length);
        document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageProducts = filteredProducts.slice(start, start + ITEMS_PER_PAGE);

  if (!pageProducts.length) {
    grid.innerHTML = '<div class="section-placeholder">Товары не найдены.</div>';
    return;
  }

  grid.innerHTML = pageProducts.map(renderProductEntry).join('');
  hydrateAssetImages(grid);
}

function filterProducts(category) {
  currentCategory = category;
  currentPage = 1;

  if (category === 'Все') {
    filteredProducts = [...allProducts];
  } else {
    filteredProducts = allProducts.filter(p => p.category === category);
  }

  renderProducts();
  renderPagination(filteredProducts.length);

  document.querySelectorAll('#category-filters .btn').forEach(btn => {
    const isCat = btn.dataset.category === category;
    btn.style.background = isCat ? '#2563EB' : 'white';
    btn.style.color = isCat ? 'white' : '#0F172A';
    btn.style.borderColor = isCat ? '#2563EB' : '#CBD5E1';
  });
}

// Открытие единой модалки с данными товара
function openUnifiedModal(product) {
  const modal = document.getElementById('product-modal');
  if (!modal) return;

  document.getElementById('modal-img').dataset.assetSrc = product.image;
  document.getElementById('modal-img').alt = product.name;
  document.getElementById('modal-img').src = ''; // сброс для перезагрузки

  document.getElementById('modal-category').textContent = product.category;
  document.getElementById('modal-title').textContent = product.name;
  document.getElementById('modal-desc').textContent = product.description || 'Подробное описание скоро появится.';
  document.getElementById('modal-price').innerHTML = `от <strong>${product.price} ₽</strong>/м²`;

  modal.hidden = false;
  modal.style.display = 'flex';
  if (typeof lockScroll === 'function') {
    lockScroll('product-modal:unified');
  }
  hydrateAssetImages(modal);
}

function closeUnifiedModal() {
  const modal = document.getElementById('product-modal');
  if (!modal) return;
  modal.hidden = true;
  modal.style.display = 'none';
  if (typeof unlockScroll === 'function') {
    unlockScroll('product-modal:unified');
  }
}

export async function initCatalogPage() {
  const grid = document.getElementById('products-grid');
  const filters = document.getElementById('category-filters');

  if (!grid) return;

  try {
    const { data } = await fetchJson('/api/products');
    allProducts = Array.isArray(data) ? data : [];
    filteredProducts = [...allProducts];

    if (!allProducts.length) {
      grid.innerHTML = '<div class="section-placeholder">Товары пока не добавлены.</div>';
      return;
    }

    if (filters) {
      filters.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const category = e.currentTarget.dataset.category;
          filterProducts(category);
        });
      });
    }

    renderProducts();
    renderPagination(filteredProducts.length);

    // Клик по карточке → открываем единую модалку
    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      if (!card) return;
      const productId = card.dataset.productId;
      const product = allProducts.find(p => String(p.id) === String(productId));
      if (product) openUnifiedModal(product);
    });

    // Закрытие модалки: кнопка × или клик по оверлею
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-close-modal]')) {
        closeUnifiedModal();
      }
      const modal = document.getElementById('product-modal');
      if (e.target === modal) {
        closeUnifiedModal();
      }
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeUnifiedModal();
      }
    });

  } catch (error) {
    console.error('Catalog page error:', error);
    grid.innerHTML = '<div class="section-placeholder" data-state="error">Не удалось загрузить товары.</div>';
  }
}