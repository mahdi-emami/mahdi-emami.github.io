async function loadJSON(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}

function renderProfile(profile) {
  if (!profile || profile.status !== 'draft') return;
  document.title = profile.name || 'Portfolio';
}

function renderProjects(projects) {
  const container = document.querySelector('#work .empty-state');
  if (!container || !Array.isArray(projects) || projects.length === 0) return;
  container.innerHTML = projects.map((project) => `
    <article class="project-card">
      <div class="project-visual"><span>${project.title || 'Untitled'}</span></div>
      <div class="project-meta"><span>${project.category || 'Project'}</span><span>${project.year || ''}</span></div>
      <h3>${project.title || 'Untitled'}</h3>
      <p>${project.description || ''}</p>
    </article>
  `).join('');
}

function renderSkills(skills) {
  const container = document.querySelector('#skills .empty-state');
  if (!container || !Array.isArray(skills) || skills.length === 0) return;
  container.innerHTML = skills.map((skill, index) => `
    <div class="skill-item">
      <span>${String(index + 1).padStart(2, '0')}</span>
      <strong>${skill.title || 'Skill'}</strong>
      <p>${skill.description || ''}</p>
    </div>
  `).join('');
}

function renderSketchbook(sketchbook) {
  const page = document.querySelector('.page-right');
  if (!page || !Array.isArray(sketchbook) || sketchbook.length === 0) return;
  const first = sketchbook[0];
  page.querySelector('span').textContent = String(first.page || 1).padStart(2, '0');
  page.querySelector('h3').textContent = first.title || 'Untitled';
  page.querySelector('p').textContent = first.description || '';
}

function renderContact(profile) {
  if (!profile || profile.status !== 'draft') return;
  const contact = document.querySelector('.contact-content');
  if (!contact) return;
  contact.innerHTML = `
    <h2>Let's connect.</h2>
    <p class="empty-contact">${profile.email || 'Add your email in data/profile.json'}</p>
  `;
}

async function initSite() {
  try {
    const [profile, projects, skills, sketchbook] = await Promise.all([
      loadJSON('data/profile.json'),
      loadJSON('data/projects.json'),
      loadJSON('data/skills.json'),
      loadJSON('data/sketchbook.json')
    ]);
    renderProfile(profile);
    renderProjects(projects);
    renderSkills(skills);
    renderSketchbook(sketchbook);
    renderContact(profile);
  } catch (error) {
    console.error('Site content could not be loaded:', error);
  }
}

const openBook = document.getElementById('openBook');
const closeBook = document.getElementById('closeBook');
const book = document.getElementById('book');
const nextPage = document.getElementById('nextPage');

if (openBook && closeBook && book) {
  openBook.addEventListener('click', () => book.classList.add('open'));
  closeBook.addEventListener('click', () => book.classList.remove('open'));
  book.addEventListener('click', (event) => {
    if (event.target === book) book.classList.remove('open');
  });
}

if (nextPage && book) {
  nextPage.addEventListener('click', () => book.classList.remove('open'));
}

document.addEventListener('DOMContentLoaded', initSite);
