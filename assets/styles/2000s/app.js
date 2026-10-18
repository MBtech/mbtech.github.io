/* The 2000s style. Content comes from /data/site.js; shared helpers from /assets/js/common.js. */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = () => matchMedia('(max-width: 699px)').matches;
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
// Everything this style remembers is namespaced, so the three styles don't trip over each other.
const store = { get(k) { try { return localStorage.getItem('mb.2000s.' + k); } catch { return null; } }, set(k, v) { try { localStorage.setItem('mb.2000s.' + k, v); } catch {} } };

/* ---------- data, all from /data/site.js ---------- */
const SITE = window.SITE, D = window.SiteData;
const NS = 'mb.2000s.';
const NOW = D.NOW;
const LANE = { industry: 'a', research: 'c', education: 'v' };
const ROLES = D.roleRows((lane, r) => r.current ? 'g' : LANE[lane]);
const PAPERS = D.paperRows();
const LINKS = [
  { href: 'mailto:' + SITE.links.email, label: 'Email', note: SITE.links.email, ico: 'globe' },
  { href: SITE.links.github, label: 'GitHub', note: 'Code and experiments', ico: 'globe' },
  { href: SITE.links.scholar, label: 'Google Scholar', note: 'All my papers', ico: 'globe' },
  { href: SITE.links.medium, label: 'Medium', note: 'Things I write', ico: 'globe' },
  { open: 'w-reading', label: 'Reading list', note: 'Books I recommend', ico: 'book' },
];
const linkHtml = (l, attrs = '') => l.open
  ? `<button ${attrs} data-open="${l.open}">${ICO[l.ico]}<span>${l.label}<small>${l.note}</small></span></button>`
  : `<a ${attrs} href="${esc(l.href)}">${ICO[l.ico]}<span>${l.label}<small>${l.note}</small></span></a>`;

/* ---------- icons: glossy 48x48 SVGs that share the gradients above ---------- */
const ICO = {
  case: '<svg viewBox="0 0 48 48"><rect x="17" y="8" width="14" height="8" rx="3" fill="none" stroke="#6B3E14" stroke-width="3"/><rect x="5" y="14" width="38" height="28" rx="4" fill="url(#iCase)" stroke="#5E3510"/><rect x="5" y="24" width="38" height="3" fill="#6B3E14" opacity=".55"/><rect x="21" y="22" width="6" height="7" rx="1" fill="#F2C14E" stroke="#8A5A10"/><path d="M8 17h32" stroke="#fff" stroke-opacity=".35" stroke-width="2"/></svg>',
  journey: '<svg viewBox="0 0 48 48"><rect x="7" y="5" width="34" height="38" rx="3" fill="url(#iDoc)" stroke="#6F86AE"/><rect x="11" y="12" width="20" height="5" rx="2.5" fill="#3FB33A"/><rect x="17" y="20" width="18" height="5" rx="2.5" fill="#F0A847"/><rect x="13" y="28" width="12" height="5" rx="2.5" fill="#3E9FD8"/><rect x="11" y="36" width="16" height="3" rx="1.5" fill="#8A63C9"/><path d="M33 8v32" stroke="#E2602F" stroke-width="2"/></svg>',
  folder: '<svg viewBox="0 0 48 48"><path d="M4 12a3 3 0 0 1 3-3h11l4 4h19a3 3 0 0 1 3 3v22a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" fill="url(#iFolderBack)" stroke="#A8700C"/><rect x="10" y="14" width="26" height="16" fill="#fff" stroke="#C9C5B2"/><path d="M13 19h18M13 23h14" stroke="#9AA6B8"/><path d="M4 20h40v18a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" fill="url(#iFolder)" stroke="#A8700C"/></svg>',
  links: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="18" fill="url(#iGlobe)" stroke="#164FA8"/><ellipse cx="24" cy="24" rx="8" ry="18" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="1.5"/><path d="M6 24h36M9 15h30M9 33h30" stroke="#fff" stroke-opacity=".75" stroke-width="1.5"/><ellipse cx="18" cy="14" rx="8" ry="4" fill="#fff" opacity=".35"/></svg>',
  bulb: '<svg viewBox="0 0 48 48"><path d="M24 4a14 14 0 0 0-8 25.5V34h16v-4.5A14 14 0 0 0 24 4z" fill="url(#iBulb)" stroke="#A8700C"/><rect x="16" y="34" width="16" height="4" fill="#C9C5B2" stroke="#8F8B76"/><rect x="17" y="38" width="14" height="4" fill="#B5B19E" stroke="#8F8B76"/><rect x="20" y="42" width="8" height="3" rx="1.5" fill="#8F8B76"/><path d="M20 26l4-8 4 8" fill="none" stroke="#A8700C" stroke-width="2" stroke-linejoin="round"/><ellipse cx="19" cy="12" rx="5" ry="3" fill="#fff" opacity=".6"/></svg>',
  globe: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="18" fill="url(#iGlobe)" stroke="#164FA8"/><ellipse cx="24" cy="24" rx="8" ry="18" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="1.5"/><path d="M6 24h36M9 15h30M9 33h30" stroke="#fff" stroke-opacity=".75" stroke-width="1.5"/></svg>',
  term: '<svg viewBox="0 0 48 48"><rect x="4" y="8" width="40" height="32" rx="4" fill="url(#iTerm)" stroke="#0F1114"/><rect x="4" y="8" width="40" height="6" rx="3" fill="#2A6FE6"/><path d="M11 22l6 4-6 4" fill="none" stroke="#7FE0A6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 31h10" stroke="#7FE0A6" stroke-width="2.5" stroke-linecap="round"/></svg>',
  book: '<svg viewBox="0 0 48 48"><rect x="10" y="5" width="28" height="38" rx="3" fill="url(#iBook)" stroke="#7A1E15"/><rect x="34" y="8" width="5" height="34" fill="#F7F3E6" stroke="#C9C5B2"/><rect x="15" y="12" width="15" height="4" rx="1" fill="#fff" opacity=".85"/><rect x="15" y="19" width="10" height="2" fill="#fff" opacity=".6"/></svg>',
  check: '<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" fill="url(#iGo)" stroke="#22751F"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  info: '<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="#2A6FE6"/><rect x="7" y="7" width="2" height="5" fill="#fff"/><rect x="7" y="4" width="2" height="2" fill="#fff"/></svg>',
  monitor: '<svg viewBox="0 0 48 48"><rect x="4" y="6" width="40" height="28" rx="3" fill="#F2F2EC" stroke="#6F86AE"/><rect x="8" y="10" width="32" height="20" fill="url(#iGlobe)"/><path d="M8 24c8-6 16-6 32 0v6H8z" fill="#4FA733"/><rect x="18" y="34" width="12" height="5" fill="#C9C5B2"/><rect x="12" y="39" width="24" height="3" rx="1.5" fill="#8F8B76"/></svg>',
  warn: '<svg viewBox="0 0 16 16"><path d="M8 1l7 13H1z" fill="#F2C14E" stroke="#8A5A10"/><rect x="7" y="5" width="2" height="5" fill="#1B1B1B"/><rect x="7" y="11" width="2" height="2" fill="#1B1B1B"/></svg>',
};
const avatarImg = '<img src="/assets/avatar/color.png" alt="">';
const glyph = name => name === 'avatar' ? avatarImg : (ICO[name] || '');
document.querySelectorAll('[data-ico]').forEach(el => { el.innerHTML = ICO[el.dataset.ico]; });

/* ---------- window manager ---------- */
const WINDOWS = [...document.querySelectorAll('.win')];
let topZ = 10, active = null;
const SVG_MIN = '<svg viewBox="0 0 10 10" aria-hidden="true"><rect x="1" y="7" width="6" height="2" fill="currentColor"/></svg>';
const SVG_MAX = '<svg viewBox="0 0 10 10" aria-hidden="true"><rect x="0.75" y="0.75" width="8.5" height="8.5" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="0.5" y="0.5" width="9" height="2.5" fill="currentColor"/></svg>';
const SVG_X = '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" stroke="currentColor" stroke-width="2"/></svg>';

function taskBtn(w) { return document.querySelector(`#tasks [data-for="${w.id}"]`); }
function focusWin(w) {
  if (!w || w.hidden) return;
  w.style.zIndex = ++topZ;
  WINDOWS.forEach(x => x.classList.toggle('active', x === w));
  document.querySelectorAll('#tasks .task').forEach(b => b.setAttribute('aria-pressed', b.dataset.for === w.id && !w.classList.contains('min')));
  active = w;
}
function animate(w, cls, done) {
  if (reduce || mobile()) { done && done(); return; }
  w.classList.remove('opening', 'closing'); void w.offsetWidth; w.classList.add(cls);
  let fired = false;
  const end = () => { if (fired) return; fired = true; w.classList.remove(cls); done && done(); };
  w.addEventListener('animationend', end, { once: true });
  setTimeout(end, 260); // in case animations are off
}
function saveOpen() { store.set('open', JSON.stringify([...document.querySelectorAll('#tasks .task')].map(b => b.dataset.for).filter(id => id !== 'w-style'))); }
function openWin(w) {
  if (!w) return;
  const wasHidden = w.hidden;
  w.hidden = false; w.classList.remove('min');
  if (wasHidden) animate(w, 'opening');
  if (!taskBtn(w)) {
    const b = document.createElement('button');
    b.className = 'task'; b.dataset.for = w.id; b.innerHTML = `${glyph(w.dataset.icon)}<span>${esc(w.dataset.title)}</span>`;
    b.addEventListener('click', () => {
      if (mobile()) { w.hidden = false; w.classList.remove('min'); w.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); focusWin(w); return; }
      if (active === w && !w.hidden) { minWin(w); } else { w.hidden = false; w.classList.remove('min'); focusWin(w); }
    });
    $('tasks').appendChild(b);
  }
  focusWin(w);
  w.dispatchEvent(new Event('winopen'));
  if (mobile()) w.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
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
  const ctl = document.createElement('div'); ctl.className = 'ctl';
  ctl.innerHTML = `<button class="tb" aria-label="Minimise ${esc(w.dataset.title)}">${SVG_MIN}</button><button class="tb maxb" aria-label="Maximise ${esc(w.dataset.title)}">${SVG_MAX}</button><button class="tb x" aria-label="Close ${esc(w.dataset.title)}">${SVG_X}</button>`;
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
function savePos(w) { store.set('pos:' + w.id, JSON.stringify([w.offsetLeft, w.offsetTop])); }
addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (!$('ctx').hidden) { hideCtx(); return; }
  if (!$('menu').hidden) { toggleMenu(false); $('menuBtn').focus(); return; }
  if (!$('balloon').hidden) { hideBalloon(); return; }
  // In the terminal, Esc clears the line first; a second Esc closes the window.
  if (e.target.id === 'tin' && e.target.value) { e.target.value = ''; return; }
  if (active) closeWin(active);
});
// Links inside windows that open other windows.
document.addEventListener('click', e => { const a = e.target.closest('a[data-open], .linklist button[data-open]'); if (a) { e.preventDefault(); openWin($(a.dataset.open)); } });

// Initial layout. Wide screens: About me and My journey on the left, What I do on the right. Otherwise cascade.
function layout() {
  const W = innerWidth, H = innerHeight - 34, R = 16;
  const rows = Math.max(1, Math.floor((H - 16) / 86)), cols = Math.ceil(document.querySelectorAll('.icon').length / rows);
  const L = 10 + cols * 94 + 8;
  const avail = W - L - R;
  const saved = id => { try { return JSON.parse(store.get('pos:' + id)); } catch { return null; } };
  const put = (id, x, y, w) => {
    const el = $(id), sp = saved(id);
    el.style.width = Math.min(w, avail) + 'px';
    if (sp) { el.style.left = Math.min(sp[0], W - 120) + 'px'; el.style.top = Math.max(0, Math.min(sp[1], H - 60)) + 'px'; }
    else {
      el.style.left = Math.max(L, Math.min(x, W - R - Math.min(w, avail))) + 'px';
      el.style.top = Math.max(8, Math.min(y, H - 120)) + 'px';
    }
    el.style.maxHeight = (H - el.offsetTop - 8) + 'px';
  };
  const side = avail >= 1120;
  if (side) {
    const lw = Math.min(680, avail - 560 - 16);
    put('w-about', L, 14, lw);
    put('w-journey', L, 14 + $('w-about').offsetHeight + 14, lw);
    put('w-work', L + lw + 16, 14, Math.min(600, avail - lw - 16));
  } else {
    const aw = Math.min(540, avail), ww = Math.min(560, avail);
    put('w-about', L, 14, aw);
    put('w-work', L + avail - ww, 44, ww);
    put('w-journey', L + 30, Math.min(H * .45, 360), Math.min(820, avail - 30));
  }
  put('w-projects', L + 170, 50, 640);
  put('w-papers', L + 200, 70, 760);
  put('w-reading', L + 230, 90, 640);
  put('w-links', L + 260, 110, 380);
  put('w-style', Math.max(L, L + (avail - 620) / 2), 60, 620);
  put('w-terminal', W - R - 620, H - 380, 620);
  $('w-terminal').style.height = Math.min(360, H - 40) + 'px';
}

/* ---------- icons, menu, taskbar ---------- */
const PROGRAMS = [
  { id: 'w-about', label: 'About me', icon: 'avatar', note: 'Who I am and what I’m doing now' },
  { id: 'w-work', label: 'What I do', icon: 'case', note: 'Fractional AI leadership' },
  { id: 'w-journey', label: 'My journey', icon: 'journey', note: '2008 to now' },
  { id: 'w-projects', label: 'Projects', icon: 'bulb', note: 'PaperBoy and tangents' },
  { id: 'w-papers', label: 'Papers', icon: 'folder', note: `${PAPERS.length} papers` },
  { id: 'w-reading', label: 'Reading list', icon: 'book', note: 'Books I recommend' },
  { id: 'w-links', label: 'Links', icon: 'links', note: 'Email, GitHub, Scholar' },
  { id: 'w-terminal', label: 'Terminal', icon: 'term', note: 'For people who like typing' },
];
let iconOrder = store.get('icons') || 'type';
function renderIcons() {
  const items = PROGRAMS.map(p => ({ label: p.label, html: `<button class="icon" data-open="${p.id}" aria-selected="false"><span class="glyph">${glyph(p.icon)}</span><span>${p.label}</span></button>` }));
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
$('linklist').innerHTML = LINKS.map(l => `<li>${linkHtml(l)}</li>`).join('');
// Menu: the main three in bold up top, extras under a line; links on the right.
$('menuLeft').innerHTML = PROGRAMS.map((p, i) => (i === 3 ? '<li><hr></li>' : '') +
  `<li><button role="menuitem" class="big" data-open="${p.id}">${glyph(p.icon)}<span><b>${p.label}</b>${i < 3 ? `<small>${p.note}</small>` : ''}</span></button></li>`).join('');
$('menuRight').innerHTML = LINKS.map(l => l.open
    ? `<li><button role="menuitem" data-open="${l.open}">${ICO[l.ico]}${l.label}</button></li>`
    : `<li><a role="menuitem" href="${esc(l.href)}">${ICO[l.ico]}${l.label}</a></li>`).join('') +
  `<li><hr></li><li><button role="menuitem" data-open="w-style">${ICO.monitor}<span><b>Change style</b></span></button></li>` +
  '<li><button role="menuitem" data-act="wall-next">Change wallpaper</button></li>';
function toggleMenu(open) {
  const m = $('menu'); m.hidden = !open; $('menuBtn').setAttribute('aria-expanded', open);
  if (open) { hideBalloon(); m.querySelector('button, a').focus(); }
}
$('menuBtn').addEventListener('click', e => { e.stopPropagation(); toggleMenu($('menu').hidden); });
$('menu').addEventListener('click', e => {
  const b = e.target.closest('[data-open]'); if (b) { openWin($(b.dataset.open)); toggleMenu(false); if (b.dataset.open === 'w-terminal') $('tin').focus(); return; }
  const a = e.target.closest('[data-act]'); if (a) { toggleMenu(false); act(a.dataset.act); }
});
$('menu').addEventListener('keydown', e => {
  const items = [...$('menu').querySelectorAll('[role=menuitem]')], i = items.indexOf(document.activeElement);
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus(); }
});
document.addEventListener('click', e => { if (!$('menu').hidden && !e.target.closest('#menu') && !e.target.closest('#menuBtn')) toggleMenu(false); });
(() => { const tick = () => { const d = new Date(); $('clock').textContent = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); $('clock').title = d.toDateString(); }; tick(); setInterval(tick, 10000); })();

/* ---------- balloon tips ---------- */
let balloonTimer = null;
function balloon(title, text, kind = 'info', ms = 9000) {
  const b = $('balloon');
  $('bTitle').innerHTML = ICO[kind] + esc(title); $('bText').textContent = text;
  b.hidden = false; b.classList.remove('show'); void b.offsetWidth; b.classList.add('show');
  clearTimeout(balloonTimer); balloonTimer = setTimeout(hideBalloon, ms);
}
function hideBalloon() { $('balloon').hidden = true; clearTimeout(balloonTimer); }
$('bClose').addEventListener('click', hideBalloon);
const welcomeTip = () => balloon('Hi, I’m Bilal', mobile()
  ? 'Tap an icon or a taskbar button to jump to a window. Change style in the bilal menu switches to the 90s or a modern look.'
  : 'Drag windows by their blue title bars. Everything else lives in the bilal menu. Prefer the 90s or a modern look? Pick Change style there, or right-click the desktop.');
$('tipBtn').addEventListener('click', welcomeTip);

/* ---------- About: avatar palettes ---------- */
(() => {
  const pals = ['color', 'amber', 'green', 'ink']; let k = 0;
  $('ava').addEventListener('click', () => { k = (k + 1) % pals.length; $('ava').src = `/assets/avatar/${pals[k]}.png`; });
})();

/* ---------- My journey: timeline ---------- */
const timeline = (() => {
  const Y0 = 2008, Y1 = Math.floor(NOW), SPAN = Y1 + 1 - Y0;
  const pct = y => ((y - Y0) / SPAN * 100) + '%';
  const COL = { g: 'linear-gradient(180deg,#7FD36A,#2F9A2C)', a: 'linear-gradient(180deg,#F7C46A,#D98A12)', c: 'linear-gradient(180deg,#7FC1F0,#2A7FD0)', v: 'linear-gradient(180deg,#B79AEC,#7A52C4)' };
  const tl = $('tl'), range = $('year'), out = $('yearOut'), then = $('then'), detail = $('detail'), win = $('w-journey');
  range.max = Y1; range.value = Y1;
  let year = Y1, playing = null, touched = false, sel = -1;
  const activeIn = (spans, y) => spans.some(([s, e]) => Math.floor(s) <= y && y <= Math.floor(e));

  function draw() {
    let html = '', i = 0;
    for (const [label, spans, when, info, c, now] of ROLES) {
      if (!spans) { html += `<div class="tgroup">${label}</div>`; continue; }
      const on = activeIn(spans, year), idx = i++;
      const bars = spans.filter(([s]) => s < year + 1).map(([s, e]) => {
        const end = Math.min(e, year + 1);
        return `<span class="bar${now && year >= Y1 ? ' live' : ''}" style="left:${pct(s)};width:calc(${pct(end)} - ${pct(s)});--g:${COL[c]}"></span>`;
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
    detail.innerHTML = r ? `<b>${esc(r[6].title)}, ${esc(r[6].org)}</b> <span class="muted">${esc(r[2])}</span><br>${r[3]}` : '';
  }
  tl.addEventListener('click', e => { const r = e.target.closest('.trow'); if (!r || e.target.closest('a')) return; sel = +r.dataset.i; showDetail(sel); draw(); tl.querySelector(`.trow[data-i="${sel}"]`).focus(); });
  tl.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.trow')) { e.preventDefault(); e.target.click(); } });
  range.addEventListener('input', () => setYear(+range.value, true));
  $('replay').addEventListener('click', () => { touched = true; replay(); });
  draw();
  // Play the journey once, the first time the window is on screen.
  new IntersectionObserver(([e], o) => { if (e.isIntersecting && !win.hidden) { o.disconnect(); setTimeout(() => { if (!touched) replay(); }, 900); } }, { threshold: .3 }).observe(tl);
  return { setYear: y => setYear(y, true), replay() { touched = true; replay(); }, activeIn };
})();

/* ---------- Papers ---------- */
const papers = (() => {
  let q = '', all = false, key = 'year', dir = -1;
  const body = $('files');
  const get = { year: p => p[0], venue: p => p[1].toLowerCase(), title: p => p[2].toLowerCase(), cites: p => p[3] ?? -1 };
  function rows() {
    const pat = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), hit = q ? new RegExp(pat, 'i') : null;
    return PAPERS.filter(p => (all || !p[4] || hit) && (!hit || hit.test(`${p[2]} ${p[1]} ${p[6].authors} ${p[6].venueFull}`)))
      .sort((a, b) => { const x = get[key](a), y = get[key](b); return (x < y ? -1 : x > y ? 1 : 0) * dir || b[0] - a[0]; });
  }
  function draw() {
    const pat = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), re = q ? new RegExp(pat, 'ig') : null;
    const list = rows();
    const hl = s => re ? esc(s).replace(re, m => `<mark>${m}</mark>`) : esc(s);
    body.innerHTML = list.map(([y, v, t, c, , url, p]) => `<tr><td class="n">${y}</td><td class="venue">${hl(v)}</td><td><a href="${esc(url)}" target="_blank" rel="noopener">${hl(t)}</a><small class="meta">${hl(p.authors)}. ${hl(p.venueFull)}</small></td><td class="n r">${c ?? '–'}</td></tr>`).join('') || '<tr><td colspan="4" class="muted">No papers match.</td></tr>';
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
const WALLS = ['hills', 'sky', 'plain'];
function setWall(w) {
  if (!WALLS.includes(w)) return false;
  if (w === 'hills') delete document.body.dataset.wall; else document.body.dataset.wall = w;
  store.set('wall', w);
  return true;
}
setWall(store.get('wall') || 'hills');

/* ---------- desktop actions ---------- */
const DEFAULT_OPEN = ['w-about', 'w-work', 'w-journey'];
function resetDesktop() {
  try { Object.keys(localStorage).filter(k => k.startsWith(NS)).forEach(k => localStorage.removeItem(k)); } catch {}
  WINDOWS.forEach(w => { w.classList.remove('max', 'min'); w.hidden = true; const b = taskBtn(w); if (b) b.remove(); });
  iconOrder = 'type'; renderIcons(); setWall('hills');
  DEFAULT_OPEN.forEach(id => openWin($(id)));
  if (!mobile()) layout();
  focusWin($('w-about'));
  saveOpen();
}
function act(a) {
  if (a === 'arrange-name' || a === 'arrange-type') { iconOrder = a.slice(8); store.set('icons', iconOrder); renderIcons(); if (!mobile()) layout(); }
  else if (a === 'term') { openWin($('w-terminal')); $('tin').focus(); }
  else if (a === 'reset') resetDesktop();
  else if (a === 'restart') showSplash(true);
  else if (a === 'wall-next') setWall(WALLS[(WALLS.indexOf(store.get('wall') || 'hills') + 1) % WALLS.length]);
}

/* ---------- right-click menu on the desk ---------- */
const ctxMenu = $('ctx');
function showCtx(x, y) {
  const cur = store.get('wall') || 'hills';
  ctxMenu.querySelectorAll('[data-wall]').forEach(b => { const on = b.dataset.wall === cur; b.setAttribute('aria-checked', on); b.querySelector('.chk').textContent = on ? '•' : ''; });
  ctxMenu.querySelectorAll('[data-style]').forEach(b => { const on = b.dataset.style === Styles.current; b.setAttribute('aria-checked', on); b.querySelector('.chk').textContent = on ? '•' : ''; });
  ctxMenu.querySelectorAll('[data-act^="arrange"]').forEach(b => { b.querySelector('.chk').textContent = b.dataset.act.endsWith(iconOrder) ? '•' : ''; });
  ctxMenu.hidden = false;
  const r = ctxMenu.getBoundingClientRect();
  ctxMenu.style.left = Math.min(x, innerWidth - r.width - 4) + 'px';
  ctxMenu.style.top = Math.min(y, innerHeight - r.height - 38) + 'px';
  ctxMenu.querySelector('button').focus();
}
function hideCtx() { ctxMenu.hidden = true; }
$('desk').addEventListener('contextmenu', e => {
  if (mobile() || e.target.closest('.win')) return;
  e.preventDefault(); toggleMenu(false); showCtx(e.clientX, e.clientY);
});
addEventListener('keydown', e => {
  if ((e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) && !e.target.closest('.win, input')) { e.preventDefault(); showCtx(120, 120); }
});
ctxMenu.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.wall) setWall(b.dataset.wall); else if (b.dataset.style) switchStyle(b.dataset.style); else act(b.dataset.act);
  hideCtx();
});
ctxMenu.addEventListener('keydown', e => {
  const items = [...ctxMenu.querySelectorAll('button')], i = items.indexOf(document.activeElement);
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus(); }
});
document.addEventListener('pointerdown', e => { if (!ctxMenu.hidden && !e.target.closest('#ctx')) hideCtx(); });

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
const term = (() => {
  const out = $('tout'), input = $('tin'), form = $('tform');
  const hist = []; let hi = 0;
  const NAMES = { about: 'w-about', me: 'w-about', what: 'w-work', work: 'w-work', hire: 'w-work', journey: 'w-journey', timeline: 'w-journey', projects: 'w-projects', tools: 'w-projects', papers: 'w-papers', reading: 'w-reading', books: 'w-reading', links: 'w-links', terminal: 'w-terminal', style: 'w-style' };
  const LISTED = { about: 'w-about', work: 'w-work', journey: 'w-journey', projects: 'w-projects', papers: 'w-papers', reading: 'w-reading', links: 'w-links', terminal: 'w-terminal' };
  const URL = { email: 'mailto:' + SITE.links.email, team: SITE.links.leadershift };
  const GH_USER = SITE.links.github.replace(/\/+$/, '').split('/').pop();
  const print = (html, cls) => { const d = document.createElement('div'); if (cls) d.className = cls; d.innerHTML = html; out.appendChild(d); while (out.children.length > 200) out.firstChild.remove(); out.scrollTop = out.scrollHeight; };
  // Open or raise a window, and keep the terminal on top so its output stays readable.
  const show = id => {
    openWin($(id));
    if (!mobile() && id !== 'w-terminal') { $('w-terminal').style.zIndex = ++topZ; input.focus({ preventScroll: true }); }
  };
  let repos = null;
  const getRepos = () => {
    if (repos) return Promise.resolve(repos);
    try { const c = JSON.parse(sessionStorage.getItem(NS + 'gh')); if (c && Date.now() - c.t < 600000) return Promise.resolve(repos = c.d); } catch {}
    return fetch(`https://api.github.com/users/${GH_USER}/repos?sort=pushed&per_page=8`)
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => { repos = d.filter(r => !r.fork && r.name !== 'mbtech.github.io'); try { sessionStorage.setItem(NS + 'gh', JSON.stringify({ t: Date.now(), d: repos })); } catch {} return repos; });
  };

  const C = {
    help: () => print(
`<span class="a">commands</span>
  ls                     list windows
  open|close &lt;window&gt;    about, work, journey, projects, papers, reading, links, terminal
  whoami                 who I am
  papers [--grep x] [--sort cites] [--all]
  timeline [year]        what I was doing that year, or replay it all
  hire [--solo|--team]   work with me
  github                 my recently pushed repos (live)
  style modern|2000s|90s switch to another look (opens the same windows)
  wallpaper [name]       hills, sky, plain
  reset                  put the desktop back the way it was
  clear, history, date, exit
<span class="d">tab completes, up and down arrows walk history</span>`),
    ls: () => print(Object.entries(LISTED)
      .map(([nm, id]) => `<span class="c">${nm.padEnd(10)}</span>${$(id).hidden ? (taskBtn($(id)) ? '<span class="a">minimised</span>' : '<span class="d">closed</span>') : '<span class="g">open</span>'}`).join('\n')),
    open: a => { const id = NAMES[(a[0] || '').toLowerCase()]; if (!id) { print(`open: no window called "${esc(a[0] || '')}". Try <span class="c">ls</span>`); return; } show(id); print(`<span class="d">opened ${esc(a[0])}</span>`); },
    close: a => {
      const id = NAMES[(a[0] || '').toLowerCase()]; if (!id) { print(`close: no window called "${esc(a[0] || '')}"`); return; }
      if (id === 'w-terminal') { C.exit(); return; }
      closeWin($(id)); print(`<span class="d">closed ${esc(a[0])}</span>`);
    },
    whoami: () => print(`${esc(SITE.profile.name)}. ${esc(SITE.profile.tagline)}\n` +
      SITE.now.map(n => n.since ? `${esc(n.role)} at <span class="a">${esc(n.org)}</span>, since ${esc(n.since)}` : `${esc(n.role)}: ${esc(n.org)}`).join('\n')),
    papers: a => {
      const gi = a.indexOf('--grep'); const q = gi >= 0 ? a.slice(gi + 1).filter(x => !x.startsWith('--') && x !== 'cites').join(' ') : '';
      const byCites = a.includes('--sort') || a.includes('--sort=cites') || a.includes('cites');
      papers.grep(q); papers.sortCites(byCites); papers.all(a.includes('--all') || !!q);
      const rows = papers.rows(); // same order as the Papers window
      print(rows.length ? rows.slice(0, 6).map(p => `<span class="a">${p[0]}</span> <span class="v">${p[1].padEnd(7)}</span> ${esc(p[2])}${byCites ? ` <span class="d">(${p[3] ?? '–'})</span>` : ''}`).join('\n') + (rows.length > 6 ? `\n<span class="d">… ${rows.length - 6} more in the Papers window</span>` : '') : `no papers match "${esc(q)}"`);
      show('w-papers');
    },
    timeline: a => {
      const y = parseInt(a[0], 10);
      show('w-journey');
      if (!y) { timeline.replay(); print('<span class="d">replaying 2008 → now</span>'); return; }
      if (y < 2008 || y > Math.floor(NOW)) { print(`timeline: I have records for 2008 to ${Math.floor(NOW)}`); return; }
      timeline.setYear(y);
      const now = ROLES.filter(r => r[1] && timeline.activeIn(r[1], y)).map(r => r[0]);
      print(`<span class="a">${y}</span>: ${now.length ? now.map(esc).join(', ') : 'between things'}`);
    },
    hire: a => {
      show('w-work');
      if (a.includes('--solo')) print(`Just me. <a href="${URL.email}">Email me</a> at ${esc(SITE.links.email)}.`);
      else if (a.includes('--team')) print(`A wider team, through <a href="${URL.team}">The Leadershift Studio</a>.`);
      else print(`Two ways in:\n  <span class="g">--solo</span>  just me, <a href="${URL.email}">email</a>\n  <span class="g">--team</span>  a wider team, <a href="${URL.team}">The Leadershift Studio</a>`);
    },
    github: () => {
      print('<span class="d">asking github…</span>');
      getRepos().then(r => print(r.slice(0, 6).map(x => `<a href="${esc(x.html_url)}">${esc(x.name)}</a> <span class="d">${esc(x.language || '')} ${new Date(x.pushed_at).toISOString().slice(0, 10)}</span>`).join('\n') || 'no public repos'))
        .catch(() => print(`github is not answering right now. <a href="${esc(SITE.links.github)}">Open GitHub</a>`));
    },
    style: a => {
      const id = (a[0] || '').toLowerCase();
      if (!id) { print(`style: ${Styles.current}. Options: ${Styles.list.map(s => s.id).join(', ')}`); return; }
      if (id === Styles.current) { print(`already in the ${id} style`); return; }
      if (!Styles.list.some(s => s.id === id)) { print(`usage: style ${Styles.list.map(s => s.id).join('|')}`); return; }
      print(`<span class="d">switching to ${esc(id)}…</span>`);
      setTimeout(() => switchStyle(id), 350);
    },
    wallpaper: a => { if (!a[0]) { print(`wallpaper: ${store.get('wall') || 'hills'}. Options: ${WALLS.join(', ')}`); return; } if (setWall(a[0])) print(`wallpaper: ${esc(a[0])}`); else print(`usage: wallpaper ${WALLS.join('|')}`); },
    reset: () => { resetDesktop(); print('<span class="d">desktop reset</span>'); },
    clear: () => { out.innerHTML = ''; },
    history: () => print(hist.map((h, i) => `${String(i + 1).padStart(3)}  ${esc(h)}`).join('\n') || '<span class="d">empty</span>'),
    date: () => print(new Date().toString()),
    ver: () => print('bilal desktop, 2000s edition'),
    sudo: () => print('Nice try. You could <span class="c">hire --team</span> instead.'),
    exit: () => { print('<span class="d">bye</span>'); setTimeout(() => closeWin($('w-terminal')), 300); },
  };
  const CMDS = Object.keys(C);
  const COMPLETE = { open: Object.keys(LISTED), close: Object.keys(LISTED), papers: ['--grep', '--sort', '--all'], hire: ['--solo', '--team'], wallpaper: WALLS, timeline: ['2008', '2015', '2017', '2021', String(Math.floor(NOW))], style: Styles.list.map(s => s.id) };

  function run(line) {
    line = line.trim(); if (!line) return;
    print(esc(line), 'cmd'); hist.push(line); hi = hist.length;
    const [name, ...args] = line.split(/\s+/);
    const fn = C[name.toLowerCase()];
    if (fn) fn(args); else print(`'${esc(name)}' is not a command here. Try <span class="c">help</span>.`);
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
  print('Welcome. Type <span class="c">help</span> to see what this desktop can do.');
  return { run };
})();
// ` or Ctrl+Alt+T opens the terminal from anywhere (except while typing).
addEventListener('keydown', e => {
  const typing = e.target.closest('input, textarea');
  if ((e.key === '`' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) || (e.ctrlKey && e.altKey && (e.key === 't' || e.key === 'T'))) { e.preventDefault(); act('term'); }
});

/* ---------- filled from /data/site.js ---------- */
(() => {
  const P = SITE.profile, S = SITE.services, L = SITE.links;
  $('name').textContent = P.name;
  $('menuName').textContent = P.name;
  $('tagline').textContent = P.tagline;
  $('bio').innerHTML = P.bio.map((t, i) => `<p${i ? ' class="muted"' : ''}>${esc(t)}</p>`).join('');
  $('nowList').innerHTML = SITE.now.map(n => n.since
    ? `<li><b><span class="dotlive" aria-hidden="true"></span>${n.orgUrl ? `<a href="${esc(n.orgUrl)}">${esc(n.org)}</a>` : esc(n.org)}</b><span>${esc(n.role)}${n.note ? `, ${esc(n.note)}` : ''}, since ${esc(n.since)}</span></li>`
    : `<li><b><span class="dotlive" aria-hidden="true"></span>${esc(n.role)}</b><span>${esc(n.org)}. <a href="#" data-open="w-work">Work with me</a></span></li>`).join('');
  $('elsewhere').innerHTML = [['Email', 'mailto:' + L.email], ['GitHub', L.github], ['Google Scholar', L.scholar], ['Medium', L.medium]]
    .map(([t, u]) => `<li><a href="${esc(u)}">${t}</a></li>`).join('') + '<li><a href="#" data-open="w-reading">Reading list</a></li>';
  $('aboutRunning').textContent = `${SITE.now.length} things running`;
  $('aboutPapers').textContent = `${SITE.papers.length} papers, ${SITE.scholar.citations} citations`;
  $('servicesIntro').textContent = S.intro;
  $('services').innerHTML = S.items.map(s => `<li>${ICO.check}<span><b>${esc(s.title)}.</b> ${esc(s.text)}</span></li>`).join('');
  $('soloTitle').textContent = S.solo.title; $('soloText').textContent = S.solo.text; $('soloLink').textContent = S.solo.cta; $('soloLink').href = 'mailto:' + L.email;
  $('teamTitle').textContent = S.team.title; $('teamText').textContent = S.team.text; $('teamLink').textContent = S.team.cta; $('teamLink').href = L.leadershift;
  $('scholarNote').innerHTML = `<a href="${esc(L.scholar)}">Google Scholar</a>: ${SITE.scholar.citations} citations, h-index ${SITE.scholar.hIndex}`;
  ReadingList.render($('rl'));
  Projects.render($('pj'));
})();

/* ---------- styles: switch between modern, 2000s and 90s ---------- */
// Open windows travel with you, using the shared app ids (w-papers -> papers).
function openApps() { return [...document.querySelectorAll('#tasks .task')].map(b => b.dataset.for.slice(2)).filter(a => Styles.apps.includes(a)); }
function switchStyle(id) { if (id === Styles.current) { closeWin($('w-style')); return; } Styles.go(id, openApps()); }
(() => {
  const form = $('styleForm');
  const pick = () => { const r = form.querySelector(`input[value="${Styles.current}"]`); if (r) r.checked = true; };
  pick();
  $('w-style').addEventListener('winopen', () => { pick(); setTimeout(() => form.querySelector('input:checked').focus({ preventScroll: true }), 40); });
  form.addEventListener('submit', e => { e.preventDefault(); switchStyle(form.querySelector('input:checked').value); });
  $('styleCancel').addEventListener('click', () => closeWin($('w-style')));
  // Double-clicking a preview applies it straight away.
  form.querySelectorAll('.scard').forEach(c => c.addEventListener('dblclick', () => switchStyle(c.querySelector('input').value)));
  $('styleBtn').addEventListener('click', () => openWin($('w-style')));
})();

/* ---------- start ---------- */
(() => {
  let open = null;
  const asked = Styles.requested();
  if (asked) open = asked.map(a => 'w-' + a);
  else {
    try { open = JSON.parse(store.get('open')); } catch {}
    if (!Array.isArray(open)) open = DEFAULT_OPEN;
    if (mobile()) open = [...new Set([...DEFAULT_OPEN, 'w-projects', 'w-papers', 'w-reading', 'w-links', ...open])].filter(id => id !== 'w-terminal' && id !== 'w-style');
  }
  open.filter(id => $(id)).forEach(id => openWin($(id)));
  if (!mobile()) layout();
  if (mobile() && !asked) scrollTo(0, 0); else if (!asked && !$('w-about').hidden) focusWin($('w-about'));
  Styles.remember();
  addEventListener('resize', () => { if (!mobile()) layout(); });
})();

/* ---------- welcome splash, once per visit ---------- */
function showSplash(force) {
  const s = $('splash');
  if (!s) return;
  let seen = false; try { seen = !!sessionStorage.getItem(NS + 'splash'); sessionStorage.setItem(NS + 'splash', '1'); } catch {}
  if (reduce || (seen && !force)) { s.hidden = true; setTimeout(welcomeTip, 900); return; }
  s.hidden = false; s.classList.remove('done');
  let done = false;
  const finish = () => {
    if (done) return; done = true;
    s.classList.add('done'); removeEventListener('keydown', finish);
    setTimeout(() => { s.hidden = true; s.classList.remove('done'); }, 380);
    setTimeout(welcomeTip, 700);
  };
  s.onclick = finish;
  addEventListener('keydown', finish, { once: true });
  setTimeout(finish, 1700);
}
showSplash(false);
