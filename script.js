document.addEventListener('DOMContentLoaded', () => {
  // Mobile Drawer Navigation
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('active');
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // CTA Form Handler
  const subscribeForm = document.getElementById('subscribe-form');
  const emailInput = document.getElementById('email-input');
  const formMessage = document.getElementById('form-message');

  if (subscribeForm) {
    subscribeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();

      if (email) {
        formMessage.style.color = '#22c55e';
        formMessage.textContent = 'Thank you for subscribing!';
        emailInput.value = '';
      } else {
        formMessage.style.color = '#ef4444';
        formMessage.textContent = 'Please enter a valid email address.';
      }
    });
  }
});
