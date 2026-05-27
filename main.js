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
     5. PROJECT CARDS — Sticky pile-up stacking effect
     ========================================================== */
  function initProjectCards() {
    const cards = document.querySelectorAll('[data-project]');
    if (!cards.length) return;

    const STICKY_TOP = 64; // 4rem in px

    function updateCards() {
      cards.forEach((card, i) => {
        const sticky = card.parentElement;
        const rect = sticky.getBoundingClientRect();

        // When card is stuck at top and being scrolled past
        if (rect.top <= STICKY_TOP) {
          const scrollPast = STICKY_TOP - rect.top;
          const maxScroll = rect.height;
          const progress = Math.min(Math.max(scrollPast / maxScroll, 0), 1);

          // Scale down gently as the next card overlaps
          const scale = 1 - (progress * 0.05);
          card.style.transform = `scale(${Math.max(scale, 0.95)})`;
          card.style.opacity = Math.max(1 - (progress * 0.4), 0.6);
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
     7. RENDER FROM DATA (localStorage → DOM)
     ========================================================== */
  function placeholderImg(w, h, text) {
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'%3E%3Crect fill='%23141418' width='${w}' height='${h}'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23D7E2EA40' font-family='Kanit' font-size='14'%3E${encodeURIComponent(text)}%3C/text%3E%3C/svg%3E`;
  }

  function renderFromData() {
    if (typeof PortfolioData === 'undefined') return;
    const d = PortfolioData.getData();

    // --- Bio ---
    const bioEl = document.querySelector('.about__bio');
    if (bioEl) bioEl.textContent = d.about.bio;

    // --- Skills ---
    const skillsGroup = document.querySelector('.about__skills-group');
    if (skillsGroup) {
      skillsGroup.innerHTML = d.skills.map(group => `
        <div class="about__skill-row">
          <span class="about__skill-label">${escText(group.label)}</span>
          <div class="about__skill-tags">
            ${group.tags.map(t => `<span class="about__skill-tag">${escText(t)}</span>`).join('')}
          </div>
        </div>
      `).join('');
    }

    // --- Experience ---
    const expList = document.querySelector('.experience__list');
    if (expList) {
      expList.innerHTML = d.experiences.map((exp, i) => `
        <div class="experience__item anim anim--visible">
          <span class="experience__number">${String(i + 1).padStart(2, '0')}</span>
          <div class="experience__item-content">
            <h3 class="experience__item-role">${escText(exp.role)}</h3>
            <span class="experience__item-company">${escText(exp.company)}</span>
            <span class="experience__item-period">${escText(exp.period)}</span>
            <p class="experience__item-desc">${escText(exp.description)}</p>
          </div>
        </div>
      `).join('');
    }

    // --- Projects ---
    const projectsSection = document.querySelector('.projects');
    if (projectsSection) {
      // Keep the header, rebuild sticky cards
      const header = projectsSection.querySelector('.projects__header');
      const existingStickies = projectsSection.querySelectorAll('.projects__sticky');
      existingStickies.forEach(s => s.remove());

      d.projects.forEach((proj, i) => {
        const num = String(i + 1).padStart(2, '0');
        const img0 = proj.images[0] || placeholderImg(400, 300, `Screenshot 1`);
        const img1 = proj.images[1] || placeholderImg(400, 300, `Screenshot 2`);
        const img2 = proj.images[2] || placeholderImg(600, 600, `Main Screenshot`);

        const sticky = document.createElement('div');
        sticky.className = 'projects__sticky';
        sticky.innerHTML = `
          <div class="projects__card" data-project>
            <div class="projects__card-header">
              <div class="projects__card-info">
                <span class="projects__card-number">${num}</span>
                <div class="projects__card-meta">
                  <span class="projects__card-category">${escText(proj.category)}</span>
                  <h3 class="projects__card-title">${escText(proj.title)}</h3>
                </div>
              </div>
              <div class="projects__card-link">
                <a href="${escAttrText(proj.liveUrl)}" target="_blank" rel="noopener">
                  Live Project
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M7 17L17 7" /><path d="M7 7h10v10" />
                  </svg>
                </a>
              </div>
            </div>
            <div class="projects__card-images">
              <div class="projects__card-img-col">
                <div class="projects__card-img-wrapper">
                  <img src="${escAttrText(img0)}" alt="${escAttrText(proj.title)} Screenshot 1" loading="lazy">
                </div>
                <div class="projects__card-img-wrapper">
                  <img src="${escAttrText(img1)}" alt="${escAttrText(proj.title)} Screenshot 2" loading="lazy">
                </div>
              </div>
              <div class="projects__card-img-col">
                <div class="projects__card-img-wrapper projects__card-img-wrapper--single">
                  <img src="${escAttrText(img2)}" alt="${escAttrText(proj.title)} Main" loading="lazy">
                </div>
              </div>
            </div>
          </div>
        `;
        projectsSection.appendChild(sticky);
      });

      // Re-init project cards stacking
      initProjectCards();
    }
  }

  function escText(str) {
    const d = document.createElement('div');
    d.textContent = str || '';
    return d.innerHTML;
  }

  function escAttrText(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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

    // Render from localStorage data if available
    if (typeof PortfolioData !== 'undefined' && PortfolioData.hasStoredData()) {
      renderFromData();
    }

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

  // Expose for admin panel
  window.refreshPortfolio = function () {
    renderFromData();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

