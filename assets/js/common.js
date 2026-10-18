/*
 * Shared by all three styles: style switching, deep links, data helpers, the reading list and projects.
 * Load after /data/site.js.
 */
(() => {
  const SITE = window.SITE;
  const NOW = (() => { const d = new Date(); return d.getFullYear() + d.getMonth() / 12; })();
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  };

  /* ---------- styles ---------- */
  const STYLES = [
    { id: 'modern', label: 'Modern', path: '/' },
    { id: '2000s', label: '2000s', path: '/2000s/' },
    { id: '90s', label: '90s', path: '/90s/' },
  ];
  // Window ids every style understands, for ?open= links and for carrying open windows across a switch.
  const APPS = ['about', 'work', 'journey', 'projects', 'papers', 'reading', 'links', 'terminal'];

  const Styles = {
    list: STYLES,
    apps: APPS,
    current: document.documentElement.dataset.style || 'modern',
    // Switch to another style. `open` is a list of app ids to reopen there.
    go(id, open) {
      const s = STYLES.find(x => x.id === id);
      if (!s || s.id === Styles.current) return false;
      store.set('style', s.id);
      const q = open && open.length ? '?open=' + open.filter(a => APPS.includes(a)).join(',') : '';
      location.href = s.path + q;
      return true;
    },
    // App ids requested in the URL (?open=papers,reading), or null.
    requested() {
      const v = new URLSearchParams(location.search).get('open');
      return v ? v.split(',').filter(a => APPS.includes(a)) : null;
    },
    // Remember the style the visitor is looking at, so / opens it next time.
    remember() { store.set('style', Styles.current); },
  };

  /* ---------- data helpers ---------- */
  const LANES = [['industry', 'Industry'], ['research', 'Research'], ['education', 'Education']];
  const Data = {
    NOW,
    esc,
    // Roles with open-ended spans resolved to today's date.
    roles() {
      return SITE.roles.map(r => ({ ...r, current: r.spans.some(s => s[1] == null), spans: r.spans.map(([a, b]) => [a, b ?? NOW]) }));
    },
    // Rows in the [label, spans, when, detail, cls, current] shape the timeline windows use,
    // with a [laneName, null] header before each lane. laneClass maps a lane id to a CSS class.
    roleRows(laneClass = l => l, label = r => `${r.short || r.title}, ${r.org}`) {
      const rows = [];
      const roles = Data.roles();
      for (const [lane, name] of LANES) {
        rows.push([name, null]);
        for (const r of roles.filter(x => x.lane === lane)) {
          rows.push([label(r), r.spans, r.when, esc(r.detail), laneClass(lane, r), r.current, r]);
        }
      }
      return rows;
    },
    // Rows in the [year, venue, title, cites, older, url, paper] shape the papers windows use.
    paperRows() {
      return SITE.papers.map(p => [p.year, p.venue, p.short || p.title, p.cites, !!p.older, p.url || SITE.links.scholar, p]);
    },
    paperUrl(p) { return p.url || SITE.links.scholar; },
  };

  /* ---------- reading list ---------- */
  // Renders the reading list into `el`. Styles theme it through the .rl-* classes.
  const ReadingList = {
    render(el) {
      const b = SITE.books;
      const shelves = b.shelves;
      el.classList.add('rl');
      el.innerHTML = `
        <p class="rl-note">${esc(b.note)}</p>
        <div class="rl-tools">
          <label class="rl-search"><span>Search</span><input type="search" placeholder="Title or author" spellcheck="false"></label>
          <label class="rl-only"><input type="checkbox"> Highly recommended only</label>
        </div>
        <div class="rl-shelves"></div>
        <p class="rl-count" aria-live="polite"></p>`;
      const q = el.querySelector('input[type=search]'), only = el.querySelector('input[type=checkbox]');
      const out = el.querySelector('.rl-shelves'), count = el.querySelector('.rl-count');
      const draw = () => {
        const term = q.value.trim().toLowerCase();
        let n = 0;
        out.innerHTML = shelves.map(s => {
          const books = s.books.filter(x => (!only.checked || x.rec === 'high') && (!term || (x.title + ' ' + x.author).toLowerCase().includes(term)));
          n += books.length;
          if (!books.length) return '';
          return `<section class="rl-shelf"><h3>${esc(s.name)} <span>${books.length}</span></h3><ul>${books.map(x =>
            `<li class="${x.rec ? 'rl-' + x.rec : ''}"><span class="rl-title">${esc(x.title)}</span>${x.author ? ` <span class="rl-author">${esc(x.author)}</span>` : ''}${x.rec === 'high' ? ' <span class="rl-tag">Highly recommended</span>' : x.rec === 'no' ? ' <span class="rl-tag">Not recommended</span>' : ''}</li>`).join('')}</ul></section>`;
        }).join('') || '<p class="rl-empty">No books match.</p>';
        const total = shelves.reduce((t, s) => t + s.books.length, 0);
        count.textContent = `${n} of ${total} books`;
      };
      q.addEventListener('input', draw);
      only.addEventListener('change', draw);
      draw();
    },
  };

  /* ---------- projects ---------- */
  // Renders the projects into `el`. Styles theme it through the .pj-* classes.
  const Projects = {
    render(el) {
      const p = SITE.projects;
      const a = (url, text) => `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(text)}</a>`;
      const host = url => url.replace(/^https?:\/\//, '').replace(/\/$/, '');
      el.classList.add('pj');
      el.innerHTML = `<p class="pj-intro">${esc(p.intro)}</p>
        <ul class="pj-list">${p.items.map(x => `
          <li class="pj-item">
            <h3>${a(x.url, x.name)} <span class="pj-host">${esc(host(x.url))}</span></h3>
            <p class="pj-tag">${esc(x.tagline)}</p>
            <p class="pj-text">${esc(x.text)}</p>
            ${x.tools ? `<ul class="pj-tools">${x.tools.map(t => `<li>${a(t.url, t.name)}<span>${esc(t.text)}</span></li>`).join('')}</ul>` : ''}
          </li>`).join('')}
        </ul>`;
    },
  };

  window.Styles = Styles;
  window.SiteData = Data;
  window.ReadingList = ReadingList;
  window.Projects = Projects;
})();
