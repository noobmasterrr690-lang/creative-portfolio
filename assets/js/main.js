/**
 * SOLO.C — PORTFOLIO INTERACTION ENGINE
 */

document.addEventListener("DOMContentLoaded", () => {
  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

  /* ==========================================================================
     0. BOOT SEQUENCE
     ========================================================================== */
  const bootOverlay = document.getElementById('boot-overlay');
  const bootBarFill = document.getElementById('boot-bar-fill');
  const bootPct = document.getElementById('boot-pct');
  
  if (bootOverlay) {
    if (sessionStorage.getItem('solo_boot_seen') === '1' || window.location.search.includes('noboot') || navigator.webdriver) {
      bootOverlay.remove();
      document.body.style.overflow = '';
    } else {
      sessionStorage.setItem('solo_boot_seen', '1');
      document.body.style.overflow = 'hidden';

      // Safety failsafe: ensure overlay unlocks and dismisses even if tab throttles
      setTimeout(() => {
        if (bootOverlay && !bootOverlay.classList.contains('hidden')) {
          bootOverlay.classList.add('hidden');
          document.body.style.overflow = '';
          setTimeout(() => {
            if (bootOverlay.parentNode) bootOverlay.remove();
          }, 750);
        }
      }, 4200);
    
    const BOOT_LINES = [
      '> SOLO.C CREATIVE OS v9.9.0',
      '> LOADING ASSETS... [PIXEL ART ENGINE]',
      '> CAT COMPANION... SYNCED',
      '> WELCOME, PLAYER_01'
    ];
    
    let lineIdx = 0;
    
    const typeLine = (lineStr, elId, onComplete) => {
      const el = document.getElementById(elId);
      if (!el) {
        if (onComplete) onComplete();
        return;
      }
      let charIdx = 0;
      const typeChar = () => {
        if (charIdx < lineStr.length) {
          el.textContent += lineStr.charAt(charIdx);
          charIdx++;
          setTimeout(typeChar, 35);
        } else {
          if (onComplete) setTimeout(onComplete, 100);
        }
      };
      typeChar();
    };

    const runTypewriter = () => {
      if (lineIdx < BOOT_LINES.length) {
        typeLine(BOOT_LINES[lineIdx], `boot-line-${lineIdx + 1}`, () => {
          lineIdx++;
          runTypewriter();
        });
      }
    };
    
    runTypewriter();

    let progress = 0;
    const progressDuration = 2800; 
    const progressInterval = 50; 
    const increment = 100 / (progressDuration / progressInterval);
    
    const barInterval = setInterval(() => {
      progress += increment;
      if (progress >= 100) {
        progress = 100;
        clearInterval(barInterval);
        
        setTimeout(() => {
          bootOverlay.classList.add('hidden');
          document.body.style.overflow = '';
          setTimeout(() => {
            if (bootOverlay.parentNode) bootOverlay.remove();
          }, 750);
        }, 350);
      }
      if (bootBarFill) bootBarFill.style.width = `${progress}%`;
      if (bootPct) bootPct.textContent = `${Math.floor(progress)}%`;
    }, progressInterval);
    }
  }

  /* ==========================================================================
     1. NAVIGATION & DYNAMIC ISLAND HEADER
     ========================================================================== */
  const header = document.getElementById("header");
  const navMenu = document.getElementById("nav-menu");
  const navToggle = document.getElementById("nav-toggle");
  const navClose = document.getElementById("nav-close");
  const navBackdrop = document.getElementById("nav-backdrop");
  const navLinks = document.querySelectorAll(".nav__link");

  const openNavMenu = () => {
    if (!navMenu) return;
    navMenu.classList.add("show-menu");
    if (navBackdrop) navBackdrop.classList.add("show-backdrop");
    document.body.style.overflow = "hidden";
  };

  const closeNavMenu = () => {
    if (!navMenu) return;
    navMenu.classList.remove("show-menu");
    if (navBackdrop) navBackdrop.classList.remove("show-backdrop");
    document.body.style.overflow = "";
  };

  if (navToggle) {
    navToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      if (navMenu && navMenu.classList.contains("show-menu")) {
        closeNavMenu();
      } else {
        openNavMenu();
      }
    });
  }

  if (navClose) {
    navClose.addEventListener("click", (e) => {
      e.stopPropagation();
      closeNavMenu();
    });
  }

  if (navBackdrop) {
    navBackdrop.addEventListener("click", closeNavMenu);
  }

  navLinks.forEach(link => {
    link.addEventListener("click", closeNavMenu);
  });

  const menuCta = document.querySelector(".nav__menu-cta");
  if (menuCta) {
    menuCta.addEventListener("click", closeNavMenu);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu && navMenu.classList.contains("show-menu")) {
      closeNavMenu();
    }
  });

  document.addEventListener("click", (e) => {
    if (navMenu && navMenu.classList.contains("show-menu")) {
      if (!navMenu.contains(e.target) && e.target !== navToggle && !navToggle.contains(e.target)) {
        closeNavMenu();
      }
    }
  });

  const handleScrollHeader = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY >= 35);
  };
  window.addEventListener("scroll", handleScrollHeader, { passive: true });
  handleScrollHeader();

  const sections = document.querySelectorAll("section[id]");
  const handleActiveNav = () => {
    const scrollY = window.scrollY + 180;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute("id");
      const activeNav = document.querySelector(`.nav__link[href*="#${sectionId}"]`);
      if (activeNav) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          activeNav.classList.add("active-link");
        } else {
          activeNav.classList.remove("active-link");
        }
      }
    });
  };
  window.addEventListener("scroll", handleActiveNav, { passive: true });
  handleActiveNav();

  /* ==========================================================================
     2. SOFT CUSTOM CURSOR
     ========================================================================== */
  if (isFinePointer && !isReducedMotion && !isCoarsePointer) {
    const dot = document.createElement("div");
    const ring = document.createElement("div");
    dot.className = "custom-cursor-dot";
    ring.className = "custom-cursor-ring";
    document.body.append(dot, ring);

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    const moveCursor = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      if (clientX !== undefined && clientY !== undefined) {
        mouseX = clientX;
        mouseY = clientY;
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
    };
    
    window.addEventListener("mousemove", moveCursor, { passive: true });
    window.addEventListener("touchmove", moveCursor, { passive: true });

    const renderCursor = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);

    const interactiveSelectors = "a, button, .tilt-card, input, textarea, select, .filter-pill";
    document.querySelectorAll(interactiveSelectors).forEach(el => {
      el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
      el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
      el.addEventListener("touchstart", () => document.body.classList.add("cursor-hover"), { passive: true });
      el.addEventListener("touchend", () => document.body.classList.remove("cursor-hover"));
    });
  }

  /* ==========================================================================
     3. 3D CARD TILT & CURSOR SPOTLIGHT GLOW
     ========================================================================== */
  if (isFinePointer && !isReducedMotion && !isCoarsePointer) {
    const tiltCards = document.querySelectorAll(".tilt-card, .tilt-button");

    tiltCards.forEach(card => {
      const moveTilt = (e) => {
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        if (clientX === undefined || clientY === undefined) return;

        const rect = card.getBoundingClientRect();
        const cardX = clientX - rect.left;
        const cardY = clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((cardY - centerY) / centerY) * -6; 
        const rotateY = ((cardX - centerX) / centerX) * 6;  

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
        card.style.setProperty("--card-mouse-x", `${((cardX / rect.width) * 100).toFixed(1)}%`);
        card.style.setProperty("--card-mouse-y", `${((cardY / rect.height) * 100).toFixed(1)}%`);
      };

      card.addEventListener("mousemove", moveTilt, { passive: true });
      card.addEventListener("touchmove", moveTilt, { passive: true });

      const resetTilt = () => {
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
      };
      
      card.addEventListener("mouseleave", resetTilt);
      card.addEventListener("touchend", resetTilt);
    });
  }

  /* ==========================================================================
     4. INTERACTIVE 8-BIT CAT MASCOT & COMPANION
     ========================================================================== */
  const catStage = document.getElementById("cat-stage");
  const catAvatar = document.querySelector(".cat-avatar");
  const catMoodVal = document.getElementById("cat-mood-val");
  const catDialogue = document.getElementById("cat-dialogue");
  const catReactions = document.getElementById("cat-reactions");
  const podPetBtn = document.getElementById("pod-pet-action");
  const navCat = document.getElementById("nav-cat");

  if (!isReducedMotion) {
    const pupils = document.querySelectorAll(".cat-pupil");

    const movePupils = (e) => {
      if (!catAvatar) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      if (clientX === undefined || clientY === undefined) return;

      const rect = catAvatar.getBoundingClientRect();
      const catCenterX = rect.left + rect.width / 2;
      const catCenterY = rect.top + rect.height * 0.45;

      const deltaX = clientX - catCenterX;
      const deltaY = clientY - catCenterY;
      const distance = Math.hypot(deltaX, deltaY);

      const maxOffset = 2.5;
      const lookX = Math.max(-maxOffset, Math.min(maxOffset, (deltaX / Math.max(distance, 1)) * maxOffset));
      const lookY = Math.max(-maxOffset, Math.min(maxOffset, (deltaY / Math.max(distance, 1)) * maxOffset));

      pupils.forEach(pupil => {
        pupil.style.transform = `translate(${lookX}px, ${lookY}px)`;
      });
    };
    
    window.addEventListener("mousemove", movePupils, { passive: true });
    window.addEventListener("touchmove", movePupils, { passive: true });
  }


  const petQuotes = [
    "\"Purr... you're awesome!\"",
    "\"Level 99 creativity unlocked!\"",
    "\"Let's build something epic!\"",
    "\"Thanks for stopping by! 🐾\"",
    "\"High score in aesthetic vibes!\"",
    "\"Purr... ready for the next quest!\""
  ];

  const petMoods = ["PURRING", "HAPPY", "LOVED", "ECSTATIC", "INSPIRED"];

  const triggerCatPet = (e) => {
    if (e && e.type === "touchstart") {
      e.preventDefault();
    }
    if (!catAvatar) return;

    catAvatar.classList.remove("is-petting");
    void catAvatar.offsetWidth; 
    catAvatar.classList.add("is-petting");

    if (catReactions) {
      const heart = document.createElement("span");
      heart.className = "floating-heart ri-heart-3-fill";
      heart.style.left = `${40 + Math.random() * 20}%`;
      heart.style.top = `${30 + Math.random() * 20}%`;
      catReactions.appendChild(heart);

      setTimeout(() => heart.remove(), 1400);
    }

    if (catMoodVal) {
      const randomMood = petMoods[Math.floor(Math.random() * petMoods.length)];
      catMoodVal.textContent = randomMood;
    }

    if (catDialogue) {
      const randomQuote = petQuotes[Math.floor(Math.random() * petQuotes.length)];
      const pixelSpan = catDialogue.querySelector(".cat-dialogue__pixel");
      if (pixelSpan) pixelSpan.textContent = randomQuote;
      catDialogue.style.transform = "scale(1.08)";
      setTimeout(() => {
        if (catDialogue) catDialogue.style.transform = "scale(1)";
      }, 300);
    }
  };

  if (catStage) {
    catStage.addEventListener("click", triggerCatPet);
    catStage.addEventListener("touchstart", triggerCatPet, { passive: false });
  }
  if (podPetBtn) {
    podPetBtn.addEventListener("click", triggerCatPet);
    podPetBtn.addEventListener("touchstart", triggerCatPet, { passive: false });
  }

  if (navCat) {
    navCat.addEventListener("click", triggerCatPet);
    navCat.addEventListener("touchstart", triggerCatPet, { passive: false });
  }

  /* ==========================================================================
     4B. DUAL-SIDED 3D CARD FLIPPER & BUSINESS CARD DYNAMICS
     ========================================================================== */
  const cardFlipper = document.getElementById("card-flipper");
  const flipToBackBtn = document.getElementById("flip-to-back-btn");
  const flipToFrontBtn = document.getElementById("flip-to-front-btn");
  const bcardLiveClock = document.getElementById("bcard-live-clock");
  const bcardCopyBtn = document.getElementById("bcard-copy-btn");
  const bcardCopyStatus = document.getElementById("bcard-copy-status");
  const bcardEmailVal = document.getElementById("bcard-email-val");
  const bcardCatEmblem = document.getElementById("bcard-cat-emblem");
  const businessCard = document.getElementById("business-card");

  // Flip Card Actions
  const flipCard = (shouldFlip) => {
    if (!cardFlipper) return;
    if (shouldFlip) {
      cardFlipper.classList.add("is-flipped");
    } else {
      cardFlipper.classList.remove("is-flipped");
    }
  };

  if (flipToBackBtn) {
    flipToBackBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      flipCard(true);
    });
  }

  if (flipToFrontBtn) {
    flipToFrontBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      flipCard(false);
    });
  }

  // Live Manila Time Clock (GMT+8)
  const updateManilaClock = () => {
    if (!bcardLiveClock) return;
    try {
      const now = new Date();
      const options = {
        timeZone: "Asia/Manila",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      };
      bcardLiveClock.textContent = new Intl.DateTimeFormat("en-US", options).format(now);
    } catch (e) {
      bcardLiveClock.textContent = new Date().toLocaleTimeString();
    }
  };

  updateManilaClock();
  setInterval(updateManilaClock, 1000);

  // Business Card One-Click Email Copy
  if (bcardCopyBtn && bcardEmailVal) {
    bcardCopyBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const email = bcardEmailVal.textContent.trim();
      try {
        await navigator.clipboard.writeText(email);
        if (bcardCopyStatus) bcardCopyStatus.textContent = "Copied!";
        bcardCopyBtn.style.background = "var(--accent-primary)";
        bcardCopyBtn.style.color = "var(--text-inverse)";
        setTimeout(() => {
          if (bcardCopyStatus) bcardCopyStatus.textContent = "Copy";
          bcardCopyBtn.style.background = "";
          bcardCopyBtn.style.color = "";
        }, 2000);
      } catch (err) {
        window.location.href = `mailto:${email}`;
      }
    });
  }

  // Interactive 8-Bit Cat Mascot Emblem on Business Card
  if (bcardCatEmblem) {
    bcardCatEmblem.addEventListener("click", (e) => {
      e.stopPropagation();
      triggerCatPet(e);
      bcardCatEmblem.style.transform = "scale(1.18) rotate(-4deg)";
      setTimeout(() => {
        bcardCatEmblem.style.transform = "";
      }, 300);
    });
  }

  // Dynamic Foil Sheen Tracking
  if (businessCard && isFinePointer && !isReducedMotion && !isCoarsePointer) {
    businessCard.addEventListener("mousemove", (e) => {
      const rect = businessCard.getBoundingClientRect();
      const xPct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
      const yPct = Math.round(((e.clientY - rect.top) / rect.height) * 100);
      businessCard.style.setProperty("--bcard-sheen-x", `${xPct}%`);
      businessCard.style.setProperty("--bcard-sheen-y", `${yPct}%`);
    }, { passive: true });

    businessCard.addEventListener("mouseleave", () => {
      businessCard.style.setProperty("--bcard-sheen-x", "50%");
      businessCard.style.setProperty("--bcard-sheen-y", "40%");
    });
  }

  /* ==========================================================================
     5. HOLO-POD CANVAS PARTICLES
     ========================================================================== */
  const holoCanvas = document.querySelector(".holo-pod__particles");
  if (holoCanvas && !isReducedMotion) {
    const ctx = holoCanvas.getContext("2d");
    let podWidth = 0;
    let podHeight = 0;
    const particleCount = 28;
    const particles = [];

    const resizeHolo = () => {
      podWidth = holoCanvas.clientWidth;
      podHeight = holoCanvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      holoCanvas.width = podWidth * dpr;
      holoCanvas.height = podHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    class HoloParticle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * podWidth;
        this.y = Math.random() * podHeight;
        this.size = Math.random() > 0.8 ? 3 : 2;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = -0.3 - Math.random() * 0.5;
        this.opacity = 0.1 + Math.random() * 0.5;
        this.color = Math.random() > 0.4 ? "0, 245, 155" : "56, 189, 248";
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.y < -5 || this.x < 0 || this.x > podWidth) {
          this.reset();
          this.y = podHeight + 5;
        }
      }
      draw() {
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.fillRect(Math.round(this.x), Math.round(this.y), this.size, this.size);
      }
    }

    resizeHolo();
    for (let i = 0; i < particleCount; i++) {
      particles.push(new HoloParticle());
    }

    window.addEventListener("resize", resizeHolo);

    const animateHolo = () => {
      ctx.clearRect(0, 0, podWidth, podHeight);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateHolo);
    };
    requestAnimationFrame(animateHolo);
  }

  /* ==========================================================================
     6. STORY COMPANION HUD: WALKING CAT PROGRESS & MILESTONES
     ========================================================================== */
  const scrollCompanion = document.getElementById("scroll-companion");
  const scrollProgressFill = document.getElementById("scroll-progress-fill");
  const scrollCat = document.getElementById("scroll-cat");
  const scrollUp = document.getElementById("scroll-up");
  const scrollPctDisplay = document.getElementById("scroll-pct-display");
  const scrollBubble = document.getElementById("scroll-bubble");
  const bubbleText = document.getElementById("bubble-text");
  const chapterPips = document.querySelectorAll(".chapter-pip");

  const storySections = ["home", "work", "services", "skills", "about", "contact"];
  let currentActiveChapter = "home";

  const handleStoryScroll = () => {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (totalScroll <= 0) return;

    const scrollFraction = Math.min(1, Math.max(0, window.scrollY / totalScroll));
    const percent = Math.min(100, Math.max(0, Math.round(scrollFraction * 100)));

    if (scrollProgressFill) {
      scrollProgressFill.style.height = `${scrollFraction * 100}%`;
    }
    if (scrollCat) {
      scrollCat.style.top = `${scrollFraction * 100}%`;
    }
    if (scrollPctDisplay) {
      scrollPctDisplay.textContent = `${String(percent).padStart(2, "0")}%`;
    }

    if (scrollUp) {
      scrollUp.classList.toggle("show-scroll", window.scrollY >= 450);
    }

    // Story Chapter Detection
    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    let detectedChapter = "home";

    for (let i = storySections.length - 1; i >= 0; i--) {
      const secEl = document.getElementById(storySections[i]);
      if (secEl && secEl.offsetTop <= scrollPos) {
        detectedChapter = storySections[i];
        break;
      }
    }

    if (detectedChapter !== currentActiveChapter) {
      currentActiveChapter = detectedChapter;

      // Companion Speech Bubble
      const storyBubbles = {
        home: "Ready for the quest? 🐾",
        work: "Vault unlocked! 🎨",
        services: "Systems & craft! ⚡",
        skills: "Inventory full! 🎒",
        about: "Reading lore... 📜",
        contact: "Send a signal! 📡"
      };

      if (bubbleText && storyBubbles[currentActiveChapter]) {
        bubbleText.textContent = storyBubbles[currentActiveChapter];
        if (scrollBubble) {
          scrollBubble.style.transform = "translateY(-50%) scale(1.08)";
          setTimeout(() => {
            scrollBubble.style.transform = "translateY(-50%) scale(1)";
          }, 200);
        }
      }

      // Rail Chapter Pips
      chapterPips.forEach(pip => {
        pip.classList.toggle("active", pip.getAttribute("data-target") === currentActiveChapter);
      });
    }
  };

  window.addEventListener("scroll", handleStoryScroll, { passive: true });
  handleStoryScroll();

  if (scrollUp) {
    scrollUp.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Rail Milestone Pips Interaction
  chapterPips.forEach(pip => {
    pip.addEventListener("click", (e) => {
      e.stopPropagation();
      const targetId = pip.getAttribute("data-target");
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Walking Cat Easter Eggs & Pop reaction
  if (scrollCat) {
    const companionEasterEggs = [
      "Purr! +50 EXP Gained! ✨",
      "Level 99 Aesthetic! 🎮",
      "Secret quest unlocked! 🗝️",
      "Best duo in the galaxy! 🐾",
      "Speedrun mode enabled! ⚡",
      "Meow! Let's build the future!"
    ];
    let lastEggIdx = -1;

    scrollCat.addEventListener("click", (e) => {
      e.stopPropagation();

      const catImg = scrollCat.querySelector(".scroll-cat__img");
      if (catImg) {
        catImg.classList.remove("scroll-cat-pop");
        void catImg.offsetWidth;
        catImg.classList.add("scroll-cat-pop");
      }

      let nextIdx;
      do {
        nextIdx = Math.floor(Math.random() * companionEasterEggs.length);
      } while (nextIdx === lastEggIdx && companionEasterEggs.length > 1);
      lastEggIdx = nextIdx;

      if (bubbleText) {
        bubbleText.textContent = companionEasterEggs[nextIdx];
        if (scrollBubble) {
          scrollBubble.style.transform = "translateY(-50%) scale(1.15)";
          setTimeout(() => {
            scrollBubble.style.transform = "translateY(-50%) scale(1)";
          }, 220);
        }
      }

      // Heart burst from cat on rail
      if (catReactions) {
        const heart = document.createElement("span");
        heart.className = "floating-heart ri-heart-3-fill";
        heart.style.position = "fixed";
        const catRect = scrollCat.getBoundingClientRect();
        heart.style.left = `${catRect.left}px`;
        heart.style.top = `${catRect.top - 12}px`;
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1200);
      }
    });
  }

  /* ==========================================================================
     7. TYPED.JS DYNAMIC ROLE DISPLAY
     ========================================================================== */
  if (window.Typed && document.getElementById("home-typed")) {
    new Typed("#home-typed", {
      strings: [
        "Multimedia Artist",
        "Digital Product Designer",
        "UI/UX Architect",
        "8-Bit Character Creator",
        "Brand Storyteller"
      ],
      typeSpeed: 55,
      backSpeed: 30,
      backDelay: 1600,
      loop: true,
      showCursor: true,
      cursorChar: "_"
    });
  }

  /* ==========================================================================
     8. SWIPER CAROUSELS & CATEGORY FILTERING
     ========================================================================== */
  let workSwiper = null;

  if (window.Swiper) {
    workSwiper = new Swiper(".work__swiper", {
      slidesPerView: 1.15,
      spaceBetween: 18,
      grabCursor: true,
      loop: false,
      navigation: {
        nextEl: ".work__next",
        prevEl: ".work__prev"
      },
      pagination: {
        el: ".work__pagination",
        clickable: true
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 20
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 24
        }
      }
    });

    const filterPills = document.querySelectorAll(".filter-pill");
    const workCards = document.querySelectorAll(".work-card");

    filterPills.forEach(pill => {
      pill.addEventListener("click", () => {
        filterPills.forEach(p => {
          p.classList.remove("active");
          p.setAttribute("aria-selected", "false");
        });
        pill.classList.add("active");
        pill.setAttribute("aria-selected", "true");

        const selectedCategory = pill.getAttribute("data-filter");

        workCards.forEach(card => {
          const cardCategory = card.getAttribute("data-category");
          if (selectedCategory === "all" || cardCategory === selectedCategory) {
            card.style.display = "";
          } else {
            card.style.display = "none";
          }
        });

        if (workSwiper) {
          workSwiper.update();
          workSwiper.slideTo(0, 300);
        }
      });
    });

    new Swiper(".testimonial__swiper", {
      slidesPerView: 1.15,
      spaceBetween: 20,
      grabCursor: true,
      loop: true,
      navigation: {
        nextEl: ".test__next",
        prevEl: ".test__prev"
      },
      pagination: {
        el: ".testimonial__pagination",
        clickable: true
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 24
        },
        1100: {
          slidesPerView: 3,
          spaceBetween: 24
        }
      }
    });
  }

  /* ==========================================================================
     8B. FEATURED CREATIONS — 3D COVERFLOW GLASSMORPHISM CAROUSEL
     ========================================================================== */
  function initFeaturedCreations3DCarousel() {
    const stage = document.getElementById("work-carousel-stage");
    const track = document.getElementById("work-carousel-track");
    const cards = Array.from(track ? track.querySelectorAll(".glass-card-3d") : []);
    const prevBtn = document.getElementById("work-prev-btn");
    const nextBtn = document.getElementById("work-next-btn");
    const playBtn = document.getElementById("work-play-btn");
    const heartBtn = document.getElementById("work-heart-btn");
    const likesCount = document.getElementById("work-likes-count");
    const expandBtn = document.getElementById("work-expand-btn");
    const pillTrackInfo = document.getElementById("work-track-info");
    const pillThumb = document.getElementById("work-pill-thumb");
    const pillTitle = document.getElementById("work-pill-title");
    const pillBadge = document.getElementById("work-pill-badge");
    const carouselSection = document.getElementById("work-carousel-section");
    const shelfWrapper = document.getElementById("work-shelf-wrapper");
    const btnCarousel = document.getElementById("work-btn-carousel");
    const btnShelf = document.getElementById("work-btn-shelf");

    if (!stage || !track || cards.length === 0) return;

    let activeIndex = 0;
    let autoplayInterval = null;
    let isPlaying = false;

    function getWrappedOffset(idx, current, count) {
      let diff = (idx - current) % count;
      if (diff > count / 2) diff -= count;
      if (diff < -count / 2) diff += count;
      return diff;
    }

    function updatePositions() {
      const isMobile = window.innerWidth <= 768;
      const stepX = isMobile ? 120 : 210;
      const stepZ = isMobile ? 110 : 160;
      const maxRotate = isMobile ? 26 : 38;

      cards.forEach((card, i) => {
        const offset = getWrappedOffset(i, activeIndex, cards.length);
        const absOffset = Math.abs(offset);
        const sign = Math.sign(offset);

        const rotateY = -sign * Math.min(absOffset * 18, maxRotate);
        const translateX = offset * stepX;
        const translateZ = -absOffset * stepZ;
        const scale = absOffset === 0 ? 1 : Math.max(0.72, 1 - absOffset * 0.12);
        const opacity = absOffset === 0 ? 1 : (absOffset === 1 ? 0.78 : (absOffset === 2 ? 0.35 : 0));
        const zIndex = 20 - Math.round(absOffset * 4);
        const blur = absOffset === 0 ? 0 : Math.min(absOffset * 2.5, 6);

        card.style.transform = `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
        card.style.opacity = opacity;
        card.style.zIndex = zIndex;
        card.style.filter = blur > 0 ? `blur(${blur}px)` : 'none';
        card.style.pointerEvents = opacity > 0 ? 'auto' : 'none';
        card.classList.toggle('is-active', offset === 0);
      });

      // Update Pill Bar telemetry
      const activeCard = cards[activeIndex];
      if (activeCard) {
        const title = activeCard.dataset.title || '';
        const badge = activeCard.dataset.badge || `0${activeIndex + 1} / 0${cards.length}`;
        const img = activeCard.dataset.img || '';

        if (pillTitle) pillTitle.textContent = title;
        if (pillBadge) pillBadge.textContent = badge;
        if (pillThumb && img) {
          pillThumb.src = img;
          pillThumb.alt = title;
        }

        // Likes state
        const storageKey = `solo_fav_work_${activeIndex}`;
        const isLiked = localStorage.getItem(storageKey) === 'true';
        if (heartBtn) {
          heartBtn.classList.toggle('liked', isLiked);
          if (likesCount) {
            const baseLikes = 40 + (activeIndex * 8);
            likesCount.textContent = baseLikes + (isLiked ? 1 : 0);
          }
        }
      }
    }

    function goTo(index) {
      activeIndex = (index + cards.length) % cards.length;
      updatePositions();
    }

    // Navigation buttons
    prevBtn?.addEventListener("click", () => goTo(activeIndex - 1));
    nextBtn?.addEventListener("click", () => goTo(activeIndex + 1));

    // Card click behavior: active card navigates, inactive card focuses
    cards.forEach((card, idx) => {
      card.addEventListener("click", () => {
        if (idx === activeIndex) {
          const href = card.dataset.href;
          if (href) window.location.href = href;
        } else {
          goTo(idx);
        }
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (idx === activeIndex) {
            const href = card.dataset.href;
            if (href) window.location.href = href;
          } else {
            goTo(idx);
          }
        }
      });
    });

    // Expand & track click navigates to destination
    expandBtn?.addEventListener("click", () => {
      const activeCard = cards[activeIndex];
      if (activeCard && activeCard.dataset.href) {
        window.location.href = activeCard.dataset.href;
      }
    });

    pillTrackInfo?.addEventListener("click", () => {
      const activeCard = cards[activeIndex];
      if (activeCard && activeCard.dataset.href) {
        window.location.href = activeCard.dataset.href;
      }
    });

    // Likes persistence
    heartBtn?.addEventListener("click", () => {
      const storageKey = `solo_fav_work_${activeIndex}`;
      const currentlyLiked = localStorage.getItem(storageKey) === "true";
      localStorage.setItem(storageKey, (!currentlyLiked).toString());
      updatePositions();
    });

    // Autoplay slideshow
    function startAutoplay() {
      isPlaying = true;
      if (playBtn) {
        playBtn.querySelector(".icon-play")?.style.setProperty("display", "none");
        playBtn.querySelector(".icon-pause")?.style.setProperty("display", "block");
      }
      autoplayInterval = setInterval(() => {
        goTo(activeIndex + 1);
      }, 3500);
    }

    function stopAutoplay() {
      isPlaying = false;
      if (playBtn) {
        playBtn.querySelector(".icon-play")?.style.setProperty("display", "block");
        playBtn.querySelector(".icon-pause")?.style.setProperty("display", "none");
      }
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
    }

    playBtn?.addEventListener("click", () => {
      if (isPlaying) stopAutoplay();
      else startAutoplay();
    });

    stage.addEventListener("mouseenter", () => {
      if (isPlaying && autoplayInterval) clearInterval(autoplayInterval);
    });

    stage.addEventListener("mouseleave", () => {
      if (isPlaying && !autoplayInterval) {
        autoplayInterval = setInterval(() => goTo(activeIndex + 1), 3500);
      }
    });

    // Touch & Drag Support
    let startX = 0;
    let isDragging = false;

    stage.addEventListener("mousedown", (e) => {
      startX = e.clientX;
      isDragging = true;
    });

    window.addEventListener("mouseup", (e) => {
      if (!isDragging) return;
      isDragging = false;
      const diff = e.clientX - startX;
      if (Math.abs(diff) > 35) {
        if (diff > 0) goTo(activeIndex - 1);
        else goTo(activeIndex + 1);
      }
    });

    stage.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    stage.addEventListener("touchend", (e) => {
      const endX = e.changedTouches[0].clientX;
      const diff = endX - startX;
      if (Math.abs(diff) > 35) {
        if (diff > 0) goTo(activeIndex - 1);
        else goTo(activeIndex + 1);
      }
    }, { passive: true });

    // Keyboard Arrow Keys
    window.addEventListener("keydown", (e) => {
      const workSection = document.getElementById("work");
      if (!workSection) return;
      const rect = workSection.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (carouselSection?.classList.contains("view-active")) {
        if (e.key === "ArrowLeft") goTo(activeIndex - 1);
        if (e.key === "ArrowRight") goTo(activeIndex + 1);
      }
    });

    // Fluid View Mode Switcher
    function setWorkView(view) {
      if (view === "shelf") {
        carouselSection?.classList.remove("view-active");
        carouselSection?.classList.add("view-hidden");

        shelfWrapper?.classList.remove("view-hidden");
        shelfWrapper?.classList.add("view-active");

        btnShelf?.classList.add("active");
        btnShelf?.setAttribute("aria-selected", "true");
        btnCarousel?.classList.remove("active");
        btnCarousel?.setAttribute("aria-selected", "false");
        localStorage.setItem("solo_work_view", "shelf");

        if (workSwiper) {
          workSwiper.update();
        }
      } else {
        shelfWrapper?.classList.remove("view-active");
        shelfWrapper?.classList.add("view-hidden");

        carouselSection?.classList.remove("view-hidden");
        carouselSection?.classList.add("view-active");

        btnCarousel?.classList.add("active");
        btnCarousel?.setAttribute("aria-selected", "true");
        btnShelf?.classList.remove("active");
        btnShelf?.setAttribute("aria-selected", "false");
        localStorage.setItem("solo_work_view", "carousel");

        requestAnimationFrame(() => updatePositions());
      }
    }

    btnCarousel?.addEventListener("click", () => setWorkView("carousel"));
    btnShelf?.addEventListener("click", () => setWorkView("shelf"));

    // Sync Category Filter Pills with 3D Carousel
    const filterPills = document.querySelectorAll(".filter-pill");
    filterPills.forEach(pill => {
      pill.addEventListener("click", () => {
        const cat = pill.getAttribute("data-filter");
        if (cat && cat !== "all") {
          const matchIndex = cards.findIndex(c => c.getAttribute("data-category") === cat);
          if (matchIndex !== -1) {
            goTo(matchIndex);
          }
        } else if (cat === "all") {
          goTo(0);
        }
      });
    });

    // Default to 3D carousel view (or URL query override)
    const workUrlParams = new URLSearchParams(window.location.search);
    const requestedWorkView = workUrlParams.get("view");
    const defaultWorkView = requestedWorkView === "shelf" ? "shelf" : "carousel";
    setWorkView(defaultWorkView);

    window.addEventListener("resize", updatePositions);
    updatePositions();
  }

  initFeaturedCreations3DCarousel();

  /* ==========================================================================
     9. QUICK EMAIL COPY ACTION
     ========================================================================== */
  const copyEmailBtn = document.getElementById("copy-email-btn");
  const emailText = document.getElementById("email-address-text");
  const copyStatus = document.getElementById("copy-status");

  if (copyEmailBtn && emailText && copyStatus) {
    copyEmailBtn.addEventListener("click", async () => {
      const email = emailText.textContent.trim();
      try {
        await navigator.clipboard.writeText(email);
        copyStatus.innerHTML = "Copied! <i class=\"ri-check-line\"></i>";
        copyStatus.style.color = "var(--accent-primary)";
        setTimeout(() => {
          copyStatus.innerHTML = "Copy <i class=\"ri-file-copy-line\"></i>";
          copyStatus.style.color = "";
        }, 2200);
      } catch (err) {
        window.location.href = `mailto:${email}`;
      }
    });
  }

  /* ==========================================================================
     10. REAL EMAIL CONTACT TRANSMISSION (FormSubmit AJAX + Mailto Fallback)
     ========================================================================== */
  const contactForm = document.getElementById("contact-form");
  const contactMessage = document.getElementById("contact-message");

  if (contactForm && contactMessage) {
    contactForm.addEventListener("submit", async e => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector("button[type=submit]");
      const originalBtnHTML = submitBtn ? submitBtn.innerHTML : "<span>Dispatch Message</span> <i class=\"ri-send-plane-fill\"></i>";

      const nameInput = document.getElementById("name");
      const emailInput = document.getElementById("email");
      const serviceInput = document.getElementById("service-select");
      const messageInput = document.getElementById("message");

      const nameVal = nameInput ? nameInput.value.trim() : "";
      const emailVal = emailInput ? emailInput.value.trim() : "";
      const serviceVal = serviceInput ? serviceInput.value : "General Inquiry";
      const messageVal = messageInput ? messageInput.value.trim() : "";

      if (!nameVal || !emailVal || !messageVal) {
        contactMessage.className = "contact__message is-error";
        contactMessage.textContent = "Please fill in all required fields.";
        return;
      }

      const mailtoUrl = `mailto:benedictkier3474@gmail.com?subject=${encodeURIComponent(
        `Portfolio Inquiry: ${serviceVal} - ${nameVal}`
      )}&body=${encodeURIComponent(
        `Hi Kier,\n\nName: ${nameVal}\nEmail: ${emailVal}\nProject: ${serviceVal}\n\nMessage:\n${messageVal}\n`
      )}`;

      // If browsing as a local file, directly trigger mailto client
      if (window.location.protocol === "file:") {
        contactMessage.className = "contact__message is-success";
        contactMessage.innerHTML = `<i class="ri-mail-send-line"></i> Local file mode: Opening your email client to send directly... (<a href="${mailtoUrl}">Click here if it didn't open</a>)`;
        window.location.href = mailtoUrl;
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = "<span>Transmitting...</span> <i class=\"ri-loader-4-line ri-spin\"></i>";
      }

      contactMessage.className = "contact__message";
      contactMessage.textContent = "Sending your message to Kier...";
      contactMessage.style.color = "var(--text-muted)";

      try {
        const payload = {
          name: nameVal,
          email: emailVal,
          service: serviceVal,
          message: messageVal,
          _subject: `New Portfolio Inquiry from ${nameVal} [${serviceVal}]`,
          _template: "table",
          _captcha: "false"
        };

        const res = await fetch("https://formsubmit.co/ajax/benedictkier3474@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload)
        });

        const data = await res.json().catch(() => ({}));

        if (res.ok && (data.success === "true" || data.success === true)) {
          contactMessage.className = "contact__message is-success";
          contactMessage.innerHTML = "<i class=\"ri-checkbox-circle-fill\"></i> Message transmitted successfully! Kier will be in touch shortly.";
          contactForm.reset();
          if (typeof triggerCatPet === "function") triggerCatPet();
        } else if (data.message && data.message.includes("Activation")) {
          contactMessage.className = "contact__message is-success";
          contactMessage.innerHTML = "<i class=\"ri-checkbox-circle-fill\"></i> Transmission queued! (FormSubmit activation email sent to Kier's inbox).";
          contactForm.reset();
          if (typeof triggerCatPet === "function") triggerCatPet();
        } else {
          throw new Error(data.message || "Transmission failed");
        }
      } catch (err) {
        console.warn("Direct transmission notice, falling back to mail client:", err);
        contactMessage.className = "contact__message is-success";
        contactMessage.innerHTML = `<i class="ri-mail-send-line"></i> Opening mail app to send directly... (<a href="${mailtoUrl}">Click here if your mail app didn't open</a>)`;
        window.location.href = mailtoUrl;
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
        }
      }
    });
  }

  /* ==========================================================================
     11. FLOATING FADE IN AND OUT SCROLL CONTROLLER
     ========================================================================== */
  if (!isReducedMotion) {
    const floatSelectors = [
      ".home__editorial",
      ".home__visual",
      ".section__header-row",
      ".section__center-header",
      ".work-card",
      ".bento-card",
      ".skills__panel",
      ".about__card",
      ".about__narrative",
      ".testimonial-card",
      ".contact__meta",
      ".channel-card",
      ".contact__form-panel",
      ".metrics-bento"
    ];

    const floatElements = document.querySelectorAll(floatSelectors.join(", "));

    floatElements.forEach(el => {
      el.classList.add("scroll-float");
    });

    const floatObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const el = entry.target;
        if (entry.isIntersecting) {
          el.classList.add("is-inview");
          el.classList.remove("is-out-above", "is-out-below");
        } else {
          el.classList.remove("is-inview");
          if (entry.boundingClientRect.top < 0) {
            el.classList.add("is-out-above");
            el.classList.remove("is-out-below");
          } else {
            el.classList.add("is-out-below");
            el.classList.remove("is-out-above");
          }
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: "0px 0px -20px 0px"
    });

    floatElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("is-inview");
      }
      floatObserver.observe(el);
    });
  }
});
