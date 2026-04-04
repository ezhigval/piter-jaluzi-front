import { fetchJson } from '/scripts/api.js';
import { hydrateAssetImages } from '/scripts/asset-loader.js';
import { renderProductEntry } from '/scripts/product-markup.js';

export async function initCatalogPage() {
  const grid = document.getElementById('products-grid');

  if (!grid) {
    return;
  }

  try {
    const { data } = await fetchJson('/api/products');
    const products = Array.isArray(data) ? data : [];

    if (!products.length) {
      grid.innerHTML = '<div class="section-placeholder">Товары пока не добавлены.</div>';
      return;
    }

    grid.innerHTML = products.map(renderProductEntry).join('');
    await hydrateAssetImages(grid);
  } catch (error) {
    console.error('Catalog page error:', error);
    grid.innerHTML = '<div class="section-placeholder" data-state="error">Не удалось загрузить товары.</div>';
  }
}
