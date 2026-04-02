export function initOrderModal() {
  const orderModal = document.getElementById('order-modal');
  const orderModalClose = document.getElementById('order-modal-close');
  const orderForm = document.getElementById('order-form');
  
  const API_URL = document.body.dataset.apiUrl || 'http://localhost:3001';

  window.openOrderModal = function() {
    if (orderModal) { orderModal.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
  };
  window.closeOrderModal = function() {
    if (orderModal) { orderModal.style.display = 'none'; document.body.style.overflow = ''; }
  };
  
  if (orderModalClose) orderModalClose.addEventListener('click', window.closeOrderModal);
  if (orderModal) orderModal.addEventListener('click', (e) => { if (e.target.id === 'order-modal') window.closeOrderModal(); });
  
  // ДЕЛЕГИРОВАНИЕ: ловим клики на всех [data-open-order-modal], даже динамических
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('[data-open-order-modal]');
    if (btn) {
      e.preventDefault();
      window.openOrderModal();
    }
  });
  
  if (orderForm) {
    orderForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Отправка...';
      btn.disabled = true;
      try {
        console.log('Sending to:', API_URL + '/api/orders');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        const response = await fetch(API_URL + '/api/orders', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(data) 
        });
        const result = await response.json();
        console.log('Response:', result);
        if (result.success) { 
          alert('Спасибо! Заявка отправлена.'); 
          form.reset(); 
          window.closeOrderModal(); 
        }
        else { alert('Ошибка: ' + (result.error || 'Не удалось отправить')); }
      } catch (error) { 
        console.error('Order error:', error);
        alert('Ошибка соединения. Проверьте, что сервер запущен на порту 3001.'); 
      }
      finally { btn.textContent = originalText; btn.disabled = false; }
    });
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') window.closeOrderModal(); });
}
