export function initProductModals() {
  document.addEventListener('click', function(e) {
    const card = e.target.closest('.product-card');
    if (card && !e.target.closest('.modal-content')) {
      const productId = card.getAttribute('data-product-id');
      const modal = document.querySelector(`.modal-overlay[data-modal-product-id="${productId}"]`);
      if (modal) { modal.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
    }
    const closeBtn = e.target.closest('[data-close-modal]');
    if (closeBtn) {
      const modal = closeBtn.closest('.modal-overlay');
      if (modal) { modal.style.display = 'none'; document.body.style.overflow = ''; }
    }
    const modalOverlay = e.target.closest('.modal-overlay');
    if (modalOverlay && e.target === modalOverlay) {
      modalOverlay.style.display = 'none'; document.body.style.overflow = '';
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay').forEach(modal => { modal.style.display = 'none'; document.body.style.overflow = ''; });
    }
  });
}
