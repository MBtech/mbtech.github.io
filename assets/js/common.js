/*
 * Shared by all three styles: style switching, deep links, data helpers, the reading list, projects,
 * the Recycle Bin and the screensaver.
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
  const APPS = ['about', 'work', 'journey', 'projects', 'papers', 'reading', 'links', 'terminal', 'bin'];

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

  /* ---------- recycle bin ---------- */
  // Renders the Recycle Bin into `el`. Styles theme it through the .bin-* classes.
  // opts.open(app, search) opens another window for a "restore" button; opts.change(count) runs when the bin empties or refills;
  // opts.btn is the style's own button class.
  const FILE = '<svg class="bin-ico" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 1.5h7l3 3v10H3z" fill="#FFFFFF" stroke="#6B6B6B"/><path d="M10 1.5v3h3" fill="#E4E4E4" stroke="#6B6B6B"/><path d="M5 7.5h6M5 10h6M5 12.5h4" stroke="#A3A3A3"/></svg>';
  const RecycleBin = {
    count: SITE.bin.items.length,
    render(el, opts = {}) {
      const b = SITE.bin;
      let emptied = false;
      const btn = esc(opts.btn || '');
      el.classList.add('bin');
      const draw = () => {
        el.innerHTML = emptied
          ? `<div class="bin-empty"><p><b>The Recycle Bin is empty.</b></p><p>Some lessons don’t delete that easily.</p><button type="button" class="bin-undo ${btn}">Put everything back</button></div>`
          : `<p class="bin-intro">${esc(b.intro)}</p>
            <ul class="bin-list">${b.items.map((x, i) => `
              <li class="bin-item" style="--i:${i}">${FILE}
                <div class="bin-main">
                  <p class="bin-head"><b class="bin-name">${esc(x.name)}</b><span class="bin-meta">${esc([x.type, x.when].filter(Boolean).join(' · '))}</span></p>
                  <p class="bin-why">${esc(x.why)}</p>
                  ${x.restore ? `<button type="button" class="bin-restore ${btn}" data-i="${i}">${esc(x.restore.label)}</button>` : ''}
                </div>
              </li>`).join('')}
            </ul>
            <div class="bin-foot"><span>${b.items.length} items</span><button type="button" class="bin-emptybtn ${btn}">Empty Recycle Bin</button></div>`;
      };
      const set = v => { emptied = v; RecycleBin.count = v ? 0 : b.items.length; draw(); opts.change && opts.change(RecycleBin.count); };
      el.addEventListener('click', e => {
        const r = e.target.closest('.bin-restore');
        if (r) {
          const x = b.items[+r.dataset.i].restore;
          if (x.url) window.open(x.url, '_blank', 'noopener');
          else if (opts.open) opts.open(x.open, x.search || '');
          return;
        }
        if (e.target.closest('.bin-undo')) { set(false); el.querySelector('.bin-emptybtn').focus(); return; }
        if (e.target.closest('.bin-emptybtn')) {
          // The files slide away one after another, then the bin shows as empty.
          const items = el.querySelectorAll('.bin-item');
          const slow = !matchMedia('(prefers-reduced-motion: reduce)').matches;
          items.forEach(n => n.classList.add('bin-going'));
          setTimeout(() => { set(true); el.querySelector('.bin-undo').focus(); }, slow ? 260 + items.length * 70 : 0);
        }
      });
      draw();
    },
  };

  /* ---------- screensaver ---------- */
  // Starts after a minute without input on a computer with a mouse, or straight away with start().
  // Any key, click or real mouse move ends it, and that key or click is swallowed so it doesn't also act on the page.
  // scene: 'stars' (90s), 'bounce' (2000s) or 'glow' (modern). ready() returns false to hold off, for example during a splash screen.
  const SCENES = {
    // Flying through a starfield.
    stars(c, W, H) {
      const COLS = ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#BFD7FF', '#FFE7A8'];
      const spawn = () => ({ x: (Math.random() - .5) * 2, y: (Math.random() - .5) * 2, z: 1 + Math.random() * 3, c: COLS[Math.floor(Math.random() * COLS.length)] });
      const stars = Array.from({ length: 220 }, spawn);
      c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
      return dt => {
        c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(0, 0, W, H);
        for (const s of stars) {
          s.z -= 1.2 * dt;
          if (s.z <= .05) Object.assign(s, spawn(), { z: 4 });
          const k = 1 / s.z, x = W / 2 + s.x * W * .5 * k, y = H / 2 + s.y * H * .5 * k, size = Math.max(1, 3 * k);
          if (x < 0 || x > W || y < 0 || y > H) { Object.assign(s, spawn(), { z: 4 }); continue; }
          c.fillStyle = s.c; c.fillRect(Math.round(x), Math.round(y), Math.round(size), Math.round(size));
        }
      };
    },
    // A glossy name badge that bounces off the edges and changes colour, and cheers when it hits a corner.
    bounce(c, W, H) {
      const COLS = ['#37A433', '#1F64D6', '#E07B2E', '#C7372B', '#7A52C4', '#1A99EE'];
      const name = SITE.profile.name, sub = SITE.profile.tagline.split('.')[0];
      const size = Math.round(Math.max(22, Math.min(44, W / 26)));
      const big = `italic 700 ${size}px "Trebuchet MS", Tahoma, sans-serif`, small = `400 ${Math.round(size * .4)}px Tahoma, Verdana, sans-serif`;
      c.font = big; const nw = c.measureText(name).width; c.font = small; const sw = c.measureText(sub).width;
      const pad = size * .55, bw = Math.max(nw, sw) + pad * 2, bh = size * 1.75 + pad * 1.2;
      let x = Math.random() * (W - bw), y = Math.random() * (H - bh), vx = 150, vy = 115, col = 0, corners = 0, cheer = 0;
      return dt => {
        x += vx * dt; y += vy * dt;
        let hx = false, hy = false;
        if (x <= 0 || x + bw >= W) { vx = -vx; x = Math.max(0, Math.min(W - bw, x)); hx = true; }
        if (y <= 0 || y + bh >= H) { vy = -vy; y = Math.max(0, Math.min(H - bh, y)); hy = true; }
        if (hx || hy) col = (col + 1) % COLS.length;
        // Near enough counts: the other edge within a few pixels.
        if ((hx && (y < 6 || y + bh > H - 6)) || (hy && (x < 6 || x + bw > W - 6))) { corners++; cheer = 2.5; }
        cheer = Math.max(0, cheer - dt);
        c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
        const g = c.createLinearGradient(0, y, 0, y + bh);
        g.addColorStop(0, '#FFFFFF'); g.addColorStop(.12, COLS[col]); g.addColorStop(1, COLS[col]);
        c.fillStyle = g; c.beginPath(); c.roundRect(x, y, bw, bh, bh / 2.6); c.fill();
        c.fillStyle = 'rgba(255,255,255,.25)'; c.beginPath(); c.roundRect(x + 6, y + 3, bw - 12, bh * .42, bh / 3); c.fill();
        c.fillStyle = '#FFFFFF'; c.textAlign = 'center'; c.textBaseline = 'alphabetic';
        c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowOffsetX = 2; c.shadowOffsetY = 2; c.shadowBlur = 2;
        c.font = big; c.fillText(name, x + bw / 2, y + pad + size * .82);
        c.shadowOffsetX = 1; c.shadowOffsetY = 1; c.shadowBlur = 1;
        c.font = small; c.fillText(sub, x + bw / 2, y + pad + size * 1.5);
        c.shadowColor = 'transparent';
        if (cheer) {
          c.globalAlpha = Math.min(1, cheer); c.font = `italic 700 ${Math.round(size * .6)}px "Trebuchet MS", Tahoma, sans-serif`; c.fillStyle = '#F8D24A';
          c.fillText(corners === 1 ? 'It hit the corner!' : `It hit the corner! (${corners} times)`, W / 2, H / 2);
          c.globalAlpha = 1;
        }
      };
    },
    // Slow coloured light drifting behind a big clock.
    glow(c, W, H) {
      const BLOBS = [['246,196,106', .23, .31, .17], ['138,216,178', .19, .27, .21], ['243,164,135', .29, .17, .13], ['169,220,214', .15, .23, .25]];
      const R = Math.max(W, H) * .4, font = '"Onest", system-ui, sans-serif';
      const big = Math.round(Math.min(W / 5, H / 3.2, 180));
      let t = Math.random() * 100;
      return dt => {
        t += dt;
        c.globalCompositeOperation = 'source-over'; c.fillStyle = '#0C1714'; c.fillRect(0, 0, W, H);
        c.globalCompositeOperation = 'screen';
        BLOBS.forEach(([rgb, a, b, s], i) => {
          const x = W * (.5 + .38 * Math.sin(t * a * .25 + i * 1.7)), y = H * (.5 + .36 * Math.cos(t * b * .25 + i * 2.3));
          const g = c.createRadialGradient(x, y, 0, x, y, R * (.8 + .25 * Math.sin(t * s * .3 + i)));
          g.addColorStop(0, `rgba(${rgb},.6)`); g.addColorStop(1, `rgba(${rgb},0)`);
          c.fillStyle = g; c.fillRect(0, 0, W, H);
        });
        c.globalCompositeOperation = 'source-over';
        const d = new Date();
        c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = 'rgba(244,250,247,.94)';
        c.font = `600 ${big}px ${font}`; c.fillText(d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }), W / 2, H / 2 - big * .12);
        c.font = `500 ${Math.round(big * .17)}px ${font}`; c.fillStyle = 'rgba(244,250,247,.75)';
        c.fillText(d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }), W / 2, H / 2 + big * .58);
      };
    },
  };
  const Screensaver = {
    running: false,
    init({ scene, ready = () => true, idle = 60000 }) {
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const el = document.createElement('div');
      el.className = 'ss ss-' + scene; el.hidden = true; el.setAttribute('aria-hidden', 'true');
      el.innerHTML = '<canvas></canvas><p class="ss-hint">Move the mouse or press a key to come back.</p>';
      document.body.appendChild(el);
      const cv = el.querySelector('canvas'), c = cv.getContext('2d');
      let draw = null, last = 0, startedAt = 0, timer = null, sx = null, sy = null, swallowUntil = 0;
      const size = () => {
        const d = devicePixelRatio || 1, W = innerWidth, H = innerHeight;
        cv.width = W * d; cv.height = H * d; c.setTransform(d, 0, 0, d, 0, 0);
        draw = SCENES[scene](c, W, H);
      };
      // With reduced motion the picture stays still and only the clock (if any) updates.
      const frame = now => {
        if (!Screensaver.running) return;
        draw(reduce ? 0 : Math.min(.1, (now - last) / 1000)); last = now;
        if (reduce) setTimeout(() => requestAnimationFrame(frame), 1000); else requestAnimationFrame(frame);
      };
      const start = () => {
        if (Screensaver.running) return;
        Screensaver.running = true; startedAt = performance.now(); sx = sy = null;
        el.hidden = false; size();
        last = performance.now(); requestAnimationFrame(frame);
      };
      const stop = () => { if (!Screensaver.running) return; Screensaver.running = false; el.hidden = true; arm(); };
      // Only computers with a mouse get the automatic one; on a phone it would hide the page you're reading.
      const auto = () => !reduce && matchMedia('(hover: hover) and (pointer: fine)').matches;
      function arm() {
        clearTimeout(timer);
        if (auto()) timer = setTimeout(() => { if (ready() && !document.hidden) start(); else arm(); }, idle);
      }
      const wake = e => {
        if (e.type === 'click') { if (performance.now() < swallowUntil) { e.preventDefault(); e.stopImmediatePropagation(); } return; }
        if (!Screensaver.running) { arm(); return; }
        // The click or key that started it, and the mouse settling afterwards, don't count.
        if (performance.now() - startedAt < 600) return;
        if (e.type === 'pointermove') {
          if (sx === null) { sx = e.clientX; sy = e.clientY; return; }
          if (Math.hypot(e.clientX - sx, e.clientY - sy) < 8) return;
        }
        stop();
        if (e.type === 'keydown' || e.type === 'pointerdown') { e.preventDefault(); e.stopImmediatePropagation(); swallowUntil = performance.now() + 700; }
      };
      ['keydown', 'pointerdown', 'pointermove', 'wheel', 'touchstart', 'click'].forEach(t => addEventListener(t, wake, { capture: true, passive: t === 'wheel' || t === 'touchstart' || t === 'pointermove' }));
      addEventListener('resize', () => { if (Screensaver.running) size(); });
      Screensaver.start = start; Screensaver.stop = stop;
      arm();
    },
    start() {},
    stop() {},
  };

  window.Styles = Styles;
  window.SiteData = Data;
  window.ReadingList = ReadingList;
  window.Projects = Projects;
  window.RecycleBin = RecycleBin;
  window.Screensaver = Screensaver;
})();
