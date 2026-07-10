/*
 * Native Nations chapter — site chrome.
 * One data file describes every public room. The header, full-screen index,
 * breadcrumbs and footer explore-columns are all generated from it, so new
 * pages only need an entry here to appear everywhere.
 * Progressive enhancement: without JS the static header links and the
 * site-map page still cover the whole site.
 */
(() => {
  document.documentElement.classList.add('js');

  /* Resolve the site root from the styles.css link, so this works from
     index.html and pages/ alike. */
  const styleLink = document.querySelector('link[rel="stylesheet"][href*="styles.css"]');
  const P = styleLink ? styleLink.getAttribute('href').split('styles.css')[0] : './';

  const SECTIONS = [
    {
      id: 'start',
      num: '01',
      label: 'Start here',
      blurb: 'The doorway, the ground rules, and the honest seams of the whole build.',
      links: [
        { href: 'index.html', title: 'Home', note: 'The question, the two registers, the invitation.' },
        { href: 'pages/seams.html', title: 'The seams', note: 'Provenance, corrections, and exactly what is provisional here.' },
        { href: 'pages/site-map.html', title: 'Site map', note: 'Every room, one clickable tree. Works without JavaScript.' }
      ]
    },
    {
      id: 'record',
      num: '02',
      label: 'The record',
      blurb: 'Established instruments, quoted and cited. Gold panels. Verify everything at the source.',
      links: [
        { href: 'pages/instruments.html', title: 'Rights instruments', note: 'UNDRIP, FPIC, ILO 169, Nagoya, WIPO — quoted, dated, and questioned: who held each pen.' },
        { href: 'pages/data-sovereignty.html', title: 'Data sovereignty', note: 'CARE, OCAP®, Maiam nayri Wingara, Te Mana Raraunga, Local Contexts.' },
        { href: 'pages/treaty-atlas.html', title: 'Treaty atlas', note: 'Living, contested, broken and unwritten agreements, mapped worldwide.' }
      ]
    },
    {
      id: 'proposals',
      num: '03',
      label: 'The proposals',
      blurb: 'P4A’s own provisional patterns. Purple panels. React, revise, refuse — all three are welcome.',
      links: [
        { href: 'pages/compute.html', title: 'Sovereign compute', note: 'The L0–L3 gradient: phones, kiosks, library racks, and why the cloud is optional.' },
        { href: 'pages/c-hour.html', title: 'The C-Hour', note: 'The reason this site exists: one verified hour of care = one C-Hour, with a one-page legislative ask.' },
        { href: 'pages/surge.html', title: 'The heart-first surge', note: 'Find the care, count the care, then bring the machines — a civic surge pattern for any nation.' },
        { href: 'pages/reciprocity-treaty.html', title: 'Reciprocity treaty', note: 'From local ledgers toward revised agreements: a kintsugi protocol.' }
      ]
    },
    {
      id: 'pathways',
      num: '04',
      label: 'The pathways',
      blurb: 'Where a nation, a person, or someone\'s own copy of this site takes over. No funnels, no sign-up walls, no asks.',
      links: [
        { href: 'pages/onboard.html', title: 'Add your nation', note: 'Self-onboarding on your own terms — including by leaving entirely.' },
        { href: 'pages/abundance.html', title: 'Joyful responsible abundance', note: 'The reframe: more time, held threats, and who the freed hours belong to.' }
      ]
    }
  ];

  const EXTERNAL = [
    { href: 'https://github.com/auraofintelligence/p4a-native-nations-cinema', title: 'Copy this whole site' },
    { href: 'https://github.com/auraofintelligence/p4a-native-nations-cinema/blob/main/ONBOARD_WITH_AN_AGENT.md', title: 'Onboard with an agent' },
    { href: 'https://auraofintelligence.github.io/p4a-xyz-cinema/', title: 'P4A — the Australian workbench' },
    { href: 'https://auraofintelligence.github.io/p4a-oceania-cinema/', title: 'P4A Oceania — regional lab' },
    { href: 'https://localcontexts.org/', title: 'Local Contexts — TK & BC Labels' },
    { href: 'https://www.gida-global.org/', title: 'Global Indigenous Data Alliance' }
  ];

  /* Normalise: strip /index.html and .html so clean URLs match too. */
  const norm = (href) => new URL(href, location.href).pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  const here = norm(location.href);
  const isCurrent = (href) => norm(P + href) === here;

  /* ---------- Full-screen index ---------- */
  const sectionMarkup = (section) => {
    const links = section.links.map((link) => `
      <li data-index-item>
        <a href="${P}${link.href}"${isCurrent(link.href) ? ' aria-current="page"' : ''}>
          <strong>${link.title}</strong>
          <em>${link.note}</em>
        </a>
      </li>`).join('');
    return `
    <section class="index-section" data-index-section>
      <header><span>${section.num}</span><h2>${section.label}</h2><p>${section.blurb}</p></header>
      <ul class="index-links">${links}</ul>
    </section>`;
  };

  const overlay = document.createElement('div');
  overlay.className = 'site-index';
  overlay.id = 'site-index';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Site index');
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="index-shell">
      <div class="index-top">
        <p class="index-kicker">Native Nations / every public room</p>
        <label class="index-search">
          <span class="sr-only">Filter the index</span>
          <input type="search" placeholder="Type to filter the rooms…" data-index-search autocomplete="off">
        </label>
        <button class="index-close" type="button" data-menu-close aria-label="Close index">Close</button>
      </div>
      <p class="index-count" data-index-count aria-live="polite"></p>
      <div class="index-grid">${SECTIONS.map(sectionMarkup).join('')}</div>
      <footer class="index-foot">
        ${EXTERNAL.map((l) => `<a href="${l.href}" target="_blank" rel="noopener noreferrer">${l.title}</a>`).join('')}
      </footer>
    </div>`;
  document.body.appendChild(overlay);

  const toggles = Array.from(document.querySelectorAll('[data-menu-toggle]'));
  const closeBtn = overlay.querySelector('[data-menu-close]');
  const searchInput = overlay.querySelector('[data-index-search]');
  const countLabel = overlay.querySelector('[data-index-count]');
  const items = Array.from(overlay.querySelectorAll('[data-index-item]'));
  const sections = Array.from(overlay.querySelectorAll('[data-index-section]'));
  let lastFocus = null;

  const setCount = (visible) => {
    countLabel.textContent = visible === items.length
      ? `${items.length} rooms in the index`
      : `${visible} of ${items.length} rooms match`;
  };
  setCount(items.length);

  const filterIndex = () => {
    const q = (searchInput.value || '').trim().toLowerCase();
    let visible = 0;
    items.forEach((item) => {
      const match = !q || item.textContent.toLowerCase().includes(q);
      item.hidden = !match;
      if (match) visible += 1;
    });
    sections.forEach((section) => {
      const any = Array.from(section.querySelectorAll('[data-index-item]')).some((i) => !i.hidden);
      section.classList.toggle('is-empty', !any);
    });
    setCount(visible);
  };
  searchInput.addEventListener('input', filterIndex);

  const setExpanded = (value) => toggles.forEach((t) => t.setAttribute('aria-expanded', String(value)));
  const openIndex = () => {
    lastFocus = document.activeElement;
    overlay.hidden = false;
    document.body.classList.add('index-open');
    setExpanded(true);
    requestAnimationFrame(() => {
      overlay.classList.add('is-open');
      searchInput.focus({ preventScroll: true });
    });
  };
  const closeIndex = () => {
    overlay.classList.remove('is-open');
    document.body.classList.remove('index-open');
    setExpanded(false);
    const done = () => { overlay.hidden = true; };
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    reduced ? done() : setTimeout(done, 320);
    if (lastFocus?.focus) lastFocus.focus({ preventScroll: true });
  };

  toggles.forEach((t) => t.addEventListener('click', () => (overlay.hidden ? openIndex() : closeIndex())));
  closeBtn.addEventListener('click', closeIndex);
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closeIndex();
  });
  document.addEventListener('keydown', (event) => {
    if (overlay.hidden) return;
    if (event.key === 'Escape') { closeIndex(); return; }
    if (event.key !== 'Tab') return;
    const focusables = Array.from(overlay.querySelectorAll('a, button, input')).filter((el) => !el.hidden && el.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  /* ---------- Header state + scroll progress ---------- */
  const header = document.querySelector('.site-header');
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  progress.innerHTML = '<i></i>';
  document.body.appendChild(progress);
  const progressBar = progress.firstElementChild;

  let ticking = false;
  const syncScroll = () => {
    ticking = false;
    const top = window.scrollY;
    header?.classList.toggle('is-condensed', top > 24);
    const depth = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.transform = `scaleX(${depth > 0 ? Math.min(1, top / depth) : 0})`;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(syncScroll); }
  }, { passive: true });
  syncScroll();

  /* ---------- Breadcrumb (topic pages only) ---------- */
  const findPage = () => {
    for (const section of SECTIONS) {
      for (const link of section.links) {
        if (isCurrent(link.href)) return { section, link };
      }
    }
    return null;
  };
  const isHome = norm(P + 'index.html') === here;
  const found = findPage();
  if (!isHome && header) {
    const crumb = document.createElement('nav');
    crumb.className = 'crumb-strip';
    crumb.setAttribute('aria-label', 'You are here');
    const sectionLabel = found ? found.section.label : 'Rooms';
    const pageLabel = found ? found.link.title : (document.querySelector('h1')?.textContent || document.title);
    crumb.innerHTML = `
      <a href="${P}index.html">Home</a>
      <span aria-hidden="true">/</span>
      <button type="button" data-crumb-index>${sectionLabel}</button>
      <span aria-hidden="true">/</span>
      <strong aria-current="page">${pageLabel}</strong>`;
    header.insertAdjacentElement('afterend', crumb);
    crumb.querySelector('[data-crumb-index]').addEventListener('click', openIndex);
  }

  /* ---------- Footer explore columns ---------- */
  document.querySelectorAll('footer.site-footer').forEach((footer) => {
    const explore = document.createElement('nav');
    explore.className = 'footer-index';
    explore.setAttribute('aria-label', 'Explore the lab');
    explore.innerHTML = SECTIONS.map((section) => `
      <div>
        <strong>${section.label}</strong>
        <ul>${section.links.slice(0, 6).map((link) => `<li><a href="${P}${link.href}">${link.title}</a></li>`).join('')}</ul>
      </div>`).join('');
    footer.insertAdjacentElement('afterbegin', explore);
  });

  /* ---------- Mark current page in the static header nav ---------- */
  document.querySelectorAll('.site-nav a').forEach((link) => {
    if (norm(link.getAttribute('href')) === here) link.setAttribute('aria-current', 'page');
  });
})();
