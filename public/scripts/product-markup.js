import { escapeHtml } from '/scripts/api.js';
import { IMG_PLACEHOLDER_SRC } from '/scripts/asset-loader.js';

export function renderProductEntry(product) {
  const id = Number(product.id);
  const name = escapeHtml(product.name);
  const category = escapeHtml(product.category);
  const description = escapeHtml(product.description || 'Подробное описание скоро появится.');
  const image = escapeHtml(product.image);
  const price = escapeHtml(product.price);

  // Рендерим ТОЛЬКО карточку, без модалки
  return `
    <div class="product-card" data-product-id="${id}" data-category="${category}">
      <img src="${IMG_PLACEHOLDER_SRC}" data-asset-src="${image}" alt="${name}" class="product-card-img" loading="lazy" />
      <div class="product-card-body">
        <span class="product-card-category">${category}</span>
        <h3 class="product-card-title">${name}</h3>
        <p class="product-card-price">от <strong>${price} ₽</strong>/м²</p>
        <span style="color:var(--color-primary);font-weight:500;">Подробнее →</span>
      </div>
    </div>
  `;
}