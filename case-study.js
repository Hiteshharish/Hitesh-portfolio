/**
 * case-study.js
 * Scroll-reveal for case study subpages.
 * Works alongside main.js (nav, hamburger already handled there).
 */

/* ── SCROLL-REVEAL ─────────────────────────────────── */
const csRevealEls = document.querySelectorAll('.cs-body .reveal, .cs-sidebar .reveal');

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -32px 0px' });

  csRevealEls.forEach((el, i) => {
    if (!el.classList.contains('reveal')) el.classList.add('reveal');
    el.style.transitionDelay = `${Math.min(i * 40, 160)}ms`;
    io.observe(el);
  });
} else {
  csRevealEls.forEach(el => el.classList.add('visible'));
}

/* ── READING PROGRESS BAR ──────────────────────────── */
const progressBar = document.createElement('div');
progressBar.setAttribute('aria-hidden', 'true');
progressBar.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 0%;
  height: 3px;
  background: #1D4A2E;
  z-index: 200;
  transition: width 100ms linear;
  pointer-events: none;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docH > 0 ? (window.scrollY / docH) * 100 : 0;
  progressBar.style.width = `${Math.min(progress, 100)}%`;
}, { passive: true });
