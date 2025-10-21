// Skrip interaktivitas sederhana: nav responsif, hero slider, dan scroll reveal

// Utility: helper untuk query
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

// Navigasi mobile toggle
(function initNavToggle() {
  const toggle = $('.nav-toggle');
  const nav = $('#primary-nav');
  if (!toggle || !nav) return;

  const setExpanded = (expanded) => {
    toggle.setAttribute('aria-expanded', String(expanded));
    nav.classList.toggle('open', expanded);
  };

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    setExpanded(!expanded);
  });

  // Tutup menu saat link diklik (mobile)
  nav.addEventListener('click', (e) => {
    if (e.target.matches('a')) setExpanded(false);
  });
})();

// Hero slider (tanpa library)
(function initHeroSlider() {
  const slider = $('.hero-slider');
  if (!slider) return;

  // Sumber gambar eksternal (placeholder)
  const images = [
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1600&auto=format&fit=crop'
  ];

  // Buat elemen slide
  const slides = images.map((src, idx) => {
    const el = document.createElement('div');
    el.className = 'hero-slide';
    el.style.backgroundImage = `url(${src})`;
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', `Slide ${idx + 1}`);
    slider.prepend(el); // pastikan overlay dan content tetap di atas
    return el;
  });

  let current = 0;
  const setActive = (index) => {
    slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
  };

  const next = () => { current = (current + 1) % slides.length; setActive(current); };
  const prev = () => { current = (current - 1 + slides.length) % slides.length; setActive(current); };

  setActive(current);

  // Auto-rotate
  let intervalId = setInterval(next, 5000);

  // Kontrol manual
  const btnNext = $('.hero-next');
  const btnPrev = $('.hero-prev');
  btnNext?.addEventListener('click', () => { next(); restart(); });
  btnPrev?.addEventListener('click', () => { prev(); restart(); });

  // Pause saat hover untuk kenyamanan
  slider.addEventListener('mouseenter', () => clearInterval(intervalId));
  slider.addEventListener('mouseleave', () => restart());

  function restart() {
    clearInterval(intervalId);
    intervalId = setInterval(next, 5000);
  }
})();

// Scroll reveal: tampilkan elemen bertahap saat masuk viewport
(function initScrollReveal() {
  const elements = $$('[data-animate]');
  if (!elements.length || !('IntersectionObserver' in window)) {
    // fallback: tampilkan saja
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

  elements.forEach((el) => observer.observe(el));
})();

// Tahun berjalan pada footer
(function initYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
