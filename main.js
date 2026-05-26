/* ============================================================
   PORTFOLIO — Interactions
   Scroll reveal, nav, sound toggle, smooth scroll, project cards
   ============================================================ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* ==========================================================
     1. SCROLL REVEAL (IntersectionObserver)
     ========================================================== */
  function initScrollReveal() {
    const animEls = document.querySelectorAll('.anim, .anim-scale');
    const staggerEls = document.querySelectorAll('.anim-stagger');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(
              entry.target.classList.contains('anim-scale')
                ? 'anim-scale--visible'
                : 'anim--visible'
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    const staggerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('anim-stagger--visible');
            staggerObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    animEls.forEach((el) => observer.observe(el));
    staggerEls.forEach((el) => staggerObserver.observe(el));
  }


  /* ==========================================================
     2. NAVIGATION
     ========================================================== */
  function initNav() {
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    const navLinks = document.querySelectorAll('.nav__link');

    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('nav__links--open');
      toggle.classList.toggle('nav__toggle--open');
      toggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        links.classList.remove('nav__links--open');
        toggle.classList.remove('nav__toggle--open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }


  /* ==========================================================
     3. SMOOTH SCROLL
     ========================================================== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Scroll indicator click
    const scrollIndicator = document.getElementById('scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.addEventListener('click', () => {
        const about = document.getElementById('about');
        if (about) about.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }


  /* ==========================================================
     4. SOUND TOGGLE (Video mute/unmute)
     ========================================================== */
  function initSoundToggle() {
    const video = document.getElementById('hero-video');
    const btn = document.getElementById('sound-toggle');
    const label = document.getElementById('sound-label');
    const muteLine1 = document.getElementById('sound-mute-1');
    const muteLine2 = document.getElementById('sound-mute-2');

    if (!video || !btn) return;

    btn.addEventListener('click', () => {
      video.muted = !video.muted;

      if (video.muted) {
        if (label) label.textContent = 'Tap for sound';
        if (muteLine1) muteLine1.style.display = '';
        if (muteLine2) muteLine2.style.display = '';
      } else {
        if (label) label.textContent = 'Unmute video';
        if (muteLine1) muteLine1.style.display = 'none';
        if (muteLine2) muteLine2.style.display = 'none';
      }
    });
  }


  /* ==========================================================
     5. PROJECT CARDS — Sticky scale effect on scroll
     ========================================================== */
  function initProjectCards() {
    const cards = document.querySelectorAll('[data-project]');
    if (!cards.length) return;

    function updateCards() {
      cards.forEach((card, i) => {
        const rect = card.parentElement.getBoundingClientRect();
        const windowH = window.innerHeight;

        // When card is sticking at top, calculate how far scrolled past
        if (rect.top <= 96) { // 6rem = ~96px sticky top
          const scrollPast = 96 - rect.top;
          const maxScroll = rect.height;
          const progress = Math.min(scrollPast / maxScroll, 1);

          // Scale down slightly as we scroll past
          const scale = 1 - (progress * 0.05);
          const opacity = 1 - (progress * 0.3);
          card.style.transform = `scale(${Math.max(scale, 0.92)})`;
          card.style.opacity = Math.max(opacity, 0.7);
        } else {
          card.style.transform = '';
          card.style.opacity = '';
        }
      });
    }

    window.addEventListener('scroll', updateCards, { passive: true });
    updateCards();
  }


  /* ==========================================================
     6. HERO ANIMATION — Trigger on load
     ========================================================== */
  function initHeroAnimation() {
    // Trigger hero animations immediately
    const heroAnims = document.querySelectorAll('.hero .anim');
    setTimeout(() => {
      heroAnims.forEach((el) => {
        el.classList.add('anim--visible');
      });
    }, 300);
  }


  /* ==========================================================
     INIT
     ========================================================== */
  function init() {
    // Footer year
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    initNav();
    initSmoothScroll();
    initSoundToggle();
    initHeroAnimation();

    if (!prefersReducedMotion) {
      initScrollReveal();
      initProjectCards();
    } else {
      // Make everything visible if reduced motion
      document.querySelectorAll('.anim, .anim-scale').forEach((el) => {
        el.classList.add('anim--visible', 'anim-scale--visible');
      });
      document.querySelectorAll('.anim-stagger').forEach((el) => {
        el.classList.add('anim-stagger--visible');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
