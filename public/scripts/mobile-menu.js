export function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-menu-link');

  window.openMobileMenu = function() {
    if (mobileMenu) { mobileMenu.style.display = 'block'; document.body.style.overflow = 'hidden'; }
  };
  window.closeMobileMenu = function() {
    if (mobileMenu) { mobileMenu.style.display = 'none'; document.body.style.overflow = ''; }
  };
  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', window.openMobileMenu);
  if (mobileMenuClose) mobileMenuClose.addEventListener('click', window.closeMobileMenu);
  mobileNavLinks.forEach(link => link.addEventListener('click', window.closeMobileMenu));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && mobileMenu) window.closeMobileMenu(); });
}
