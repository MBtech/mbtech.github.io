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
  // Renders the reading list into `el` as piles of books lying flat, one or more piles per shelf.
  // Styles theme it through the .rl-* classes.
  const PILE = 10;
  const HUES = [150, 335, 38, 218, 12, 192];
  // Stable pseudo-random numbers per book, so sizes and colours stay the same between visits.
  const hash = s => { let h = 2166136261; for (const c of s) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rnd = (b, k) => (hash(b.title + '#' + k) % 1000) / 1000;
  const surname = a => (a || '').split(/, | and /)[0].trim().split(' ').pop();
  const ReadingList = {
    render(el) {
      const b = SITE.books;
      const books = b.shelves.flatMap((s, si) => s.books.map((x, i) => ({ ...x, shelf: s.name, si, key: si + '/' + i })));
      el.classList.add('rl');
      el.innerHTML = `
        <p class="rl-note">${esc(b.note)}</p>
        <div class="rl-tools">
          <label class="rl-search"><span>Search</span><input type="search" placeholder="Title or author" spellcheck="false"></label>
          <label class="rl-only"><input type="checkbox"> Highly recommended only</label>
        </div>
        <p class="rl-hint">The book on top of each pile is the one I recommend most. <span class="rl-star">★</span> means highly recommended; a book with its pages facing out is one I don’t recommend.</p>
        <div class="rl-pick" aria-live="polite"></div>
        <div class="rl-table"></div>
        <p class="rl-count" aria-live="polite"></p>`;
      const q = el.querySelector('input[type=search]'), only = el.querySelector('input[type=checkbox]');
      const table = el.querySelector('.rl-table'), pick = el.querySelector('.rl-pick'), count = el.querySelector('.rl-count');
      let picked = null;
      const matches = x => {
        const term = q.value.trim().toLowerCase();
        return (!only.checked || x.rec === 'high') && (!term || (x.title + ' ' + x.author).toLowerCase().includes(term));
      };
      const book = x => {
        const cream = rnd(x, 'c') < .16, hue = HUES[x.si % HUES.length] + (rnd(x, 'hue') - .5) * 40, w = 80 + Math.round(rnd(x, 'w') * 20);
        const bg = cream ? `hsl(${hue} 30% 84%)` : `hsl(${hue} ${30 + rnd(x, 's') * 28}% ${20 + rnd(x, 'l') * 18}%)`;
        const font = ['', 'rl-serif', 'rl-caps'][Math.floor(rnd(x, 'f') * 3)];
        const label = esc(x.title + (x.author ? ' by ' + x.author : ''));
        return `<button type="button" class="rl-book ${rnd(x, 'd') < .5 ? 'rl-band' : ''} ${x.rec ? 'rl-' + x.rec : ''}" data-key="${x.key}" title="${label}" aria-label="${label}" aria-pressed="false"
          style="--w:${w}%;--x:${Math.round(rnd(x, 'x') * (100 - w))}%;--h:${25 + Math.round(rnd(x, 'h') * 9)}px;--r:${((rnd(x, 'r') - .5) * 1.4).toFixed(2)}deg;--bg:${bg};--fg:${cream ? '#2a2018' : '#f3ead9'}">
          <span class="rl-t ${font}">${esc(x.title.split(':')[0])}</span><span class="rl-a">${esc(surname(x.author))}</span></button>`;
      };
      table.innerHTML = b.shelves.map((s, si) => {
        const mine = books.filter(x => x.si === si), piles = [];
        for (let i = 0; i < mine.length; i += PILE) piles.push(mine.slice(i, i + PILE));
        return piles.map((p, pi) => `<div class="rl-col"><div class="rl-pile">${p.map(book).join('')}</div>
          <p class="rl-cap" data-shelf="${si}" data-part="${piles.length > 1 ? `${pi + 1} of ${piles.length}` : ''}">${esc(s.name)} <span></span></p></div>`).join('');
      }).join('');
      const drawPick = () => {
        const x = books.find(y => y.key === picked);
        pick.innerHTML = x
          ? `<p><b>${esc(x.title)}</b>${x.author ? ` by ${esc(x.author)}` : ''}<br><small>${esc(x.shelf)}${x.rec === 'high' ? ' · <span class="rl-star">★</span> Highly recommended' : x.rec === 'no' ? ' · Not recommended' : ''}</small></p><button type="button" class="rl-put" aria-label="Put the book back">×</button>`
          : '<p><small>Click a book to see its full title.</small></p>';
        table.querySelectorAll('.rl-book').forEach(n => { n.classList.toggle('rl-on', n.dataset.key === picked); n.setAttribute('aria-pressed', n.dataset.key === picked); });
      };
      // Books that don't match are dimmed rather than removed, so the piles keep their shape.
      const draw = () => {
        const shown = new Set(books.filter(matches).map(x => x.key));
        table.querySelectorAll('.rl-book').forEach(n => n.classList.toggle('rl-off', !shown.has(n.dataset.key)));
        table.querySelectorAll('.rl-cap').forEach(c => {
          const n = books.filter(x => x.si === +c.dataset.shelf && shown.has(x.key)).length;
          c.lastElementChild.textContent = c.dataset.part ? `(${c.dataset.part})` : `· ${n}`;
        });
        count.textContent = `${shown.size} of ${books.length} books`;
        // A search that narrows to one book pulls it out.
        if (q.value.trim() && shown.size === 1) { picked = [...shown][0]; drawPick(); }
      };
      table.addEventListener('click', e => {
        const n = e.target.closest('.rl-book');
        if (!n) return;
        picked = picked === n.dataset.key ? null : n.dataset.key;
        drawPick();
      });
      pick.addEventListener('click', e => { if (e.target.closest('.rl-put')) { picked = null; drawPick(); } });
      q.addEventListener('input', draw);
      only.addEventListener('change', draw);
      draw();
      drawPick();
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
