// Settings shape and persistence. Pure functions take/return plain objects so they can be tested.
import { DEFAULT_LISTS } from './lists.js';

export const STORAGE_KEY = 'dfb.settings.v2';
const LEGACY_KEY = 'dfb.settings.v1';

export function defaultSettings() {
  return {
    version: 2,
    welcomed: false,
    lists: DEFAULT_LISTS.map((list) => ({ ...list, items: [...list.items], visible: true })),
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
  return { version: 2, welcomed: !!raw.welcomed, lists };
}

export function newList(settings) {
  const n = settings.lists.length;
  return {
    id: `list-${Date.now().toString(36)}`,
    title: 'New list',
    force: '',
    ageMinutes: 25 + n * 97, // spread new notes out so they don't all show the same time
    items: [],
    visible: true,
  };
}

export function parseItems(text) {
  return String(text).split('\n').map((w) => w.trim()).filter(Boolean);
}

export function load(storage = globalThis.localStorage) {
  try {
    const current = storage.getItem(STORAGE_KEY);
    if (current) return normalize(JSON.parse(current));
    const legacy = storage.getItem(LEGACY_KEY);
    if (legacy) return migrateV1(JSON.parse(legacy));
  } catch { /* storage unavailable or corrupt: fall back to defaults */ }
  return defaultSettings();
}

export function save(settings, storage = globalThis.localStorage) {
  try { storage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch { /* ignore */ }
}
