/**
 * Hitesh Portfolio — main.js (v2)
 * Handles: sidebar mobile toggle, scroll-reveal, contact form
 */

/* ── MOBILE SIDEBAR TOGGLE ───────────────────────── */
const navToggle    = document.getElementById('navToggle');
const sidebarNav   = document.getElementById('sidebarNav');
const sidebarContact = document.getElementById('sidebarContact');

if (navToggle && sidebarNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    sidebarNav.classList.toggle('open', !isOpen);
    if (sidebarContact) sidebarContact.classList.toggle('open', !isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });

  // Close on link click
  sidebarNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      sidebarNav.classList.remove('open');
      if (sidebarContact) sidebarContact.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    const sidebar = document.getElementById('sidebar');
    if (sidebar && !sidebar.contains(e.target) && sidebarNav.classList.contains('open')) {
      navToggle.setAttribute('aria-expanded', 'false');
      sidebarNav.classList.remove('open');
      if (sidebarContact) sidebarContact.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ── SCROLL-REVEAL ───────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -32px 0px' });

  revealEls.forEach((el, i) => {
    if (i < 3) el.style.transitionDelay = `${i * 60}ms`;
    io.observe(el);
  });
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}

/* ── READING PROGRESS BAR (case study pages) ─────── */
if (document.querySelector('.cs-back')) {
  const bar = document.createElement('div');
  bar.setAttribute('aria-hidden', 'true');
  bar.style.cssText = 'position:fixed;top:0;left:0;width:0%;height:2px;background:#1D4A2E;z-index:300;transition:width 80ms linear;pointer-events:none;';
  document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = h > 0 ? `${Math.min((window.scrollY / h) * 100, 100)}%` : '0%';
  }, { passive: true });
}

/* ── CONTACT FORM ────────────────────────────────── */
const form        = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');
if (formSuccess) formSuccess.hidden = true;

if (form) {
  const fields = {
    name:    { el: document.getElementById('name'),    err: document.getElementById('name-error'),    msg: 'Please enter your name.' },
    email:   { el: document.getElementById('email'),   err: document.getElementById('email-error'),   msg: 'Please enter a valid email address.' },
    subject: { el: document.getElementById('subject'), err: document.getElementById('subject-error'), msg: 'Please enter a subject.' },
    message: { el: document.getElementById('message'), err: document.getElementById('message-error'), msg: 'Please write a message.' },
  };

  Object.values(fields).forEach(({ el, err, msg }) => {
    if (!el) return;
    el.addEventListener('blur', () => validate(el, err, msg));
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) validate(el, err, msg);
    });
  });

  function validate(el, err, msg) {
    const val = el.value.trim();
    let valid = !!val;
    if (valid && el.type === 'email') valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    el.classList.toggle('error', !valid);
    if (err) err.textContent = valid ? '' : msg;
    return valid;
  }

  function validateAll() {
    return Object.values(fields).every(({ el, err, msg }) => el ? validate(el, err, msg) : true);
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validateAll()) return;
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;
    await new Promise(r => setTimeout(r, 1200));
    form.hidden = true;
    formSuccess.hidden = false;
    formSuccess.focus();
  });
}
