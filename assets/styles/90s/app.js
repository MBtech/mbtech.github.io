/* 90s style: window manager, apps and terminal. Content comes from window.SITE (data/site.js). */
(() => {
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = () => matchMedia('(max-width: 699px)').matches;
const $ = id => document.getElementById(id);
const esc = SiteData.esc;
const KEY = 'mb.90s.';
const store = {
  get(k) { try { return localStorage.getItem(KEY + k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(KEY + k, v); } catch {} },
};
const sstore = {
  get(k) { try { return sessionStorage.getItem(KEY + k); } catch { return null; } },
  set(k, v) { try { sessionStorage.setItem(KEY + k, v); } catch {} },
};
const S = window.SITE, L = S.links;
// Keyboard events can target the document itself; treat that as the page body.
const tgt = e => e.target instanceof Element ? e.target : document.body;
const ext = href => /^(#|\/|mailto:)/.test(href) ? '' : ' target="_blank" rel="noopener"';
const MAIL = 'mailto:' + L.email;
Styles.remember();

/* ---------- data ---------- */
const LANE_COL = { industry: 'a', research: 'c', education: 'v' };
const ROLES = SiteData.roleRows((lane, r) => r.current ? 'g' : LANE_COL[lane]);
const PAPERS = SiteData.paperRows();
const Y0 = 2008, Y1 = Math.floor(SiteData.NOW);
// App ids shared by all styles, and the windows that show them here.
const APP = { about: 'w-about', work: 'w-work', journey: 'w-journey', projects: 'w-projects', papers: 'w-papers', reading: 'w-reading', links: 'w-links', terminal: 'w-term', bin: 'w-bin' };

/* ---------- pixel icons, drawn from 16x16 maps ---------- */
const PAL = { '#': '#1E1D1A', w: '#FBF9F4', f: '#B9B4AA', k: '#0E1A14', g: '#5FD08A', a: '#F2B33D', r: '#E0505C', y: '#F2C94C', Y: '#C99A1E', b: '#3E6FB8', B: '#233B63', n: '#8A5A2B', N: '#5E3B1B', p: '#B07CE0', c: '#5EC2D8' };
const MAPS = {
  term: [
    '................', '.##############.', '.#ffffffffffff#.', '.#kkkkkkkkkkkk#.', '.#kgkkkkkkkkkk#.', '.#kkgkkkkkkkkk#.', '.#kgkkggggkkkk#.', '.#kkkkkkkkkkkk#.',
    '.#kkkkkkkkkkkk#.', '.#kkkkkkkkkkkk#.', '.##############.', '................', '................', '................', '................', '................'],
  chart: [
    '................', '.##############.', '.#bbbbbbbbbbbb#.', '.##############.', '.#wwwwwwwwwwww#.', '.#waaaaaawwwww#.', '.#wwwwwwwwwwww#.', '.#wwwcccccwwww#.',
    '.#wwwwwwwwwwww#.', '.#wwwwwwpppppw#.', '.#wwwwwwwwwwww#.', '.#wwwwwwwwgggw#.', '.#wwwwwwwwwwww#.', '.##############.', '................', '................'],
  folder: [
    '................', '................', '.#####..........', '#yyyyy#.........', '#yyyyyy########.', '#YYYYYYYYYYYYYY#', '#yyyyyyyyyyyyyy#', '#yyyyywwwwyyyyy#',
    '#yyyyyw##wyyyyy#', '#yyyyywwwwyyyyy#', '#yyyyyw##wyyyyy#', '#yyyyywwwwyyyyy#', '#yyyyyyyyyyyyyy#', '################', '................', '................'],
  case: [
    '................', '................', '.....######.....', '.....#....#.....', '.##############.', '#nnnnnnnnnnnnnn#', '#nnnnnnnnnnnnnn#', '#nnnnnn##nnnnnn#',
    '#NNNNNN#a#NNNNN#', '#nnnnnn##nnnnnn#', '#nnnnnnnnnnnnnn#', '#nnnnnnnnnnnnnn#', '#nnnnnnnnnnnnnn#', '################', '................', '................'],
  link: [
    '................', '.....######.....', '...##bbbbbb##...', '..#bbwbbbbwbb#..', '.#bbwwbbbbwwbb#.', '.#bwwwwwwwwwwb#.', '#bbbwbbbbbbwbbb#', '#bbbwbbbbbbwbbb#',
    '#wwwwwwwwwwwwww#', '#bbbwbbbbbbwbbb#', '.#bbwbbbbbbwbb#.', '.#bwwwwwwwwwwb#.', '..#bbwbbbbwbb#..', '...##bbbbbb##...', '.....######.....', '................'],
  book: [
    '................', '..############..', '..#rrrrrrrrrr##.', '..#rrrrrrrrrr#w#', '..#rrwwwwwwrr#w#', '..#rrrrrrrrrr#w#', '..#rrwwwwrrrr#w#', '..#rrrrrrrrrr#w#',
    '..#rrrrrrrrrr#w#', '..#rrrrrrrrrr#w#', '..#rrrrrrrrrr#w#', '..#rrrrrrrrrr#w#', '..############w#', '...#wwwwwwwwwww#', '...#############', '................'],
  bulb: [
    '................', '.....######.....', '....#yyyyyy#....', '...#yywyyyyy#...', '...#ywyyyyyy#...', '...#yyyyyyyy#...', '...#yyy#yyyy#...', '....#yy#yyy#....',
    '.....#y#yy#.....', '.....#yyyy#.....', '.....######.....', '.....#ffff#.....', '.....######.....', '.....#ffff#.....', '......####......', '................'],
  // A wire basket with its lid on when empty, paper poking out when full.
  binEmpty: [
    '................', '.....######.....', '....#ffffff#....', '..############..', '..#wfwfwfwfwf#..', '..#fwfwfwfwfw#..', '...#wfwfwfwf#...', '...#fwfwfwfw#...',
    '...#wfwfwfwf#...', '...#fwfwfwfw#...', '...#wfwfwfwf#...', '....#fwfwfw#....', '....#wfwfwf#....', '....########....', '................', '................'],
  binFull: [
    '.....##.........', '....#ww#.##.....', '...#wwww#yy#....', '..############..', '..#wfwfwfwfwf#..', '..#fwfwfwfwfw#..', '...#wfwfwfwf#...', '...#fwfwfwfw#...',
    '...#wfwfwfwf#...', '...#fwfwfwfw#...', '...#wfwfwfwf#...', '....#fwfwfw#....', '....#wfwfwf#....', '....########....', '................', '................'],
  person: [
    '................', '......####......', '.....#aaaa#.....', '....#ayaaaa#....', '....#aaaaaa#....', '....#aaaaaa#....', '.....#aaaa#.....', '......####......',
    '...##########...', '..#bbbbbbbbbb#..', '.#bbcbbbbbbbbb#.', '.#bbbbbbbbbbbb#.', '.#bbbbbbbbbbbb#.', '.##############.', '................', '................'],
  display: [
    '................', '.##############.', '.#wwwwwwwwwwww#.', '.#wccccccccccw#.', '.#wccyyccccccw#.', '.#wcyyyyccbbcw#.', '.#wccyyccbbbbw#.', '.#wggggggggggw#.',
    '.#wwwwwwwwwwww#.', '.##############.', '......#ff#......', '.....##ff##.....', '...##########...', '...#ffffffff#...', '...##########...', '................'],
};
function icon(name) {
  if (name === 'bin') name = RecycleBin.count ? 'binFull' : 'binEmpty';
  const m = MAPS[name]; let r = '';
  m.forEach((row, y) => [...row].forEach((ch, x) => { if (ch !== '.') r += `<rect x="${x}" y="${y}" width="1" height="1" fill="${PAL[ch]}"/>`; }));
  return `<svg viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true">${r}</svg>`;
}

/* ---------- content, filled from SITE ---------- */
(() => {
  const P = S.profile;
  $('whoText').innerHTML = `<h1>${esc(P.name)}</h1><p>${esc(P.tagline)}</p>${P.bio.map(b => `<p class="muted">${esc(b)}</p>`).join('')}`;
  const linkOrg = n => {
    let org = esc(n.org);
    if (n.orgUrl) org = `<a href="${esc(n.orgUrl)}"${ext(n.orgUrl)}>${org}</a>`;
    return org.replace('The Leadershift Studio', `<a href="${esc(L.leadershift)}"${ext(L.leadershift)}>The Leadershift Studio</a>`);
  };
  const past = SiteData.roles().filter(r => r.lane === 'industry' && !r.current).sort((a, b) => b.spans[0][1] - a.spans[0][1])[0];
  $('nowList').innerHTML = S.now.map(n => `<dt>${n.since ? 'Since ' + esc(n.since) : 'Open'}</dt><dd>${esc(n.role)}, ${linkOrg(n)}${n.note ? ` (${esc(n.note)})` : ''}</dd>`).join('') +
    (past ? `<dt>Until ${esc(past.when.split('– ').pop())}</dt><dd>${esc(past.short || past.title)}, ${esc(past.org)}</dd>` : '');
  $('statsList').innerHTML = `<dt>Citations</dt><dd class="mono">${S.scholar.citations}</dd><dt>h-index</dt><dd class="mono">${S.scholar.hIndex}</dd><dt>Papers</dt><dd class="mono">${S.papers.length}</dd><dt>Source</dt><dd><a href="${esc(L.scholar)}"${ext(L.scholar)}>Google Scholar</a>, ${esc(S.scholar.asOf)}</dd>`;
  $('aboutStatus').textContent = `${S.now.length} things running`;

  const V = S.services;
  $('workIntro').textContent = V.intro;
  $('svcList').innerHTML = V.items.map(i => `<li><b>${esc(i.title)}.</b> ${esc(i.text)}</li>`).join('');
  $('choices').innerHTML =
    `<a class="choice" href="${esc(MAIL)}"><b>${esc(V.solo.title)}</b><span>${esc(V.solo.text)} ${esc(V.solo.cta)}: ${esc(L.email)}</span></a>` +
    `<a class="choice" href="${esc(L.leadershift)}"${ext(L.leadershift)}><b>${esc(V.team.title)}</b><span>${esc(V.team.text)}</span></a>`;

  const LINKS = [
    { href: MAIL, label: 'Email', note: L.email },
    { href: L.github, label: 'GitHub', note: 'Code and experiments' },
    { href: L.scholar, label: 'Google Scholar', note: 'Every paper, with citations' },
    { href: L.medium, label: 'Medium', note: 'Things I have written' },
    { href: L.leadershift, label: 'The Leadershift Studio', note: 'Work with me and a wider team' },
  ];
  $('linkList').innerHTML = LINKS.map(x => `<li><a href="${esc(x.href)}"${ext(x.href)}>${icon('link')}<span><b>${esc(x.label)}</b><small>${esc(x.note)}</small></span></a></li>`).join('') +
    `<li><button type="button" data-open="w-reading">${icon('book')}<span><b>Reading list</b><small>Books I recommend</small></span></button></li>`;
  $('linkList').addEventListener('click', e => { const b = e.target.closest('[data-open]'); if (b) openWin($(b.dataset.open)); });

  ReadingList.render($('readingBody'));
  Projects.render($('pj'));
  const binStatus = n => { $('binStatus').textContent = `${n} object(s)`; };
  RecycleBin.render($('bin'), {
    btn: 'btn',
    open(app, q) {
      openWin($(APP[app]));
      if (app === 'papers') { papers.all(true); papers.grep(q); }
      else if (app === 'reading') { const i = $('readingBody').querySelector('input[type=search]'); i.value = q; i.dispatchEvent(new Event('input')); }
    },
    change(n) { document.querySelectorAll('.icon[data-open="w-bin"] .glyph').forEach(g => { g.innerHTML = icon('bin'); }); binStatus(n); },
  });
  binStatus(RecycleBin.count);
  $('pscholar').textContent = `${S.scholar.citations} citations, h-index ${S.scholar.hIndex}`;
  $('bootName').textContent = P.name;
})();

/* ---------- window manager ---------- */
const WINDOWS = [...document.querySelectorAll('.win')];
let topZ = 10, active = null;
const SVG_MIN = '<svg viewBox="0 0 10 10" aria-hidden="true"><rect x="1" y="7" width="6" height="2" fill="currentColor"/></svg>';
const SVG_MAX = '<svg viewBox="0 0 10 10" aria-hidden="true"><rect x="0.5" y="0.5" width="9" height="9" fill="none" stroke="currentColor"/><rect x="0.5" y="0.5" width="9" height="2" fill="currentColor"/></svg>';
const SVG_X = '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M1 1L9 9M9 1L1 9" stroke="currentColor" stroke-width="2"/></svg>';

function taskBtn(w) { return document.querySelector(`#tasks [data-for="${w.id}"]`); }
function focusWin(w) {
  if (!w || w.hidden) return;
  w.style.zIndex = ++topZ;
  WINDOWS.forEach(x => x.classList.toggle('active', x === w));
  document.querySelectorAll('#tasks .btn').forEach(b => b.setAttribute('aria-pressed', b.dataset.for === w.id && !w.classList.contains('min')));
  active = w;
}
function animate(w, cls, done) {
  if (reduce || mobile()) { done && done(); return; }
  w.classList.remove('opening', 'closing'); void w.offsetWidth; w.classList.add(cls);
  let fired = false;
  const end = () => { if (fired) return; fired = true; w.classList.remove(cls); done && done(); };
  w.addEventListener('animationend', end, { once: true });
  setTimeout(end, 250); // in case animations are off
}
function openIds() { return [...document.querySelectorAll('#tasks .btn')].map(b => b.dataset.for); }
function saveOpen() { store.set('open', JSON.stringify(openIds())); }
function openWin(w) {
  if (!w) return;
  const wasHidden = w.hidden;
  w.hidden = false; w.classList.remove('min');
  if (wasHidden) animate(w, 'opening');
  if (!taskBtn(w)) {
    const b = document.createElement('button');
    b.className = 'btn'; b.dataset.for = w.id; b.textContent = w.dataset.title;
    b.addEventListener('click', () => {
      if (mobile()) { w.hidden = false; w.classList.remove('min'); w.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); focusWin(w); return; }
      if (active === w && !w.hidden) { minWin(w); } else { w.hidden = false; w.classList.remove('min'); focusWin(w); }
    });
    $('tasks').appendChild(b);
  }
  focusWin(w);
  w.dispatchEvent(new Event('winopen'));
  if (mobile() && booted) w.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  saveOpen();
}
function minWin(w) {
  if (mobile()) { w.classList.toggle('min'); return; }
  w.hidden = true; const b = taskBtn(w); if (b) b.setAttribute('aria-pressed', 'false');
  active = null;
}
function closeWin(w) {
  if (!w || w.hidden) return;
  const b = taskBtn(w); if (b) b.remove(); if (active === w) active = null;
  saveOpen();
  animate(w, 'closing', () => { w.hidden = true; w.classList.remove('max'); });
}

WINDOWS.forEach(w => {
  const bar = w.querySelector('.tbar');
  const ctl = document.createElement('div'); ctl.style.display = 'flex'; ctl.style.gap = '2px';
  ctl.innerHTML = `<button class="tb" aria-label="Minimise ${esc(w.dataset.title)}">${SVG_MIN}</button><button class="tb maxb" aria-label="Maximise ${esc(w.dataset.title)}">${SVG_MAX}</button><button class="tb" aria-label="Close ${esc(w.dataset.title)}" style="margin-left:2px">${SVG_X}</button>`;
  bar.appendChild(ctl);
  const [bMin, bMax, bX] = ctl.querySelectorAll('button');
  bMin.addEventListener('click', e => { e.stopPropagation(); minWin(w); });
  bMax.addEventListener('click', e => { e.stopPropagation(); w.classList.toggle('max'); focusWin(w); w.dispatchEvent(new Event('winresize')); });
  bX.addEventListener('click', e => { e.stopPropagation(); closeWin(w); });
  bar.addEventListener('dblclick', e => { if (!mobile() && !e.target.closest('button')) { w.classList.toggle('max'); w.dispatchEvent(new Event('winresize')); } });
  w.addEventListener('pointerdown', () => focusWin(w));
  w.addEventListener('focusin', () => focusWin(w));

  // Drag by the title bar (desktop only); arrow keys move a focused title bar.
  bar.tabIndex = 0; bar.setAttribute('aria-label', `${w.dataset.title} window. Arrow keys move it.`);
  bar.addEventListener('pointerdown', e => {
    if (mobile() || e.target.closest('button') || w.classList.contains('max')) return;
    const desk = $('desk').getBoundingClientRect(), r = w.getBoundingClientRect();
    const dx = e.clientX - r.left, dy = e.clientY - r.top;
    bar.setPointerCapture(e.pointerId);
    const move = ev => {
      const x = Math.max(-r.width + 80, Math.min(desk.width - 80, ev.clientX - desk.left - dx));
      const y = Math.max(0, Math.min(desk.height - 30, ev.clientY - desk.top - dy));
      w.style.left = x + 'px'; w.style.top = y + 'px';
    };
    const up = () => { bar.removeEventListener('pointermove', move); bar.removeEventListener('pointerup', up); savePos(w); };
    bar.addEventListener('pointermove', move); bar.addEventListener('pointerup', up);
  });
  bar.addEventListener('keydown', e => {
    if (mobile()) return;
    const d = { ArrowLeft: [-16, 0], ArrowRight: [16, 0], ArrowUp: [0, -16], ArrowDown: [0, 16] }[e.key];
    if (!d) return; e.preventDefault();
    w.style.left = (w.offsetLeft + d[0]) + 'px'; w.style.top = Math.max(0, w.offsetTop + d[1]) + 'px'; savePos(w);
  });
});
function savePos(w) { store.set('pos.' + w.id, JSON.stringify([w.offsetLeft, w.offsetTop])); }
addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (!$('ctx').hidden) { hideCtx(); return; }
  if (!$('menu').hidden) { toggleMenu(false); return; }
  // In the terminal, Esc clears the line first; a second Esc closes the window.
  if (e.target.id === 'tin' && e.target.value) { e.target.value = ''; return; }
  if (active) closeWin(active);
});

// Initial layout: About me and What I do side by side, My journey under them; the rest cascade when opened.
function layout() {
  const W = innerWidth, H = innerHeight - 40, R = 16;
  // Leave room for however many icon columns fit the screen height.
  const rows = Math.max(1, Math.floor((H - 16) / 80)), cols = Math.ceil(document.querySelectorAll('.icon').length / rows);
  const Lx = 12 + cols * 94 + 6;
  const avail = W - Lx - R;
  const saved = id => { try { return JSON.parse(store.get('pos.' + id)); } catch { return null; } };
  const put = (id, x, y, w) => {
    const el = $(id), sp = saved(id);
    el.style.width = Math.min(w, avail) + 'px';
    if (sp) { el.style.left = Math.min(sp[0], W - 120) + 'px'; el.style.top = Math.max(0, Math.min(sp[1], H - 60)) + 'px'; }
    else {
      el.style.left = Math.max(Lx, Math.min(x, W - R - Math.min(w, avail))) + 'px';
      el.style.top = Math.max(8, Math.min(y, H - 120)) + 'px';
    }
    el.style.maxHeight = Math.max(160, H - el.offsetTop - 8) + 'px';
  };
  const side = avail >= 1000;
  const aw = side ? Math.min(600, avail * .48) : Math.min(560, avail);
  put('w-about', Lx, 16, aw);
  const ah = $('w-about').offsetHeight;
  const ww = side ? Math.min(620, avail - aw - 16) : Math.min(600, avail - 40);
  put('w-work', side ? Lx + aw + 16 : Lx + 40, side ? 16 : 16 + ah * .5, ww);
  const wh = $('w-work').offsetHeight;
  if (side) {
    // Full width under both if there's room, otherwise under About me only.
    const full = 16 + Math.max(ah, wh) + 14;
    if (H - full >= 300) put('w-journey', Lx, full, Math.min(860, avail));
    else put('w-journey', Lx, 16 + ah + 14, aw);
  } else put('w-journey', Lx + 80, $('w-work').offsetTop + wh * .55, Math.min(820, avail - 80));
  put('w-projects', Lx + 140, 40, 600);
  put('w-papers', Lx + 180, 60, 760);
  put('w-reading', Lx + 220, 70, 560);
  $('w-reading').style.height = Math.min(600, H - 90) + 'px';
  put('w-links', Lx + 260, 100, 380);
  put('w-bin', Lx + 290, 80, 560);
  put('w-display', (W - 480) / 2, 70, 480);
  put('w-term', W - R - 620, H - 380, 620);
  $('w-term').style.height = Math.min(360, H - 40) + 'px';
}

/* ---------- styles ---------- */
function openApps() { return openIds().map(id => $(id).dataset.app).filter(Boolean); }
function switchStyle(id) {
  if (id === Styles.current) return false;
  return Styles.go(id, openApps());
}

/* ---------- icons, menu, taskbar ---------- */
const PROGRAMS = [
  { id: 'w-about', label: 'About me', icon: 'person' },
  { id: 'w-work', label: 'What I do', icon: 'case' },
  { id: 'w-journey', label: 'My journey', icon: 'chart' },
  { id: 'w-projects', label: 'Projects', icon: 'bulb' },
  { id: 'w-papers', label: 'Papers', icon: 'folder' },
  { id: 'w-reading', label: 'Reading list', icon: 'book' },
  { id: 'w-links', label: 'Links', icon: 'link' },
  { id: 'w-term', label: 'Terminal', icon: 'term' },
  { id: 'w-bin', label: 'Recycle Bin', icon: 'bin', deskOnly: true },
];
const SHORTCUTS = [
  { href: MAIL, label: 'Email' },
  { href: L.github, label: 'GitHub' },
  { href: L.scholar, label: 'Google Scholar' },
  { href: L.medium, label: 'Medium' },
];
const glyph = p => icon(p.icon || 'link');
let iconOrder = store.get('icons') || 'type';
function renderIcons() {
  const items = PROGRAMS.map(p => ({ label: p.label, html: `<button class="icon" data-open="${p.id}" aria-selected="false"><span class="glyph">${glyph(p)}</span><span>${p.label}</span></button>` }));
  if (iconOrder === 'name') items.sort((a, b) => a.label.localeCompare(b.label));
  $('icons').innerHTML = items.map(i => i.html).join('');
  document.querySelectorAll('.icon[data-open]').forEach(b => {
    const go = () => openWin($(b.dataset.open));
    b.addEventListener('click', () => {
      document.querySelectorAll('.icon').forEach(x => x.setAttribute('aria-selected', x === b));
      if (mobile() || matchMedia('(pointer: coarse)').matches) go();
    });
    b.addEventListener('dblclick', go);
    b.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); go(); } });
  });
}
renderIcons();
$('menuList').innerHTML =
  PROGRAMS.filter(p => !p.deskOnly).map(p => `<li><button role="menuitem" data-open="${p.id}">${glyph(p)}${p.label}</button></li>`).join('') + '<li><hr></li>' +
  SHORTCUTS.map(s => `<li><a role="menuitem" href="${esc(s.href)}"${ext(s.href)}>${icon('link')}${s.label}</a></li>`).join('') + '<li><hr></li>' +
  `<li><button role="menuitem" data-act="display">${icon('display')}Change style…</button></li>` +
  Styles.list.map(s => `<li><button role="menuitemradio" aria-checked="${s.id === Styles.current}" data-style="${s.id}"><span style="width:20px;text-align:center">${s.id === Styles.current ? '•' : ''}</span>${s.label} look</button></li>`).join('') +
  '<li><hr></li><li><button role="menuitem" data-act="wall-next">Change wallpaper</button></li><li><button role="menuitem" data-act="reset">Reset desktop</button></li>';
function toggleMenu(open) {
  const m = $('menu'); m.hidden = !open; $('menuBtn').setAttribute('aria-expanded', open); $('menuBtn').setAttribute('aria-pressed', open);
  if (open) m.querySelector('button, a').focus();
}
$('menuBtn').addEventListener('click', e => { e.stopPropagation(); toggleMenu($('menu').hidden); });
$('menu').addEventListener('click', e => {
  const b = e.target.closest('[data-open]'); if (b) { openWin($(b.dataset.open)); toggleMenu(false); return; }
  // Scope to the menu: <html> itself carries data-style.
  const s = e.target.closest('#menu [data-style]'); if (s) { toggleMenu(false); switchStyle(s.dataset.style); return; }
  const a = e.target.closest('[data-act]'); if (a) { toggleMenu(false); act(a.dataset.act); }
});
$('menu').addEventListener('keydown', e => {
  const items = [...$('menu').querySelectorAll('button, a')], i = items.indexOf(document.activeElement);
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus(); }
});
document.addEventListener('click', e => { if (!$('menu').hidden && !e.target.closest('#menu')) toggleMenu(false); });
(() => { const tick = () => { const d = new Date(); $('clock').textContent = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); $('clock').title = d.toDateString(); }; tick(); setInterval(tick, 1000); })();

/* ---------- About me: tabs ---------- */
(() => {
  const tabs = [...document.querySelectorAll('#w-about [role=tab]')];
  const pick = t => tabs.forEach(x => { const on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; $(x.getAttribute('aria-controls')).hidden = !on; });
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => pick(t));
    t.addEventListener('keydown', e => { const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (d) { const n = tabs[(i + d + tabs.length) % tabs.length]; pick(n); n.focus(); } });
  });
})();

/* ---------- My journey: timeline ---------- */
const timeline = (() => {
  const SPAN = Y1 + 1 - Y0;
  const pct = y => ((y - Y0) / SPAN * 100) + '%';
  const COL = { g: 'var(--green)', a: 'var(--amber)', c: '#3E9FB8', v: '#8A63C9' };
  const tl = $('tl'), range = $('year'), out = $('yearOut'), then = $('then'), detail = $('detail'), win = $('w-journey');
  let year = Y1, playing = null, touched = false, sel = -1;
  range.max = Y1; range.value = Y1;
  const activeIn = (spans, y) => spans.some(([s, e]) => Math.floor(s) <= y && y <= Math.floor(e));

  function draw() {
    let html = '', i = 0;
    for (const [label, spans, , , c, now] of ROLES) {
      if (!spans) { html += `<div class="tgroup">${esc(label)}</div>`; continue; }
      const on = activeIn(spans, year), idx = i++;
      const bars = spans.filter(([s]) => s < year + 1).map(([s, e]) => {
        const end = Math.min(e, year + 1);
        return `<span class="bar${now && year >= Y1 ? ' live' : ''}" style="left:${pct(s)};width:calc(${pct(end)} - ${pct(s)});background-color:${COL[c]}"></span>`;
      }).join('');
      html += `<div class="trow${on ? '' : ' off'}${sel === idx ? ' sel' : ''}" data-i="${idx}" tabindex="0" role="button" aria-pressed="${sel === idx}"><span class="lab">${esc(label)}</span><div class="track">${bars}<span class="cur" style="left:calc(${pct(year + .5)} - 1px)"></span></div></div>`;
    }
    let ticks = ''; for (let y = Y0; y <= Y1; y += 3) ticks += `<span style="left:${pct(y + .5)}">${y}</span>`;
    html += `<div class="axis"><span></span><div class="ticks">${ticks}</div></div>`;
    tl.innerHTML = html;
    const now = ROLES.filter(r => r[1] && activeIn(r[1], year)).map(r => r[0]);
    then.textContent = `${year}: ${now.length ? now.join(' + ') : 'between things'}`;
    out.value = year; range.value = year;
  }
  function setYear(y, byUser) { if (byUser) { touched = true; clearInterval(playing); } year = Math.max(Y0, Math.min(Y1, y)); draw(); }
  function replay() {
    clearInterval(playing);
    if (reduce) { setYear(Y1); return; }
    let y = Y0; setYear(y);
    playing = setInterval(() => { if (++y > Y1) { clearInterval(playing); return; } setYear(y); }, 260);
  }
  function showDetail(idx) {
    const r = ROLES.filter(x => x[1])[idx];
    detail.innerHTML = r ? `<b>${esc(r[0])}</b> <span class="muted">${esc(r[2])}</span><br>${r[3]}` : '';
  }
  tl.addEventListener('click', e => { const r = e.target.closest('.trow'); if (!r) return; sel = +r.dataset.i; showDetail(sel); draw(); tl.querySelector(`.trow[data-i="${sel}"]`).focus(); });
  tl.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.trow')) { e.preventDefault(); e.target.click(); } });
  range.addEventListener('input', () => setYear(+range.value, true));
  $('replay').addEventListener('click', () => { touched = true; replay(); });
  draw();
  // Play the career once, the first time the window is on screen.
  new IntersectionObserver(([e], o) => { if (e.isIntersecting && !win.hidden) { o.disconnect(); setTimeout(() => { if (!touched) replay(); }, 600); } }, { threshold: .3 }).observe(tl);
  return { setYear: y => setYear(y, true), replay() { touched = true; replay(); }, activeIn };
})();

/* ---------- Papers ---------- */
const papers = (() => {
  let q = '', all = false, key = 'year', dir = -1;
  const body = $('files');
  const get = { year: p => p[0], venue: p => p[1].toLowerCase(), title: p => p[2].toLowerCase(), cites: p => p[3] ?? -1 };
  const hay = p => `${p[2]} ${p[1]} ${p[6].authors} ${p[6].venueFull}`;
  // Same filter and order as the window, so the terminal can print what the window shows.
  function rows() {
    const pat = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), hit = q ? new RegExp(pat, 'i') : null;
    return PAPERS.filter(p => (all || !p[4] || hit) && (!hit || hit.test(hay(p))))
      .sort((a, b) => { const x = get[key](a), y = get[key](b); return (x < y ? -1 : x > y ? 1 : 0) * dir || b[0] - a[0]; });
  }
  function draw() {
    const re = q ? new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig') : null;
    const list = rows();
    const hl = s => re ? esc(s).replace(re, m => `<mark>${m}</mark>`) : esc(s);
    body.innerHTML = list.map(([y, v, t, c, , url, p]) =>
      `<tr><td class="n">${y}</td><td class="venue">${hl(v)}</td><td><a href="${esc(url)}"${ext(url)} title="${esc(p.title)}">${hl(t)}</a><span class="by">${hl(p.authors)}. ${hl(p.venueFull)}.</span></td><td class="n r">${c ?? '–'}</td></tr>`).join('') ||
      '<tr><td colspan="4" class="muted">No papers match.</td></tr>';
    $('pcount').textContent = `${list.length} of ${PAPERS.length} papers`;
    document.querySelectorAll('.files th button').forEach(b => { if (b.dataset.s === key) b.setAttribute('aria-sort', dir > 0 ? 'ascending' : 'descending'); else b.removeAttribute('aria-sort'); });
  }
  $('q').addEventListener('input', e => { q = e.target.value.trim(); draw(); });
  $('all').addEventListener('change', e => { all = e.target.checked; draw(); });
  document.querySelectorAll('.files th button').forEach(b => b.addEventListener('click', () => {
    if (key === b.dataset.s) dir = -dir; else { key = b.dataset.s; dir = key === 'title' || key === 'venue' ? 1 : -1; }
    draw();
  }));
  draw();
  return {
    grep(x) { q = x; $('q').value = x; draw(); },
    sortCites(v) { key = v ? 'cites' : 'year'; dir = -1; draw(); },
    all(v) { all = v; $('all').checked = v; draw(); },
    rows,
  };
})();

/* ---------- wallpaper ---------- */
const WALLS = ['dither', 'weave', 'bricks', 'plain'];
const WALL_NAMES = { dither: 'Teal dither', weave: 'Woven', bricks: 'Tiles', plain: 'Plain' };
function currentWall() { return store.get('wall') || 'dither'; }
function setWall(w, keep = true) {
  if (!WALLS.includes(w)) return false;
  if (w === 'dither') delete document.body.dataset.wall; else document.body.dataset.wall = w;
  if (keep) store.set('wall', w);
  return true;
}
setWall(currentWall());

/* ---------- Display Properties: style + wallpaper ---------- */
const display = (() => {
  const cards = $('styleCards'), walls = $('wallPick'), win = $('w-display');
  let pick = Styles.current, wallAtOpen = currentWall();
  const NOTES = { modern: 'Glass windows, a dock and widgets', '2000s': 'Blue taskbar and rolling hills', '90s': 'Grey bevels on a teal desk' };
  cards.innerHTML = Styles.list.map(s => `<button type="button" class="stylecard" role="radio" data-id="${s.id}" aria-checked="${s.id === pick}"><span class="mini mini-${s.id}"><i class="w"></i><i class="d"></i><i class="s"></i></span><b>${s.label}${s.id === Styles.current ? ' (current)' : ''}</b><small>${NOTES[s.id] || ''}</small></button>`).join('');
  walls.innerHTML = WALLS.map(w => `<label><input type="radio" name="wall" value="${w}"> ${WALL_NAMES[w]}</label>`).join('');
  const sync = () => {
    cards.querySelectorAll('.stylecard').forEach(c => c.setAttribute('aria-checked', c.dataset.id === pick));
    walls.querySelectorAll('input').forEach(i => { i.checked = i.value === currentWall(); });
  };
  cards.addEventListener('click', e => { const c = e.target.closest('.stylecard'); if (c) { pick = c.dataset.id; sync(); } });
  cards.addEventListener('dblclick', e => { const c = e.target.closest('.stylecard'); if (c) { pick = c.dataset.id; ok(); } });
  cards.addEventListener('keydown', e => {
    const list = [...cards.querySelectorAll('.stylecard')], i = list.indexOf(document.activeElement);
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (d && i >= 0) { e.preventDefault(); const n = list[(i + d + list.length) % list.length]; pick = n.dataset.id; sync(); n.focus(); }
  });
  walls.addEventListener('change', e => setWall(e.target.value));
  function ok() { if (!switchStyle(pick)) closeWin(win); }
  $('dispOk').addEventListener('click', ok);
  $('dispCancel').addEventListener('click', () => { setWall(wallAtOpen); closeWin(win); });
  $('saverPreview').addEventListener('click', () => act('saver'));
  win.addEventListener('winopen', () => { pick = Styles.current; wallAtOpen = currentWall(); sync(); });
  return { open() { openWin(win); const c = cards.querySelector('[aria-checked="true"]'); if (c && !mobile()) c.focus(); } };
})();

/* ---------- desktop actions (context menu, start menu, terminal) ---------- */
const DEFAULT_OPEN = ['w-about', 'w-work', 'w-journey'];
function resetDesktop() {
  try { Object.keys(localStorage).filter(k => k.startsWith(KEY)).forEach(k => localStorage.removeItem(k)); } catch {}
  WINDOWS.forEach(w => { w.classList.remove('max', 'min'); w.hidden = true; const b = taskBtn(w); if (b) b.remove(); w.style.left = w.style.top = ''; });
  iconOrder = 'type'; renderIcons(); setWall('dither');
  DEFAULT_OPEN.forEach(id => openWin($(id)));
  if (!mobile()) layout();
  focusWin($('w-about'));
  saveOpen();
}
function act(a) {
  if (a === 'arrange-name' || a === 'arrange-type') { iconOrder = a.slice(8); store.set('icons', iconOrder); renderIcons(); }
  else if (a === 'term') { openWin($('w-term')); $('tin').focus(); }
  else if (a === 'reset') resetDesktop();
  else if (a === 'display') display.open();
  else if (a === 'wall-next') setWall(WALLS[(WALLS.indexOf(currentWall()) + 1) % WALLS.length]);
  else if (a === 'saver') Screensaver.start();
}

/* ---------- right-click menu on the desk ---------- */
const ctx = $('ctx');
function showCtx(x, y) {
  const cur = currentWall();
  ctx.querySelectorAll('[data-wall]').forEach(b => { const on = b.dataset.wall === cur; b.setAttribute('aria-checked', on); b.querySelector('.chk').textContent = on ? '•' : ''; });
  ctx.querySelectorAll('[data-style]').forEach(b => { const on = b.dataset.style === Styles.current; b.setAttribute('aria-checked', on); b.querySelector('.chk').textContent = on ? '•' : ''; });
  ctx.querySelectorAll('[data-act^="arrange"]').forEach(b => { b.querySelector('.chk').textContent = b.dataset.act.endsWith(iconOrder) ? '•' : ''; });
  ctx.hidden = false;
  const r = ctx.getBoundingClientRect();
  ctx.style.left = Math.min(x, innerWidth - r.width - 4) + 'px';
  ctx.style.top = Math.max(4, Math.min(y, innerHeight - r.height - 44)) + 'px';
  ctx.querySelector('button').focus();
}
function hideCtx() { ctx.hidden = true; }
$('desk').addEventListener('contextmenu', e => {
  if (mobile() || e.target.closest('.win')) return;
  e.preventDefault(); toggleMenu(false); showCtx(e.clientX, e.clientY);
});
// Keyboard: Shift+F10 or the menu key on the desk opens the same menu.
addEventListener('keydown', e => {
  if ((e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) && !tgt(e).closest('.win, input')) { e.preventDefault(); showCtx(120, 120); }
});
ctx.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  hideCtx();
  if (b.dataset.wall) setWall(b.dataset.wall);
  else if (b.dataset.style) switchStyle(b.dataset.style);
  else act(b.dataset.act);
});
ctx.addEventListener('keydown', e => {
  const items = [...ctx.querySelectorAll('button')], i = items.indexOf(document.activeElement);
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus(); }
});
document.addEventListener('pointerdown', e => { if (!ctx.hidden && !e.target.closest('#ctx')) hideCtx(); });

/* ---------- rubber-band selection on the desk ---------- */
(() => {
  const desk = $('desk');
  desk.addEventListener('pointerdown', e => {
    if (mobile() || e.button !== 0 || (e.target !== desk && e.target !== $('icons'))) return;
    document.querySelectorAll('.icon').forEach(x => x.setAttribute('aria-selected', 'false'));
    const d = desk.getBoundingClientRect(), x0 = e.clientX, y0 = e.clientY;
    const box = document.createElement('div'); box.className = 'marquee'; desk.appendChild(box);
    desk.setPointerCapture(e.pointerId);
    const move = ev => {
      const l = Math.min(x0, ev.clientX), t = Math.min(y0, ev.clientY), r = Math.max(x0, ev.clientX), b = Math.max(y0, ev.clientY);
      Object.assign(box.style, { left: l - d.left + 'px', top: t - d.top + 'px', width: r - l + 'px', height: b - t + 'px' });
      document.querySelectorAll('.icon').forEach(ic => {
        const q = ic.getBoundingClientRect();
        ic.setAttribute('aria-selected', q.left < r && q.right > l && q.top < b && q.bottom > t);
      });
    };
    const up = () => { box.remove(); desk.removeEventListener('pointermove', move); desk.removeEventListener('pointerup', up); };
    desk.addEventListener('pointermove', move); desk.addEventListener('pointerup', up);
  });
})();

/* ---------- terminal ---------- */
(() => {
  const out = $('tout'), input = $('tin'), form = $('tform');
  const hist = []; let hi = 0;
  const NAMES = { about: 'w-about', work: 'w-work', hire: 'w-work', journey: 'w-journey', timeline: 'w-journey', projects: 'w-projects', tools: 'w-projects', papers: 'w-papers', reading: 'w-reading', books: 'w-reading', links: 'w-links', terminal: 'w-term', display: 'w-display', bin: 'w-bin', trash: 'w-bin' };
  const WINLIST = { about: 'w-about', work: 'w-work', journey: 'w-journey', projects: 'w-projects', papers: 'w-papers', reading: 'w-reading', links: 'w-links', terminal: 'w-term', bin: 'w-bin' };
  const print = (html, cls) => { const d = document.createElement('div'); if (cls) d.className = cls; d.innerHTML = html; out.appendChild(d); while (out.children.length > 200) out.firstChild.remove(); out.scrollTop = out.scrollHeight; };
  // Open or raise a window; keep typing in the terminal.
  const show = id => {
    openWin($(id));
    // Keep the terminal above the window it just opened, so its output stays readable.
    if (!mobile() && id !== 'w-term') { $('w-term').style.zIndex = ++topZ; input.focus({ preventScroll: true }); }
  };
  let repos = null;
  const getRepos = () => {
    if (repos) return Promise.resolve(repos);
    try { const c = JSON.parse(sstore.get('gh')); if (c && Date.now() - c.t < 600000) return Promise.resolve(repos = c.d); } catch {}
    return fetch('https://api.github.com/users/MBtech/repos?sort=pushed&per_page=8')
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => { repos = d.filter(r => !r.fork && r.name !== 'mbtech.github.io'); sstore.set('gh', JSON.stringify({ t: Date.now(), d: repos })); return repos; });
  };
  const styleIds = Styles.list.map(s => s.id);

  const C = {
    help: () => print(
`<span class="a">commands</span>
  ls                     list windows
  open|close &lt;window&gt;    about, work, journey, projects, papers, reading, links, bin
  whoami                 who I am
  papers [--grep x] [--sort cites] [--all]
  timeline [year]        what I was doing that year, or replay it all
  hire [--solo|--team]   work with me
  style [${styleIds.join('|')}]  switch the whole site to another look
  github                 my recently pushed repos (live)
  wallpaper [name]       ${WALLS.join(', ')}
  screensaver            start the screen saver
  reset                  put the desktop back the way it was
  clear, history, date, exit
<span class="d">tab completes, up and down arrows walk history</span>`),
    ls: () => print(Object.entries(WINLIST)
      .map(([nm, id]) => `<span class="c">${nm.padEnd(10)}</span>${$(id).hidden ? (taskBtn($(id)) ? '<span class="a">minimised</span>' : '<span class="d">closed</span>') : '<span class="g">open</span>'}`).join('\n')),
    open: a => { const id = NAMES[(a[0] || '').toLowerCase()]; if (!id) { print(`open: no window called "${esc(a[0] || '')}". Try <span class="c">ls</span>`); return; } show(id); print(`<span class="d">opened ${esc(a[0])}</span>`); },
    close: a => {
      const id = NAMES[(a[0] || '').toLowerCase()]; if (!id) { print(`close: no window called "${esc(a[0] || '')}"`); return; }
      if (id === 'w-term') { C.exit(); return; }
      closeWin($(id)); print(`<span class="d">closed ${esc(a[0])}</span>`);
    },
    whoami: () => print(`${esc(S.profile.name)}. ${esc(S.profile.tagline)}\n${S.now.map(n => `<span class="a">${esc(n.role)}</span>, ${esc(n.org)}`).join('\n')}`),
    papers: a => {
      const gi = a.indexOf('--grep'); const term = gi >= 0 ? a.slice(gi + 1).filter(x => !x.startsWith('--') && x !== 'cites').join(' ') : '';
      papers.grep(term); papers.sortCites(a.includes('--sort') || a.includes('--sort=cites') || a.includes('cites')); papers.all(a.includes('--all') || !!term);
      const rows = papers.rows();
      print(rows.length ? rows.slice(0, 6).map(p => `<span class="a">${p[0]}</span> <span class="v">${p[1].padEnd(7)}</span> ${p[3] != null ? `<span class="d">${String(p[3]).padStart(3)}</span> ` : '<span class="d">  –</span> '}${esc(p[2])}`).join('\n') + (rows.length > 6 ? `\n<span class="d">… ${rows.length - 6} more in the Papers window</span>` : '') : `no papers match "${esc(term)}"`);
      show('w-papers');
    },
    timeline: a => {
      const y = parseInt(a[0], 10);
      show('w-journey');
      if (!y) { timeline.replay(); print(`<span class="d">replaying ${Y0} → now</span>`); return; }
      if (y < Y0 || y > Y1) { print(`timeline: I have records for ${Y0} to ${Y1}`); return; }
      timeline.setYear(y);
      const now = ROLES.filter(r => r[1] && timeline.activeIn(r[1], y)).map(r => r[0]);
      print(`<span class="a">${y}</span>: ${now.length ? now.map(esc).join(', ') : 'between things'}`);
    },
    hire: a => {
      show('w-work');
      if (a.includes('--solo')) print(`Just me, for AI engineering work. <a href="${esc(MAIL)}">${esc(L.email)}</a>`);
      else if (a.includes('--team')) print(`A wider team, for a range of expertise including Growth, People Ops, Strategy and AI Law, through <a href="${esc(L.leadershift)}"${ext(L.leadershift)}>The Leadershift Studio</a>.`);
      else print(`Two ways in:\n  <span class="g">--solo</span>  AI engineering work: just me, <a href="${esc(MAIL)}">${esc(L.email)}</a>\n  <span class="g">--team</span>  Growth, People Ops, Strategy, AI Law: a wider team, <a href="${esc(L.leadershift)}"${ext(L.leadershift)}>The Leadershift Studio</a>`);
    },
    style: a => {
      const id = (a[0] || '').toLowerCase();
      if (!id) { print(`style: ${Styles.current}. Options: ${styleIds.join(', ')}`); return; }
      if (!styleIds.includes(id)) { print(`usage: style ${styleIds.join('|')}`); return; }
      if (id === Styles.current) { print(`already in the ${id} look`); return; }
      print(`<span class="d">switching to the ${esc(id)} look…</span>`);
      setTimeout(() => switchStyle(id), 300);
    },
    github: () => {
      print('<span class="d">asking github…</span>');
      getRepos().then(r => print(r.slice(0, 6).map(x => `<a href="${esc(x.html_url)}" target="_blank" rel="noopener">${esc(x.name)}</a> <span class="d">${esc(x.language || '')} ${new Date(x.pushed_at).toISOString().slice(0, 10)}</span>`).join('\n') || 'no public repos'))
        .catch(() => print(`github is not answering right now. <a href="${esc(L.github)}" target="_blank" rel="noopener">Open GitHub</a>`));
    },
    wallpaper: a => { if (!a[0]) { print(`wallpaper: ${currentWall()}. Options: ${WALLS.join(', ')}`); return; } if (setWall(a[0])) print(`wallpaper: ${esc(a[0])}`); else print(`usage: wallpaper ${WALLS.join('|')}`); },
    reset: () => { resetDesktop(); print('<span class="d">desktop reset</span>'); },
    clear: () => { out.innerHTML = ''; },
    history: () => print(hist.map((h, i) => `${String(i + 1).padStart(3)}  ${esc(h)}`).join('\n') || '<span class="d">empty</span>'),
    date: () => print(new Date().toString()),
    uname: () => print('bilal-desktop (90s look)'),
    sudo: () => print('Nice try. You could <span class="c">hire --team</span> instead.'),
    rm: () => { show('w-bin'); print('Nothing here is ever really deleted. It all ends up in the <span class="c">bin</span>.'); },
    screensaver: () => { print('<span class="d">starting the screen saver. Any key brings you back.</span>'); setTimeout(() => act('saver'), 300); },
    exit: () => { print('<span class="d">bye</span>'); setTimeout(() => closeWin($('w-term')), 300); },
  };
  const CMDS = Object.keys(C);
  const COMPLETE = { open: Object.keys(NAMES), close: Object.keys(NAMES), papers: ['--grep', '--sort', '--all'], hire: ['--solo', '--team'], wallpaper: WALLS, style: styleIds, timeline: ['2008', '2015', '2017', '2021', String(Y1)] };

  function run(line) {
    line = line.trim(); if (!line) return;
    print(esc(line), 'cmd'); hist.push(line); hi = hist.length;
    const [name, ...args] = line.split(/\s+/);
    const fn = C[name.toLowerCase()];
    if (fn) fn(args); else print(`${esc(name)}: command not found. Try <span class="c">help</span>.`);
  }
  form.addEventListener('submit', e => { e.preventDefault(); run(input.value); input.value = ''; });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp') { e.preventDefault(); if (hi > 0) input.value = hist[--hi]; }
    else if (e.key === 'ArrowDown') { e.preventDefault(); hi = Math.min(hist.length, hi + 1); input.value = hist[hi] || ''; }
    else if (e.key === 'Tab') {
      e.preventDefault();
      const parts = input.value.split(' '), last = parts[parts.length - 1];
      const pool = parts.length === 1 ? CMDS : (COMPLETE[parts[0]] || []);
      const hits = pool.filter(x => x.startsWith(last));
      if (hits.length === 1) { parts[parts.length - 1] = hits[0]; input.value = parts.join(' ') + (hits[0].endsWith('=') ? '' : ' '); }
      else if (hits.length > 1) print(hits.join('  '), 'd');
    }
  });
  $('term').addEventListener('click', e => { if (!e.target.closest('a') && !getSelection().toString()) input.focus(); });
  $('w-term').addEventListener('winopen', () => { if (!mobile()) setTimeout(() => input.focus({ preventScroll: true }), 30); });
  print('Welcome. Type <span class="c">help</span> to see what this desktop can do.');
})();
$('termBtn').addEventListener('click', () => act('term'));
// ` or Ctrl+Alt+T opens the terminal from anywhere (except while typing).
addEventListener('keydown', e => {
  const typing = tgt(e).closest('input, textarea');
  if ((e.key === '`' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) || (e.ctrlKey && e.altKey && (e.key === 't' || e.key === 'T'))) { e.preventDefault(); act('term'); }
});

/* ---------- start ---------- */
let booted = false;
(() => {
  // A link like /90s/?open=papers,reading opens exactly those windows.
  const req = Styles.requested();
  let open = null;
  if (req) open = req.map(a => APP[a]);
  else { try { open = JSON.parse(store.get('open')); } catch {} }
  if (!Array.isArray(open) || (!req && !open.length)) open = DEFAULT_OPEN;
  if (mobile()) open = [...new Set([...open, ...DEFAULT_OPEN, 'w-projects', 'w-papers'])];
  open.filter(id => $(id)).forEach(id => openWin($(id)));
  if (!mobile()) layout();
  const first = req && req.length ? $(APP[req[0]]) : $('w-about');
  if (mobile()) { if (req && req.length) first.scrollIntoView({ block: 'start' }); else scrollTo(0, 0); }
  else if (first && !first.hidden) focusWin(first);
  addEventListener('resize', () => { if (!mobile()) layout(); });
  booted = true;
})();

/* ---------- start-up splash, once per visit ---------- */
(() => {
  const boot = $('boot'), prog = $('bootProg'), msg = $('bootMsg');
  const seen = !!sstore.get('booted'); sstore.set('booted', '1');
  if (reduce || seen || Styles.requested()) { boot.remove(); return; }
  boot.hidden = false;
  const N = 18, MSGS = ['Loading your desktop', 'Opening About me', 'Opening What I do', 'Opening My journey', 'Ready'];
  let i = 0, done = false;
  const finish = () => { if (done) return; done = true; boot.classList.add('done'); setTimeout(() => boot.remove(), 350); };
  const step = () => {
    if (done) return;
    if (i >= N) { setTimeout(finish, 250); return; }
    prog.insertAdjacentHTML('beforeend', '<i></i>'); i++;
    msg.textContent = MSGS[Math.min(MSGS.length - 1, Math.floor(i / N * MSGS.length))];
    setTimeout(step, 55 + Math.random() * 40);
  };
  boot.addEventListener('click', finish);
  addEventListener('keydown', finish, { once: true });
  step();
})();

/* ---------- screensaver: a starfield, after a minute idle (shared, in common.js) ---------- */
Screensaver.init({ scene: 'stars', ready: () => !$('boot') && !mobile() });
})();
