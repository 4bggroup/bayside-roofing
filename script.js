'use strict';
const menu = document.querySelector('#main-menu');
const menuButton = document.querySelector('.menu-toggle');
function closeMenu() {
  menu.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menu.classList.toggle('is-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
window.matchMedia('(min-width: 961px)').addEventListener('change', closeMenu);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') { closeMenu(); menuButton.focus(); }
});

const services = {
  repairs: { image: '02-tile-repair.webp', alt: 'Gloved roofer adjusting a terracotta tile', label: '01 / ROOF REPAIRS', caption: 'Small problem.\nProper attention.' },
  restoration: { image: '03-roof-restoration.webp', alt: 'Restored terracotta tiled roof on a Melbourne brick house', label: '02 / ROOF RESTORATION', caption: 'A familiar roof.\nA fresh outlook.' },
  metal: { image: '04-metal-roof.webp', alt: 'Contemporary coastal home with a charcoal metal roof', label: '03 / METAL ROOFING', caption: 'A new roof.\nA considered finish.' },
  gutters: { image: '05-gutters.webp', alt: 'Neatly finished gutter and downpipe beneath Australian roof eaves', label: '04 / GUTTERS & DOWNPIPES', caption: 'The finishing line.\nAn important detail.' },
  inspection: { image: '06-roof-inspection.webp', alt: 'Roofer inspecting metal roof flashing', label: '05 / ROOF INSPECTIONS', caption: 'A closer look.\nA clearer next step.' }
};
const serviceImage = document.querySelector('#service-image');
function chooseService(key) {
  const selected = services[key];
  if (!selected) return;
  document.querySelectorAll('.service-item').forEach(item => {
    const active = item.dataset.service === key;
    item.classList.toggle('is-active', active);
    item.querySelector('button').setAttribute('aria-expanded', String(active));
    item.querySelector('.service-panel').hidden = !active;
  });
  serviceImage.src = 'assets/' + selected.image;
  serviceImage.alt = selected.alt;
  document.querySelector('#service-kicker').textContent = selected.label;
  const caption = document.querySelector('#service-caption');
  caption.replaceChildren();
  selected.caption.split('\n').forEach((line, index) => {
    if (index) caption.append(document.createElement('br'));
    caption.append(document.createTextNode(line));
  });
}
document.querySelectorAll('.service-item').forEach(item => item.querySelector('button').addEventListener('click', () => chooseService(item.dataset.service)));
document.querySelectorAll('[data-choose-service]').forEach(link => link.addEventListener('click', () => chooseService(link.dataset.chooseService)));
document.querySelectorAll('[data-enquiry-service]').forEach(link => link.addEventListener('click', () => {
  document.querySelector('#enquiry-service').value = link.dataset.enquiryService;
}));

const gallery = [
  { src: '08-heritage-home.webp', alt: 'Traditional cream weatherboard Melbourne cottage with a terracotta roof', label: 'The heritage home — architectural inspiration' },
  { src: '09-modern-home.webp', alt: 'Contemporary brick Melbourne home with a dark metal roof', label: 'A modern perspective — architectural inspiration' },
  { src: '01-brighton-home.webp', alt: 'Brighton weatherboard home with a charcoal metal roof', label: 'Coastal at heart — architectural inspiration' }
];
const dialog = document.querySelector('#gallery-dialog');
let photoIndex = 0;
let lastGalleryButton = null;
function showPhoto(index) {
  photoIndex = (index + gallery.length) % gallery.length;
  const photo = gallery[photoIndex];
  document.querySelector('#dialog-image').src = 'assets/' + photo.src;
  document.querySelector('#dialog-image').alt = photo.alt;
  document.querySelector('#dialog-label').textContent = photo.label;
  document.querySelector('#dialog-counter').textContent = (photoIndex + 1) + ' / ' + gallery.length;
}
document.querySelectorAll('[data-gallery-index]').forEach(button => button.addEventListener('click', () => {
  lastGalleryButton = button;
  showPhoto(Number(button.dataset.galleryIndex));
  dialog.showModal();
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
document.querySelector('#previous-photo').addEventListener('click', () => showPhoto(photoIndex - 1));
document.querySelector('#next-photo').addEventListener('click', () => showPhoto(photoIndex + 1));
dialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(photoIndex - 1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(photoIndex + 1); }
});
dialog.addEventListener('click', event => {
  if (event.target === dialog) {
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  }
});
dialog.addEventListener('close', () => lastGalleryButton?.focus({ preventScroll: true }));

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => { element.classList.add('will-reveal'); observer.observe(element); });
}
document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('#enquiry-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const result = document.querySelector('#form-result');
  result.textContent = 'Your enquiry preview\n\nName: ' + data.get('name') + '\nSuburb: ' + data.get('suburb') + '\nEmail: ' + data.get('email') + '\nService: ' + data.get('service') + (data.get('message') ? '\n\n' + data.get('message') : '') + '\n\nPreview only — nothing has been sent or stored.';
  result.hidden = false;
  result.focus({ preventScroll: true });
  result.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
});
