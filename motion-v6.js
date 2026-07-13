const pages = [
  ['Home', 'index.html'], ['Artist', 'author.html'], ['Filmmaking', 'filmmaking.html'],
  ['Screenwriting', 'screenwriting.html'], ['Collection', 'collection.html'], ['Journal', 'blog.html'],
  ['Services', 'services.html'], ['Questions', 'questions.html'], ['Contact', 'contact.html']
];
const current = location.pathname.split('/').pop() || 'index.html';
const deployment = 'portfolio-2026-v6';
document.documentElement.style.overflowX = 'hidden';
document.body.style.overflowX = 'hidden';
if (current === 'collection.html' || current.startsWith('project-')) document.body.classList.add('collection-page');

document.body.insertAdjacentHTML('afterbegin', `
  <div class="loader" aria-hidden="true"><div><span>The Archive</span><i></i><small>Film · Photo · Story</small></div></div>
  <div class="grain" aria-hidden="true"></div>
  <header class="site-header"><a class="brand" href="index.html">The Archive</a>
    <button class="menu-toggle" aria-expanded="false" aria-controls="main-nav"><span></span><span></span><span></span><b>Menu</b></button>
    <nav id="main-nav">${pages.map(([name, url]) => `<a ${current === url ? 'class="active"' : ''} href="${url}">${name}</a>`).join('')}</nav>
  </header>`);

document.querySelectorAll('a[href$=".html"]').forEach(link => {
  link.setAttribute('href', `${link.getAttribute('href')}?v=${deployment}`);
});

const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    entry.target.classList.add('seen');
    reveal.unobserve(entry.target);
  }
}), { threshold: .08, rootMargin: '0px 0px 8% 0px' });
document.querySelectorAll('.reveal, img.fade').forEach(el => reduce ? el.classList.add('seen') : reveal.observe(el));
document.querySelectorAll('img:not(.hero img)').forEach(img => { img.loading = 'lazy'; img.decoding = 'async'; });

if (current === 'author.html') {
  const heading = document.querySelector('.page-hero h1');
  if (heading) heading.textContent = 'Christian O. Reyes';
}

document.querySelectorAll('.gallery').forEach(gallery => {
  const images = [...gallery.querySelectorAll(':scope > img')];
  if (images.length < 2) return;
  gallery.classList.add('gallery-slider');
  images.forEach((image, index) => {
    image.classList.remove('wide');
    image.setAttribute('aria-label', `Image ${index + 1} of ${images.length}`);
  });
  gallery.insertAdjacentHTML('beforeend', `
    <div class="gallery-controls"><button class="gallery-prev" aria-label="Previous image">←</button><span aria-live="polite">1 / ${images.length}</span><button class="gallery-next" aria-label="Next image">→</button></div>
    <div class="gallery-thumbs" aria-label="Gallery thumbnails">${images.map((image, index) => `<button class="${index === 0 ? 'active' : ''}" data-slide="${index}" aria-label="View image ${index + 1}"><img src="${image.getAttribute('src')}" alt=""></button>`).join('')}</div>`);
  let active = 0;
  const status = gallery.querySelector('.gallery-controls span');
  const thumbs = [...gallery.querySelectorAll('.gallery-thumbs button')];
  const setActive = index => {
    active = index;
    status.textContent = `${active + 1} / ${images.length}`;
    thumbs.forEach((thumb, thumbIndex) => thumb.classList.toggle('active', thumbIndex === active));
  };
  const show = index => {
    setActive(index);
    images[index].scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
  };
  gallery.querySelector('.gallery-prev').addEventListener('click', () => show((active - 1 + images.length) % images.length));
  gallery.querySelector('.gallery-next').addEventListener('click', () => show((active + 1) % images.length));
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
  document.querySelector('.gallery')?.insertAdjacentHTML('afterend', `<nav class="collection-switcher" aria-label="Collection navigation"><a href="${previous}?v=${deployment}">← Previous collection</a><a href="collection.html?v=${deployment}">All collections</a><a href="${next}?v=${deployment}">Next collection →</a></nav>`);
}

const ready = () => requestAnimationFrame(() => document.body.classList.add('loaded'));
document.readyState === 'loading' ? addEventListener('DOMContentLoaded', ready, { once: true }) : ready();
if ('requestIdleCallback' in window) requestIdleCallback(() => pages.forEach(([, href]) => {
  if (href === current) return;
  const link = document.createElement('link'); link.rel = 'prefetch'; link.href = `${href}?v=${deployment}`; document.head.append(link);
}));
