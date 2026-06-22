/* iRock Finishes — Main JS */

// Nav scroll state
const nav = document.querySelector('.nav');
const hamburger = document.querySelector('.nav__hamburger');
const mobileNav = document.querySelector('.nav__mobile');

if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
  // Init on load
  nav.classList.toggle('scrolled', window.scrollY > 40);
}

// Mobile menu toggle
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.querySelectorAll('span').forEach((s, i) => {
      s.style.transform = isOpen
        ? i === 0 ? 'translateY(7px) rotate(45deg)'
          : i === 1 ? 'scaleX(0)'
          : 'translateY(-7px) rotate(-45deg)'
        : '';
    });
  });
}

// Close mobile nav on link click
document.querySelectorAll('.nav__mobile-link, .nav__mobile-sub a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    hamburger?.querySelectorAll('span').forEach(s => s.style.transform = '');
  });
});

// Active nav link
const currentPath = window.location.pathname;
document.querySelectorAll('.nav__link, .nav__mobile-link').forEach(link => {
  const href = link.getAttribute('href') || '';
  if (
    (href === 'index.html' && (currentPath === '/' || currentPath.endsWith('index.html'))) ||
    (href !== 'index.html' && href !== '#' && currentPath.includes(href.replace('.html', '')))
  ) {
    link.classList.add('active');
  }
});

// Intersection observer for fade-up elements
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    observer.observe(el);
  });
}

// Nav dropdown — JS hover with delay to bridge the gap between button and menu
document.querySelectorAll('.nav__dropdown').forEach(dropdown => {
  let timer;
  dropdown.addEventListener('mouseenter', () => {
    clearTimeout(timer);
    dropdown.classList.add('open');
  });
  dropdown.addEventListener('mouseleave', () => {
    timer = setTimeout(() => dropdown.classList.remove('open'), 120);
  });
});

// Contact form (prevent default, show success)
const form = document.querySelector('.js-contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending…';
    setTimeout(() => {
      btn.textContent = 'Message Sent!';
      btn.style.background = '#4CAF50';
      setTimeout(() => {
        btn.textContent = orig;
        btn.disabled = false;
        btn.style.background = '';
        form.reset();
      }, 3000);
    }, 1200);
  });
}
