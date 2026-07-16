const pages = [
  ['Home', 'index.html'], ['Artist', 'author.html'], ['Filmmaking', 'filmmaking.html'],
  ['Screenwriting', 'screenwriting.html'], ['Collection', 'collection.html'], ['Journal', 'blog.html'],
  ['Services', 'services.html'], ['Questions', 'questions.html'], ['Contact', 'contact.html']
];
const current = location.pathname.split('/').pop() || 'index.html';
const deployment = 'portfolio-2026-v16';
const siteContent = window.PORTFOLIO_CONTENT || {};
const escapeMarkup = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const safeExternalHref = value => { try { const url = new URL(value); return url.protocol === 'https:' ? url.href : '#'; } catch { return '#'; } };
document.documentElement.style.overflowX = 'hidden';
document.body.style.overflowX = 'hidden';
if (current === 'collection.html' || current.startsWith('project-')) document.body.classList.add('collection-page');
if (current === 'author.html') document.body.classList.add('artist-page');
if (current === 'screenwriting.html') document.body.classList.add('screenwriting-page');
if (current === 'filmmaking.html') document.body.classList.add('filmmaking-page');
if (current === 'blog.html') document.body.classList.add('journal-page');

document.body.insertAdjacentHTML('afterbegin', `
  <div class="loader" aria-hidden="true"><div><span>The Archive</span><i></i><small>Film · Photo · Story</small></div></div>
  <div class="grain" aria-hidden="true"></div>
  <header class="site-header"><a class="brand" href="index.html">The Archive</a>
    <button class="menu-toggle" aria-expanded="false" aria-controls="main-nav"><span></span><span></span><span></span><b>Menu</b></button>
    <nav id="main-nav">${pages.map(([name, url]) => `<a ${current === url ? 'class="active"' : ''} href="${url}">${name}</a>`).join('')}</nav>
  </header>
  <div class="nav-blur-field" aria-hidden="true"></div>
  ${current === 'index.html' && siteContent.introEnabled !== false ? `<div class="camera-intro" aria-hidden="true"><div class="cine-blueprint"></div><div class="cine-camera-rig"><img class="cine-camera-master" src="media/camera/cine-camera-reference-v11.jpg" alt=""><div class="cine-slice cine-reel-shell"></div><div class="cine-slice cine-body-shell"></div><div class="cine-slice cine-optics-shell"></div><div class="cine-slice cine-support-shell"></div><div class="cine-internal film-reel reel-feed"><i></i></div><div class="cine-internal film-reel reel-takeup"><i></i></div><div class="cine-internal film-gate"><i></i></div><div class="cine-internal rotary-shutter"></div><div class="cine-internal sprocket sprocket-one"></div><div class="cine-internal sprocket sprocket-two"></div><div class="cine-internal film-strip"></div><div class="cine-internal pressure-plate"></div><div class="cine-internal camera-motor"><i></i></div><div class="cine-internal lens-element lens-one"></div><div class="cine-internal lens-element lens-two"></div><div class="cine-internal lens-element lens-three"></div><div class="cine-internal matte-box-core"></div></div><div class="camera-floor-shadow"></div><p>THE ARCHIVE / MOTION PICTURE CAMERA</p></div>` : ''}`);

const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
  document.body.classList.toggle('nav-open', !open);
  if (open) menu.blur();
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
  document.body.classList.remove('nav-open');
  menu.blur();
}));
addEventListener('keydown', event => {
  if (event.key !== 'Escape' || !nav.classList.contains('open')) return;
  menu.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
  document.body.classList.remove('nav-open');
  menu.blur();
});

if (current === 'author.html') {
  const heading = document.querySelector('.page-hero h1');
  if (heading) heading.textContent = 'Christian O. Reyes';
}

if (current === 'index.html' && siteContent.pages?.home) {
  const home = siteContent.pages.home;
  const heroImage = document.querySelector('.hero > img');
  if (heroImage && home.heroImage) heroImage.src = home.heroImage;
  const archiveTitle = document.querySelector('.archive-title');
  if (archiveTitle) archiveTitle.textContent = home.archiveTitle;
  const credit = String(home.creditLine || '').split('\n');
  const directedTitle = document.querySelector('.directed-title');
  if (directedTitle) directedTitle.innerHTML = `<span>${escapeMarkup(credit[0] || '')}</span>${credit.length > 1 ? `<br>${escapeMarkup(credit.slice(1).join(' '))}` : ''}`;
  const greeting = document.querySelector('.hello');
  if (greeting) greeting.innerHTML = escapeMarkup(home.greeting || '').replace(/\n/g, '<br>');
}

const archiveGroups = window.PORTFOLIO_MEDIA?.archives || { color: [], mono: [] };
const archiveCatalog = (folder, prefix, groups) => {
  return groups.flatMap(({ label: group, count, slug: groupSlug }) => Array.from({ length: count }, (_, groupIndex) => {
    const number = String(groupIndex + 1).padStart(3, '0');
    return {
      group,
      slug: groupSlug,
      src: `media/archive-v12/${folder}/${groupSlug}/${number}.jpg?v=${deployment}`,
      alt: `${folder === 'color' ? 'Color' : 'Black and white'} photograph from ${group}, image ${groupIndex + 1}`
    };
  }));
};
const projectPage = current === 'project-one.html'
  ? { folder: 'color', prefix: 'color', groups: archiveGroups.color, label: 'Color' }
  : current === 'project-four.html'
    ? { folder: 'mono', prefix: 'mono', groups: archiveGroups.mono, label: 'Black & White' }
    : null;
let selectedProject = null;
if (projectPage) {
  const catalog = archiveCatalog(projectPage.folder, projectPage.prefix, projectPage.groups);
  const selectedSlug = new URLSearchParams(location.search).get('project');
  const groups = projectPage.groups.map(({ label, count, slug }) => ({ label, count, slug, first: { src: `media/archive-v12/${projectPage.folder}/${slug}/preview.jpg?v=${deployment}` } }));
  selectedProject = groups.find(group => group.slug === selectedSlug) || null;
  const selection = document.querySelector('.project-selection');
  const gallery = document.querySelector('.gallery');
  if (selectedProject) {
    document.body.classList.add('project-gallery-page');
    selection?.remove();
    const heading = document.querySelector('.project-intro h1');
    const description = document.querySelector('.project-intro > p');
    if (heading) heading.textContent = selectedProject.label;
    if (description) description.textContent = `${selectedProject.count} images · ${projectPage.label} collection`;
    const back = document.querySelector('.collection-back');
    if (back) { back.href = current; back.textContent = `Back to ${projectPage.label} projects`; }
    gallery.innerHTML = catalog.filter(image => image.slug === selectedProject.slug).map(image => `<img class="fade" data-group="${escapeMarkup(image.group)}" src="${escapeMarkup(image.src)}" alt="${escapeMarkup(image.alt)}">`).join('');
  } else {
    gallery?.remove();
    selection.innerHTML = `<div class="project-card-grid">${groups.map(group => `<article class="project-card reveal"><a href="${current}?project=${escapeMarkup(group.slug)}"><img class="fade" src="${escapeMarkup(group.first.src)}" alt="Preview of ${escapeMarkup(group.label)}"><div><small>${group.count} images</small><h2>${escapeMarkup(group.label)}</h2><span>Open project</span></div></a></article>`).join('')}</div>`;
    const back = document.querySelector('.collection-back');
    if (back) { back.href = 'collection.html'; back.textContent = 'Back to collections'; }
  }
}
if (current === 'filmmaking.html') {
  const bts = document.querySelector('.bts-grid');
  const btsGroups = window.PORTFOLIO_MEDIA?.bts || [];
  if (bts) bts.innerHTML = btsGroups.map(group => `<section class="bts-project"><h3>${escapeMarkup(group.label)}</h3><div>${Array.from({ length: group.count }, (_, index) => { const src = `media/bts-v12/${group.slug}/${String(index + 1).padStart(3, '0')}.jpg?v=${deployment}`; return `<button class="media-open" type="button" data-full-image="${escapeMarkup(src)}" data-title="${escapeMarkup(group.label)}"><img class="fade" src="${escapeMarkup(src)}" alt="${escapeMarkup(group.label)} behind-the-scenes photograph ${index + 1}"></button>`; }).join('')}</div></section>`).join('');

  const musicVideoGrid = document.querySelector('.selected-work .film-grid');
  if (musicVideoGrid && siteContent.musicVideos) musicVideoGrid.innerHTML = siteContent.musicVideos.map(item => `<article class="film-card"><a href="${escapeMarkup(safeExternalHref(item.url))}" target="_blank" rel="noreferrer"><img class="fade" src="${escapeMarkup(item.poster)}" alt="${escapeMarkup(item.title)}"><div><p>${escapeMarkup(item.meta)}</p><h2>${escapeMarkup(item.title)}</h2></div></a></article>`).join('');

  const linkedFilms = document.querySelector('.external-shorts');
  if (linkedFilms && siteContent.externalShorts) linkedFilms.innerHTML = siteContent.externalShorts.map(item => `<article class="film-card"><a href="${escapeMarkup(safeExternalHref(item.url))}" target="_blank" rel="noreferrer"><img class="fade" src="${escapeMarkup(item.poster)}" alt="${escapeMarkup(item.title)}"><div><p>${escapeMarkup(item.meta)}</p><h2>${escapeMarkup(item.title)}</h2></div></a></article>`).join('');
  const hostedFilms = document.querySelector('.short-film-grid');
  if (hostedFilms && siteContent.localShorts) hostedFilms.innerHTML = siteContent.localShorts.map(item => `<article><video controls preload="metadata" poster="${escapeMarkup(item.poster)}" src="${escapeMarkup(item.video)}"></video><h3>${escapeMarkup(item.title)}</h3></article>`).join('');
  const interviews = document.querySelector('.interview-section');
  if (interviews && siteContent.interviews) interviews.innerHTML = `<p class="eyebrow">Interview / Selected conversation</p><h2 class="asset-title">Interviews.</h2><div class="interview-grid">${siteContent.interviews.map(item => `<article><video class="interview-video" controls preload="metadata" poster="${escapeMarkup(item.poster)}" src="${escapeMarkup(item.video)}"></video><h3>${escapeMarkup(item.title)}</h3></article>`).join('')}</div>`;
  const upcoming = document.querySelector('.upcoming-grid');
  if (upcoming && siteContent.upcoming) upcoming.innerHTML = siteContent.upcoming.map(item => `<article><button class="upcoming-open" type="button" data-full-image="${escapeMarkup(item.image)}" data-title="${escapeMarkup(item.title)}"><img src="${escapeMarkup(item.image)}" alt="${escapeMarkup(item.title)} title card"><span>View full image</span></button><h3>${escapeMarkup(item.title)}</h3></article>`).join('');

  const reel = document.querySelector('.profile-reel');
  const audioToggle = document.querySelector('.reel-audio-toggle');
  if (reel && audioToggle) audioToggle.addEventListener('click', () => {
    reel.muted = !reel.muted;
    audioToggle.setAttribute('aria-pressed', String(!reel.muted));
    audioToggle.textContent = reel.muted ? 'Play audio' : 'Mute audio';
    reel.play().catch(() => {});
  });

}

if (current === 'services.html' && siteContent.pages?.services) {
  const services = siteContent.pages.services;
  const heading = document.querySelector('.collection-head h1');
  if (heading) heading.innerHTML = escapeMarkup(services.heading).replace(/\n|\s+(?=[^\s]+$)/, '<br>');
  const grid = document.querySelector('.service-grid');
  if (grid) grid.innerHTML = services.items.map(item => `<article class="service-card reveal"><img class="fade" src="${escapeMarkup(item.image)}" alt="${escapeMarkup(item.title)}"><div><h2>${escapeMarkup(item.title)}</h2><p>${escapeMarkup(item.description)}</p></div></article>`).join('');
}

if (current === 'questions.html' && siteContent.pages?.questions) {
  const questions = siteContent.pages.questions;
  const hero = document.querySelector('.page-hero');
  if (hero && questions.heroImage) hero.style.setProperty('--image', `url('${questions.heroImage.replace(/["'()]/g, '')}')`);
  const heading = hero?.querySelector('h1');
  if (heading) heading.textContent = questions.heading;
  const faq = document.querySelector('.faq');
  if (faq) faq.innerHTML = questions.items.map((item, index) => `<details ${index === 0 ? 'open' : ''}><summary>${escapeMarkup(item.question)}</summary><p>${escapeMarkup(item.answer)}</p></details>`).join('');
}

if (current === 'contact.html' && siteContent.pages?.contact) {
  const contact = siteContent.pages.contact;
  const page = document.querySelector('.contact-page');
  if (page && contact.heroImage) page.style.setProperty('--image', `url('${contact.heroImage.replace(/["'()]/g, '')}')`);
  const lead = page?.querySelector(':scope > .lead');
  const prompt = page?.querySelector('.contact-prompt');
  const heading = page?.querySelector('h1');
  const email = page?.querySelector('.big-email');
  if (lead) lead.textContent = contact.lead;
  if (prompt) prompt.textContent = contact.prompt;
  if (heading) { const lines = String(contact.heading || '').split('\n'); heading.innerHTML = `${escapeMarkup(lines[0] || '')}${lines[1] ? `<br><i>${escapeMarkup(lines.slice(1).join(' '))}</i>` : ''}`; }
  if (email) { email.textContent = contact.email; email.href = `mailto:${contact.email}`; }
}

const scripts = siteContent.scripts?.map(item => [item.slug, item.title, item.type]) || [
  ['the-mysterious-stranger', 'The Mysterious Stranger', 'Senior Capstone / Featured'],
  ['halo-odst', 'HALO: ODST', 'Screenplay'], ['midnight-in-mexico', 'Midnight in Mexico', 'Screenplay'],
  ['starbound-stageplay', 'Starbound', 'Stageplay'], ['synthetic-genesis', 'Synthetic Genesis', 'Screenplay'],
  ['purgotorio-outline', 'Purgatorio', 'Television outline'], ['the-caldwell-house', 'The Caldwell House', 'Screenplay']
];
if (current === 'screenwriting.html') {
  document.querySelector('.screenplay')?.remove();
  document.querySelector('.writing-grid')?.closest('.editorial')?.remove();
  const library = document.querySelector('.script-library');
  if (library) library.innerHTML = `<p class="eyebrow">Scripts / Selected writing</p><h2 class="asset-title">From the archive.</h2><div class="script-preview-grid">${scripts.map(([slug, title, type], index) => `<a class="script-preview ${index === 0 ? 'featured-script' : ''}" href="media/scripts/${escapeMarkup(slug)}.pdf"><img src="media/scripts/previews/${escapeMarkup(slug)}.jpg" alt="Front page of ${escapeMarkup(title)}"><span><span><small>${escapeMarkup(type)}</small><strong>${escapeMarkup(title)}</strong></span><small>Read PDF</small></span></a>`).join('')}</div>`;
}
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.body.insertAdjacentHTML('beforeend', `<dialog class="media-lightbox" aria-label="Full-size portfolio image"><button class="media-lightbox-close" type="button">Close</button><figure><img src="" alt=""><figcaption></figcaption></figure></dialog>`);
const mediaLightbox = document.querySelector('.media-lightbox');
const mediaLightboxImage = mediaLightbox.querySelector('img');
const mediaLightboxCaption = mediaLightbox.querySelector('figcaption');
let mediaZoom = { scale: 1, x: 0, y: 0, dragging: false, pointerX: 0, pointerY: 0 };
const applyMediaZoom = () => { mediaLightboxImage.style.transform = `translate3d(${mediaZoom.x}px,${mediaZoom.y}px,0) scale(${mediaZoom.scale})`; mediaLightbox.classList.toggle('zoomed', mediaZoom.scale > 1); };
const resetMediaZoom = () => { mediaZoom = { scale: 1, x: 0, y: 0, dragging: false, pointerX: 0, pointerY: 0 }; applyMediaZoom(); };
document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-full-image], .upcoming-open');
  if (!trigger) return;
  const source = trigger.dataset.fullImage || trigger.dataset.full;
  const title = trigger.dataset.title || trigger.querySelector('img')?.alt || 'Portfolio image';
  mediaLightboxImage.src = source;
  mediaLightboxImage.alt = `${title} full-size image`;
  mediaLightboxCaption.textContent = title;
  mediaLightbox.showModal();
  resetMediaZoom();
});
mediaLightbox.querySelector('.media-lightbox-close').addEventListener('click', () => { mediaLightbox.close(); resetMediaZoom(); });
mediaLightbox.addEventListener('click', event => { if (event.target === mediaLightbox) { mediaLightbox.close(); resetMediaZoom(); } });
mediaLightbox.addEventListener('wheel', event => {
  event.preventDefault();
  const previousScale = mediaZoom.scale;
  const nextScale = Math.min(7, Math.max(1, previousScale * Math.exp(-event.deltaY * .0015)));
  const rect = mediaLightbox.getBoundingClientRect();
  const cursorX = event.clientX - rect.left - rect.width / 2;
  const cursorY = event.clientY - rect.top - rect.height / 2;
  const ratio = nextScale / previousScale;
  mediaZoom.x = cursorX - (cursorX - mediaZoom.x) * ratio;
  mediaZoom.y = cursorY - (cursorY - mediaZoom.y) * ratio;
  mediaZoom.scale = nextScale;
  if (nextScale === 1) { mediaZoom.x = 0; mediaZoom.y = 0; }
  applyMediaZoom();
}, { passive: false });
mediaLightboxImage.addEventListener('pointerdown', event => { if (mediaZoom.scale <= 1) return; mediaZoom.dragging = true; mediaZoom.pointerX = event.clientX - mediaZoom.x; mediaZoom.pointerY = event.clientY - mediaZoom.y; mediaLightboxImage.setPointerCapture(event.pointerId); mediaLightbox.classList.add('dragging'); });
mediaLightboxImage.addEventListener('pointermove', event => { if (!mediaZoom.dragging) return; mediaZoom.x = event.clientX - mediaZoom.pointerX; mediaZoom.y = event.clientY - mediaZoom.pointerY; applyMediaZoom(); });
const stopMediaDrag = event => { mediaZoom.dragging = false; mediaLightbox.classList.remove('dragging'); if (event.pointerId !== undefined && mediaLightboxImage.hasPointerCapture(event.pointerId)) mediaLightboxImage.releasePointerCapture(event.pointerId); };
mediaLightboxImage.addEventListener('pointerup', stopMediaDrag);
mediaLightboxImage.addEventListener('pointercancel', stopMediaDrag);
mediaLightboxImage.addEventListener('dblclick', () => { mediaZoom.scale = mediaZoom.scale > 1 ? 1 : 2.5; mediaZoom.x = 0; mediaZoom.y = 0; applyMediaZoom(); });
const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('seen'); reveal.unobserve(entry.target); }
}), { threshold: .06, rootMargin: '0px 0px 10% 0px' });
document.querySelectorAll('.reveal, img.fade').forEach(el => reduce ? el.classList.add('seen') : reveal.observe(el));
document.querySelectorAll('img:not(.hero img)').forEach(img => { img.loading = 'lazy'; img.decoding = 'async'; });

document.querySelectorAll('.gallery').forEach(gallery => {
  const images = [...gallery.querySelectorAll(':scope > img')];
  images.forEach((image, index) => { image.classList.remove('wide'); image.setAttribute('aria-label', `Open image ${index + 1} of ${images.length} full screen`); image.dataset.fullImage = image.currentSrc || image.src; image.dataset.title = image.alt; image.tabIndex = 0; image.setAttribute('role', 'button'); image.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); image.click(); } }); });
  if (images.length < 2) return;
  gallery.classList.add('gallery-slider');
  const firstLabel = images[0].dataset.group ? `${images[0].dataset.group} · ` : '';
  const groups = [...new Set(images.map(image => image.dataset.group).filter(Boolean))];
  const groupNavigation = groups.length > 1 ? `<div class="gallery-groups" aria-label="Project folders">${groups.map((group, index) => `<button class="${index === 0 ? 'active' : ''}" data-group="${escapeMarkup(group)}">${escapeMarkup(group)}</button>`).join('')}</div>` : '';
  gallery.insertAdjacentHTML('afterend', `<div class="gallery-ui ${groups.length > 1 ? '' : 'single-project-ui'}"><div class="gallery-controls"><button class="gallery-prev" aria-label="Previous image">Prev</button><span aria-live="polite">${firstLabel}1 / ${images.length}</span><button class="gallery-next" aria-label="Next image">Next</button></div>${groupNavigation}<div class="gallery-thumbs" aria-label="Gallery thumbnails">${images.map((image, index) => `<button class="${index === 0 ? 'active' : ''}" aria-label="View ${image.dataset.group || 'image'} ${index + 1}"><img loading="lazy" src="${image.getAttribute('src')}" alt=""></button>`).join('')}</div></div>`);
  const ui = gallery.nextElementSibling;
  const status = ui.querySelector('.gallery-controls span');
  const thumbs = [...ui.querySelectorAll('.gallery-thumbs button')];
  const groupButtons = [...ui.querySelectorAll('.gallery-groups button')];
  let active = 0;
  const show = index => {
    active = index;
    const label = images[active].dataset.group ? `${images[active].dataset.group} · ` : '';
    status.textContent = `${label}${active + 1} / ${images.length}`;
    thumbs.forEach((thumb, thumbIndex) => thumb.classList.toggle('active', thumbIndex === active));
    groupButtons.forEach(button => button.classList.toggle('active', button.dataset.group === images[active].dataset.group));
    thumbs[active].scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
    gallery.scrollTo({ left: images[active].offsetLeft, behavior: reduce ? 'auto' : 'smooth' });
  };
  ui.querySelector('.gallery-prev').addEventListener('click', () => show((active - 1 + images.length) % images.length));
  ui.querySelector('.gallery-next').addEventListener('click', () => show((active + 1) % images.length));
  thumbs.forEach((thumb, index) => thumb.addEventListener('click', () => show(index)));
  groupButtons.forEach(button => button.addEventListener('click', () => show(images.findIndex(image => image.dataset.group === button.dataset.group))));
  gallery.tabIndex = 0;
  gallery.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') show((active - 1 + images.length) % images.length);
    if (event.key === 'ArrowRight') show((active + 1) % images.length);
  });
});

if (projectPage && selectedProject) {
  const projects = projectPage.groups.map(({ label, slug }) => ({ label, slug }));
  const projectIndex = projects.findIndex(project => project.slug === selectedProject.slug);
  const previous = projects[(projectIndex - 1 + projects.length) % projects.length];
  const next = projects[(projectIndex + 1) % projects.length];
  const anchor = document.querySelector('.gallery-ui') || document.querySelector('.gallery');
  anchor?.insertAdjacentHTML('afterend', `<nav class="collection-switcher" aria-label="Project navigation"><a href="${current}?project=${previous.slug}#gallery-view">Previous project</a><a href="${current}">All ${projectPage.label} projects</a><a href="${current}?project=${next.slug}#gallery-view">Next project</a></nav>`);
  if (location.hash === '#gallery-view') requestAnimationFrame(() => document.querySelector('#gallery-view')?.scrollIntoView({ block: 'start' }));
}

if (!['services.html', 'filmmaking.html'].includes(current)) {
  document.querySelectorAll('main img:not(.gallery-thumbs img)').forEach(image => {
    if (image.matches('[data-no-copyright]') || image.closest('.no-copyright')) return;
    const host = image.parentElement;
    if (!host) return;
    host.classList.add('copyright-host');
    if (!host.querySelector(':scope > .image-mark')) host.insertAdjacentHTML('beforeend', '<span class="image-mark">© Christian O. Reyes</span>');
  });
}

if (!document.querySelector('.mini-footer')) document.body.insertAdjacentHTML('beforeend', '<footer class="mini-footer"><span>Christian O. Reyes</span><span>Film · Photo · Story</span></footer>');
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (!href || /^(https?:|mailto:|#)/.test(href)) return;
  const url = new URL(href, location.href);
  if (!url.pathname.endsWith('.html')) return;
  url.searchParams.set('v', deployment);
  link.setAttribute('href', `${url.pathname.split('/').pop()}${url.search}${url.hash}`);
});

const ready = () => requestAnimationFrame(() => document.body.classList.add('loaded'));
document.readyState === 'loading' ? addEventListener('DOMContentLoaded', ready, { once: true }) : ready();
if ('requestIdleCallback' in window) requestIdleCallback(() => pages.forEach(([, href]) => {
  if (href === current) return;
  const link = document.createElement('link'); link.rel = 'prefetch'; link.href = `${href}?v=${deployment}`; document.head.append(link);
}));
