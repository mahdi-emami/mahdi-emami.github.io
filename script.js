const BASE_PATH = window.location.pathname.endsWith('/') ? window.location.pathname : window.location.pathname.replace(/\/[^/]*$/, '/');

async function loadJSON(path) {
  const url = new URL(`${BASE_PATH}${path}`, window.location.origin);
  const response = await fetch(`${url.href}?v=${Date.now()}`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Could not load ${url.href} (${response.status})`);
  const data = await response.json();
  return data;
}

function showLoadError(error) {
  console.error('Site content could not be loaded:', error);
  const message = document.createElement('div');
  message.className = 'site-load-error';
  message.innerHTML = `<strong>Content loading error</strong><span>${error.message}</span>`;
  document.body.prepend(message);
}

function renderProfile(profile) {
  if (!profile) return;
  document.title = profile.name || 'Portfolio';
  document.getElementById('heroName').textContent = profile.name || 'Your Name';
  document.getElementById('heroRole').textContent = profile.role || 'Portfolio / 2026';
  document.getElementById('heroIntro').textContent = profile.intro || 'Your introduction will appear here.';

  const email = document.getElementById('contactEmail');
  const github = document.getElementById('githubLink');
  const linkedin = document.getElementById('linkedinLink');
  if (profile.email) {
    email.href = `mailto:${profile.email}`;
    email.textContent = `${profile.email} ↗`;
  }
  if (profile.github && !profile.github.startsWith('DRAFT')) github.href = profile.github;
  if (profile.linkedin && !profile.linkedin.startsWith('DRAFT')) linkedin.href = profile.linkedin;
}

function renderProjects(projects) {
  const container = document.getElementById('projectsContainer');
  if (!container) return;
  if (!Array.isArray(projects) || projects.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No projects added yet.</p><small>Add a project to <code>data/projects.json</code>.</small></div>';
    return;
  }
  container.innerHTML = projects.map((project) => `
    <article class="project-card ${project.featured ? 'featured' : ''}">
      <div class="project-visual">${project.image ? `<img src="${project.image}" alt="${project.title || 'Project'}" onerror="this.style.display='none'">` : ''}<span>${project.title || 'Untitled'}</span></div>
      <div class="project-meta"><span>${project.category || 'Project'}</span><span>${project.year || ''}</span></div>
      <h3>${project.title || 'Untitled'}</h3>
      <p>${project.description || ''}</p>
    </article>
  `).join('');
}

function renderPrototypes(prototypes) {
  const container = document.getElementById('prototypesContainer');
  if (!container) return;
  if (!Array.isArray(prototypes) || prototypes.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No prototypes added yet.</p><small>Add a prototype to <code>data/prototypes.json</code>.</small></div>';
    return;
  }
  container.innerHTML = prototypes.map((prototype) => `
    <article class="project-card">
      <div class="project-visual">${prototype.image ? `<img src="${prototype.image}" alt="${prototype.title || 'Prototype'}" onerror="this.style.display='none'">` : ''}<span>${prototype.title || 'Untitled'}</span></div>
      <div class="project-meta"><span>${prototype.category || 'Prototype'}</span><span>${prototype.year || ''}</span></div>
      <h3>${prototype.title || 'Untitled'}</h3>
      <p>${prototype.description || ''}</p>
    </article>
  `).join('');
}

function renderSkills(skills) {
  const container = document.getElementById('skillsContainer');
  if (!container) return;
  if (!Array.isArray(skills) || skills.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No skills added yet.</p><small>Add a skill to <code>data/skills.json</code>.</small></div>';
    return;
  }
  container.innerHTML = skills.map((skill, index) => `
    <div class="skill-item"><span>${String(index + 1).padStart(2, '0')}</span><strong>${skill.title || 'Skill'}</strong><p>${skill.description || ''}</p></div>
  `).join('');
}

function renderSketchbook(sketchbook) {
  if (!Array.isArray(sketchbook) || sketchbook.length === 0) return;
  const first = sketchbook[0];
  document.getElementById('bookNumber').textContent = String(first.page || 1).padStart(2, '0');
  document.getElementById('bookTitle').textContent = first.title || 'Untitled';
  document.getElementById('bookDescription').textContent = first.description || '';
}

async function initSite() {
  try {
    const [profile, projects, prototypes, skills, sketchbook] = await Promise.all([
      loadJSON('data/profile.json'),
      loadJSON('data/projects.json'),
      loadJSON('data/prototypes.json'),
      loadJSON('data/skills.json'),
      loadJSON('data/sketchbook.json')
    ]);
    renderProfile(profile);
    renderProjects(projects);
    renderPrototypes(prototypes);
    renderSkills(skills);
    renderSketchbook(sketchbook);
  } catch (error) {
    showLoadError(error);
  }
}

const openBook = document.getElementById('openBook');
const closeBook = document.getElementById('closeBook');
const book = document.getElementById('book');
const nextPage = document.getElementById('nextPage');

if (openBook && closeBook && book) {
  openBook.addEventListener('click', () => book.classList.add('open'));
  closeBook.addEventListener('click', () => book.classList.remove('open'));
  book.addEventListener('click', (event) => { if (event.target === book) book.classList.remove('open'); });
}
if (nextPage && book) nextPage.addEventListener('click', () => book.classList.remove('open'));

document.addEventListener('DOMContentLoaded', initSite);
