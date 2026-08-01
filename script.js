/* Native Nations chapter, page behaviour.
   Progressive enhancement only: every page reads fully with JS off. */

/* Reveal on scroll, and kintsugi seams drawing themselves in gold.
   Deliberately NOT IntersectionObserver. Content visibility must never
   depend on an observer callback arriving: browsers throttle or delay IO
   in background tabs, prerendered pages and low-power modes, which can
   leave a section at opacity 0 for the whole visit. A plain geometry sweep
   on scroll and resize gives the same effect with nothing that can strand
   content. Without JS the CSS shows every panel and seam already drawn. */
const revealPending = new Set([
  ...document.querySelectorAll('.reveal'),
  ...document.querySelectorAll('.kintsugi-seam'),
]);
const showReveal = (el) =>
  el.classList.add(el.classList.contains('kintsugi-seam') ? 'is-drawn' : 'is-visible');
const sweepReveals = () => {
  if (!revealPending.size) return;
  /* Only the top edge is tested, so anything scrolled past stays revealed:
     an anchor jump or a restored scroll position cannot skip a block. */
  const line = window.innerHeight * 0.92;
  revealPending.forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.top < line) { showReveal(el); revealPending.delete(el); }
  });
};
sweepReveals();
window.addEventListener('scroll', sweepReveals, { passive: true });
window.addEventListener('resize', sweepReveals, { passive: true });
window.addEventListener('load', sweepReveals);
/* Late-layout safety net (fonts and images shifting geometry after first paint). */
setTimeout(sweepReveals, 400);
setTimeout(sweepReveals, 1500);

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
