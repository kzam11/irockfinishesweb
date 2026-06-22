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

// Reviews carousel
(function () {
  const track = document.getElementById('reviewsTrack');
  const prevBtn = document.getElementById('reviewsPrev');
  const nextBtn = document.getElementById('reviewsNext');
  const dotsContainer = document.getElementById('reviewsDots');
  if (!track) return;

  const cards = Array.from(track.children);
  let perPage = 3;
  let current = 0;
  let autoTimer;

  function getPerPage() {
    if (window.innerWidth <= 560) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  function totalPages() {
    return Math.ceil(cards.length / perPage);
  }

  function goTo(page) {
    const pages = totalPages();
    current = (page + pages) % pages;
    const offset = current * perPage * (100 / cards.length);
    track.style.transform = `translateX(-${offset}%)`;
    dotsContainer.querySelectorAll('.reviews-carousel__dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function buildDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalPages(); i++) {
      const dot = document.createElement('button');
      dot.className = 'reviews-carousel__dot' + (i === current ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Page ${i + 1}`);
      dot.addEventListener('click', () => { goTo(i); resetAuto(); });
      dotsContainer.appendChild(dot);
    }
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }

  function init() {
    perPage = getPerPage();
    // Set track width so flex items size correctly
    track.style.width = `${(cards.length / perPage) * 100}%`;
    cards.forEach(c => {
      c.style.flex = `0 0 ${100 / cards.length}%`;
    });
    current = 0;
    buildDots();
    goTo(0);
    resetAuto();
  }

  prevBtn?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  nextBtn?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  // Pause on hover
  track.closest('.reviews-carousel')?.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.closest('.reviews-carousel')?.addEventListener('mouseleave', resetAuto);

  // Swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { goTo(diff > 0 ? current + 1 : current - 1); resetAuto(); }
  });

  window.addEventListener('resize', () => {
    const newPer = getPerPage();
    if (newPer !== perPage) init();
  });

  init();
})();

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
