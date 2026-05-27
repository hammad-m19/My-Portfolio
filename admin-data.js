/* ============================================================
   ADMIN DATA LAYER — localStorage persistence
   ============================================================ */

const PortfolioData = (function () {
  'use strict';

  const STORAGE_KEY = 'portfolio_admin_data';

  /* ---------- Default data (matches current HTML) ---------- */
  const DEFAULTS = {
    about: {
      bio: "I'm a Software Engineer who values craftsmanship over shortcuts. I build robust, scalable software with purpose and precision — from backend architecture to polished front-end experiences."
    },
    skills: [
      {
        label: 'Languages',
        tags: ['JavaScript', 'TypeScript', 'Python', 'HTML', 'CSS', 'SQL']
      },
      {
        label: 'Frameworks & Libraries',
        tags: ['React', 'Next.js', 'Node.js', 'Express', 'Vue.js', 'Tailwind']
      },
      {
        label: 'Tools & Platforms',
        tags: ['Git', 'Docker', 'AWS', 'Firebase', 'PostgreSQL', 'MongoDB', 'Vercel']
      }
    ],
    experiences: [
      {
        id: 'exp_1',
        role: 'Software Engineer',
        company: 'Tech Company',
        period: '2023 — Present',
        description: 'Building scalable microservices architecture and leading frontend modernization. Reduced page load times by 40% through performance optimization.'
      },
      {
        id: 'exp_2',
        role: 'Full Stack Developer',
        company: 'Startup Inc.',
        period: '2022 — 2023',
        description: 'Developed core product features from conception to deployment. Implemented CI/CD pipelines and established coding standards for the team.'
      },
      {
        id: 'exp_3',
        role: 'Junior Developer',
        company: 'Agency Studio',
        period: '2021 — 2022',
        description: 'Built responsive web applications for diverse clients. Collaborated with designers to translate mockups into pixel-perfect, accessible interfaces.'
      }
    ],
    projects: [
      {
        id: 'proj_1',
        title: 'E-Commerce Platform',
        category: 'Personal',
        liveUrl: '#',
        images: ['', '', '']
      },
      {
        id: 'proj_2',
        title: 'Task Management App',
        category: 'Personal',
        liveUrl: '#',
        images: ['', '', '']
      },
      {
        id: 'proj_3',
        title: 'API Analytics Dashboard',
        category: 'Personal',
        liveUrl: '#',
        images: ['', '', '']
      }
    ]
  };

  /* ---------- Deep clone helper ---------- */
  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /* ---------- Generate unique ID ---------- */
  function generateId(prefix) {
    return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  }

  /* ---------- Public API ---------- */
  function getData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to handle new fields added later
        return {
          about: parsed.about || deepClone(DEFAULTS.about),
          skills: parsed.skills || deepClone(DEFAULTS.skills),
          experiences: parsed.experiences || deepClone(DEFAULTS.experiences),
          projects: parsed.projects || deepClone(DEFAULTS.projects)
        };
      }
    } catch (e) {
      console.warn('Failed to read portfolio data from localStorage:', e);
    }
    return deepClone(DEFAULTS);
  }

  function saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save portfolio data:', e);
    }
  }

  function resetToDefaults() {
    localStorage.removeItem(STORAGE_KEY);
    return deepClone(DEFAULTS);
  }

  function hasStoredData() {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }

  return {
    getData,
    saveData,
    resetToDefaults,
    hasStoredData,
    generateId,
    DEFAULTS: deepClone(DEFAULTS)
  };
})();
