/* Native Nations chapter — page behaviour.
   Progressive enhancement only: every page reads fully with JS off. */

const reveals = document.querySelectorAll('.reveal');
const showReveal = (el) => el.classList.add('is-visible');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      showReveal(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -6% 0px' });
  reveals.forEach((el) => observer.observe(el));
} else {
  reveals.forEach(showReveal);
}

const normaliseNavPath = (value) => {
  const url = new URL(value, location.href);
  return url.pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
};
const path = normaliseNavPath(location.href);
document.querySelectorAll('[data-nav] a').forEach((link) => {
  const href = link.getAttribute('href');
  if (!href || href.includes('#')) return;
  if (normaliseNavPath(href) === path) link.setAttribute('aria-current', 'page');
});

/* Same-page anchors respect reduced motion. */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;
    const target = document.getElementById(hash.slice(1));
    if (!target) return;
    event.preventDefault();
    history.pushState(null, '', hash);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
});

/* External links (and links out of this repo on github.io) open in a new tab. */
document.querySelectorAll('a[href]').forEach((link) => {
  const href = link.getAttribute('href');
  if (!href) return;
  let url;
  try {
    url = new URL(href, location.href);
  } catch {
    return;
  }
  const isWebLink = url.protocol === 'http:' || url.protocol === 'https:';
  if (!isWebLink) return;
  const isSameOrigin = url.origin === location.origin;
  const currentPathParts = location.pathname.split('/').filter(Boolean);
  const targetPathParts = url.pathname.split('/').filter(Boolean);
  const currentRepo = location.hostname.endsWith('github.io') ? currentPathParts[0] : '';
  const leavesCurrentGithubRepo = Boolean(
    currentRepo &&
    isSameOrigin &&
    targetPathParts[0] &&
    targetPathParts[0] !== currentRepo
  );
  if (isSameOrigin && !leavesCurrentGithubRepo) return;
  link.setAttribute('target', '_blank');
  const rel = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
  rel.add('noopener');
  rel.add('noreferrer');
  link.setAttribute('rel', Array.from(rel).join(' '));
});
