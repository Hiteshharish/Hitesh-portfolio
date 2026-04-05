/**
 * Hitesh Portfolio — main.js
 * Handles: nav toggle, scroll effects, form validation, scroll-reveal
 */

/* ── NAV ─────────────────────────────────────────── */
const nav        = document.querySelector('.nav');
const navToggle  = document.querySelector('.nav-toggle');
const navLinks   = document.querySelector('.nav-links');

// Sticky shadow on scroll
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Hamburger toggle
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    navLinks.classList.toggle('open', !isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });

  // Close on nav link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && navLinks.classList.contains('open')) {
      navToggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ── SCROLL-REVEAL ───────────────────────────────── */
const revealEls = document.querySelectorAll(
  '.hero-headline, .hero-bio, .hero-stats, .hero-ctas, ' +
  '.project-row, .project-card, .about-inner, .proj-body, ' +
  '.contact-inner, .cta-band-inner, .page-header-inner'
);

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger first 3 hero elements slightly
    if (i < 4) el.style.transitionDelay = `${i * 60}ms`;
    io.observe(el);
  });
} else {
  // Fallback: just show everything
  revealEls.forEach(el => el.classList.add('visible'));
}

/* ── PROJECT ROW HOVER CURSOR ────────────────────── */
document.querySelectorAll('.project-row').forEach(row => {
  row.addEventListener('mouseenter', () => {
    row.style.cursor = 'pointer';
  });
  row.addEventListener('click', () => {
    const link = row.querySelector('.project-link');
    if (link) link.click();
  });
});

/* ── CONTACT FORM ────────────────────────────────── */
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  const fields = {
    name:    { el: document.getElementById('name'),    err: document.getElementById('name-error'),    msg: 'Please enter your name.' },
    email:   { el: document.getElementById('email'),   err: document.getElementById('email-error'),   msg: 'Please enter a valid email address.' },
    subject: { el: document.getElementById('subject'), err: document.getElementById('subject-error'), msg: 'Please enter a subject.' },
    message: { el: document.getElementById('message'), err: document.getElementById('message-error'), msg: 'Please write a message.' },
  };

  // Live validation on blur
  Object.values(fields).forEach(({ el, err, msg }) => {
    if (!el) return;
    el.addEventListener('blur', () => validate(el, err, msg));
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) validate(el, err, msg);
    });
  });

  function validate(el, err, msg) {
    let valid = true;
    const val = el.value.trim();

    if (!val) {
      valid = false;
    } else if (el.type === 'email') {
      valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    }

    el.classList.toggle('error', !valid);
    err.textContent = valid ? '' : msg;
    return valid;
  }

  function validateAll() {
    return Object.values(fields).every(({ el, err, msg }) =>
      el ? validate(el, err, msg) : true
    );
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validateAll()) return;

    // Simulate async send
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    await new Promise(r => setTimeout(r, 1200));

    form.hidden = true;
    formSuccess.hidden = false;
    formSuccess.focus();
  });
}

/* ── MARQUEE DUPLICATE CHECK ─────────────────────── */
// The marquee already has doubled content in HTML for seamless loop.
// No JS needed — pure CSS animation.

/* ── SMOOTH NAV ACTIVE STATE ─────────────────────── */
// Highlight active nav link based on current page
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href') || '';
  if (href === currentPath || (currentPath === '' && href === 'index.html')) {
    link.classList.add('nav-link--active');
  }
});
