import { parseSecret, applyForce } from './force.js';
import { DECOYS } from './lists.js';
import { IOS_EASE } from './motion.js';
import * as store from './store.js';
import { createSetup } from './setup.js';
import * as purchases from './purchases.js';

const LONG_PRESS_MS = 700;

const $ = (id) => document.getElementById(id);

let settings = store.load();
let openList = null; // the trick list currently in the note screen (null for a decoy note)
let shownWords = []; // what that list currently displays (changes when a force is applied)

// ---------- Dates (mimic Notes' labels) ----------

const timeFmt = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' });
const weekdayFmt = new Intl.DateTimeFormat(undefined, { weekday: 'long' });
const shortFmt = new Intl.DateTimeFormat(undefined, { year: '2-digit', month: 'numeric', day: 'numeric' });
const longFmt = new Intl.DateTimeFormat(undefined, { dateStyle: 'long' });
const bootTime = Date.now();

function daysAgoDate(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(9 + ((days * 7) % 11), (days * 13) % 60, 0, 0);
  return d;
}

function calendarDaysAgo(date) {
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  return Math.round((startOfDay(new Date()) - startOfDay(date)) / 86400000);
}

function listLabel(date, daysAgo) {
  if (daysAgo === 0) return timeFmt.format(date);
  if (daysAgo === 1) return 'Yesterday';
  if (daysAgo < 7) return weekdayFmt.format(date);
  return shortFmt.format(date);
}

function headerLabel(date) {
  return `${longFmt.format(date)} at ${timeFmt.format(date)}`;
}

// ---------- Rendering ----------

function listNote(list) {
  const date = new Date(bootTime - list.ageMinutes * 60000);
  return { list, title: list.title, date, daysAgo: calendarDaysAgo(date), preview: list.items.slice(0, 4).join(' ') };
}

function allNotes() {
  const lists = settings.lists.filter((list) => list.visible).map(listNote);
  const decoys = DECOYS.map((n) => ({ ...n, date: daysAgoDate(n.daysAgo), preview: n.lines.filter(Boolean).join(' ') }));
  return [...lists, ...decoys].sort((a, b) => b.date - a.date);
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function renderList() {
  const notes = allNotes();
  const buckets = [
    ['Today', notes.filter((n) => n.daysAgo === 0)],
    ['Previous 7 Days', notes.filter((n) => n.daysAgo > 0 && n.daysAgo <= 7)],
    ['Previous 30 Days', notes.filter((n) => n.daysAgo > 7)],
  ];

  const container = $('note-groups');
  container.replaceChildren();
  for (const [label, items] of buckets) {
    if (!items.length) continue;
    container.append(el('h3', 'group-title', label));
    const group = el('div', 'group');
    for (const note of items) {
      const cell = el('button', 'cell');
      cell.type = 'button';
      const sub = el('div', 'cell-sub');
      sub.append(el('time', null, listLabel(note.date, note.daysAgo)), note.preview || 'No additional text');
      cell.append(el('div', 'cell-title', note.title), sub);
      cell.addEventListener('click', () => openNote(note, cell));
      group.append(cell);
    }
    container.append(group);
  }
  container.append(el('div', 'list-bottom-pad'));
  $('note-count').textContent = `${notes.length} Notes`;
}

// `caretAt` is the index of the list item to show the fake cursor after (-1 for none).
function renderTrickBody(caretAt = -1) {
  const body = $('note-body');
  body.replaceChildren(el('h2', null, openList.title));
  const ol = el('ol');
  shownWords.forEach((word, i) => {
    const li = el('li');
    const span = el('span', null, word);
    if (i === caretAt) span.append(el('span', 'caret'));
    li.append(span);
    ol.append(li);
  });
  body.append(ol);
}

function renderDecoyBody(note) {
  const body = $('note-body');
  body.replaceChildren(el('h2', null, note.title), ...note.lines.map((line) => el('p', null, line)));
}

// ---------- Transitions (iOS-style push / pop / sheet) ----------
// Screens are never hidden: the note and the setup sheet rest just off screen (see styles.css),
// so they stay painted and a transition is pure compositing. Animations use the Web Animations
// API on transform/opacity only, which iOS runs on the compositor, off the main thread.

const PUSH_MS = 520;
const POP_MS = 460;
const SHEET_MS = 500;
const PARALLAX = 30; // % the screen underneath shifts left while a note is pushed over it
const SHADE = 0.12;

const listScreen = $('list-screen');
const noteScreen = $('note-screen');
const settingsScreen = $('settings-screen');
const shade = $('shade');
let busy = false;

const noteX = (p) => `translate3d(${(1 - p) * 100}%, 0, 0)`;
const listX = (p) => `translate3d(${-PARALLAX * p}%, 0, 0)`;

// p = how far the note is pushed on screen: 0 = off to the right, 1 = fully shown.
function setPush(p) {
  noteScreen.style.transform = noteX(p);
  listScreen.style.transform = listX(p);
  shade.style.opacity = SHADE * p;
}

function clearInlineStyles() {
  for (const node of [listScreen, noteScreen, settingsScreen]) node.style.transform = '';
  shade.style.opacity = '';
}

let running = null; // { animations, promise } for the transition in progress

// Runs the animations; once they finish, `done` sets the resting state before the animations
// are removed, so the last frame and the resting state match and nothing flickers.
function play(animations, done) {
  busy = true;
  const promise = Promise.all(animations.map((a) => a.finished)).catch(() => {}).then(() => {
    done();
    clearInlineStyles();
    for (const a of animations) a.cancel();
    running = null;
    busy = false;
  });
  running = { animations, promise };
  return promise;
}

// Jump a running transition to its end. The iOS easing curve spends its last ~40% barely moving,
// so a tap there must not be swallowed: finish the transition, then handle the tap.
function finishRunning() {
  if (!running) return Promise.resolve();
  for (const a of running.animations) a.finish();
  return running.promise;
}

function animatePush(from, to, ms) {
  const options = { duration: ms, easing: IOS_EASE, fill: 'forwards' };
  shade.classList.add('active');
  return [
    noteScreen.animate([{ transform: noteX(from) }, { transform: noteX(to) }], options),
    listScreen.animate([{ transform: listX(from) }, { transform: listX(to) }], options),
    shade.animate([{ opacity: SHADE * from }, { opacity: SHADE * to }], options),
  ];
}

function pushNote(from = 0, ms = PUSH_MS) {
  return play(animatePush(from, 1, ms), () => {
    noteScreen.classList.add('active');
    shade.classList.remove('active');
  });
}

function popNote(from = 1, ms = POP_MS) {
  deselectCell();
  noteScreen.classList.add('leaving'); // taps fall through the departing note to the list
  return play(animatePush(from, 0, ms), () => {
    noteScreen.classList.remove('active', 'leaving');
    shade.classList.remove('active');
  });
}

function sheetAnimation(screen, from, to, ms) {
  const y = (v) => `translate3d(0, ${v}%, 0)`;
  return screen.animate([{ transform: y(from) }, { transform: y(to) }], { duration: ms, easing: IOS_EASE, fill: 'forwards' });
}

function presentSheet(screen) {
  return play([sheetAnimation(screen, 100, 0, SHEET_MS)], () => screen.classList.add('active'));
}

function dismissSheet(screen) {
  return play([sheetAnimation(screen, 0, 100, SHEET_MS - 80)], () => screen.classList.remove('active'));
}

// Swipe from the left edge of a note to go back, following the finger like iOS.
function enableEdgeSwipe() {
  const EDGE = 24;
  let swipe = null;

  noteScreen.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    if (busy || e.touches.length > 1 || touch.clientX > EDGE) return;
    swipe = { startX: touch.clientX, lastX: touch.clientX, lastT: e.timeStamp, velocity: 0, started: false };
  }, { passive: true });

  noteScreen.addEventListener('touchmove', (e) => {
    if (!swipe) return;
    const x = e.touches[0].clientX;
    if (!swipe.started) {
      swipe.started = true;
      if (secretActive) secret.blur();
      shade.classList.add('active');
    }
    e.preventDefault(); // stop the note scrolling while dragging sideways
    const dt = Math.max(1, e.timeStamp - swipe.lastT);
    swipe.velocity = (x - swipe.lastX) / dt;
    swipe.lastX = x;
    swipe.lastT = e.timeStamp;
    setPush(1 - Math.max(0, x - swipe.startX) / window.innerWidth);
  }, { passive: false });

  const end = async () => {
    if (!swipe) return;
    const { started, lastX, startX, velocity } = swipe;
    swipe = null;
    if (!started) return;
    const p = 1 - Math.max(0, lastX - startX) / window.innerWidth;
    if (p < 0.6 || velocity > 0.4) {
      await popNote(p, Math.max(160, POP_MS * p));
      afterClose();
    } else {
      await pushNote(p, Math.max(160, PUSH_MS * (1 - p)));
    }
  };
  noteScreen.addEventListener('touchend', end);
  noteScreen.addEventListener('touchcancel', end);
}

// ---------- Navigation ----------

const PRERENDER_DELAY_MS = 800;

let renderedKey = null; // identifies what the note screen currently has drawn
let selectedCell = null;
let prerenderTimer = 0;

function contentKey(note, words = note.list?.items) {
  return note.list ? `list:${note.list.id}:${note.list.title}:${words.join('|')}` : `note:${note.title}`;
}

async function openNote(note, cell) {
  await finishRunning();
  if (busy || noteScreen.classList.contains('active')) return;
  // Keep the cell highlighted under the note, like iOS (a fading highlight would repaint mid-slide).
  selectedCell = cell;
  cell.classList.add('selected');
  clearTimeout(prerenderTimer);
  // The most recent list is pre-rendered, so usually there is nothing to draw before sliding.
  if (renderedKey !== contentKey(note)) {
    showNoteContent(note);
    requestAnimationFrame(() => pushNote());
  } else {
    openList = note.list ?? null;
    if (openList) shownWords = [...openList.items];
    pushNote();
  }
}

function showNoteContent(note) {
  openList = note.list ?? null;
  renderedKey = contentKey(note);
  $('note-date').textContent = headerLabel(note.date);
  if (openList) {
    shownWords = [...openList.items];
    renderTrickBody();
  } else {
    renderDecoyBody(note);
  }
  $('note-scroll').scrollTop = 0;
}

// The note most likely to be opened next: the newest visible list.
function primaryNote() {
  return allNotes().find((n) => n.list) ?? null;
}

// Runs once the note is off screen: reset the trick for the next performance and pre-render.
// iOS Safari swallows a tap if new content appears while the finger is down (it treats the tap
// as a "hover"), and taps often land right as the slide ends. So never redraw here when nothing
// changed, and when something did, wait for a quiet moment.
function afterClose() {
  if (openList) shownWords = [...openList.items];
  const next = primaryNote();
  if (!next || renderedKey === contentKey(next)) return;
  clearTimeout(prerenderTimer);
  prerenderTimer = setTimeout(() => {
    if (!noteScreen.classList.contains('active') && !busy) showNoteContent(next);
  }, PRERENDER_DELAY_MS);
}

// Clear the row highlight instantly when leaving a note (a fade would repaint the list mid-slide).
function deselectCell() {
  selectedCell?.classList.remove('selected');
  selectedCell = null;
}

async function closeNote() {
  await finishRunning();
  if (busy || !noteScreen.classList.contains('active')) return;
  if (secretActive) secret.blur();
  await popNote();
  afterClose();
}

$('back').addEventListener('click', closeNote);
enableEdgeSwipe();

// ---------- Secret input ----------
// Tap anywhere on a list note: number pad opens (type the spectator's number).
// Long-press: letter keyboard opens (type "17 banana" to force a different word).
// Nothing typed is shown. Tap the note again, or press Done/return, to apply.

const secret = $('secret');
const noteScroll = $('note-scroll');
let secretActive = false;
let press = null;

function beginSecretInput(mode, target) {
  if (mode === 'numeric') {
    secret.setAttribute('inputmode', 'numeric');
    secret.setAttribute('pattern', '[0-9]*');
  } else {
    secret.setAttribute('inputmode', 'text');
    secret.removeAttribute('pattern');
  }
  secret.value = '';
  secret.focus({ preventScroll: true }); // must run inside a touch handler for iOS to open the keyboard
  secretActive = true;

  // Show the cursor where a real note would put it: the tapped line, or the end of the list.
  const items = [...$('note-body').querySelectorAll('li')];
  const tapped = target.closest?.('li');
  renderTrickBody(tapped ? items.indexOf(tapped) : items.length - 1);
}

function commitSecretInput() {
  if (!secretActive) return;
  secretActive = false;
  const parsed = parseSecret(secret.value, openList?.force);
  secret.value = '';
  if (!openList) return;
  // Without a subscription the app is just Notes: the force does nothing.
  if (parsed && purchases.isEntitled()) shownWords = applyForce(shownWords, parsed.position, parsed.word);
  renderTrickBody();
  renderedKey = contentKey({ list: openList }, shownWords);
}

// Keep focus on the hidden input when tapping the note (desktop browsers would otherwise blur it).
noteScroll.addEventListener('mousedown', (e) => { if (openList) e.preventDefault(); });

noteScroll.addEventListener('pointerdown', (e) => {
  press = { x: e.clientX, y: e.clientY, t: e.timeStamp, target: e.target };
});
noteScroll.addEventListener('pointermove', (e) => {
  if (press && Math.hypot(e.clientX - press.x, e.clientY - press.y) > 10) press = null; // it's a scroll
});
noteScroll.addEventListener('pointercancel', () => { press = null; });
noteScroll.addEventListener('pointerup', (e) => {
  const current = press;
  press = null;
  if (!current || !openList || busy) return;
  if (secretActive) {
    secret.blur(); // second tap applies the force and hides the keyboard
    return;
  }
  beginSecretInput(e.timeStamp - current.t >= LONG_PRESS_MS ? 'text' : 'numeric', current.target);
});

$('secret-form').addEventListener('submit', (e) => {
  e.preventDefault();
  secret.blur();
});
secret.addEventListener('blur', commitSecretInput);

// ---------- Setup (long-press the "Notes" title) ----------

function onLongPress(target, callback) {
  let timer;
  const cancel = () => clearTimeout(timer);
  target.addEventListener('pointerdown', () => { timer = setTimeout(callback, LONG_PRESS_MS); });
  for (const type of ['pointerup', 'pointerleave', 'pointercancel']) target.addEventListener(type, cancel);
  target.addEventListener('contextmenu', (e) => e.preventDefault());
}

const setup = createSetup({
  root: $('setup-stack'),
  purchases,
  getSettings: () => settings,
  setSettings(next) {
    settings = next;
    store.save(settings);
  },
  close: async () => {
    if (busy) return;
    document.activeElement?.blur();
    await dismissSheet(settingsScreen);
    renderList();
    const next = primaryNote();
    if (next) showNoteContent(next);
  },
});

function openSetup(page) {
  if (busy) return;
  setup.show(page);
  presentSheet(settingsScreen);
}

onLongPress($('folder-title'), () => openSetup('main'));

// ---------- Boot ----------

// iOS only applies :active styles (button press dimming) when a touch listener exists.
document.addEventListener('touchstart', () => {}, { passive: true });

renderList();
const firstNote = primaryNote();
if (firstNote) showNoteContent(firstNote);

// First launch: explain how to install, open setup and perform.
if (!settings.welcomed) {
  settings.welcomed = true;
  store.save(settings);
  setTimeout(() => openSetup('welcome'), 400);
}

purchases.init();

// The native apps bundle their files, so only the web version needs the offline cache.
if ('serviceWorker' in navigator && !purchases.isNative) {
  navigator.serviceWorker.register('sw.js').catch(() => { /* offline support is best-effort */ });
}
