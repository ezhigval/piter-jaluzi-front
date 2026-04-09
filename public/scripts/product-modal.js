import { lockScroll, unlockScroll } from '/scripts/scroll-lock.js';

export function initProductModals() {
  const openModal = (modal) => {
    modal.style.display = 'flex';
    lockScroll(`product-modal:${modal.dataset.modalProductId || 'unknown'}`);
  };

  const closeModal = (modal) => {
    modal.style.display = 'none';
    unlockScroll(`product-modal:${modal.dataset.modalProductId || 'unknown'}`);
  };

  document.addEventListener('click', function(e) {
    const card = e.target.closest('.product-card');
    if (card && !e.target.closest('.modal-content')) {
      const productId = card.getAttribute('data-product-id');
      const modal = document.querySelector(`.modal-overlay[data-modal-product-id="${productId}"]`);
      if (modal instanceof HTMLElement) {
        openModal(modal);
      }
    }
    const closeBtn = e.target.closest('[data-close-modal]');
    if (closeBtn) {
      const modal = closeBtn.closest('.modal-overlay');
      if (modal instanceof HTMLElement) {
        closeModal(modal);
      }
    }
    const modalOverlay = e.target.closest('.modal-overlay');
    if (modalOverlay && e.target === modalOverlay) {
      closeModal(modalOverlay);
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay').forEach((modal) => {
        if (modal instanceof HTMLElement) {
          closeModal(modal);
        }
      });
    }
  });
}
