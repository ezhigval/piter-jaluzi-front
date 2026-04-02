export function initProductFilters() {
  const filterBtns = document.querySelectorAll('#category-filters button');
  const productItems = document.querySelectorAll('.product-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const cat = this.getAttribute('data-category');
      filterBtns.forEach(b => { b.style.background = 'white'; b.style.color = '#0F172A'; });
      this.style.background = '#2563EB'; this.style.color = 'white';
      productItems.forEach(item => {
        const ic = item.getAttribute('data-category');
        item.style.display = (cat === 'Все' || ic === cat) ? 'block' : 'none';
      });
    });
  });
}
