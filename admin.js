/* ============================================================
   ADMIN PANEL — Password Modal + Full Admin Interface
   ============================================================ */

const AdminPanel = (function () {
  'use strict';

  // SHA-256 hash of "hammad@135"
  const PASSWORD_HASH = 'a79b15bcc58359501b193f769879b7d21251ed90025b89b2520a496b82ba91d0';

  let isAuthenticated = false;
  let currentTab = 'about';
  let data = null;

  /* ---------- SHA-256 helper ---------- */
  async function sha256(str) {
    const buf = await crypto.subtle.digest('SHA-256',
      new TextEncoder().encode(str)
    );
    return Array.from(new Uint8Array(buf))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /* ---------- Toast ---------- */
  function showToast(msg) {
    let toast = document.querySelector('.admin-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'admin-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('admin-toast--visible');
    setTimeout(() => toast.classList.remove('admin-toast--visible'), 2200);
  }

  /* ==========================================================
     PASSWORD MODAL
     ========================================================== */
  function createPasswordModal() {
    const overlay = document.createElement('div');
    overlay.className = 'pwd-overlay';
    overlay.id = 'pwd-overlay';
    overlay.innerHTML = `
      <div class="pwd-modal">
        <button class="pwd-modal__close" id="pwd-close">&times;</button>
        <div class="pwd-modal__icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <h3 class="pwd-modal__title">Admin Access</h3>
        <p class="pwd-modal__subtitle">Enter password to continue</p>
        <div class="pwd-modal__input-wrap">
          <input type="password" class="pwd-modal__input" id="pwd-input" placeholder="Password" autocomplete="off" />
          <button class="pwd-modal__eye" id="pwd-eye" type="button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
        </div>
        <p class="pwd-modal__error" id="pwd-error">&nbsp;</p>
        <button class="pwd-modal__submit" id="pwd-submit">Unlock</button>
      </div>
    `;
    document.body.appendChild(overlay);
    return overlay;
  }

  function showPasswordModal() {
    let overlay = document.getElementById('pwd-overlay');
    if (!overlay) overlay = createPasswordModal();

    const input = document.getElementById('pwd-input');
    const error = document.getElementById('pwd-error');
    const submit = document.getElementById('pwd-submit');
    const close = document.getElementById('pwd-close');
    const eye = document.getElementById('pwd-eye');

    // Reset
    input.value = '';
    error.innerHTML = '&nbsp;';
    input.classList.remove('pwd-modal__input--error');

    // Show
    requestAnimationFrame(() => {
      overlay.classList.add('pwd-overlay--visible');
      setTimeout(() => input.focus(), 300);
    });

    // Eye toggle
    function toggleEye() {
      input.type = input.type === 'password' ? 'text' : 'password';
    }

    // Submit
    async function handleSubmit() {
      const hash = await sha256(input.value);
      if (hash === PASSWORD_HASH) {
        isAuthenticated = true;
        overlay.classList.remove('pwd-overlay--visible');
        setTimeout(() => showAdminPanel(), 350);
      } else {
        input.classList.add('pwd-modal__input--error');
        error.textContent = 'Incorrect password';
        setTimeout(() => {
          input.classList.remove('pwd-modal__input--error');
        }, 600);
      }
    }

    function handleClose() {
      overlay.classList.remove('pwd-overlay--visible');
    }

    // Clean up old listeners by cloning
    const newSubmit = submit.cloneNode(true);
    submit.parentNode.replaceChild(newSubmit, submit);
    newSubmit.addEventListener('click', handleSubmit);

    const newClose = close.cloneNode(true);
    close.parentNode.replaceChild(newClose, close);
    newClose.addEventListener('click', handleClose);

    const newEye = eye.cloneNode(true);
    eye.parentNode.replaceChild(newEye, eye);
    newEye.addEventListener('click', toggleEye);

    // Enter key
    input.onkeydown = (e) => {
      if (e.key === 'Enter') handleSubmit();
    };

    // Click backdrop
    overlay.onclick = (e) => {
      if (e.target === overlay) handleClose();
    };
  }


  /* ==========================================================
     ADMIN PANEL
     ========================================================== */
  function createAdminPanel() {
    const overlay = document.createElement('div');
    overlay.className = 'admin-overlay';
    overlay.id = 'admin-overlay';
    overlay.innerHTML = `
      <header class="admin-header">
        <span class="admin-header__title">Admin Panel</span>
        <div class="admin-header__actions">
          <button class="admin-header__btn admin-header__btn--danger" id="admin-reset">Reset All</button>
          <button class="admin-header__btn admin-header__btn--close" id="admin-close">&times;</button>
        </div>
      </header>
      <nav class="admin-tabs" id="admin-tabs">
        <button class="admin-tab admin-tab--active" data-tab="about">About & Skills</button>
        <button class="admin-tab" data-tab="experience">Experience</button>
        <button class="admin-tab" data-tab="projects">Projects</button>
      </nav>
      <div class="admin-content" id="admin-content">
        <div class="admin-panel admin-panel--active" id="panel-about"></div>
        <div class="admin-panel" id="panel-experience"></div>
        <div class="admin-panel" id="panel-projects"></div>
      </div>
    `;
    document.body.appendChild(overlay);
    return overlay;
  }

  function showAdminPanel() {
    let overlay = document.getElementById('admin-overlay');
    if (!overlay) overlay = createAdminPanel();

    data = PortfolioData.getData();
    currentTab = 'about';

    // Render initial tab
    renderAboutPanel();
    renderExperiencePanel();
    renderProjectsPanel();
    updateTabVisibility();

    // Show with animation
    requestAnimationFrame(() => {
      overlay.classList.add('admin-overlay--visible');
    });

    // Tab clicks
    document.getElementById('admin-tabs').onclick = (e) => {
      const tab = e.target.closest('.admin-tab');
      if (!tab) return;
      currentTab = tab.dataset.tab;
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('admin-tab--active'));
      tab.classList.add('admin-tab--active');
      updateTabVisibility();
    };

    // Close
    document.getElementById('admin-close').onclick = () => {
      overlay.classList.remove('admin-overlay--visible');
      // Refresh portfolio
      if (typeof window.refreshPortfolio === 'function') {
        window.refreshPortfolio();
      }
    };

    // Reset
    document.getElementById('admin-reset').onclick = () => {
      if (confirm('Reset all data to defaults? This cannot be undone.')) {
        data = PortfolioData.resetToDefaults();
        renderAboutPanel();
        renderExperiencePanel();
        renderProjectsPanel();
        showToast('Data reset to defaults');
        if (typeof window.refreshPortfolio === 'function') {
          window.refreshPortfolio();
        }
      }
    };
  }

  function updateTabVisibility() {
    document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('admin-panel--active'));
    const target = document.getElementById('panel-' + currentTab);
    if (target) target.classList.add('admin-panel--active');
  }


  /* ==========================================================
     TAB: ABOUT & SKILLS
     ========================================================== */
  function renderAboutPanel() {
    const panel = document.getElementById('panel-about');
    if (!panel) return;

    let html = `
      <h3 class="admin-panel__section-title">Bio</h3>
      <div class="admin-field">
        <label class="admin-field__label">About Me Text</label>
        <textarea class="admin-field__textarea" id="admin-bio" rows="4">${escHtml(data.about.bio)}</textarea>
      </div>
      <div style="display:flex;justify-content:flex-end;margin-bottom:2rem;">
        <button class="admin-item__btn admin-item__btn--save" id="admin-bio-save">Save Bio</button>
      </div>

      <h3 class="admin-panel__section-title">Skills</h3>
    `;

    data.skills.forEach((group, gi) => {
      html += `
        <div class="admin-tags" data-skill-group="${gi}">
          <label class="admin-tags__label">${escHtml(group.label)}</label>
          <div class="admin-tags__list">
            ${group.tags.map((tag, ti) => `
              <span class="admin-tags__tag">
                ${escHtml(tag)}
                <button class="admin-tags__remove" data-group="${gi}" data-tag="${ti}">&times;</button>
              </span>
            `).join('')}
          </div>
          <div class="admin-tags__add-row">
            <input class="admin-tags__add-input" placeholder="New skill…" data-group-input="${gi}" />
            <button class="admin-tags__add-btn" data-group-add="${gi}">+ Add</button>
          </div>
        </div>
      `;
    });

    panel.innerHTML = html;

    // Bio save
    document.getElementById('admin-bio-save').onclick = () => {
      data.about.bio = document.getElementById('admin-bio').value.trim();
      PortfolioData.saveData(data);
      showToast('Bio saved');
    };

    // Remove tags
    panel.querySelectorAll('.admin-tags__remove').forEach(btn => {
      btn.onclick = () => {
        const gi = parseInt(btn.dataset.group);
        const ti = parseInt(btn.dataset.tag);
        data.skills[gi].tags.splice(ti, 1);
        PortfolioData.saveData(data);
        renderAboutPanel();
        showToast('Skill removed');
      };
    });

    // Add tags
    panel.querySelectorAll('.admin-tags__add-btn').forEach(btn => {
      btn.onclick = () => {
        const gi = parseInt(btn.dataset.groupAdd);
        const input = panel.querySelector(`[data-group-input="${gi}"]`);
        const val = input.value.trim();
        if (val) {
          data.skills[gi].tags.push(val);
          PortfolioData.saveData(data);
          renderAboutPanel();
          showToast('Skill added');
        }
      };
    });

    // Enter key for tag add
    panel.querySelectorAll('.admin-tags__add-input').forEach(input => {
      input.onkeydown = (e) => {
        if (e.key === 'Enter') {
          const gi = parseInt(input.dataset.groupInput);
          const btn = panel.querySelector(`[data-group-add="${gi}"]`);
          if (btn) btn.click();
        }
      };
    });
  }


  /* ==========================================================
     TAB: EXPERIENCE
     ========================================================== */
  function renderExperiencePanel() {
    const panel = document.getElementById('panel-experience');
    if (!panel) return;

    let html = `<h3 class="admin-panel__section-title">Experience Items</h3>`;

    data.experiences.forEach((exp, i) => {
      html += `
        <div class="admin-item" data-exp-index="${i}">
          <div class="admin-item__header">
            <span class="admin-item__number">${String(i + 1).padStart(2, '0')}</span>
            <div class="admin-item__actions">
              ${i > 0 ? `<button class="admin-item__btn" data-exp-move-up="${i}">↑</button>` : ''}
              ${i < data.experiences.length - 1 ? `<button class="admin-item__btn" data-exp-move-down="${i}">↓</button>` : ''}
              <button class="admin-item__btn admin-item__btn--delete" data-exp-delete="${i}">Delete</button>
            </div>
          </div>
          <div class="admin-item__fields">
            <div class="admin-item__row">
              <div class="admin-field">
                <label class="admin-field__label">Role</label>
                <input class="admin-field__input" value="${escAttr(exp.role)}" data-exp-field="${i}-role" />
              </div>
              <div class="admin-field">
                <label class="admin-field__label">Company</label>
                <input class="admin-field__input" value="${escAttr(exp.company)}" data-exp-field="${i}-company" />
              </div>
            </div>
            <div class="admin-field">
              <label class="admin-field__label">Period</label>
              <input class="admin-field__input" value="${escAttr(exp.period)}" data-exp-field="${i}-period" />
            </div>
            <div class="admin-field">
              <label class="admin-field__label">Description</label>
              <textarea class="admin-field__textarea" rows="3" data-exp-field="${i}-description">${escHtml(exp.description)}</textarea>
            </div>
            <div style="display:flex;justify-content:flex-end;">
              <button class="admin-item__btn admin-item__btn--save" data-exp-save="${i}">Save</button>
            </div>
          </div>
        </div>
      `;
    });

    html += `<button class="admin-add-btn" id="admin-exp-add">+ Add Experience</button>`;
    panel.innerHTML = html;

    // Save
    panel.querySelectorAll('[data-exp-save]').forEach(btn => {
      btn.onclick = () => {
        const i = parseInt(btn.dataset.expSave);
        data.experiences[i].role = panel.querySelector(`[data-exp-field="${i}-role"]`).value.trim();
        data.experiences[i].company = panel.querySelector(`[data-exp-field="${i}-company"]`).value.trim();
        data.experiences[i].period = panel.querySelector(`[data-exp-field="${i}-period"]`).value.trim();
        data.experiences[i].description = panel.querySelector(`[data-exp-field="${i}-description"]`).value.trim();
        PortfolioData.saveData(data);
        showToast('Experience saved');
      };
    });

    // Delete
    panel.querySelectorAll('[data-exp-delete]').forEach(btn => {
      btn.onclick = () => {
        const i = parseInt(btn.dataset.expDelete);
        if (confirm(`Delete "${data.experiences[i].role}" experience?`)) {
          data.experiences.splice(i, 1);
          PortfolioData.saveData(data);
          renderExperiencePanel();
          showToast('Experience deleted');
        }
      };
    });

    // Move up/down
    panel.querySelectorAll('[data-exp-move-up]').forEach(btn => {
      btn.onclick = () => {
        const i = parseInt(btn.dataset.expMoveUp);
        [data.experiences[i - 1], data.experiences[i]] = [data.experiences[i], data.experiences[i - 1]];
        PortfolioData.saveData(data);
        renderExperiencePanel();
      };
    });
    panel.querySelectorAll('[data-exp-move-down]').forEach(btn => {
      btn.onclick = () => {
        const i = parseInt(btn.dataset.expMoveDown);
        [data.experiences[i], data.experiences[i + 1]] = [data.experiences[i + 1], data.experiences[i]];
        PortfolioData.saveData(data);
        renderExperiencePanel();
      };
    });

    // Add
    document.getElementById('admin-exp-add').onclick = () => {
      data.experiences.push({
        id: PortfolioData.generateId('exp'),
        role: 'New Role',
        company: 'Company',
        period: '2024 — Present',
        description: 'Description of your role and achievements.'
      });
      PortfolioData.saveData(data);
      renderExperiencePanel();
      showToast('Experience added');
      // Scroll to bottom
      const adminContent = document.getElementById('admin-content');
      if (adminContent) adminContent.scrollTop = adminContent.scrollHeight;
    };
  }


  /* ==========================================================
     TAB: PROJECTS
     ========================================================== */
  function renderProjectsPanel() {
    const panel = document.getElementById('panel-projects');
    if (!panel) return;

    let html = `<h3 class="admin-panel__section-title">Project Items</h3>`;

    data.projects.forEach((proj, i) => {
      html += `
        <div class="admin-item" data-proj-index="${i}">
          <div class="admin-item__header">
            <span class="admin-item__number">${String(i + 1).padStart(2, '0')}</span>
            <div class="admin-item__actions">
              ${i > 0 ? `<button class="admin-item__btn" data-proj-move-up="${i}">↑</button>` : ''}
              ${i < data.projects.length - 1 ? `<button class="admin-item__btn" data-proj-move-down="${i}">↓</button>` : ''}
              <button class="admin-item__btn admin-item__btn--delete" data-proj-delete="${i}">Delete</button>
            </div>
          </div>
          <div class="admin-item__fields">
            <div class="admin-item__row">
              <div class="admin-field">
                <label class="admin-field__label">Title</label>
                <input class="admin-field__input" value="${escAttr(proj.title)}" data-proj-field="${i}-title" />
              </div>
              <div class="admin-field">
                <label class="admin-field__label">Category</label>
                <input class="admin-field__input" value="${escAttr(proj.category)}" data-proj-field="${i}-category" />
              </div>
            </div>
            <div class="admin-field">
              <label class="admin-field__label">Live URL</label>
              <input class="admin-field__input" value="${escAttr(proj.liveUrl)}" data-proj-field="${i}-liveUrl" placeholder="https://..." />
            </div>
            <div class="admin-item__row">
              <div class="admin-field">
                <label class="admin-field__label">Screenshot 1 URL</label>
                <input class="admin-field__input" value="${escAttr(proj.images[0] || '')}" data-proj-field="${i}-img0" placeholder="Image URL" />
              </div>
              <div class="admin-field">
                <label class="admin-field__label">Screenshot 2 URL</label>
                <input class="admin-field__input" value="${escAttr(proj.images[1] || '')}" data-proj-field="${i}-img1" placeholder="Image URL" />
              </div>
            </div>
            <div class="admin-field">
              <label class="admin-field__label">Main Screenshot URL</label>
              <input class="admin-field__input" value="${escAttr(proj.images[2] || '')}" data-proj-field="${i}-img2" placeholder="Image URL" />
            </div>
            <div style="display:flex;justify-content:flex-end;">
              <button class="admin-item__btn admin-item__btn--save" data-proj-save="${i}">Save</button>
            </div>
          </div>
        </div>
      `;
    });

    html += `<button class="admin-add-btn" id="admin-proj-add">+ Add Project</button>`;
    panel.innerHTML = html;

    // Save
    panel.querySelectorAll('[data-proj-save]').forEach(btn => {
      btn.onclick = () => {
        const i = parseInt(btn.dataset.projSave);
        data.projects[i].title = panel.querySelector(`[data-proj-field="${i}-title"]`).value.trim();
        data.projects[i].category = panel.querySelector(`[data-proj-field="${i}-category"]`).value.trim();
        data.projects[i].liveUrl = panel.querySelector(`[data-proj-field="${i}-liveUrl"]`).value.trim();
        data.projects[i].images = [
          panel.querySelector(`[data-proj-field="${i}-img0"]`).value.trim(),
          panel.querySelector(`[data-proj-field="${i}-img1"]`).value.trim(),
          panel.querySelector(`[data-proj-field="${i}-img2"]`).value.trim()
        ];
        PortfolioData.saveData(data);
        showToast('Project saved');
      };
    });

    // Delete
    panel.querySelectorAll('[data-proj-delete]').forEach(btn => {
      btn.onclick = () => {
        const i = parseInt(btn.dataset.projDelete);
        if (confirm(`Delete "${data.projects[i].title}" project?`)) {
          data.projects.splice(i, 1);
          PortfolioData.saveData(data);
          renderProjectsPanel();
          showToast('Project deleted');
        }
      };
    });

    // Move up/down
    panel.querySelectorAll('[data-proj-move-up]').forEach(btn => {
      btn.onclick = () => {
        const i = parseInt(btn.dataset.projMoveUp);
        [data.projects[i - 1], data.projects[i]] = [data.projects[i], data.projects[i - 1]];
        PortfolioData.saveData(data);
        renderProjectsPanel();
      };
    });
    panel.querySelectorAll('[data-proj-move-down]').forEach(btn => {
      btn.onclick = () => {
        const i = parseInt(btn.dataset.projMoveDown);
        [data.projects[i], data.projects[i + 1]] = [data.projects[i + 1], data.projects[i]];
        PortfolioData.saveData(data);
        renderProjectsPanel();
      };
    });

    // Add
    document.getElementById('admin-proj-add').onclick = () => {
      data.projects.push({
        id: PortfolioData.generateId('proj'),
        title: 'New Project',
        category: 'Personal',
        liveUrl: '#',
        images: ['', '', '']
      });
      PortfolioData.saveData(data);
      renderProjectsPanel();
      showToast('Project added');
    };
  }


  /* ---------- Escape helpers ---------- */
  function escHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  function escAttr(str) {
    return (str || '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }


  /* ---------- Init: attach click to logo ---------- */
  function init() {
    const logo = document.querySelector('.nav__logo');
    if (logo) {
      logo.style.cursor = 'pointer';
      logo.addEventListener('click', (e) => {
        e.preventDefault();
        if (isAuthenticated) {
          showAdminPanel();
        } else {
          showPasswordModal();
        }
      });
    }
  }

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { showPasswordModal, showAdminPanel };
})();
