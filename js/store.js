// Settings shape and persistence. Pure functions take/return plain objects so they can be tested.
import { DEFAULT_LISTS, listSet } from './lists.js';
import { LOCALES } from './i18n.js';

export const STORAGE_KEY = 'dfb.settings.v2';
const LEGACY_KEY = 'dfb.settings.v1';
const VERSION = 3;

// Built-in titles that were later renamed. Lists still using the old default get the new one;
// titles the user chose are left alone.
const RENAMED_DEFAULT_TITLES = { celebrities: { from: 'Charades ideas', since: 3 } };

function renameOldDefaults(lists, fromVersion) {
  for (const list of lists) {
    const rename = RENAMED_DEFAULT_TITLES[list.id];
    if (rename && fromVersion < rename.since && list.title === rename.from) {
      list.title = DEFAULT_LISTS.find((l) => l.id === list.id).title;
    }
  }
  return lists;
}

// Built-in lists for a language (each list as an independent copy).
export function defaultLists(locale = 'en') {
  return listSet(locale).lists.map((list) => ({ ...list, items: [...list.items], visible: true }));
}

// `language` is 'auto' (follow the phone) or one of LOCALES.
export function defaultSettings(locale = 'en') {
  return {
    version: VERSION,
    welcomed: false,
    freeForcesUsed: 0,
    language: 'auto',
    lists: defaultLists(locale),
  };
}

// Version 1 had a single list: { title, force, words }. It becomes the celebrities list.
export function migrateV1(v1) {
  const settings = defaultSettings();
  settings.welcomed = true; // existing users already know the app
  if (!v1 || !Array.isArray(v1.words) || !v1.words.length) return settings;
  const [first] = settings.lists;
  Object.assign(first, {
    title: String(v1.title || first.title),
    force: String(v1.force ?? first.force),
    items: v1.words.map(String),
  });
  renameOldDefaults(settings.lists, 1);
  return settings;
}

// Repair anything missing or malformed so the app never crashes on stored data.
export function normalize(raw) {
  const fallback = defaultSettings();
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.lists)) return fallback;
  const seen = new Set();
  const lists = raw.lists
    .filter((list) => list && typeof list === 'object')
    .map((list, i) => {
      let id = String(list.id || `list-${i}`);
      while (seen.has(id)) id += '-1';
      seen.add(id);
      return {
        id,
        title: String(list.title ?? '').trim() || 'Untitled',
        force: String(list.force ?? '').trim(),
        ageMinutes: Number.isFinite(list.ageMinutes) ? list.ageMinutes : 60 * (i + 1),
        items: Array.isArray(list.items) ? list.items.map((w) => String(w).trim()).filter(Boolean) : [],
        visible: list.visible !== false,
      };
    });
  return {
    version: VERSION,
    welcomed: !!raw.welcomed,
    freeForcesUsed: Number.isInteger(raw.freeForcesUsed) && raw.freeForcesUsed > 0 ? raw.freeForcesUsed : 0,
    language: LOCALES.includes(raw.language) ? raw.language : 'auto',
    lists: renameOldDefaults(lists, Number(raw.version) || 2),
  };
}

export function newList(settings, title = 'New list') {
  const n = settings.lists.length;
  return {
    id: `list-${Date.now().toString(36)}`,
    title,
    force: '',
    ageMinutes: 25 + n * 97, // spread new notes out so they don't all show the same time
    items: [],
    visible: true,
  };
}

export function parseItems(text) {
  return String(text).split('\n').map((w) => w.trim()).filter(Boolean);
}

// `locale` picks the built-in lists for a first launch; saved settings keep their own lists.
export function load(storage = globalThis.localStorage, locale = 'en') {
  try {
    const current = storage.getItem(STORAGE_KEY);
    if (current) return normalize(JSON.parse(current));
    const legacy = storage.getItem(LEGACY_KEY);
    if (legacy) return migrateV1(JSON.parse(legacy));
  } catch { /* storage unavailable or corrupt: fall back to defaults */ }
  return defaultSettings(locale);
}

export function save(settings, storage = globalThis.localStorage) {
  try { storage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch { /* ignore */ }
}
