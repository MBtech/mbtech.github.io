/* Modern style. Content comes from /data/site.js; shared helpers from /assets/js/common.js. */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = () => matchMedia('(max-width: 699px)').matches;
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
// Everything this style keeps in localStorage is under mb.modern.*; the shared 'style' key belongs to common.js.
const NS = 'mb.modern.';
const store = { get(k) { try { return localStorage.getItem(NS + k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(NS + k, v); } catch {} } };
const css = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/* ---------- data: everything comes from /data/site.js ---------- */
const SITE = window.SITE, D = window.SiteData;
const LANE_CLASS = { industry: 'ind', research: 'res', education: 'edu' };
// [label, spans, when, detail, cls, current, role], with [laneName, null] headers.
const ROLES = D.roleRows((lane, r) => r.current ? 'g' : LANE_CLASS[lane]);
// [year, venue, title, cites, older, url, paper]
const PAPERS = D.paperRows();
const L = SITE.links;
const LINKS = [
  { href: 'mailto:' + L.email, label: 'Email', note: L.email, icon: 'email' },
  { href: L.github, label: 'GitHub', note: 'Code and experiments', icon: 'github' },
  { href: L.scholar, label: 'Google Scholar', note: 'Every paper, with citations', icon: 'scholar' },
  { href: L.medium, label: 'Medium', note: 'Things I have written', icon: 'medium' },
  { open: 'w-reading', label: 'Reading list', note: 'Books I recommend', icon: 'books' },
];
const TEAM = L.leadershift;
const ext = href => /^https?:/.test(href) ? ' target="_blank" rel="noopener"' : '';
// Shared app ids (common.js) <-> window element ids here.
const WIN_ID = id => 'w-' + id;
const APP_ID = wid => wid.replace(/^w-/, '');

/* ---------- app icons: original, drawn in SVG on soft gradient tiles ---------- */
const tile = (id, a, b, inner) => `<svg viewBox="0 0 60 60" aria-hidden="true"><defs><linearGradient id="g-${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="60" height="60" fill="url(#g-${id})"/>${inner}</svg>`;
let iconSeq = 0;
const ICONS = {
  about: () => tile('a' + (++iconSeq), '#F7C76C', '#EE9A6E', '<circle cx="30" cy="23" r="9" fill="#fff"/><path d="M14 47c0-9 7-15 16-15s16 6 16 15z" fill="#fff"/>'),
  work: () => tile('w' + (++iconSeq), '#3FBF8C', '#167A5A', '<rect x="13" y="22" width="34" height="24" rx="5" fill="#fff"/><path d="M24 22v-4a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v4" fill="none" stroke="#fff" stroke-width="3"/><rect x="13" y="30" width="34" height="3" fill="#167A5A" opacity=".35"/><rect x="27" y="28" width="6" height="7" rx="2" fill="#167A5A"/>'),
  journey: () => tile('j' + (++iconSeq), '#2C9AAE', '#155463', '<rect x="12" y="17" width="20" height="6" rx="3" fill="#fff"/><rect x="20" y="27" width="28" height="6" rx="3" fill="#FFD27A"/><rect x="16" y="37" width="16" height="6" rx="3" fill="#fff" opacity=".8"/><rect x="41" y="13" width="2.5" height="34" rx="1.2" fill="#fff" opacity=".7"/>'),
  projects: () => tile('pj' + (++iconSeq), '#F7B955', '#E07B2E', '<path d="M30 12a11 11 0 0 0-6 20.2V37h12v-4.8A11 11 0 0 0 30 12z" fill="#fff"/><rect x="24" y="40" width="12" height="3.5" rx="1.5" fill="#fff"/><rect x="26" y="46" width="8" height="3" rx="1.5" fill="#fff" opacity=".8"/><path d="M27 30l3-6 3 6" fill="none" stroke="#E07B2E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'),
  papers: () => tile('p' + (++iconSeq), '#F4F1E8', '#D7D2C4', '<rect x="19" y="11" width="26" height="34" rx="3" fill="#C8C1AF"/><rect x="15" y="15" width="26" height="34" rx="3" fill="#fff" stroke="#BDB6A3"/><rect x="20" y="22" width="16" height="2.5" rx="1" fill="#167A5A"/><rect x="20" y="28" width="14" height="2" rx="1" fill="#A49D8A"/><rect x="20" y="33" width="16" height="2" rx="1" fill="#A49D8A"/><rect x="20" y="38" width="10" height="2" rx="1" fill="#A49D8A"/>'),
  links: () => tile('l' + (++iconSeq), '#F49A7E', '#D2593F', '<path d="M27 33a7 7 0 0 0 10 0l6-6a7 7 0 0 0-10-10l-2 2" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/><path d="M33 27a7 7 0 0 0-10 0l-6 6a7 7 0 0 0 10 10l2-2" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>'),
  term: () => tile('t' + (++iconSeq), '#25332F', '#0D1513', '<path d="M15 22l9 8-9 8" fill="none" stroke="#7FD1A0" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="28" y="36" width="15" height="3.5" rx="1.5" fill="#F2B33D"/>'),
  search: () => tile('s' + (++iconSeq), 'rgba(255,255,255,.55)', 'rgba(255,255,255,.25)', '<circle cx="27" cy="27" r="10" fill="none" stroke="currentColor" stroke-width="4"/><path d="M35 35l9 9" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'),
  email: () => tile('em' + (++iconSeq), '#2E7DB8', '#1B4F7A', '<rect x="12" y="17" width="36" height="26" rx="4" fill="#fff"/><path d="M14 20l16 12 16-12" fill="none" stroke="#1B4F7A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'),
  github: () => tile('gh' + (++iconSeq), '#3A4440', '#1A201E', '<circle cx="30" cy="30" r="14" fill="none" stroke="#fff" stroke-width="3.5"/><circle cx="24.5" cy="29" r="2" fill="#fff"/><circle cx="35.5" cy="29" r="2" fill="#fff"/><path d="M25 36c3 2.5 7 2.5 10 0" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>'),
  scholar: () => tile('sc' + (++iconSeq), '#5B8DEF', '#2F5DB8', '<path d="M30 14l18 10-18 10-18-10z" fill="#fff"/><path d="M19 29v8c0 3 5 6 11 6s11-3 11-6v-8" fill="none" stroke="#fff" stroke-width="3"/>'),
  medium: () => tile('md' + (++iconSeq), '#2A2A2A', '#111', '<circle cx="21" cy="30" r="8" fill="#fff"/><ellipse cx="36" cy="30" rx="4" ry="8" fill="#fff"/><ellipse cx="45" cy="30" rx="1.6" ry="7" fill="#fff"/>'),
  style: () => tile('st' + (++iconSeq), '#8E7CF0', '#4F3FB8', '<rect x="12" y="14" width="16" height="14" rx="3" fill="#fff"/><rect x="32" y="14" width="16" height="14" rx="3" fill="#C9C2FF"/><rect x="12" y="32" width="16" height="14" rx="3" fill="#C9C2FF"/><rect x="32" y="32" width="16" height="14" rx="7" fill="#fff"/>'),
  books: () => tile('bk' + (++iconSeq), '#E2634F', '#A63A2B', '<rect x="15" y="16" width="8" height="28" rx="1.5" fill="#fff"/><rect x="25" y="19" width="8" height="25" rx="1.5" fill="#FFD27A"/><rect x="36" y="15" width="8" height="30" rx="1.5" fill="#fff" transform="rotate(10 40 30)"/>'),
};

/* ---------- content ---------- */
(() => {
  const P = SITE.profile, S = SITE.services;
  $('brandName').textContent = P.short;
  $('srTitle').textContent = `${P.name}: ${P.tagline}`;
  $('aboutName').textContent = P.name;
  $('aboutLede').textContent = P.tagline;
  $('avaImg').alt = `Pop-art portrait of ${P.name}`;
  $('aboutBio').innerHTML = P.bio.map(p => `<p class="bio">${esc(p)}</p>`).join('');
  const org = x => x.orgUrl ? `<a href="${esc(x.orgUrl)}" target="_blank" rel="noopener">${esc(x.org)}</a>` : esc(x.org);
  $('nowList').innerHTML = SITE.now.map(x => x.since
    ? `<li><span class="when">Since ${esc(x.since)}</span><span>${esc(x.role)}, ${org(x)}${x.note ? ', ' + esc(x.note) : ''}</span></li>`
    : `<li><span class="when">Open</span><span>${esc(x.role)}. <a href="#" data-open="w-work">Work with me</a></span></li>`).join('');
  $('wNowList').innerHTML = SITE.now.map(x => `<li><i class="pin"></i><div><b>${x.since ? org(x) : esc(x.role)}</b><span>${x.since ? esc(x.role) + (x.note ? ' to ' + esc(x.note) : '') + ', since ' + esc(x.since) : esc(x.org)}</span></div></li>`).join('');
  $('workIntro').textContent = S.intro;
  $('services').innerHTML = S.items.map(s => `<li><b>${esc(s.title)}</b><span>${esc(s.text)}</span></li>`).join('');
  $('soloT').textContent = S.solo.title; $('soloX').textContent = S.solo.text; $('soloA').textContent = S.solo.cta; $('soloA').href = 'mailto:' + L.email;
  $('soloA').removeAttribute('target'); $('soloA').removeAttribute('rel');
  $('teamT').textContent = S.team.title; $('teamX').textContent = S.team.text; $('teamA').textContent = S.team.cta; $('teamA').href = L.leadershift;
  const sc = SITE.scholar;
  $('wCiteN').textContent = sc.citations; $('wH').textContent = sc.hIndex; $('wP').textContent = SITE.papers.length;
  $('wCite').setAttribute('aria-label', `${sc.citations} citations on Google Scholar. Open my papers.`);
  $('scholarLink').href = L.scholar;
  $('helloText').textContent = `Hello, I'm ${P.short}.`;
})();

/* ---------- reading list, projects ---------- */
ReadingList.render($('rl'));
Projects.render($('pj'));
function readingSearch(q) { const i = $('rl').querySelector('input[type=search]'); i.value = q; i.dispatchEvent(new Event('input')); }

/* ---------- window manager ---------- */
const WINDOWS = [...document.querySelectorAll('.win')];
const running = new Set();
let topZ = 10, active = null;
const SVG = {
  min: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 6h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  max: '<svg viewBox="0 0 12 12" aria-hidden="true"><rect x="2" y="2" width="8" height="8" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
  x: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  back: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Home',
};

function refreshDock() {
  document.querySelectorAll('#dock .dk[data-open]').forEach(b => {
    const on = running.has(b.dataset.open);
    b.classList.toggle('running', on);
    b.querySelector('.state').textContent = on ? ' (open)' : '';
  });
  renderGo();
}
function focusWin(w) {
  if (!w || w.hidden) return;
  w.style.zIndex = ++topZ;
  WINDOWS.forEach(x => x.classList.toggle('active', x === w));
  active = w;
}
function animate(w, cls, done) {
  if (reduce) { done && done(); return; }
  w.classList.remove('opening', 'closing'); void w.offsetWidth; w.classList.add(cls);
  let fired = false;
  const end = () => { if (fired) return; fired = true; w.classList.remove(cls); done && done(); };
  w.addEventListener('animationend', end, { once: true });
  setTimeout(end, 520);
}
function saveOpen() { if (!mobile()) store.set('open', JSON.stringify(WINDOWS.filter(w => !w.hidden).map(w => w.id))); }
function openWin(w, opts = {}) {
  if (!w) return;
  if (mobile()) {
    // Phones show one app at a time, like a home screen.
    WINDOWS.forEach(x => { if (x !== w && !x.hidden) x.hidden = true; });
    if (w.hidden) { try { history.pushState({ mbApp: w.id }, ''); } catch {} }
    document.body.classList.add('app-open');
  }
  const wasHidden = w.hidden;
  w.hidden = false;
  if (wasHidden) animate(w, 'opening');
  running.add(w.id);
  focusWin(w);
  w.dispatchEvent(new Event('winopen'));
  if (opts.focus !== false && (opts.focus || mobile())) w.querySelector(mobile() ? '.back' : '.tbar').focus({ preventScroll: true });
  saveOpen(); refreshDock();
}
function minWin(w) { w.hidden = true; if (active === w) active = null; saveOpen(); refreshDock(); }
function closeWin(w) {
  if (!w || w.hidden) return;
  running.delete(w.id); if (active === w) active = null;
  w.classList.remove('max');
  animate(w, 'closing', () => { w.hidden = true; if (mobile() && !WINDOWS.some(x => !x.hidden)) document.body.classList.remove('app-open'); saveOpen(); });
  refreshDock();
}
// On phones the system back gesture closes the open app.
function goHome() {
  const w = WINDOWS.find(x => !x.hidden);
  try { if (history.state && history.state.mbApp) { history.back(); return; } } catch {}
  if (w) closeWin(w);
}
addEventListener('popstate', () => { if (!mobile()) return; WINDOWS.filter(x => !x.hidden).forEach(closeWin); });

WINDOWS.forEach(w => {
  const bar = w.querySelector('.tbar'), title = w.dataset.title;
  bar.querySelector('.tico').innerHTML = ICONS[w.dataset.icon]();
  bar.querySelector('.back').innerHTML = SVG.back;
  bar.querySelector('.back').addEventListener('click', goHome);
  const ctl = document.createElement('div'); ctl.className = 'ctl';
  ctl.innerHTML = `<button aria-label="Minimise ${esc(title)}">${SVG.min}</button><button aria-label="Make ${esc(title)} bigger">${SVG.max}</button><button class="x" aria-label="Close ${esc(title)}">${SVG.x}</button>`;
  bar.appendChild(ctl);
  const [bMin, bMax, bX] = ctl.querySelectorAll('button');
  bMin.addEventListener('click', e => { e.stopPropagation(); minWin(w); });
  bMax.addEventListener('click', e => { e.stopPropagation(); w.classList.toggle('max'); focusWin(w); w.dispatchEvent(new Event('winresize')); });
  bX.addEventListener('click', e => { e.stopPropagation(); closeWin(w); });
  bar.addEventListener('dblclick', e => { if (!mobile() && !e.target.closest('button')) { w.classList.toggle('max'); w.dispatchEvent(new Event('winresize')); } });
  w.addEventListener('pointerdown', () => focusWin(w));
  w.addEventListener('focusin', () => focusWin(w));
  bar.tabIndex = 0; bar.setAttribute('aria-label', `${title} window. Arrow keys move it, Escape closes it.`);
  bar.addEventListener('pointerdown', e => {
    if (mobile() || e.button !== 0 || e.target.closest('button') || w.classList.contains('max')) return;
    const desk = $('desk').getBoundingClientRect(), r = w.getBoundingClientRect();
    const dx = e.clientX - r.left, dy = e.clientY - r.top;
    bar.setPointerCapture(e.pointerId);
    const move = ev => {
      w.style.left = Math.max(-r.width + 120, Math.min(desk.width - 120, ev.clientX - desk.left - dx)) + 'px';
      w.style.top = Math.max(0, Math.min(desk.height - 60, ev.clientY - desk.top - dy)) + 'px';
    };
    const up = () => { bar.removeEventListener('pointermove', move); bar.removeEventListener('pointerup', up); savePos(w); };
    bar.addEventListener('pointermove', move); bar.addEventListener('pointerup', up);
  });
  bar.addEventListener('keydown', e => {
    if (mobile()) return;
    const d = { ArrowLeft: [-20, 0], ArrowRight: [20, 0], ArrowUp: [0, -20], ArrowDown: [0, 20] }[e.key];
    if (!d) return; e.preventDefault();
    w.style.left = (w.offsetLeft + d[0]) + 'px'; w.style.top = Math.max(0, w.offsetTop + d[1]) + 'px'; savePos(w);
  });
  // Swipe in from the left edge to go back, on phones.
  let sx = null;
  w.addEventListener('touchstart', e => { const t = e.touches[0]; sx = t.clientX < 28 ? t.clientX : null; }, { passive: true });
  w.addEventListener('touchend', e => { if (sx !== null && e.changedTouches[0].clientX - sx > 70) goHome(); sx = null; }, { passive: true });
});
function savePos(w) { store.set('pos:' + w.id, JSON.stringify([w.offsetLeft, w.offsetTop])); }

// First layout: About and What I do side by side, My journey below; others cascade when opened.
function layout() {
  if (mobile()) return;
  const W = innerWidth, H = innerHeight - 36, dockH = 92;
  const widgets = $('widgets').getBoundingClientRect();
  const right = W >= 900 ? widgets.left - 18 : W - 18;
  const L0 = 22, avail = right - L0;
  const saved = id => { try { return JSON.parse(store.get('pos:' + id)); } catch { return null; } };
  const put = (id, x, y, w) => {
    const el = $(id), sp = saved(id);
    el.style.width = Math.min(w, avail) + 'px';
    const top = sp ? Math.max(0, Math.min(sp[1], H - 80)) : Math.max(12, y);
    el.style.left = (sp ? Math.min(sp[0], W - 160) : Math.max(L0, Math.min(x, right - Math.min(w, avail)))) + 'px';
    el.style.top = top + 'px';
    el.style.maxHeight = Math.max(240, H - dockH - top - 6) + 'px';
  };
  const side = avail >= 900;
  const aw = side ? Math.min(480, avail * .46) : Math.min(500, avail * .62);
  put('w-about', L0, 16, aw);
  put('w-work', side ? L0 + aw + 18 : L0 + avail * .3, side ? 16 : 70, side ? Math.min(620, avail - aw - 18) : Math.min(600, avail * .7));
  put('w-journey', L0 + 40, 60, Math.min(800, avail - 40));
  put('w-projects', L0 + 110, 50, Math.min(640, avail - 110));
  put('w-papers', L0 + 140, 70, Math.min(720, avail - 140));
  put('w-reading', L0 + 170, 40, Math.min(640, avail - 170));
  put('w-links', L0 + 200, 110, 460);
  put('w-terminal', right - Math.min(640, avail), H - dockH - 380, 640);
  $('w-terminal').style.height = Math.min(360, H - dockH - 40) + 'px';
  return side;
}

/* ---------- dock, phone apps, Go menu ---------- */
const APPS = [
  { id: 'w-about', label: 'About me', icon: 'about', fav: true },
  { id: 'w-work', label: 'What I do', icon: 'work', fav: true },
  { id: 'w-journey', label: 'My journey', icon: 'journey', fav: true },
  { id: 'w-projects', label: 'Projects', icon: 'projects' },
  { id: 'w-papers', label: 'Papers', icon: 'papers' },
  { id: 'w-reading', label: 'Reading list', icon: 'books' },
  { id: 'w-links', label: 'Links', icon: 'links' },
  { id: 'w-terminal', label: 'Terminal', icon: 'term' },
];
function dockClick(id) {
  const w = $(id);
  if (mobile() || w.hidden) { openWin(w, { focus: true }); return; }
  if (active === w) minWin(w); else focusWin(w);
}
$('dock').innerHTML =
  APPS.map(a => `${a.id === 'w-terminal' ? '<span class="dsep" aria-hidden="true"></span>' : ''}<button class="dk" data-open="${a.id}"${a.fav ? ' data-fav' : ''}><span class="tile">${ICONS[a.icon]()}</span><span class="tip" aria-hidden="true">${a.label}</span><span class="sr">${a.label}</span><span class="sr state"></span></button>`).join('') +
  `<button class="dk" id="dockSearch" data-fav><span class="tile" style="color:var(--ink)">${ICONS.search()}</span><span class="tip" aria-hidden="true">Search</span><span class="sr">Search everything</span></button>`;
// Each dock button reads its name, then "(open)" while the app is running.
document.querySelectorAll('#dock .dk[data-open]').forEach(b => b.addEventListener('click', () => dockClick(b.dataset.open)));
$('dockSearch').addEventListener('click', () => palette.open());
$('apps').innerHTML = APPS.map(a => `<li><button data-open="${a.id}"><span class="tile">${ICONS[a.icon]()}</span>${a.label}</button></li>`).join('') +
  // Phones hide the menu bar's Style menu, so the home screen gets its own way in.
  `<li><button type="button" id="styleApp"><span class="tile">${ICONS.style()}</span>Style</button></li>`;
$('styleApp').addEventListener('click', e => { e.stopPropagation(); menus.open('m-style', true); });
$('apps').addEventListener('click', e => { const b = e.target.closest('[data-open]'); if (b) openWin($(b.dataset.open)); });
function renderGo() {
  $('m-go').innerHTML = APPS.map(a => `<button role="menuitem" data-act="open:${a.id}"><span class="chk">${running.has(a.id) ? '•' : ''}</span>${a.label}</button>`).join('');
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-open]');
  if (b && !b.closest('#dock, #apps') && $(b.dataset.open)) { e.preventDefault(); openWin($(b.dataset.open), { focus: true }); }
});

/* ---------- menu bar menus ---------- */
const menus = (() => {
  let openId = null;
  const btns = [...document.querySelectorAll('#menubar [data-menu]')];
  function close() { if (!openId) return; $(openId).hidden = true; btns.forEach(b => b.setAttribute('aria-expanded', 'false')); openId = null; }
  function open(id, focus) {
    close(); const m = $(id), b = btns.find(x => x.dataset.menu === id);
    if (id === 'm-view') markView();
    m.hidden = false; openId = id; b.setAttribute('aria-expanded', 'true');
    const r = b.getBoundingClientRect(); m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 8) + 'px'; m.style.top = '40px';
    if (focus) m.querySelector('button').focus();
  }
  btns.forEach(b => {
    b.addEventListener('click', e => { e.stopPropagation(); openId === b.dataset.menu ? close() : open(b.dataset.menu, e.detail === 0); });
    b.addEventListener('pointerenter', () => { if (openId && openId !== b.dataset.menu) open(b.dataset.menu); });
    b.addEventListener('keydown', e => { if (e.key === 'ArrowDown') { e.preventDefault(); open(b.dataset.menu, true); } });
  });
  document.querySelectorAll('.menu').forEach(m => {
    m.addEventListener('click', e => { const it = e.target.closest('[data-act]'); if (!it) return; const a = it.dataset.act; close(); act(a); });
    m.addEventListener('keydown', e => {
      const items = [...m.querySelectorAll('button')], i = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus(); }
      if (e.key === 'Escape') { e.stopPropagation(); const b = btns.find(x => x.dataset.menu === openId); close(); b && b.focus(); }
    });
  });
  document.addEventListener('pointerdown', e => { if (openId && !e.target.closest('.menu, #menubar [data-menu]')) close(); });
  return { close, open, isOpen: () => !!openId };
})();
function markView() {
  const t = store.get('theme') || 'auto', w = store.get('wall') || 'aurora';
  document.querySelectorAll('#m-view [data-act]').forEach(b => {
    const [k, v] = b.dataset.act.split(':'), on = (k === 'theme' ? t : w) === v;
    b.setAttribute('aria-checked', on); b.querySelector('.chk').textContent = on ? '•' : '';
  });
}

/* ---------- appearance ---------- */
function isDark() { const t = document.documentElement.dataset.theme; return t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches; }
function setTheme(t) {
  if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t; else { delete document.documentElement.dataset.theme; t = 'auto'; }
  store.set('theme', t); themeIcon();
}
function themeIcon() {
  const dark = isDark();
  $('themeBtn').innerHTML = dark
    ? '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="10" cy="10" r="4"/><path d="M10 1.5v2M10 16.5v2M1.5 10h2M16.5 10h2M4 4l1.4 1.4M14.6 14.6L16 16M4 16l1.4-1.4M14.6 5.4L16 4" stroke-linecap="round"/></svg>'
    : '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M16 12.5A6.5 6.5 0 0 1 7.5 4a6.5 6.5 0 1 0 8.5 8.5z" stroke-linejoin="round"/></svg>';
  $('themeBtn').setAttribute('aria-label', dark ? 'Switch to light' : 'Switch to dark');
}
$('themeBtn').addEventListener('click', () => setTheme(isDark() ? 'light' : 'dark'));
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', themeIcon);
const WALLS = ['aurora', 'dusk', 'plain'];
function setWall(w) { if (!WALLS.includes(w)) return false; if (w === 'aurora') delete document.body.dataset.wall; else document.body.dataset.wall = w; store.set('wall', w); return true; }
document.addEventListener('visibilitychange', () => document.body.classList.toggle('paused', document.hidden));

/* ---------- clock + toast ---------- */
(() => {
  const tick = () => {
    const d = new Date();
    $('clock').textContent = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) + '  ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    $('wTime').textContent = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    $('wDate').textContent = d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  };
  tick(); setInterval(tick, 1000);
})();
let toastT = null;
function toast(msg) { const t = $('toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 2800); }

/* ---------- My journey: timeline ---------- */
const timeline = (() => {
  const Y0 = Math.floor(Math.min(...ROLES.filter(r => r[1]).flatMap(r => r[1].map(s => s[0])))), Y1 = Math.floor(D.NOW), SPAN = Y1 + 1 - Y0;
  const pct = y => ((y - Y0) / SPAN * 100) + '%';
  const COL = { g: 'var(--good)', ind: 'var(--t-ind)', res: 'var(--t-res)', edu: 'var(--t-edu)' };
  const tl = $('tl'), range = $('year'), out = $('yearOut'), then = $('then'), detail = $('detail'), win = $('w-journey');
  range.min = Y0; range.max = Y1; range.value = Y1;
  let year = Y1, playing = null, touched = false, sel = -1;
  const activeIn = (spans, y) => spans.some(([s, e]) => Math.floor(s) <= y && y <= Math.floor(e));
  function draw() {
    let html = '', i = 0;
    for (const [label, spans, , , c, now] of ROLES) {
      if (!spans) { html += `<div class="tgroup">${label}</div>`; continue; }
      const on = activeIn(spans, year), idx = i++;
      const bars = spans.filter(([s]) => s < year + 1).map(([s, e]) => {
        const end = Math.min(e, year + 1);
        return `<span class="bar${now && year >= Y1 ? ' live' : ''}" style="left:${pct(s)};width:calc(${pct(end)} - ${pct(s)});background-color:${COL[c]}"></span>`;
      }).join('');
      html += `<div class="trow${on ? '' : ' off'}${sel === idx ? ' sel' : ''}" data-i="${idx}" tabindex="0" role="button" aria-pressed="${sel === idx}"><span class="lab">${label}</span><div class="track">${bars}<span class="cur" style="left:calc(${pct(year + .5)} - 1px)"></span></div></div>`;
    }
    let ticks = ''; for (let y = Y0; y <= Y1; y += 3) ticks += `<span style="left:${pct(y + .5)}">${y}</span>`;
    html += `<div class="axis"><span></span><div class="ticks">${ticks}</div></div>`;
    tl.innerHTML = html;
    const now = ROLES.filter(r => r[1] && activeIn(r[1], year)).map(r => r[0]);
    then.textContent = `${year}: ${now.length ? now.join(' + ') : 'between things'}`;
    out.value = year; range.value = year;
    mini(now);
  }
  // The widget: one thin bar per role, a cursor on the year, and what was going on then.
  function mini(now) {
    const rows = ROLES.filter(r => r[1]), w = 236, rh = 66 / rows.length, X = y => (y - Y0) / SPAN * w;
    $('jMini').innerHTML = rows.map(([, spans, , , c], i) => {
      const on = activeIn(spans, year);
      return `<rect x="0" y="${(i * rh + rh / 2 - .5).toFixed(1)}" width="${w}" height="1" fill="var(--line)"/>` +
        spans.filter(([s]) => s < year + 1).map(([s, e]) => `<rect x="${X(s).toFixed(1)}" y="${(i * rh + 1.2).toFixed(1)}" width="${Math.max(3, X(Math.min(e, year + 1)) - X(s)).toFixed(1)}" height="${(rh - 2.4).toFixed(1)}" rx="2" fill="${COL[c]}" opacity="${on ? 1 : .45}"/>`).join('');
    }).join('') + `<rect x="${(X(year + .5) - 1).toFixed(1)}" y="0" width="2" height="66" rx="1" fill="var(--ink)" opacity=".35"/>`;
    $('jYear').textContent = year;
    $('jNow').textContent = now.length ? now.join(', ') : 'Between things';
  }
  function setYear(y, byUser) { if (byUser) { touched = true; clearInterval(playing); } year = Math.max(Y0, Math.min(Y1, y)); draw(); }
  function replay() {
    clearInterval(playing);
    if (reduce) { setYear(Y1); return; }
    let y = Y0; setYear(y);
    playing = setInterval(() => { if (++y > Y1) { clearInterval(playing); return; } setYear(y); }, 240);
  }
  function showDetail(idx) { const r = ROLES.filter(x => x[1])[idx]; detail.innerHTML = r ? `<b>${esc(r[6].title)}, ${esc(r[6].org)}</b> <span class="muted">${esc(r[2])}</span><br>${r[3]}` : ''; }
  tl.addEventListener('click', e => { const r = e.target.closest('.trow'); if (!r) return; sel = +r.dataset.i; showDetail(sel); draw(); tl.querySelector(`.trow[data-i="${sel}"]`).focus(); });
  tl.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.trow')) { e.preventDefault(); e.target.click(); } });
  range.addEventListener('input', () => setYear(+range.value, true));
  $('replay').addEventListener('click', () => { touched = true; replay(); });
  draw();
  // Play the journey once on arrival (the widget shows it even with the window closed).
  setTimeout(() => { if (!touched) replay(); }, reduce ? 0 : 1900);
  return { setYear: y => setYear(y, true), replay() { touched = true; replay(); }, activeIn, Y0, Y1 };
})();

/* ---------- Papers ---------- */
const papers = (() => {
  let q = '', all = false, key = 'year';
  function rows() {
    const hit = q ? new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') : null;
    return PAPERS.filter(p => (all || !p[4] || hit) && (!hit || hit.test(p[2] + ' ' + p[1] + ' ' + p[6].venueFull + ' ' + p[6].authors)))
      .sort((a, b) => key === 'cites' ? (b[3] ?? -1) - (a[3] ?? -1) || b[0] - a[0] : b[0] - a[0]);
  }
  function draw() {
    const re = q ? new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig') : null;
    const hl = s => re ? esc(s).replace(re, m => `<mark>${m}</mark>`) : esc(s);
    const r = rows();
    $('plist').innerHTML = r.map(([y, v, t, c, , url, p]) => `<li><span class="y">${y}</span><span><a href="${esc(url)}" target="_blank" rel="noopener" title="${esc(p.title)}">${hl(t)}</a><span class="v">${hl(p.venueFull || v)}</span><span class="au">${hl(p.authors)}</span></span><span class="c">${c == null ? 'new' : c + (c === 1 ? ' citation' : ' citations')}</span></li>`).join('') || '<li class="muted">No papers match.</li>';
    $('pcount').textContent = `${r.length} of ${PAPERS.length} papers`;
    $('q').value = q; $('sort').value = key; $('all').checked = all;
  }
  $('q').addEventListener('input', e => { q = e.target.value.trim(); draw(); });
  $('sort').addEventListener('change', e => { key = e.target.value; draw(); });
  $('all').addEventListener('change', e => { all = e.target.checked; draw(); });
  draw();
  return { grep(x) { q = x; draw(); }, sortCites(v) { key = v ? 'cites' : 'year'; draw(); }, all(v) { all = v; draw(); }, rows };
})();

/* ---------- Links ---------- */
$('linklist').innerHTML = LINKS.map(l => {
  const inner = `<span class="lt">${ICONS[l.icon]()}</span><span><b>${l.label}</b><span>${l.note}</span></span>`;
  return l.open ? `<li><button type="button" data-open="${l.open}">${inner}</button></li>` : `<li><a href="${esc(l.href)}"${ext(l.href)}>${inner}</a></li>`;
}).join('');

/* ---------- actions shared by menus, palette and terminal ---------- */
const DEFAULT_OPEN = ['w-about', 'w-work'];
function resetDesktop() {
  try { Object.keys(localStorage).filter(k => k.startsWith(NS)).forEach(k => localStorage.removeItem(k)); } catch {}
  WINDOWS.forEach(w => { w.classList.remove('max'); w.hidden = true; });
  running.clear(); setTheme('auto'); setWall('aurora');
  if (!mobile()) { DEFAULT_OPEN.forEach(id => openWin($(id), { focus: false })); layout(); focusWin($('w-about')); }
  else document.body.classList.remove('app-open');
  refreshDock(); toast('Desktop reset.');
}
function workWith(which) {
  openWin($('w-work'), { focus: true });
  const el = $(which === 'team' ? 'way-team' : 'way-solo');
  el.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
  el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
  el.querySelector('a').focus({ preventScroll: true });
}
// Which shared app ids are on screen right now, so they reopen in the other style.
function openApps() { return WINDOWS.filter(w => !w.hidden).map(w => APP_ID(w.id)); }
function switchStyle(id) {
  const s = Styles.list.find(x => x.id === id);
  if (!s) return false;
  if (id === Styles.current) { toast('You are already in the ' + s.label + ' look.'); return true; }
  toast('Switching to the ' + s.label + ' look…');
  return Styles.go(id, openApps());
}
function act(a) {
  const [k, v] = a.split(':');
  if (k === 'open') openWin($(v), { focus: true });
  else if (k === 'theme') setTheme(v);
  else if (k === 'wall') setWall(v);
  else if (a === 'reset') resetDesktop();
  else if (a === 'term') { openWin($('w-terminal'), { focus: false }); $('tin').focus(); }
  else if (k === 'style') switchStyle(v);
}

/* ---------- search everything (Ctrl+K / Cmd+K) ---------- */
const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
$('kbHint').textContent = isMac ? '⌘K' : 'Ctrl K';
const palette = (() => {
  const box = $('pal'), input = $('palq'), list = $('palres');
  let items = [], sel = 0, lastFocus = null;
  const appIcon = id => ICONS[APPS.find(a => a.id === id).icon]();
  const ACTIONS = [
    { label: 'Replay my journey', hint: 'Timeline', kw: 'timeline career history', icon: () => ICONS.journey(), run: () => { openWin($('w-journey'), { focus: true }); timeline.replay(); } },
    { label: 'Work with me: just me', hint: 'Email', kw: 'hire contact solo email mail fractional', icon: () => ICONS.email(), run: () => workWith('solo') },
    { label: 'Work with me: a wider team', hint: 'The Leadershift Studio', kw: 'hire team leadershift fractional', icon: () => ICONS.work(), run: () => workWith('team') },
    { label: () => isDark() ? 'Switch to light' : 'Switch to dark', hint: 'Appearance', kw: 'theme dark light mode appearance', icon: () => ICONS.search(), run: () => setTheme(isDark() ? 'light' : 'dark') },
    { label: 'Match my system appearance', hint: 'Appearance', kw: 'theme auto system', icon: () => ICONS.search(), run: () => setTheme('auto') },
    { label: 'Change wallpaper', hint: 'Daylight, dusk or plain', kw: 'background wallpaper', icon: () => ICONS.search(), run: () => { const cur = store.get('wall') || 'aurora'; setWall(WALLS[(WALLS.indexOf(cur) + 1) % WALLS.length]); } },
    { label: 'Switch to the 2000s look', hint: 'Style', kw: 'style look retro classic old blue taskbar 2000s', icon: () => ICONS.search(), run: () => switchStyle('2000s') },
    { label: 'Switch to the 90s look', hint: 'Style', kw: 'style look retro classic old grey 90s', icon: () => ICONS.search(), run: () => switchStyle('90s') },
    { label: 'Open the terminal', hint: 'For the curious', kw: 'shell command console', icon: () => ICONS.term(), run: () => act('term') },
    { label: 'Reset desktop', hint: 'Put every window back', kw: 'reset layout', icon: () => ICONS.search(), run: resetDesktop },
  ];
  function build(q) {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const match = s => words.every(w => s.toLowerCase().includes(w));
    const out = [];
    const apps = APPS.filter(a => !words.length || match(a.label + ' window app open')).map(a => ({ group: 'Open', label: a.label, hint: running.has(a.id) ? 'Open' : '', icon: () => appIcon(a.id), run: () => openWin($(a.id), { focus: true }) }));
    const acts = ACTIONS.map(x => ({ ...x, label: typeof x.label === 'function' ? x.label() : x.label, group: 'Actions' })).filter(x => !words.length || match(x.label + ' ' + x.hint + ' ' + x.kw));
    out.push(...apps.slice(0, words.length ? 4 : 7), ...acts.slice(0, words.length ? 5 : 4));
    if (words.length) {
      out.push(...PAPERS.filter(p => match(p[2] + ' ' + p[1] + ' ' + p[0] + ' ' + p[6].authors)).slice(0, 6).map(p => ({ group: 'Papers', label: p[2], hint: `${p[1]} ${p[0]}`, icon: () => ICONS.papers(), run: () => { openWin($('w-papers'), { focus: true }); papers.all(true); papers.grep(q); } })));
      out.push(...SITE.projects.items.flatMap(x => [x, ...(x.tools || [])]).filter(x => match(x.name + ' ' + (x.tagline || x.text) + ' project tool')).slice(0, 4).map(x => ({ group: 'Projects', label: x.name, hint: x.tagline || x.text, icon: () => ICONS.projects(), run: () => window.open(x.url, '_blank', 'noopener') })));
      out.push(...SITE.books.shelves.flatMap(s => s.books.map(b => ({ ...b, shelf: s.name }))).filter(b => match(b.title + ' ' + b.author)).slice(0, 4).map(b => ({ group: 'Books', label: b.title, hint: b.author, icon: () => ICONS.books(), run: () => { openWin($('w-reading'), { focus: true }); readingSearch(b.title); } })));
      out.push(...LINKS.filter(l => match(l.label + ' ' + l.note)).map(l => ({ group: 'Links', label: l.label, hint: l.note, icon: () => ICONS[l.icon](), run: () => { if (l.open) { openWin($(l.open), { focus: true }); return; } const a = document.createElement('a'); a.href = l.href; if (ext(l.href)) { a.target = '_blank'; a.rel = 'noopener'; } a.click(); } })));
    }
    return out;
  }
  function render() {
    let html = '', g = null;
    items.forEach((it, i) => {
      if (it.group !== g) { g = it.group; html += `<li class="grp" role="presentation">${g}</li>`; }
      html += `<li class="opt" role="option" id="po-${i}" data-i="${i}" aria-selected="${i === sel}"><span class="oi">${it.icon()}</span><span class="ol">${esc(it.label)}</span><span class="hint">${esc(it.hint || '')}</span></li>`;
    });
    list.innerHTML = html || `<li class="empty">Nothing matches "${esc(input.value)}".</li>`;
    input.setAttribute('aria-activedescendant', items.length ? 'po-' + sel : '');
    const cur = $('po-' + sel); if (cur) cur.scrollIntoView({ block: 'nearest' });
  }
  function update() { items = build(input.value.trim()); sel = 0; render(); }
  function open() { menus.close(); lastFocus = document.activeElement; box.hidden = false; input.value = ''; update(); input.focus(); }
  function close() { box.hidden = true; if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true }); }
  function choose(i) { const it = items[i]; if (!it) return; box.hidden = true; it.run(); }
  input.addEventListener('input', update);
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); if (!items.length) return; sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length; render(); }
    else if (e.key === 'Enter') { e.preventDefault(); choose(sel); }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); }
  });
  list.addEventListener('pointermove', e => { const o = e.target.closest('.opt'); if (o && +o.dataset.i !== sel) { sel = +o.dataset.i; render(); } });
  list.addEventListener('click', e => { const o = e.target.closest('.opt'); if (o) choose(+o.dataset.i); });
  box.addEventListener('pointerdown', e => { if (e.target === box) close(); });
  $('searchBtn').addEventListener('click', open);
  return { open, close, isOpen: () => !box.hidden };
})();

/* ---------- terminal: a fun extra ---------- */
const term = (() => {
  const out = $('tout'), input = $('tin'), form = $('tform');
  const hist = []; let hi = 0;
  const NAMES = { about: 'w-about', me: 'w-about', work: 'w-work', hire: 'w-work', journey: 'w-journey', timeline: 'w-journey', projects: 'w-projects', tools: 'w-projects', papers: 'w-papers', reading: 'w-reading', books: 'w-reading', links: 'w-links', terminal: 'w-terminal', term: 'w-terminal' };
  const print = (html, cls) => { const d = document.createElement('div'); if (cls) d.className = cls; d.innerHTML = html; out.appendChild(d); while (out.children.length > 200) out.firstChild.remove(); out.scrollTop = out.scrollHeight; };
  const show = id => { openWin($(id), { focus: false }); if (!mobile() && id !== 'w-terminal') { $('w-terminal').style.zIndex = ++topZ; input.focus({ preventScroll: true }); } };
  let repos = null;
  const getRepos = () => {
    if (repos) return Promise.resolve(repos);
    try { const c = JSON.parse(sessionStorage.getItem(NS + 'gh')); if (c && Date.now() - c.t < 600000) return Promise.resolve(repos = c.d); } catch {}
    return fetch('https://api.github.com/users/MBtech/repos?sort=pushed&per_page=8')
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => { repos = d.filter(r => !r.fork && r.name !== 'mbtech.github.io'); try { sessionStorage.setItem(NS + 'gh', JSON.stringify({ t: Date.now(), d: repos })); } catch {} return repos; });
  };
  const C = {
    help: () => print(
`<span class="a">commands</span>
  ls                     list windows
  open|close &lt;window&gt;    about, work, journey, projects, papers, reading, links
  whoami                 who I am
  papers [--grep x] [--sort cites] [--all]
  timeline [year]        what I was doing that year, or replay it
  hire [--solo|--team]   work with me
  github                 my recently pushed repos (live)
  theme light|dark|auto
  style modern|2000s|90s  switch the whole look
  reset, clear, history, date, exit
<span class="d">tab completes, up and down arrows walk history</span>`),
    ls: () => print(APPS.map(a => `<span class="c">${Object.keys(NAMES).find(k => NAMES[k] === a.id).padEnd(10)}</span>${$(a.id).hidden ? (running.has(a.id) ? '<span class="a">minimised</span>' : '<span class="d">closed</span>') : '<span class="g">open</span>'}  <span class="d">${a.label}</span>`).join('\n')),
    open: a => { const id = NAMES[(a[0] || '').toLowerCase()]; if (!id) { print(`open: no window called "${esc(a[0] || '')}". Try <span class="c">ls</span>`); return; } show(id); print(`<span class="d">opened ${esc(a[0])}</span>`); },
    close: a => { const id = NAMES[(a[0] || '').toLowerCase()]; if (!id) { print(`close: no window called "${esc(a[0] || '')}"`); return; } if (id === 'w-terminal') { C.exit(); return; } closeWin($(id)); print(`<span class="d">closed ${esc(a[0])}</span>`); },
    whoami: () => print(`${esc(SITE.profile.name)}. ${esc(SITE.profile.tagline)}
${SITE.now.map(x => `<span class="a">${esc(x.role)}</span>${x.since ? ` <span class="d">since ${esc(x.since)}</span>` : ''}\n  ${esc(x.org)}`).join('\n')}`),
    papers: a => {
      const gi = a.indexOf('--grep'); const q = gi >= 0 ? a.slice(gi + 1).filter(x => !x.startsWith('--')).join(' ') : '';
      papers.grep(q); papers.sortCites(a.some(x => x.includes('cites') || x === '--sort')); papers.all(a.includes('--all') || !!q);
      const rows = papers.rows();
      print(rows.length ? rows.slice(0, 6).map(p => `<span class="a">${p[0]}</span> <span class="v">${p[1].padEnd(7)}</span> ${esc(p[2])}${p[3] != null ? ` <span class="d">${p[3]}</span>` : ''}`).join('\n') + (rows.length > 6 ? `\n<span class="d">… ${rows.length - 6} more in the Papers window</span>` : '') : `no papers match "${esc(q)}"`);
      show('w-papers');
    },
    timeline: a => {
      const y = parseInt(a[0], 10); show('w-journey');
      if (!y) { timeline.replay(); print('<span class="d">replaying 2008 → now</span>'); return; }
      if (y < timeline.Y0 || y > timeline.Y1) { print(`timeline: I have records for ${timeline.Y0} to ${timeline.Y1}`); return; }
      timeline.setYear(y);
      const now = ROLES.filter(r => r[1] && timeline.activeIn(r[1], y)).map(r => r[0]);
      print(`<span class="a">${y}</span>: ${now.length ? now.map(esc).join(', ') : 'between things'}`);
    },
    hire: a => {
      show('w-work');
      if (a.includes('--solo')) print(`Just me. <a href="mailto:${esc(L.email)}">${esc(L.email)}</a>`);
      else if (a.includes('--team')) print(`A wider team, through <a href="${esc(TEAM)}" target="_blank" rel="noopener">The Leadershift Studio</a>.`);
      else print(`Two ways in:\n  <span class="g">--solo</span>  just me, <a href="mailto:${esc(L.email)}">${esc(L.email)}</a>\n  <span class="g">--team</span>  a wider team, <a href="${esc(TEAM)}" target="_blank" rel="noopener">The Leadershift Studio</a>`);
    },
    github: () => {
      print('<span class="d">asking github…</span>');
      getRepos().then(r => print(r.slice(0, 6).map(x => `<a href="${esc(x.html_url)}">${esc(x.name)}</a> <span class="d">${esc(x.language || '')} ${new Date(x.pushed_at).toISOString().slice(0, 10)}</span>`).join('\n') || 'no public repos'))
        .catch(() => print(`github is not answering right now. <a href="${esc(L.github)}" target="_blank" rel="noopener">Open GitHub</a>`));
    },
    theme: a => { if (!['light', 'dark', 'auto'].includes(a[0])) { print('usage: theme light|dark|auto'); return; } setTheme(a[0]); print(`theme: ${a[0]}`); },
    style: a => {
      const id = (a[0] || '').toLowerCase();
      if (!id) { print(Styles.list.map(s => `<span class="c">${s.id.padEnd(7)}</span>${s.id === Styles.current ? '<span class="g">current</span>' : `<span class="d">style ${s.id}</span>`}`).join('\n')); return; }
      if (!Styles.list.some(s => s.id === id)) { print('usage: style modern|2000s|90s'); return; }
      if (id === Styles.current) { print(`already in the ${id} look`); return; }
      print(`<span class="d">switching to ${id}…</span>`); setTimeout(() => switchStyle(id), 250);
    },
    reset: () => { resetDesktop(); print('<span class="d">desktop reset</span>'); },
    clear: () => { out.innerHTML = ''; },
    history: () => print(hist.map((h, i) => `${String(i + 1).padStart(3)}  ${esc(h)}`).join('\n') || '<span class="d">empty</span>'),
    date: () => print(new Date().toString()),
    sudo: () => print('Nice try. You could <span class="c">hire --team</span> instead.'),
    exit: () => { print('<span class="d">bye</span>'); setTimeout(() => closeWin($('w-terminal')), 300); },
  };
  const CMDS = Object.keys(C);
  const COMPLETE = { open: Object.keys(NAMES), close: Object.keys(NAMES), papers: ['--grep', '--sort', '--all'], hire: ['--solo', '--team'], theme: ['light', 'dark', 'auto'], style: ['modern', '2000s', '90s'], timeline: ['2008', '2015', '2017', '2021', '2026'] };
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
  $('w-terminal').addEventListener('winopen', () => { if (!mobile()) setTimeout(() => input.focus({ preventScroll: true }), 30); });
  print('Hi. This desktop also answers to commands. Type <span class="c">help</span>.');
  return { run };
})();

/* ---------- keyboard ---------- */
addEventListener('keydown', e => {
  const typing = e.target.closest?.('input, textarea, select');
  if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); palette.isOpen() ? palette.close() : palette.open(); return; }
  if (e.key === '/' && !typing && !palette.isOpen()) { e.preventDefault(); palette.open(); return; }
  if ((e.key === '`' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) || (e.ctrlKey && e.altKey && (e.key === 't' || e.key === 'T'))) { e.preventDefault(); act('term'); return; }
  if (e.key === 'Escape') {
    if (palette.isOpen()) { palette.close(); return; }
    if (menus.isOpen()) { menus.close(); return; }
    if (e.target.id === 'tin' && e.target.value) { e.target.value = ''; return; }
    if (mobile()) { goHome(); return; }
    if (active && !active.hidden) closeWin(active);
  }
});

/* ---------- start ---------- */
(() => {
  setWall(store.get('wall') || 'aurora'); themeIcon(); renderGo();
  Styles.remember();
  // ?open=papers,reading (or windows carried over from another style) wins over the saved layout.
  const asked = Styles.requested();
  let open = null; try { open = JSON.parse(store.get('open')); } catch {}
  if (asked) open = asked.map(WIN_ID);
  if (!Array.isArray(open)) open = DEFAULT_OPEN;
  if (asked) { try { history.replaceState(history.state, '', location.pathname + location.hash); } catch {} }
  if (mobile()) { WINDOWS.forEach(w => { w.hidden = true; }); if (asked && asked.length) openWin($(WIN_ID(asked[asked.length - 1])), { focus: true }); }
  else {
    const fresh = !store.get('open') && !asked;
    open.filter(id => $(id)).forEach(id => openWin($(id), { focus: false })); WINDOWS.forEach(w => { if (!open.includes(w.id)) w.hidden = true; });
    // First visit on a narrow screen: What I do waits in the dock instead of hiding behind About.
    if (!layout() && fresh) minWin($('w-work'));
    const first = asked && asked.length ? $(WIN_ID(asked[asked.length - 1])) : $('w-about'); if (first && !first.hidden) focusWin(first);
  }
  refreshDock();
  let lastMobile = mobile();
  addEventListener('resize', () => {
    const m = mobile();
    if (m !== lastMobile) { lastMobile = m; if (m) { WINDOWS.forEach(w => { w.hidden = true; }); document.body.classList.remove('app-open'); } else { DEFAULT_OPEN.forEach(id => openWin($(id), { focus: false })); } }
    layout();
  });
})();

/* ---------- hello, once per visit ---------- */
(() => {
  const h = $('hello');
  let seen = false; try { seen = !!sessionStorage.getItem(NS + 'hello'); sessionStorage.setItem(NS + 'hello', '1'); } catch {}
  if (reduce || seen) { h.remove(); return; }
  h.hidden = false;
  let done = false;
  const finish = () => { if (done) return; done = true; h.classList.add('out'); setTimeout(() => h.remove(), 650); };
  h.addEventListener('click', finish);
  addEventListener('keydown', finish, { once: true });
  setTimeout(finish, 1500);
})();
