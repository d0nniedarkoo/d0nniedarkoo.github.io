const pages = [
  ['Home', 'index.html'],
  ['Artist', 'author.html'],
  ['Filmmaking', 'filmmaking.html'],
  ['Screenwriting', 'screenwriting.html'],
  ['Collection', 'collection.html'],
  ['Journal', 'blog.html'],
  ['Services', 'services.html'],
  ['Questions', 'questions.html'],
  ['Contact', 'contact.html']
];

const current = location.pathname.split('/').pop() || 'index.html';
const deployment = '1ce3a58';
document.documentElement.style.overflowX = 'hidden';
document.body.style.overflowX = 'hidden';
if (current === 'collection.html' || current.startsWith('project-')) document.body.classList.add('collection-page');

document.body.insertAdjacentHTML('afterbegin', `
  <div class="loader" aria-hidden="true"><div><span>The Archive</span><i></i><small>Film · Photo · Story</small></div></div>
  <div class="grain" aria-hidden="true"></div>
  <header class="site-header">
    <a class="brand" href="index.html">The Archive</a>
    <button class="menu-toggle" aria-expanded="false" aria-controls="main-nav"><span></span><span></span><span></span><b>Menu</b></button>
    <nav id="main-nav">${pages.map(([name, url]) => `<a ${current === url ? 'class="active"' : ''} href="${url}">${name}</a>`).join('')}</nav>
  </header>`);

document.querySelectorAll('a[href$=".html"]').forEach(link => {
  const href = link.getAttribute('href');
  link.setAttribute('href', `${href}?v=${deployment}`);
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

document.querySelectorAll('img:not(.hero img)').forEach(img => {
  img.loading = 'lazy';
  img.decoding = 'async';
});

if (current === 'author.html') {
  const heading = document.querySelector('.page-hero h1');
  if (heading) heading.textContent = 'Christian O. Reyes';
}

document.querySelectorAll('.home-grid a').forEach(card => {
  card.addEventListener('pointermove', event => {
    const box = card.getBoundingClientRect();
    card.style.setProperty('--x', `${event.clientX - box.left}px`);
    card.style.setProperty('--y', `${event.clientY - box.top}px`);
  });
});

const hero = document.querySelector('.hero');
if (hero) {
  hero.insertAdjacentHTML('beforeend', '<i class="cursor-line" aria-hidden="true"></i>');
  hero.addEventListener('pointermove', event => {
    const box = hero.getBoundingClientRect();
    hero.style.setProperty('--x', `${event.clientX - box.left}px`);
    hero.style.setProperty('--y', `${event.clientY - box.top}px`);
  });
}

document.querySelectorAll('.gallery').forEach(gallery => {
  const images = [...gallery.querySelectorAll('img')];
  if (images.length < 2) return;
  gallery.classList.add('gallery-slider');
  images.forEach((image, index) => {
    image.classList.remove('wide');
    image.setAttribute('aria-label', `Image ${index + 1} of ${images.length}`);
  });
  gallery.insertAdjacentHTML('beforeend', `<div class="gallery-controls"><button class="gallery-prev" aria-label="Previous image">←</button><span aria-live="polite">1 / ${images.length}</span><button class="gallery-next" aria-label="Next image">→</button></div>`);
  let active = 0;
  const status = gallery.querySelector('.gallery-controls span');
  const go = direction => {
    active = (active + direction + images.length) % images.length;
    images[active].scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
    status.textContent = `${active + 1} / ${images.length}`;
  };
  gallery.querySelector('.gallery-prev').addEventListener('click', () => go(-1));
  gallery.querySelector('.gallery-next').addEventListener('click', () => go(1));
  gallery.tabIndex = 0;
  gallery.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') go(-1);
    if (event.key === 'ArrowRight') go(1);
  });
});

const ready = () => requestAnimationFrame(() => document.body.classList.add('loaded'));
document.readyState === 'loading' ? addEventListener('DOMContentLoaded', ready, { once: true }) : ready();

if ('requestIdleCallback' in window) requestIdleCallback(() => {
  pages.forEach(([, href]) => {
    if (href === current) return;
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.append(link);
  });
});
