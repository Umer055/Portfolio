/* ─── MAIN SCRIPT ─── */

/* ── Theme ── */
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  html.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
  localStorage.setItem('uf_theme', html.getAttribute('data-theme'));
}
(function initTheme() {
  const saved = localStorage.getItem('uf_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
})();

/* ── Hamburger ── */
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

/* ── Ticker ── */
const tickerEvents = [
  {cls:'evt-red', sev:'[ALERT]', msg:'Suspicious lateral movement detected — 192.168.10.45 → DC01'},
  {cls:'evt-green', sev:'[INFO]', msg:'User authentication successful — admin@domain.local from 10.0.1.22'},
  {cls:'evt-amber', sev:'[WARN]', msg:'Failed SSH login: 5 attempts in 60s from 185.220.101.x'},
  {cls:'evt-red', sev:'[ALERT]', msg:'Malware signature matched: Mimikatz activity on WORKSTATION-07'},
  {cls:'evt-green', sev:'[INFO]', msg:'Vulnerability scan complete — 3 critical, 11 high findings'},
  {cls:'evt-amber', sev:'[WARN]', msg:'DNS query to known C2 domain blocked — 10.0.2.115'},
  {cls:'evt-red', sev:'[ALERT]', msg:'Ransomware behavior: mass file encryption attempt — quarantined'},
  {cls:'evt-green', sev:'[INFO]', msg:'ISO 27001 control check passed: A.12.4.1 — event logging confirmed'},
  {cls:'evt-amber', sev:'[WARN]', msg:'Unusual data exfiltration: 2.4GB outbound to 103.42.x.x'},
  {cls:'evt-green', sev:'[INFO]', msg:'Cloud compliance scan: GCP project cleared for NIST 800-53'},
];
const track = document.getElementById('tickerTrack');
if (track) {
  [...tickerEvents, ...tickerEvents].forEach(e => {
    const s = document.createElement('span');
    s.innerHTML = `<span class="${e.cls}">${e.sev}</span> ${e.msg}`;
    track.appendChild(s);
  });
}

/* ── Terminal Animation ── */
async function typeText(el, text, speed = 55) {
  return new Promise(r => {
    let i = 0;
    const t = setInterval(() => { el.textContent += text[i++]; if (i >= text.length) { clearInterval(t); r(); }}, speed);
  });
}

async function runTerminal() {
  await new Promise(r => setTimeout(r, 400));
  await typeText(document.getElementById('cmd1'), 'whoami');
  const o1 = document.getElementById('out1');
  o1.classList.remove('hidden');
  o1.innerHTML = '<span style="color:var(--green)">umar.farooq — Cybersecurity Analyst // SOC | GRC | DFIR</span>';

  await new Promise(r => setTimeout(r, 600));
  document.getElementById('line2').classList.remove('hidden');
  await typeText(document.getElementById('cmd2'), 'cat /etc/clearance');
  const o2 = document.getElementById('out2');
  o2.classList.remove('hidden');
  o2.innerHTML = '<span style="color:var(--accent)">Internships: 2 | CTF Wins: 7+ | BlackHat MEA: TOP 50 | Riyadh Onsite</span>';

  await new Promise(r => setTimeout(r, 600));
  document.getElementById('line3').classList.remove('hidden');
  await typeText(document.getElementById('cmd3'), 'nmap --skills umar.local');
  const o3 = document.getElementById('out3');
  o3.classList.remove('hidden');
  o3.innerHTML = '<span style="color:var(--text-dim)">PORT       STATE    SERVICE</span>';
  const o3b = document.getElementById('out3b');
  o3b.classList.remove('hidden');
  o3b.innerHTML = '<span style="color:var(--green)">SOC/443    open     Wazuh · Rapid7 · Kaspersky</span>';

  await new Promise(r => setTimeout(r, 300));
  document.getElementById('line4').classList.remove('hidden');
}
// runTerminal();

/* ── Case Accordion ── */
function toggleCase(id) {
  const item = document.getElementById(id);
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.case-item').forEach(c => c.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

/* ── Skill Bars ── */
function animateSkillBars(group) {
  group.querySelectorAll('.sk-fill').forEach(bar => {
    const w = bar.getAttribute('data-w');
    if (w) bar.style.width = w + '%';
  });
}
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { animateSkillBars(e.target); skillObs.unobserve(e.target); }});
}, { threshold: 0.2 });
document.querySelectorAll('.skill-group').forEach(g => skillObs.observe(g));

/* ── Scroll Reveal ── */
const revObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) { setTimeout(() => e.target.classList.add('visible'), i * 60); revObs.unobserve(e.target); }
  });
}, { threshold: 0.06 });
document.querySelectorAll('section > *, .timeline-card, .ach-card, .skill-group, .case-item').forEach(el => {
  el.classList.add('reveal'); revObs.observe(el);
});

/* ── Timeline Renderer ── */
function renderTimeline() {
  const container = document.getElementById('timelineContainer');
  if (!container) return;
  const experiences = loadData(KEYS.experience, DEFAULT_EXPERIENCE);
  container.innerHTML = experiences.map(exp => {
    const cardInner = `
        <div class="tl-card-header">
          <div>
            <span class="tl-incident-id">${exp.incidentId}</span>
            <h3>${exp.role}${exp.link ? ' <span class="card-link-icon">↗</span>' : ''}</h3>
            <span class="tl-org">${exp.org}</span>
          </div>
          <div class="tl-meta">
            <span class="tl-date">${exp.date}</span>
            <span class="tl-badge ${exp.status}">${exp.status === 'ongoing' ? 'ACTIVE' : 'COMPLETED'}</span>
          </div>
        </div>
        <div class="tl-card-body">
          <p>${exp.desc}</p>
          ${exp.findings.length ? `<ul class="tl-findings">${exp.findings.map(f => `<li>${f}</li>`).join('')}</ul>` : ''}
          <div class="tl-tools">${exp.tools.map(t => `<span class="tool-tag">${t}</span>`).join('')}</div>
        </div>`;
    const card = exp.link
      ? `<a class="timeline-card ${exp.status === 'ongoing' ? 'ongoing-card' : ''} card-linkable" href="${exp.link}" target="_blank" rel="noopener noreferrer">${cardInner}</a>`
      : `<div class="timeline-card ${exp.status === 'ongoing' ? 'ongoing-card' : ''}">${cardInner}</div>`;
    return `
    <div class="timeline-item">
      <div class="timeline-connector">
        <div class="tl-dot ${exp.status === 'ongoing' ? 'pulse-dot' : 'active'}"></div>
        ${exp.status !== 'ongoing' ? '<div class="tl-line"></div>' : ''}
      </div>
      ${card}
    </div>`;
  }).join('');
}

/* ── Achievements Renderer ── */
function renderAchievements() {
  const grid = document.getElementById('achievementsGrid');
  if (!grid) return;
  const achievements = loadData(KEYS.achievements, DEFAULT_ACHIEVEMENTS);
  grid.innerHTML = achievements.map(a => {
    const cardInner = `
      <div class="ach-rank-badge">${a.rank}</div>
      <div class="ach-icon">◆${a.link ? '<span class="card-link-icon">↗</span>' : ''}</div>
      <div class="ach-content">
        <span class="ach-event">${a.event}</span>
        <h3>${a.title}</h3>
        <p>${a.desc}</p>
        <span class="ach-date">${a.date}</span>
        ${a.image ? `<div class="ach-img-wrap"><img src="${a.image}" alt="${a.event}" loading="lazy" onerror="this.parentElement.style.display='none'"/></div>` : ''}
      </div>
      ${a.featured ? '<div class="ach-glow"></div>' : ''}`;
    return a.link
      ? `<a class="ach-card ${a.featured ? 'featured' : ''} card-linkable" href="${a.link}" target="_blank" rel="noopener noreferrer">${cardInner}</a>`
      : `<div class="ach-card ${a.featured ? 'featured' : ''}">${cardInner}</div>`;
  }).join('');
}

/* ── Blog Preview Renderer (index page - shows 3) ── */
function renderBlogPreview() {
  const grid = document.getElementById('blogPreviewGrid');
  if (!grid) return;
  const posts = loadData(KEYS.posts, DEFAULT_POSTS).slice(0, 3);
  grid.innerHTML = posts.map(p => `
    <a href="blog.html?id=${p.id}" class="blog-card">
      ${p.image ? `<div class="blog-card-img"><img src="${p.image}" alt="${p.title}" loading="lazy" onerror="this.parentElement.style.display='none'"/></div>` : ''}
      <span class="blog-card-cat ${p.category}">${p.category.toUpperCase()}</span>
      <h3>${p.title}</h3>
      <p>${p.excerpt}</p>
      <div class="blog-card-meta"><span>${p.date}</span><span class="blog-card-read">READ →</span></div>
    </a>
  `).join('');
}

/* ── Admin Tab Switch ── */
function switchAdminTab(tab) {
  document.querySelectorAll('.ad-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.ad-tab-content').forEach(c => c.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById('tab-' + tab).classList.add('active');
}

/* ── Admin: Render Lists ── */
function renderAdminLists() {
  renderAdminPosts();
  renderAdminExp();
  renderAdminAch();
}

function renderAdminPosts() {
  const el = document.getElementById('adminPostList');
  if (!el) return;
  const posts = loadData(KEYS.posts, DEFAULT_POSTS);
  el.innerHTML = '<div class="ad-list-title">EXISTING REPORTS</div>' + posts.map(p => `
    <div class="ad-list-item">
      <span class="blog-card-cat ${p.category}">${p.category}</span>
      <span class="ad-item-title">${p.title}</span>
      <span class="ad-item-date">${p.date}</span>
      <div class="ad-item-actions">
        <button onclick="editPost('${p.id}')">EDIT</button>
        <button class="del" onclick="deletePost('${p.id}')">DELETE</button>
      </div>
    </div>
  `).join('');
}

function renderAdminExp() {
  const el = document.getElementById('adminExpList');
  if (!el) return;
  const exps = loadData(KEYS.experience, DEFAULT_EXPERIENCE);
  el.innerHTML = '<div class="ad-list-title">EXISTING ENTRIES</div>' + exps.map(e => `
    <div class="ad-list-item">
      <span class="tl-badge ${e.status}">${e.status === 'ongoing' ? 'ACTIVE' : 'DONE'}</span>
      <span class="ad-item-title">${e.role} @ ${e.org}</span>
      <span class="ad-item-date">${e.date}</span>
      <div class="ad-item-actions">
        <button onclick="editExp('${e.id}')">EDIT</button>
        <button class="del" onclick="deleteExp('${e.id}')">DELETE</button>
      </div>
    </div>
  `).join('');
}

function renderAdminAch() {
  const el = document.getElementById('adminAchList');
  if (!el) return;
  const achs = loadData(KEYS.achievements, DEFAULT_ACHIEVEMENTS);
  el.innerHTML = '<div class="ad-list-title">EXISTING AWARDS</div>' + achs.map(a => `
    <div class="ad-list-item">
      <span class="ach-rank-badge" style="position:static;font-size:0.8rem;color:var(--accent)">${a.rank}</span>
      <span class="ad-item-title">${a.event} — ${a.title}</span>
      <span class="ad-item-date">${a.date}</span>
      <div class="ad-item-actions">
        <button onclick="editAch('${a.id}')">EDIT</button>
        <button class="del" onclick="deleteAch('${a.id}')">DELETE</button>
      </div>
    </div>
  `).join('');
}

/* ── Blog CRUD ── */
function publishPost() {
  const id = document.getElementById('editPostId').value || 'post-' + Date.now();
  const post = {
    id,
    title: document.getElementById('npTitle').value.trim(),
    category: document.getElementById('npCategory').value,
    date: document.getElementById('npDate').value.trim() || 'Recent',
    excerpt: document.getElementById('npExcerpt').value.trim(),
    content: document.getElementById('npContent').value.trim()
  };
  if (!post.title || !post.content) { alert('Title and content required.'); return; }
  let posts = loadData(KEYS.posts, DEFAULT_POSTS);
  const idx = posts.findIndex(p => p.id === id);
  if (idx >= 0) posts[idx] = post; else posts.unshift(post);
  saveData(KEYS.posts, posts);
  clearPostForm();
  renderAdminPosts();
  renderBlogPreview();
  if (typeof renderBlogPage === 'function') renderBlogPage();
}

function editPost(id) {
  const posts = loadData(KEYS.posts, DEFAULT_POSTS);
  const p = posts.find(x => x.id === id);
  if (!p) return;
  document.getElementById('editPostId').value = p.id;
  document.getElementById('npTitle').value = p.title;
  document.getElementById('npCategory').value = p.category;
  document.getElementById('npDate').value = p.date;
  document.getElementById('npExcerpt').value = p.excerpt;
  document.getElementById('npContent').value = p.content;
  document.getElementById('tab-blog').scrollIntoView({ behavior: 'smooth' });
}

function deletePost(id) {
  if (!confirm('Delete this report?')) return;
  let posts = loadData(KEYS.posts, DEFAULT_POSTS);
  saveData(KEYS.posts, posts.filter(p => p.id !== id));
  renderAdminPosts();
  renderBlogPreview();
  if (typeof renderBlogPage === 'function') renderBlogPage();
}

function clearPostForm() {
  ['editPostId','npTitle','npExcerpt','npContent','npDate'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
}

/* ── Experience CRUD ── */
function publishExperience() {
  const id = document.getElementById('editExpId').value || 'exp-' + Date.now();
  const inc = 'INC-' + new Date().getFullYear() + '-' + String(Date.now()).slice(-3);
  const findings = document.getElementById('expFindings').value.split(',').map(s => s.trim()).filter(Boolean);
  const tools = document.getElementById('expTools').value.split(',').map(s => s.trim()).filter(Boolean);
  const exp = {
    id, incidentId: inc,
    role: document.getElementById('expRole').value.trim(),
    org: document.getElementById('expOrg').value.trim(),
    date: document.getElementById('expDate').value.trim(),
    status: document.getElementById('expStatus').value,
    desc: document.getElementById('expDesc').value.trim(),
    findings, tools
  };
  if (!exp.role || !exp.org) { alert('Role and organization required.'); return; }
  let exps = loadData(KEYS.experience, DEFAULT_EXPERIENCE);
  const idx = exps.findIndex(e => e.id === id);
  if (idx >= 0) exps[idx] = exp; else exps.unshift(exp);
  saveData(KEYS.experience, exps);
  clearExpForm();
  renderAdminExp();
  renderTimeline();
}

function editExp(id) {
  const exps = loadData(KEYS.experience, DEFAULT_EXPERIENCE);
  const e = exps.find(x => x.id === id);
  if (!e) return;
  document.getElementById('editExpId').value = e.id;
  document.getElementById('expRole').value = e.role;
  document.getElementById('expOrg').value = e.org;
  document.getElementById('expDate').value = e.date;
  document.getElementById('expStatus').value = e.status;
  document.getElementById('expDesc').value = e.desc;
  document.getElementById('expFindings').value = e.findings.join(', ');
  document.getElementById('expTools').value = e.tools.join(', ');
}

function deleteExp(id) {
  if (!confirm('Delete this entry?')) return;
  let exps = loadData(KEYS.experience, DEFAULT_EXPERIENCE);
  saveData(KEYS.experience, exps.filter(e => e.id !== id));
  renderAdminExp();
  renderTimeline();
}

function clearExpForm() {
  ['editExpId','expRole','expOrg','expDate','expDesc','expFindings','expTools'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
}

/* ── Achievements CRUD ── */
function publishAchievement() {
  const id = document.getElementById('editAchId').value || 'ach-' + Date.now();
  const ach = {
    id,
    event: document.getElementById('achEvent').value.trim(),
    rank: document.getElementById('achRank').value.trim(),
    title: document.getElementById('achTitle').value.trim(),
    date: document.getElementById('achDate').value.trim(),
    desc: document.getElementById('achDesc').value.trim(),
    featured: document.getElementById('achFeatured').checked
  };
  if (!ach.event || !ach.title) { alert('Event and title required.'); return; }
  let achs = loadData(KEYS.achievements, DEFAULT_ACHIEVEMENTS);
  const idx = achs.findIndex(a => a.id === id);
  if (idx >= 0) achs[idx] = ach; else achs.unshift(ach);
  saveData(KEYS.achievements, achs);
  clearAchForm();
  renderAdminAch();
  renderAchievements();
}

function editAch(id) {
  const achs = loadData(KEYS.achievements, DEFAULT_ACHIEVEMENTS);
  const a = achs.find(x => x.id === id);
  if (!a) return;
  document.getElementById('editAchId').value = a.id;
  document.getElementById('achEvent').value = a.event;
  document.getElementById('achRank').value = a.rank;
  document.getElementById('achTitle').value = a.title;
  document.getElementById('achDate').value = a.date;
  document.getElementById('achDesc').value = a.desc;
  document.getElementById('achFeatured').checked = a.featured;
}

function deleteAch(id) {
  if (!confirm('Delete this award?')) return;
  let achs = loadData(KEYS.achievements, DEFAULT_ACHIEVEMENTS);
  saveData(KEYS.achievements, achs.filter(a => a.id !== id));
  renderAdminAch();
  renderAchievements();
}

function clearAchForm() {
  ['editAchId','achEvent','achRank','achTitle','achDate','achDesc'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  const cb = document.getElementById('achFeatured'); if (cb) cb.checked = false;
}

/* ── Projects Rendering ── */
function renderProjects() {
  const KEYS = { projects: 'uf_projects' };
  const projectsSection = document.getElementById('projects');
  if (!projectsSection) return;

  // Load from localStorage or use defaults
  let projects = [];
  try {
    const stored = localStorage.getItem(KEYS.projects);
    if (stored) {
      projects = JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading projects:', e);
  }

  // If no projects in localStorage, try loading from DEFAULT_PROJECTS if defined
  if (projects.length === 0 && typeof DEFAULT_PROJECTS !== 'undefined') {
    projects = DEFAULT_PROJECTS;
  }

  if (!projects || projects.length === 0) return;

  // Remove old hardcoded cases
  const existingCases = projectsSection.querySelectorAll('.case-item');
  existingCases.forEach(el => el.remove());

  // Create and insert new cases
  projects.forEach((project, idx) => {
    const caseId = `case${idx + 1}`;
    const indicatorClass = project.indicator === 'active' ? 'active-indicator' : 'resolved-indicator';
    const categoryClass = getCategoryClass(project.category);
    const severityClass = getSeverityClass(project.severity);
    
    const statusMap = {
      'active': 'IN PROGRESS',
      'completed': 'COMPLETED',
      'pending': 'PENDING'
    };

    const caseHTML = `
      <div class="case-item" id="${caseId}">
        <div class="case-row" onclick="toggleCase('${caseId}')">
          <div class="ap-col case-id">${escapeHtml(project.caseId)}</div>
          <div class="ap-col case-name">
            <span class="case-indicator ${indicatorClass}"></span>${escapeHtml(project.name)}
          </div>
          <div class="ap-col"><span class="cat-tag ${categoryClass}">${project.category.toUpperCase()}</span></div>
          <div class="ap-col"><span class="sev ${severityClass}">${project.severity.toUpperCase()}</span></div>
          <div class="ap-col"><span class="status-badge ${project.status}">${statusMap[project.status] || project.status.toUpperCase()}</span></div>
          <span class="expand-arrow">▼</span>
        </div>
        <div class="case-details">
          <div class="case-report">
            <div class="report-section"><span class="report-label">OVERVIEW</span>
              <p>${escapeHtml(project.overview)}</p>
            </div>
            <div class="report-grid">
              <div class="report-section"><span class="report-label">FRAMEWORKS</span>
                <div class="report-tags">
                  ${(project.frameworks || []).map(f => `<span class="tool-tag">${escapeHtml(f)}</span>`).join('')}
                </div>
              </div>
              <div class="report-section"><span class="report-label">CAPABILITIES</span>
                <ul class="report-list">
                  ${(project.capabilities || []).map(c => `<li>${escapeHtml(c)}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    projectsSection.insertAdjacentHTML('beforeend', caseHTML);
  });
}

function getCategoryClass(category) {
  const map = {
    'cloud': 'cloud',
    'offense': 'offense',
    'dfir': 'dfir',
    'research': 'research',
    'ctf': 'ctf'
  };
  return map[category] || 'dev';
}

function getSeverityClass(severity) {
  const map = {
    'critical': 'critical',
    'high': 'high',
    'medium': 'medium',
    'low': 'low'
  };
  return map[severity] || 'medium';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

/* ── Skills/Operator Loadout Rendering ── */
function renderOperatorLoadout() {
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;

  const groups = loadData(KEYS.operatorLoadout, DEFAULT_OPERATOR_LOADOUT);
  if (!groups || !groups.length) return;

  const dashboard = skillsSection.querySelector('.skills-dashboard');
  if (!dashboard) return;

  dashboard.innerHTML = groups.map(group => {
    if (group.isGrc) {
      return `
        <div class="skill-group grc-matrix-group">
          <div class="sg-header"><span class="sg-icon">◈</span><span>${escapeHtml(group.name)}</span></div>
          <div class="compliance-matrix">
            ${group.items.map(fw => `
              <div class="cm-item">
                <div class="cm-framework">${escapeHtml(fw.label)}</div>
                <div class="cm-controls">
                  ${fw.controls.map(c => `<span class="cm-ctrl ${c.active ? 'active' : 'partial'}" title="${escapeHtml(c.title)}">${escapeHtml(c.code)}</span>`).join('')}
                </div>
                <div class="cm-status">${escapeHtml(fw.status)}</div>
              </div>
            `).join('')}
          </div>
        </div>`;
    }
    const colorClass = group.color === 'amber' ? 'amber' : group.color === 'red' ? 'red' : group.color === 'green' ? 'green' : '';
    return `
      <div class="skill-group">
        <div class="sg-header"><span class="sg-icon">◈</span><span>${escapeHtml(group.name)}</span></div>
        <div class="skill-list">
          ${group.items.map(item => `
            <div class="skill-item">
              <span>${escapeHtml(item.label)}</span>
              <div class="sk-bar"><div class="sk-fill ${colorClass}" data-w="${item.value}"></div></div>
            </div>
          `).join('')}
        </div>
      </div>`;
  }).join('');

  dashboard.querySelectorAll('.skill-group').forEach(g => skillObs.observe(g));
}

/* ── Init ── */
/* ── Threat Posture Risk Panel ── */
function renderRiskPanel() {
  const panel = document.getElementById('riskPanel');
  if (!panel) return;
  const skills = loadData(KEYS.skills, DEFAULT_SKILLS);
  const colorClass = { accent: '', green: 'green', amber: 'amber' };
  panel.innerHTML = '<div class="risk-header">THREAT POSTURE</div>' +
    skills.map(sk => {
      const cls = colorClass[sk.color] || '';
      const inner = `
        <span>${sk.label}</span>
        <div class="risk-bar"><div class="risk-fill ${cls}" style="width:${sk.value}%"></div></div>
        <span class="risk-score ${cls || 'accent-score'}">${sk.value}</span>`;
      if (sk.link) {
        return `<a class="risk-row risk-row-link" href="${sk.link}" target="_blank" rel="noopener noreferrer">${inner}</a>`;
      }
      return `<div class="risk-row">${inner}</div>`;
    }).join('');
}

function initGlobeInteraction() {
  const card = document.querySelector('.hero-globe-card');
  const globe = document.querySelector('.globe-shell');
  if (!card || !globe) return;
  card.addEventListener('pointermove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 22;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    globe.style.transform = `rotateX(${y}deg) rotateY(${x}deg)`;
  });
  card.addEventListener('pointerleave', () => {
    globe.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  renderOperatorLoadout();
  renderTimeline();
  renderAchievements();
  renderBlogPreview();
  renderRiskPanel();
  initGlobeInteraction();
});
