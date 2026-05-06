/* ─── BLOG PAGE SCRIPT ─── */

let currentFilter = 'all';

function parseMarkdown(text) {
  if (!text) return '';

  // Escape HTML in raw text (but not inside code blocks — handled separately)
  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  const lines = text.split('\n');
  let html = '';
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // ── Fenced code block ```lang
    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim();
      let code = '';
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        code += escHtml(lines[i]) + '\n';
        i++;
      }
      html += `<pre class="md-pre"><code class="md-code-block${lang ? ' lang-'+escHtml(lang) : ''}">${code.trimEnd()}</code></pre>`;
      i++;
      continue;
    }

    // ── Headings
    if (line.startsWith('### ')) { html += `<h3 class="md-h3">${inline(line.slice(4))}</h3>`; i++; continue; }
    if (line.startsWith('## '))  { html += `<h2 class="md-h2">${inline(line.slice(3))}</h2>`; i++; continue; }
    if (line.startsWith('# '))   { html += `<h1 class="md-h1">${inline(line.slice(2))}</h1>`; i++; continue; }

    // ── Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) { html += '<hr class="md-hr"/>'; i++; continue; }

    // ── Blockquote
    if (line.startsWith('> ')) {
      let bq = '';
      while (i < lines.length && lines[i].startsWith('> ')) {
        bq += `<p>${inline(lines[i].slice(2))}</p>`;
        i++;
      }
      html += `<blockquote class="md-blockquote">${bq}</blockquote>`;
      continue;
    }

    // ── Unordered list
    if (/^[-*+] /.test(line)) {
      let list = '';
      while (i < lines.length && /^[-*+] /.test(lines[i])) {
        list += `<li>${inline(lines[i].slice(2))}</li>`;
        i++;
      }
      html += `<ul class="md-ul">${list}</ul>`;
      continue;
    }

    // ── Ordered list
    if (/^\d+\. /.test(line)) {
      let list = '';
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        list += `<li>${inline(lines[i].replace(/^\d+\. /,''))}</li>`;
        i++;
      }
      html += `<ol class="md-ol">${list}</ol>`;
      continue;
    }

    // ── Table
    if (line.includes('|') && i + 1 < lines.length && /^\|?[\s\-:|]+\|/.test(lines[i+1])) {
      const headers = line.split('|').map(c=>c.trim()).filter(Boolean);
      i += 2; // skip separator
      let rows = '';
      while (i < lines.length && lines[i].includes('|')) {
        const cells = lines[i].split('|').map(c=>c.trim()).filter(Boolean);
        rows += `<tr>${cells.map(c=>`<td>${inline(c)}</td>`).join('')}</tr>`;
        i++;
      }
      html += `<div class="md-table-wrap"><table class="md-table"><thead><tr>${headers.map(h=>`<th>${inline(h)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`;
      continue;
    }

    // ── Empty line
    if (line.trim() === '') { html += '<div class="md-spacer"></div>'; i++; continue; }

    // ── Paragraph
    html += `<p class="md-p">${inline(line)}</p>`;
    i++;
  }

  return html;
}

// Inline Markdown: bold, italic, code, images, links, strikethrough
function inline(text) {
  function escHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  let t = escHtml(text);
  // Images before links  ![alt](url)
  t = t.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_,alt,src)=>`<img class="md-img" src="${src}" alt="${alt}" loading="lazy" onerror="this.style.display='none'"/>`);
  // Links [text](url)
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_,txt,href)=>`<a class="md-link" href="${href}" target="_blank" rel="noopener noreferrer">${txt}</a>`);
  // Inline code
  t = t.replace(/`([^`]+)`/g, (_,c)=>`<code class="md-code">${c}</code>`);
  // Bold+italic
  t = t.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  // Bold
  t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/__(.+?)__/g, '<strong>$1</strong>');
  // Italic
  t = t.replace(/\*(.+?)\*/g, '<em>$1</em>');
  t = t.replace(/_(.+?)_/g, '<em>$1</em>');
  // Strikethrough
  t = t.replace(/~~(.+?)~~/g, '<del>$1</del>');
  return t;
}

function renderBlogPage() {
  const grid = document.getElementById('blogFullGrid');
  if (!grid) return;
  const posts = loadData(KEYS.posts, DEFAULT_POSTS);
  const filtered = currentFilter === 'all' ? posts : posts.filter(p => p.category === currentFilter);
  if (!filtered.length) {
    grid.innerHTML = '<div class="blog-empty">No reports in this category yet.</div>';
    return;
  }
  grid.innerHTML = filtered.map(p => `
    <div class="blog-card-full reveal" onclick="openPost('${p.id}')">
      ${p.image ? `<div class="bcf-img"><img src="${p.image}" alt="${p.title}" loading="lazy" onerror="this.parentElement.style.display='none'"/></div>` : ''}
      <div class="bcf-top">
        <span class="blog-card-cat ${p.category}">${p.category.toUpperCase()}</span>
        <span class="blog-card-meta-date">${p.date}</span>
      </div>
      <h2 class="bcf-title">${p.title}</h2>
      <p class="bcf-excerpt">${p.excerpt}</p>
      <span class="bcf-read">READ FULL REPORT →</span>
    </div>
  `).join('');
  // Scroll reveal
  setTimeout(() => {
    grid.querySelectorAll('.reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 80);
    });
  }, 50);
}

function filterBlog(cat, btn) {
  currentFilter = cat;
  document.querySelectorAll('.blog-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderBlogPage();
}

function openPost(id) {
  const posts = loadData(KEYS.posts, DEFAULT_POSTS);
  const post = posts.find(p => p.id === id);
  if (!post) return;
  document.getElementById('blogListView').style.display = 'none';
  document.getElementById('blogPostView').style.display = 'block';
  document.getElementById('postCat').textContent = post.category.toUpperCase();
  document.getElementById('postCat').className = `blog-card-cat ${post.category}`;
  document.getElementById('postTitle').textContent = post.title;
  document.getElementById('postDate').textContent = post.date;
  document.getElementById('postNavLabel').textContent = post.category.toUpperCase() + ' // ' + post.date;
  // Hero image
  let heroEl = document.getElementById('postHero');
  if (!heroEl) {
    heroEl = document.createElement('div');
    heroEl.id = 'postHero';
    heroEl.className = 'post-hero';
    const header = document.querySelector('.post-header');
    header.parentNode.insertBefore(heroEl, header);
  }
  if (post.image) {
    heroEl.innerHTML = `<img src="${post.image}" alt="${post.title}" onerror="this.parentElement.style.display='none'"/>`;
    heroEl.style.display = 'block';
  } else {
    heroEl.style.display = 'none';
    heroEl.innerHTML = '';
  }
  document.getElementById('postBody').innerHTML = parseMarkdown(post.content);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // Update URL without reload
  history.pushState({ postId: id }, '', `blog.html?id=${id}`);
}

function showBlogList() {
  document.getElementById('blogListView').style.display = 'block';
  document.getElementById('blogPostView').style.display = 'none';
  history.pushState({}, '', 'blog.html');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Handle browser back button
window.addEventListener('popstate', e => {
  if (e.state && e.state.postId) {
    openPost(e.state.postId);
  } else {
    showBlogList();
  }
});

// Override openAdminDrawer for blog page
function openAdminDrawer() {
  document.getElementById('adminDrawer').style.display = 'flex';
  renderAdminPosts();
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  // Theme
  const saved = localStorage.getItem('uf_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);

  // Ticker
  const tickerEvents = [
    {cls:'evt-red',sev:'[ALERT]',msg:'Suspicious lateral movement detected — 192.168.10.45 → DC01'},
    {cls:'evt-green',sev:'[INFO]',msg:'Compliance scan complete — AWS environment cleared'},
    {cls:'evt-amber',sev:'[WARN]',msg:'Failed SSH login: 5 attempts in 60s from 185.220.101.x'},
    {cls:'evt-red',sev:'[ALERT]',msg:'Malware signature matched: Mimikatz on WORKSTATION-07'},
    {cls:'evt-green',sev:'[INFO]',msg:'CTF challenge deployed — Forensics category online'},
  ];
  const track = document.getElementById('tickerTrack');
  if (track) {
    [...tickerEvents,...tickerEvents].forEach(e => {
      const s = document.createElement('span');
      s.innerHTML = `<span class="${e.cls}">${e.sev}</span> ${e.msg}`;
      track.appendChild(s);
    });
  }

  // Hamburger
  document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('open');
  });

  // Check for direct post link
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');
  if (postId) {
    renderBlogPage();
    openPost(postId);
  } else {
    renderBlogPage();
  }
});
