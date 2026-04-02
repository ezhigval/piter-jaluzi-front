import { initMobileMenu } from '/scripts/mobile-menu.js';
import { initOrderModal } from '/scripts/order-modal.js';
import { initProductModals } from '/scripts/product-modal.js';
import { initProductFilters } from '/scripts/filters.js';

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initOrderModal();
  initProductModals();
  initProductFilters();
});
