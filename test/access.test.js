import { test } from 'node:test';
import assert from 'node:assert/strict';
import { availableLists, canForce } from '../js/access.js';
import { defaultSettings } from '../js/store.js';

const { lists } = defaultSettings();
const celebrities = lists.find((l) => l.id === 'celebrities');
const movies = lists.find((l) => l.id === 'movies');

test('without All Access only the free list is shown', () => {
  assert.deepEqual(availableLists(lists, false).map((l) => l.id), ['celebrities']);
  assert.equal(availableLists(lists, true).length, lists.length);
});

test('hidden lists stay hidden either way', () => {
  const hidden = lists.map((l) => ({ ...l, visible: l.id !== 'celebrities' }));
  assert.deepEqual(availableLists(hidden, false), []);
});

test('the free list forces only its own force word', () => {
  assert.equal(canForce(celebrities, 'Leonardo DiCaprio', false), true);
  assert.equal(canForce(celebrities, 'leonardo dicaprio ', false), true);
  assert.equal(canForce(celebrities, 'Banana', false), false);
  assert.equal(canForce(movies, 'Titanic', false), false);
  assert.equal(canForce(null, 'x', false), false);
});

test('All Access forces anything', () => {
  assert.equal(canForce(movies, 'Banana', true), true);
});
