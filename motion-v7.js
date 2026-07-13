const pages = [
  ['Home', 'index.html'], ['Artist', 'author.html'], ['Filmmaking', 'filmmaking.html'],
  ['Screenwriting', 'screenwriting.html'], ['Collection', 'collection.html'], ['Journal', 'blog.html'],
  ['Services', 'services.html'], ['Questions', 'questions.html'], ['Contact', 'contact.html']
];
const current = location.pathname.split('/').pop() || 'index.html';
const deployment = 'portfolio-2026-v7b';
document.documentElement.style.overflowX = 'hidden';
document.body.style.overflowX = 'hidden';
if (current === 'collection.html' || current.startsWith('project-')) document.body.classList.add('collection-page');
if (current === 'author.html') document.body.classList.add('artist-page');
if (current === 'screenwriting.html') document.body.classList.add('screenwriting-page');

document.body.insertAdjacentHTML('afterbegin', `
  <div class="loader" aria-hidden="true"><div><span>The Archive</span><i></i><small>Film · Photo · Story</small></div></div>
  <div class="grain" aria-hidden="true"></div>
  <header class="site-header"><a class="brand" href="index.html">The Archive</a>
    <button class="menu-toggle" aria-expanded="false" aria-controls="main-nav"><span></span><span></span><span></span><b>Menu</b></button>
    <nav id="main-nav">${pages.map(([name, url]) => `<a ${current === url ? 'class="active"' : ''} href="${url}">${name}</a>`).join('')}</nav>
  </header>`);

const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});

if (current === 'author.html') {
  const heading = document.querySelector('.page-hero h1');
  if (heading) heading.textContent = 'Christian O. Reyes';
}

const archiveImages = (folder, prefix, count, extension = 'jpg') => Array.from({ length: count }, (_, index) => {
  const number = String(index + 1).padStart(3, '0');
  return `<img class="fade" src="media/archive/${folder}/${prefix}-${number}.${extension}" alt="${folder === 'color' ? 'Color' : 'Black and white'} archive photograph ${index + 1}">`;
}).join('');
if (current === 'project-one.html') document.querySelector('.gallery').innerHTML = archiveImages('color', 'color', 28);
if (current === 'project-four.html') document.querySelector('.gallery').innerHTML = archiveImages('mono', 'mono', 109);
if (current === 'filmmaking.html') {
  const bts = document.querySelector('.bts-grid');
  if (bts) bts.innerHTML = Array.from({ length: 23 }, (_, index) => `<img class="fade" src="media/archive/bts/bts-${String(index + 1).padStart(3, '0')}.jpg" alt="Behind the scenes photograph ${index + 1}">`).join('');
}

const scripts = [
  ['halo-odst', 'HALO: ODST'], ['midnight-in-mexico', 'Midnight in Mexico'],
  ['starbound-stageplay', 'Starbound'], ['synthetic-genesis', 'Synthetic Genesis'],
  ['purgotorio-outline', 'Purgatorio'], ['the-caldwell-house', 'The Caldwell House'],
  ['the-mysterious-stranger', 'The Mysterious Stranger']
];
if (current === 'screenwriting.html') {
  document.querySelector('.screenplay')?.remove();
  document.querySelector('.writing-grid')?.closest('.editorial')?.remove();
  const library = document.querySelector('.script-library');
  if (library) library.innerHTML = `<p class="eyebrow">Scripts / Selected writing</p><h2 class="asset-title">From the archive.</h2><div class="script-preview-grid">${scripts.map(([slug, title]) => `<a class="script-preview" href="media/scripts/${slug}.pdf"><img src="media/scripts/previews/${slug}.jpg" alt="Front page of ${title}"><span><strong>${title}</strong><small>Read PDF ↗</small></span></a>`).join('')}</div>`;
}
if (current === 'services.html') {
  const grid = document.querySelector('.service-grid');
  if (grid && !grid.querySelector('.writing-service')) grid.insertAdjacentHTML('beforeend', `<article class="service-card writing-service reveal"><img class="fade" src="media/screenwriting-card.png" alt="Screenplay page"><div><h2>Writing</h2><p>Screenplays, treatments, story development, beat sheets, and production-ready narrative work.</p></div></article>`);
}

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('seen'); reveal.unobserve(entry.target); }
}), { threshold: .06, rootMargin: '0px 0px 10% 0px' });
document.querySelectorAll('.reveal, img.fade').forEach(el => reduce ? el.classList.add('seen') : reveal.observe(el));
document.querySelectorAll('img:not(.hero img)').forEach(img => { img.loading = 'lazy'; img.decoding = 'async'; });

document.querySelectorAll('.gallery').forEach(gallery => {
  const images = [...gallery.querySelectorAll(':scope > img')];
  if (images.length < 2) return;
  gallery.classList.add('gallery-slider');
  images.forEach((image, index) => { image.classList.remove('wide'); image.setAttribute('aria-label', `Image ${index + 1} of ${images.length}`); });
  gallery.insertAdjacentHTML('afterend', `<div class="gallery-ui"><div class="gallery-controls"><button class="gallery-prev" aria-label="Previous image">←</button><span aria-live="polite">1 / ${images.length}</span><button class="gallery-next" aria-label="Next image">→</button></div><div class="gallery-thumbs" aria-label="Gallery thumbnails">${images.map((image, index) => `<button class="${index === 0 ? 'active' : ''}" aria-label="View image ${index + 1}"><img loading="lazy" src="${image.getAttribute('src')}" alt=""></button>`).join('')}</div></div>`);
  const ui = gallery.nextElementSibling;
  const status = ui.querySelector('.gallery-controls span');
  const thumbs = [...ui.querySelectorAll('.gallery-thumbs button')];
  let active = 0;
  const show = index => {
    active = index;
    status.textContent = `${active + 1} / ${images.length}`;
    thumbs.forEach((thumb, thumbIndex) => thumb.classList.toggle('active', thumbIndex === active));
    thumbs[active].scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
    gallery.scrollTo({ left: images[active].offsetLeft, behavior: reduce ? 'auto' : 'smooth' });
  };
  ui.querySelector('.gallery-prev').addEventListener('click', () => show((active - 1 + images.length) % images.length));
  ui.querySelector('.gallery-next').addEventListener('click', () => show((active + 1) % images.length));
  thumbs.forEach((thumb, index) => thumb.addEventListener('click', () => show(index)));
  gallery.tabIndex = 0;
  gallery.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') show((active - 1 + images.length) % images.length);
    if (event.key === 'ArrowRight') show((active + 1) % images.length);
  });
});

const collections = ['project-one.html', 'project-two.html', 'project-three.html', 'project-four.html'];
const collectionIndex = collections.indexOf(current);
if (collectionIndex >= 0) {
  const previous = collections[(collectionIndex - 1 + collections.length) % collections.length];
  const next = collections[(collectionIndex + 1) % collections.length];
  const anchor = document.querySelector('.gallery-ui') || document.querySelector('.gallery');
  anchor?.insertAdjacentHTML('afterend', `<nav class="collection-switcher" aria-label="Collection navigation"><a href="${previous}">← Previous collection</a><a href="collection.html">All collections</a><a href="${next}">Next collection →</a></nav>`);
}

document.querySelectorAll('main img:not(.gallery-thumbs img)').forEach(image => {
  const host = image.parentElement;
  if (!host) return;
  host.classList.add('copyright-host');
  if (!host.querySelector(':scope > .image-mark')) host.insertAdjacentHTML('beforeend', '<span class="image-mark">© Christian O. Reyes</span>');
});

if (!document.querySelector('.mini-footer')) document.body.insertAdjacentHTML('beforeend', '<footer class="mini-footer"><span>Christian O. Reyes</span><span>Film · Photo · Story</span></footer>');
document.querySelectorAll('a[href$=".html"]').forEach(link => link.setAttribute('href', `${link.getAttribute('href')}?v=${deployment}`));

const ready = () => requestAnimationFrame(() => document.body.classList.add('loaded'));
document.readyState === 'loading' ? addEventListener('DOMContentLoaded', ready, { once: true }) : ready();
if ('requestIdleCallback' in window) requestIdleCallback(() => pages.forEach(([, href]) => {
  if (href === current) return;
  const link = document.createElement('link'); link.rel = 'prefetch'; link.href = `${href}?v=${deployment}`; document.head.append(link);
}));
