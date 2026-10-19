import { parseSecret, applyForce } from './force.js';

const STORAGE_KEY = 'dfb.settings.v1';
const LONG_PRESS_MS = 700;

const DEFAULTS = {
  title: 'Charades ideas',
  force: 'Leonardo DiCaprio',
  words: [
    'Taylor Swift', 'Leonardo DiCaprio', 'Beyoncé', 'Tom Hanks', 'Rihanna', 'Brad Pitt',
    'Oprah Winfrey', 'Lionel Messi', 'Jennifer Aniston', 'Cristiano Ronaldo', 'Will Smith',
    'Lady Gaga', 'Johnny Depp', 'Kim Kardashian', 'Dwayne Johnson', 'Adele', 'Barack Obama',
    'Angelina Jolie', 'Elon Musk', 'Ed Sheeran', 'Michael Jordan', 'Scarlett Johansson',
    'Justin Bieber', 'Morgan Freeman', 'Ariana Grande', 'Keanu Reeves', 'Serena Williams',
    'Robert Downey Jr.', 'Selena Gomez', 'Bill Gates', 'Tom Cruise', 'Shakira',
    'David Beckham', 'Emma Watson', 'Drake', 'Meryl Streep', 'LeBron James', 'Billie Eilish',
    'Jackie Chan', 'Madonna', 'Harry Styles', 'Julia Roberts', 'Usain Bolt', 'Bruno Mars',
    'Nicole Kidman', 'Ryan Reynolds', 'Jennifer Lopez', 'Roger Federer', 'Zendaya',
    'Mark Zuckerberg', 'Eminem', 'Sandra Bullock', 'Tiger Woods', 'Katy Perry',
    'Chris Hemsworth', 'Kylie Jenner', 'Denzel Washington', 'Dua Lipa',
    'Arnold Schwarzenegger', 'Margot Robbie', 'Steve Jobs', 'Snoop Dogg', 'Anne Hathaway',
    'Jim Carrey', 'Miley Cyrus', 'Brad Paisley', 'Nicki Minaj', 'Hugh Jackman', 'Elton John',
    'Gal Gadot', 'Neymar', 'Kanye West', 'Natalie Portman', 'Mr. Bean', 'Pink', 'Matt Damon',
    'Shaquille O\'Neal', 'Lionel Richie', 'Cardi B', 'George Clooney', 'Jennifer Lawrence',
    'Paul McCartney', 'Kevin Hart', 'Mariah Carey', 'Rafael Nadal', 'Emma Stone',
    'Justin Timberlake', 'Sylvester Stallone', 'Britney Spears', 'Kobe Bryant',
    'Charlize Theron', 'The Weeknd', 'Mike Tyson', 'Cameron Diaz', 'Post Malone',
    'Jason Statham', 'Céline Dion', 'Michael Jackson', 'Audrey Hepburn', 'Albert Einstein',
  ],
};

// Decoy notes so the folder looks lived-in. `daysAgo` drives the date labels.
const DECOYS = [
  { title: 'Groceries', daysAgo: 1, lines: ['Milk', 'Eggs', 'Sourdough', 'Spinach', 'Coffee beans', 'Lemons', 'Paper towels'] },
  { title: 'Gift ideas', daysAgo: 3, lines: ['Mom - cookbook / nice olive oil', 'Dan - board game?', 'Noa - headphones', ''] },
  { title: 'Wifi', daysAgo: 6, lines: ['Home network - password on the router sticker', 'Guest: ask before sharing'] },
  { title: 'Books to read', daysAgo: 12, lines: ['Project Hail Mary', 'The Midnight Library', 'Sapiens', 'Born a Crime'] },
  { title: 'Packing list', daysAgo: 25, lines: ['Passport', 'Chargers', 'Adapter', 'Sunglasses', 'Swimsuit', 'Book'] },
];

const $ = (id) => document.getElementById(id);

let settings = loadSettings();
let shownWords = [...settings.words]; // what the trick note currently displays
let openNoteIsTrick = false;

// The trick note was "last edited" a little while ago today.
const trickEdited = new Date(Date.now() - 47 * 60 * 1000);

// ---------- Storage ----------

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.words) && saved.words.length) return { ...DEFAULTS, ...saved };
  } catch { /* storage unavailable or corrupt: fall back to defaults */ }
  return structuredClone(DEFAULTS);
}

function saveSettings(next) {
  settings = next;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
}

// ---------- Dates (mimic Notes' labels) ----------

const timeFmt = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' });
const weekdayFmt = new Intl.DateTimeFormat(undefined, { weekday: 'long' });
const shortFmt = new Intl.DateTimeFormat(undefined, { year: '2-digit', month: 'numeric', day: 'numeric' });
const longFmt = new Intl.DateTimeFormat(undefined, { dateStyle: 'long' });

function daysAgoDate(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(9 + ((days * 7) % 11), (days * 13) % 60, 0, 0);
  return d;
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

function allNotes() {
  const trick = { trick: true, title: settings.title, daysAgo: 0, date: trickEdited, preview: shownWords.slice(0, 4).join(' ') };
  const decoys = DECOYS.map((n) => ({ ...n, date: daysAgoDate(n.daysAgo), preview: n.lines.filter(Boolean).join(' ') }));
  return [trick, ...decoys];
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
      cell.addEventListener('click', () => openNote(note));
      group.append(cell);
    }
    container.append(group);
  }
  container.append(el('div', 'list-bottom-pad'));
  $('note-count').textContent = `${notes.length} Notes`;
}

function renderTrickBody(withCaret = false) {
  const body = $('note-body');
  body.replaceChildren(el('h2', null, settings.title));
  const ol = el('ol');
  shownWords.forEach((word, i) => {
    const li = el('li');
    const span = el('span', null, word);
    if (withCaret && i === shownWords.length - 1) span.append(el('span', 'caret'));
    li.append(span);
    ol.append(li);
  });
  body.append(ol);
}

function renderDecoyBody(note) {
  const body = $('note-body');
  body.replaceChildren(el('h2', null, note.title), ...note.lines.map((line) => el('p', null, line)));
}

// ---------- Navigation ----------

function show(screenId) {
  for (const screen of document.querySelectorAll('.screen')) {
    screen.classList.toggle('active', screen.id === screenId);
  }
}

function openNote(note) {
  openNoteIsTrick = !!note.trick;
  $('note-date').textContent = headerLabel(note.date);
  if (note.trick) renderTrickBody();
  else renderDecoyBody(note);
  $('note-scroll').scrollTop = 0;
  show('note-screen');
}

function closeNote() {
  $('secret').blur();
  // Leaving the note resets the trick for the next performance.
  shownWords = [...settings.words];
  renderList();
  show('list-screen');
}

// ---------- Secret input ----------

function beginSecretInput() {
  if (!openNoteIsTrick) return;
  const input = $('secret');
  input.value = '';
  input.focus({ preventScroll: true }); // must run inside the tap handler for iOS to open the keyboard
  renderTrickBody(true);
}

function commitSecretInput() {
  const input = $('secret');
  const parsed = parseSecret(input.value, settings.force);
  input.value = '';
  if (parsed) shownWords = applyForce(shownWords, parsed.position, parsed.word);
  renderTrickBody(false);
}

$('tap-zone').addEventListener('click', beginSecretInput);
$('secret-form').addEventListener('submit', (e) => {
  e.preventDefault();
  $('secret').blur(); // blur triggers the commit
});
$('secret').addEventListener('blur', commitSecretInput);
$('back').addEventListener('click', closeNote);

// ---------- Hidden settings (long-press the "Notes" title) ----------

function onLongPress(target, callback) {
  let timer;
  const cancel = () => clearTimeout(timer);
  target.addEventListener('pointerdown', () => { timer = setTimeout(callback, LONG_PRESS_MS); });
  for (const type of ['pointerup', 'pointerleave', 'pointercancel']) target.addEventListener(type, cancel);
  target.addEventListener('contextmenu', (e) => e.preventDefault());
}

function fillSettingsForm(values) {
  $('set-title').value = values.title;
  $('set-force').value = values.force;
  $('set-words').value = values.words.join('\n');
}

onLongPress($('folder-title'), () => {
  fillSettingsForm(settings);
  show('settings-screen');
});

$('settings-cancel').addEventListener('click', () => show('list-screen'));
$('settings-reset').addEventListener('click', () => fillSettingsForm(DEFAULTS));
$('settings-save').addEventListener('click', () => {
  const words = $('set-words').value.split('\n').map((w) => w.trim()).filter(Boolean);
  saveSettings({
    title: $('set-title').value.trim() || DEFAULTS.title,
    force: $('set-force').value.trim(),
    words: words.length ? words : DEFAULTS.words,
  });
  shownWords = [...settings.words];
  renderList();
  show('list-screen');
});

// ---------- Boot ----------

renderList();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => { /* offline support is best-effort */ });
}
