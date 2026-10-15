const galleryItems = document.querySelectorAll('[data-gallery-item]');
const lightbox = document.getElementById('gallery-lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxVideo = document.getElementById('lightbox-video');
const lightboxIframe = document.getElementById('lightbox-iframe');
const lightboxVideoWrap = document.getElementById('lightbox-video-wrap');
const lightboxVideoPoster = document.getElementById('lightbox-video-poster');
const lightboxVideoPlayBtn = document.getElementById('lightbox-video-play-btn');
const lightboxActions = document.getElementById('lightbox-actions');
const lightboxExternalBtn = document.getElementById('lightbox-external-btn');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxText = document.getElementById('lightbox-text');
const lightboxClose = document.getElementById('lightbox-close');

// Prevent pinch-to-zoom and multi-touch gesture zoom on mobile
document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });
document.addEventListener('gesturechange', (e) => e.preventDefault(), { passive: false });
document.addEventListener('gestureend', (e) => e.preventDefault(), { passive: false });

// Soft tactile cursor matching portfolio
if (window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const dot = document.createElement("div");
  const ring = document.createElement("div");
  dot.className = "custom-cursor-dot";
  ring.className = "custom-cursor-ring";
  document.body.append(dot, ring);

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;

  window.addEventListener("pointermove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  }, { passive: true });

  const renderCursor = () => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursor);
  };
  requestAnimationFrame(renderCursor);

  document.querySelectorAll("a, button, .gallery-item, .glass-card-3d, .pill-btn, .view-toggle-btn").forEach(el => {
    el.addEventListener("pointerenter", () => document.body.classList.add("cursor-hover"));
    el.addEventListener("pointerleave", () => document.body.classList.remove("cursor-hover"));
  });
}

// Global open / close lightbox handler
let openLightbox = null;
let closeLightbox = null;

if (lightbox && lightboxTitle && lightboxText && lightboxClose) {
  closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.classList.remove('lightbox-open');

    if (lightboxVideo) {
      lightboxVideo.pause();
      lightboxVideo.removeAttribute('src');
      lightboxVideo.load();
    }

    if (lightboxImage) {
      lightboxImage.removeAttribute('src');
      lightboxImage.alt = '';
    }

    if (lightboxIframe) {
      lightboxIframe.removeAttribute('src');
      lightboxIframe.style.display = 'none';
    }

    if (lightboxVideoWrap) {
      lightboxVideoWrap.style.display = 'none';
    }

    if (lightboxVideoPoster) {
      lightboxVideoPoster.removeAttribute('src');
      lightboxVideoPoster.alt = '';
    }

    if (lightboxActions) {
      lightboxActions.style.display = 'none';
    }
  };

  openLightbox = (item) => {
    if (!item) return;
    const title = item.dataset.title || item.querySelector('h3')?.textContent || 'Gallery item';
    const text = item.dataset.text || item.querySelector('p')?.textContent || '';
    const img = item.querySelector('img');
    const video = item.querySelector('video');
    const iframe = item.querySelector('iframe');
    const videoUrl = item.dataset.videoUrl || '';
    const isVideoCard = item.classList.contains('gallery-item--video') || !!videoUrl;

    lightboxTitle.textContent = title;
    lightboxText.textContent = text;

    if (isVideoCard && lightboxVideoWrap && lightboxVideoPoster) {
      if (lightboxImage) lightboxImage.style.display = 'none';
      if (lightboxVideo) lightboxVideo.style.display = 'none';
      if (lightboxIframe) lightboxIframe.style.display = 'none';

      lightboxVideoPoster.src = img ? img.src : '';
      lightboxVideoPoster.alt = title;
      lightboxVideoWrap.style.display = 'flex';

      if (lightboxVideoPlayBtn) {
        lightboxVideoPlayBtn.href = videoUrl;
      }
      if (lightboxExternalBtn && videoUrl) {
        lightboxExternalBtn.href = videoUrl;
      }
      if (lightboxActions) {
        lightboxActions.style.display = videoUrl ? 'flex' : 'none';
      }
    } else {
      if (lightboxVideoWrap) lightboxVideoWrap.style.display = 'none';
      if (lightboxActions) lightboxActions.style.display = 'none';

      if (img && lightboxImage) {
        lightboxImage.src = img.src;
        lightboxImage.alt = title;
        lightboxImage.style.display = 'block';
      } else if (lightboxImage) {
        lightboxImage.style.display = 'none';
      }

      if (video && lightboxVideo) {
        lightboxVideo.src = video.querySelector('source')?.src || '';
        lightboxVideo.style.display = 'block';
        lightboxVideo.load();
        lightboxVideo.play().catch(() => {});
      } else if (lightboxVideo) {
        lightboxVideo.style.display = 'none';
      }

      if (iframe && lightboxIframe) {
        lightboxIframe.src = iframe.src;
        lightboxIframe.style.display = 'block';
      } else if (lightboxIframe) {
        lightboxIframe.removeAttribute('src');
        lightboxIframe.style.display = 'none';
      }
    }

    lightbox.classList.add('active');
    document.body.classList.add('lightbox-open');
  };

  galleryItems.forEach(item => {
    item.addEventListener('click', (event) => {
      if (event.target.closest('a, button')) return;
      openLightbox(item);
    });
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        if (event.target.closest('a, button')) return;
        event.preventDefault();
        openLightbox(item);
      }
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

// ==========================================================================
// 3D COVERFLOW GLASSMORPHISM CAROUSEL INITIALIZATION
// ==========================================================
function initGlassCarousel() {
  const stage = document.getElementById('carousel-stage');
  const track = document.getElementById('carousel-track');
  const items = Array.from(document.querySelectorAll('.gallery-grid [data-gallery-item]'));
  if (!stage || !track || !items.length) return;

  track.innerHTML = '';
  const total = items.length;

  items.forEach((item, index) => {
    const title = item.dataset.title || item.querySelector('h3')?.textContent || `Piece 0${index + 1}`;
    const text = item.dataset.text || item.querySelector('p')?.textContent || '';
    const img = item.querySelector('img');
    const imgSrc = img ? img.src : (item.querySelector('video')?.poster || '');
    const tag = item.querySelector('.gallery-badge')?.textContent || 'Gallery';
    const num = String(index + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
    const isVideo = item.classList.contains('gallery-item--video') || !!item.dataset.videoUrl;
    const playBadge = isVideo ? '<div class="glass-card-3d__play-pill"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7z"/></svg><span>Video</span></div>' : '';

    const card = document.createElement('div');
    card.className = 'glass-card-3d';
    card.dataset.index = index;
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `${title} (${num})`);

    card.innerHTML = `
      <div class="glass-card-3d__media">
        <img src="${imgSrc}" alt="${title}" loading="lazy">
        ${playBadge}
        <div class="glass-card-3d__top-row">
          <span class="glass-card-3d__expand-badge">Expand ⤢</span>
          <span class="glass-card-3d__menu-icon">···</span>
        </div>
      </div>
      <div class="glass-card-3d__body">
        <div class="glass-card-3d__header">
          <h3 class="glass-card-3d__title">${title}</h3>
          <span class="glass-card-3d__counter">${num}</span>
        </div>
        <p class="glass-card-3d__desc">${text}</p>
        <div class="glass-card-3d__meta">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <span>${tag}</span>
        </div>
      </div>
    `;

    track.appendChild(card);
  });

  const cards = Array.from(track.querySelectorAll('.glass-card-3d'));
  let activeIndex = 0;
  let autoplayTimer = null;
  let isAutoplaying = false;

  function updatePositions() {
    const isMobile = window.innerWidth <= 768;

    cards.forEach((card, i) => {
      let diff = i - activeIndex;
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;

      const absDiff = Math.abs(diff);

      if (isMobile) {
        // MOBILE VIEW: Exactly ONE card fits the exact view.
        // No sideways offset, no cards translated off-screen, completely eliminating canvas blowout and horizontal scroll.
        if (absDiff === 0) {
          card.style.transform = 'translate3d(0, 0, 0) scale(1)';
          card.style.zIndex = '10';
          card.style.opacity = '1';
          card.style.visibility = 'visible';
          card.style.display = 'flex';
          card.style.filter = 'brightness(1) blur(0px)';
          card.classList.add('is-active');
          card.style.pointerEvents = 'auto';
        } else {
          card.style.transform = 'translate3d(0, 0, -80px) scale(0.92)';
          card.style.zIndex = '1';
          card.style.opacity = '0';
          card.style.visibility = 'hidden';
          card.style.display = 'none';
          card.style.filter = 'brightness(0.3) blur(2px)';
          card.classList.remove('is-active');
          card.style.pointerEvents = 'none';
        }
      } else {
        // DESKTOP VIEW: Full 3D Coverflow with angled peek cards
        if (absDiff === 0) {
          card.style.transform = 'translate3d(0, 0, 0) rotateY(0deg) scale(1)';
          card.style.zIndex = '10';
          card.style.opacity = '1';
          card.style.visibility = 'visible';
          card.style.display = 'flex';
          card.style.filter = 'brightness(1) blur(0px)';
          card.classList.add('is-active');
          card.style.pointerEvents = 'auto';
        } else if (absDiff === 1) {
          const sign = Math.sign(diff);
          card.style.transform = `translate3d(${sign * 185}px, 0, -110px) rotateY(${-sign * 24}deg) scale(0.86)`;
          card.style.zIndex = '8';
          card.style.opacity = '0.8';
          card.style.visibility = 'visible';
          card.style.display = 'flex';
          card.style.filter = 'brightness(0.82) blur(0.5px)';
          card.classList.remove('is-active');
          card.style.pointerEvents = 'auto';
        } else if (absDiff === 2) {
          const sign = Math.sign(diff);
          card.style.transform = `translate3d(${sign * 295}px, 0, -195px) rotateY(${-sign * 32}deg) scale(0.74)`;
          card.style.zIndex = '6';
          card.style.opacity = '0.42';
          card.style.visibility = 'visible';
          card.style.display = 'flex';
          card.style.filter = 'brightness(0.6) blur(1.5px)';
          card.classList.remove('is-active');
          card.style.pointerEvents = 'auto';
        } else {
          card.style.transform = 'translate3d(0, 0, -300px) scale(0.4)';
          card.style.zIndex = '1';
          card.style.opacity = '0';
          card.style.visibility = 'hidden';
          card.style.display = 'none';
          card.style.filter = 'brightness(0.2) blur(4px)';
          card.classList.remove('is-active');
          card.style.pointerEvents = 'none';
        }
      }
    });

    const activeItem = items[activeIndex];
    const activeCard = cards[activeIndex];
    if (!activeItem || !activeCard) return;

    const thumbImg = activeCard.querySelector('.glass-card-3d__media img')?.src || '';
    const titleText = activeItem.dataset.title || activeItem.querySelector('h3')?.textContent || '';
    const countBadge = String(activeIndex + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');

    const pillThumb = document.getElementById('pill-thumb');
    const pillTitle = document.getElementById('pill-title');
    const pillBadge = document.getElementById('pill-badge');
    const pillHeartBtn = document.getElementById('pill-heart-btn');
    const pillLikesCount = document.getElementById('pill-likes-count');

    if (pillThumb) pillThumb.src = thumbImg;
    if (pillTitle) pillTitle.textContent = titleText;
    if (pillBadge) pillBadge.textContent = countBadge;

    const storageKey = 'solo_like_' + (activeItem.dataset.title || activeIndex);
    const isLiked = localStorage.getItem(storageKey) === 'true';
    if (pillHeartBtn) {
      pillHeartBtn.classList.toggle('liked', isLiked);
      const baseLikes = 20 + ((activeIndex * 7) % 35);
      if (pillLikesCount) pillLikesCount.textContent = isLiked ? String(baseLikes + 1) : String(baseLikes);
    }
  }

  function goTo(index) {
    activeIndex = (index + total) % total;
    updatePositions();
  }

  cards.forEach((card, i) => {
    card.addEventListener('click', () => {
      if (i === activeIndex) {
        if (typeof openLightbox === 'function') openLightbox(items[i]);
      } else {
        goTo(i);
      }
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (i === activeIndex) {
          if (typeof openLightbox === 'function') openLightbox(items[i]);
        } else {
          goTo(i);
        }
      }
    });
  });

  // Carousel Navigation Buttons (Side-by-side circular buttons)
  document.getElementById('pill-prev-btn')?.addEventListener('click', () => goTo(activeIndex - 1));
  document.getElementById('pill-next-btn')?.addEventListener('click', () => goTo(activeIndex + 1));

  // Grid View Navigation Buttons (Side-by-side circular buttons)
  let activeGridIndex = 0;
  function navigateGrid(delta) {
    const gridCards = Array.from(document.querySelectorAll('.gallery-grid [data-gallery-item]'));
    if (!gridCards.length) return;
    
    gridCards.forEach(c => c.classList.remove('grid-card-highlight'));
    activeGridIndex = (activeGridIndex + delta + gridCards.length) % gridCards.length;
    const targetCard = gridCards[activeGridIndex];
    if (targetCard) {
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      targetCard.focus();
      targetCard.classList.add('grid-card-highlight');
      setTimeout(() => targetCard.classList.remove('grid-card-highlight'), 1200);

      // Keep carousel in sync
      activeIndex = activeGridIndex;
      updatePositions();
    }
  }

  document.getElementById('grid-prev-btn')?.addEventListener('click', () => navigateGrid(-1));
  document.getElementById('grid-next-btn')?.addEventListener('click', () => navigateGrid(1));

  document.getElementById('pill-expand-btn')?.addEventListener('click', () => {
    if (typeof openLightbox === 'function') openLightbox(items[activeIndex]);
  });
  document.getElementById('pill-track-info')?.addEventListener('click', () => {
    if (typeof openLightbox === 'function') openLightbox(items[activeIndex]);
  });

  const playBtn = document.getElementById('pill-play-btn');
  const iconPlay = playBtn?.querySelector('.icon-play');
  const iconPause = playBtn?.querySelector('.icon-pause');

  function toggleAutoplay() {
    isAutoplaying = !isAutoplaying;
    if (isAutoplaying) {
      if (iconPlay) iconPlay.style.display = 'none';
      if (iconPause) iconPause.style.display = 'block';
      autoplayTimer = setInterval(() => goTo(activeIndex + 1), 3500);
    } else {
      if (iconPlay) iconPlay.style.display = 'block';
      if (iconPause) iconPause.style.display = 'none';
      clearInterval(autoplayTimer);
    }
  }
  playBtn?.addEventListener('click', toggleAutoplay);

  document.getElementById('pill-heart-btn')?.addEventListener('click', () => {
    const activeItem = items[activeIndex];
    const storageKey = 'solo_like_' + (activeItem.dataset.title || activeIndex);
    const currentlyLiked = localStorage.getItem(storageKey) === 'true';
    localStorage.setItem(storageKey, (!currentlyLiked).toString());
    updatePositions();
  });

  let startX = 0;
  let startY = 0;
  let isDragging = false;

  stage.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    startY = e.clientY;
    isDragging = true;
  });
  window.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const diffX = e.clientX - startX;
    const diffY = e.clientY - startY;
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) goTo(activeIndex - 1);
      else goTo(activeIndex + 1);
    }
  });

  stage.addEventListener('touchstart', (e) => {
    if (!e.touches || !e.touches[0]) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    if (!e.changedTouches || !e.changedTouches[0]) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = endX - startX;
    const diffY = endY - startY;
    if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) goTo(activeIndex - 1);
      else goTo(activeIndex + 1);
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    updatePositions();
  });

  window.addEventListener('keydown', (e) => {
    if (lightbox?.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') goTo(activeIndex - 1);
    if (e.key === 'ArrowRight') goTo(activeIndex + 1);
  });

  const carouselSection = document.getElementById('glass-carousel-section');
  const gridSection = document.querySelector('.gallery-grid');
  const btnCarousel = document.getElementById('view-btn-carousel');
  const btnGrid = document.getElementById('view-btn-grid');

  function setView(view) {
    if (view === 'grid') {
      carouselSection?.classList.remove('view-active');
      carouselSection?.classList.add('view-hidden');
      
      gridSection?.classList.remove('view-hidden');
      gridSection?.classList.add('view-active');
      
      btnGrid?.classList.add('active');
      btnGrid?.setAttribute('aria-selected', 'true');
      btnCarousel?.classList.remove('active');
      btnCarousel?.setAttribute('aria-selected', 'false');
      localStorage.setItem('solo_gallery_view', 'grid');
      activeGridIndex = activeIndex;

      // Stagger subtle entrance for grid cards
      const gridCards = gridSection?.querySelectorAll('.gallery-item');
      gridCards?.forEach((card, idx) => {
        card.style.animation = `fadeSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.04}s both`;
      });
    } else {
      gridSection?.classList.remove('view-active');
      gridSection?.classList.add('view-hidden');
      
      carouselSection?.classList.remove('view-hidden');
      carouselSection?.classList.add('view-active');
      
      btnCarousel?.classList.add('active');
      btnCarousel?.setAttribute('aria-selected', 'true');
      btnGrid?.classList.remove('active');
      btnGrid?.setAttribute('aria-selected', 'false');
      localStorage.setItem('solo_gallery_view', 'carousel');
      activeIndex = activeGridIndex;
      
      requestAnimationFrame(() => updatePositions());
    }
  }

  btnCarousel?.addEventListener('click', () => setView('carousel'));
  btnGrid?.addEventListener('click', () => setView('grid'));

  // Default to carousel view whenever gallery is opened or pressed
  const urlParams = new URLSearchParams(window.location.search);
  const requestedView = urlParams.get('view');
  const defaultView = requestedView === 'grid' ? 'grid' : 'carousel';
  setView(defaultView);

  window.addEventListener('resize', updatePositions);
  updatePositions();
}

// Run carousel initialization on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGlassCarousel);
} else {
  initGlassCarousel();
}
