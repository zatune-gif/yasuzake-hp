// ─── Scroll Reveal ───
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

function observeReveal(root = document) {
  root.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}
observeReveal();

// ─── Smooth Scroll ───
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ─── Gallery + Hero Background ───
fetch('gallery.json')
  .then(r => r.json())
  .then(groups => {
    setHeroBg(groups);
    renderGallery(groups);
  })
  .catch(() => {});

function setHeroBg(groups) {
  const all = groups.flatMap(g => g.images.map(img => `images/events/${g.folder}/${img}`));
  if (!all.length) return;
  const src = all[Math.floor(Math.random() * all.length)];
  const bg = document.getElementById('hero-bg');
  bg.style.backgroundImage = `url('${src}')`;
  const img = new Image();
  img.onload = () => bg.classList.add('loaded');
  img.src = src;
}

function renderGallery(groups) {
  const container = document.getElementById('gallery-container');
  if (!container || !groups.length) return;

  container.innerHTML = groups.map(group => `
    <div class="event-group reveal">
      <div class="photo-grid">
        ${group.images.map(img => `
          <div class="photo-item" tabindex="0" role="button" aria-label="写真を拡大">
            <img src="images/events/${group.folder}/${img}" alt="外飲みの様子" loading="lazy">
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  observeReveal(container);
  initLightboxItems(container);
}

// ─── Lightbox ───
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightbox-img');
const lightboxLabel = document.getElementById('lightbox-label');

function initLightboxItems(root = document) {
  root.querySelectorAll('.photo-item').forEach(item => {
    const open = () => {
      const img = item.querySelector('img');
      if (!img) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxLabel.textContent = '';
      openLightbox();
    };
    item.addEventListener('click', open);
    item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') open(); });
  });
}
initLightboxItems();

document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

function openLightbox() {
  lightbox.style.display = 'flex';
  requestAnimationFrame(() => lightbox.classList.add('active'));
  lightbox.setAttribute('aria-hidden', 'false');
  document.querySelector('.lightbox-close').focus();
}

function closeLightbox() {
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  setTimeout(() => {
    lightbox.style.display = 'none';
    lightboxImg.src = '';
  }, 200);
}
