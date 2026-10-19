import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultSettings, migrateV1, normalize, parseItems, load, save, STORAGE_KEY } from '../js/store.js';

function memoryStorage(initial = {}) {
  const data = { ...initial };
  return { getItem: (k) => (k in data ? data[k] : null), setItem: (k, v) => { data[k] = String(v); }, data };
}

test('defaults: every built-in list has its force word in the list', () => {
  const { lists } = defaultSettings();
  assert.ok(lists.length >= 4);
  for (const list of lists) assert.ok(list.items.includes(list.force), list.title);
});

test('defaults are independent copies', () => {
  const a = defaultSettings();
  a.lists[0].items.push('x');
  assert.notEqual(defaultSettings().lists[0].items.at(-1), 'x');
});

test('the old default title "Charades ideas" becomes "Celebrities", custom titles stay', () => {
  assert.equal(defaultSettings().lists[0].title, 'Celebrities');
  assert.equal(migrateV1({ title: 'Charades ideas', force: 'x', words: ['x'] }).lists[0].title, 'Celebrities');
  const v2 = { version: 2, lists: [{ id: 'celebrities', title: 'Charades ideas', items: ['a'] }, { id: 'movies', title: 'Charades ideas', items: ['b'] }] };
  const upgraded = normalize(v2);
  assert.equal(upgraded.lists[0].title, 'Celebrities');
  assert.equal(upgraded.lists[1].title, 'Charades ideas', 'only the built-in celebrities list is renamed');
  assert.equal(normalize({ version: 2, lists: [{ id: 'celebrities', title: 'My stars', items: ['a'] }] }).lists[0].title, 'My stars');
  // Once upgraded, a user who deliberately renames it back keeps their choice
  assert.equal(normalize({ version: 3, lists: [{ id: 'celebrities', title: 'Charades ideas', items: ['a'] }] }).lists[0].title, 'Charades ideas');
});

test('migrateV1 keeps the old single list as the first list', () => {
  const s = migrateV1({ title: 'My list', force: 'Bob', words: ['Ann', 'Bob'] });
  assert.equal(s.lists[0].title, 'My list');
  assert.equal(s.lists[0].force, 'Bob');
  assert.deepEqual(s.lists[0].items, ['Ann', 'Bob']);
  assert.equal(s.welcomed, true);
  assert.ok(s.lists.length > 1, 'other built-in lists are added');
});

test('normalize repairs malformed data', () => {
  assert.deepEqual(normalize(null), defaultSettings());
  const s = normalize({ lists: [{ id: 'a', title: '  ', items: ['x', ' ', 3] }, { id: 'a' }, null] });
  assert.equal(s.lists.length, 2);
  assert.equal(s.lists[0].title, 'Untitled');
  assert.deepEqual(s.lists[0].items, ['x', '3']);
  assert.notEqual(s.lists[0].id, s.lists[1].id, 'duplicate ids are fixed');
  assert.equal(s.lists[1].visible, true);
});

test('parseItems drops blank lines and trims', () => {
  assert.deepEqual(parseItems(' a \n\n b\n  '), ['a', 'b']);
});

test('load prefers v2, falls back to migrating v1, then defaults', () => {
  const v2 = defaultSettings();
  v2.lists[0].force = 'Zendaya';
  assert.equal(load(memoryStorage({ [STORAGE_KEY]: JSON.stringify(v2) })).lists[0].force, 'Zendaya');
  const fromV1 = load(memoryStorage({ 'dfb.settings.v1': JSON.stringify({ title: 'T', force: 'f', words: ['f'] }) }));
  assert.equal(fromV1.lists[0].title, 'T');
  assert.deepEqual(load(memoryStorage()), defaultSettings());
  assert.deepEqual(load(memoryStorage({ [STORAGE_KEY]: '{not json' })), defaultSettings());
});

test('save then load round-trips', () => {
  const storage = memoryStorage();
  const s = defaultSettings();
  s.lists[1].visible = false;
  save(s, storage);
  assert.equal(load(storage).lists[1].visible, false);
});
