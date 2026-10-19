import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseSecret, applyForce } from '../js/force.js';

test('parseSecret: number only uses the default word', () => {
  assert.deepEqual(parseSecret('17', 'Elephant'), { position: 17, word: 'Elephant' });
});

test('parseSecret: number then word, with or without a space', () => {
  assert.deepEqual(parseSecret('17 banana'), { position: 17, word: 'banana' });
  assert.deepEqual(parseSecret('17banana'), { position: 17, word: 'banana' });
  assert.deepEqual(parseSecret('  3   ice cream '), { position: 3, word: 'ice cream' });
});

test('parseSecret: word then number', () => {
  assert.deepEqual(parseSecret('banana 17'), { position: 17, word: 'banana' });
});

test('parseSecret: rejects input without a usable number or word', () => {
  assert.equal(parseSecret('banana'), null);
  assert.equal(parseSecret(''), null);
  assert.equal(parseSecret('0 banana'), null);
  assert.equal(parseSecret('5', ''), null);
});

test('applyForce: swaps when the word is already in the list', () => {
  const words = ['a', 'b', 'c', 'd'];
  assert.deepEqual(applyForce(words, 1, 'c'), ['c', 'b', 'a', 'd']);
  assert.deepEqual(words, ['a', 'b', 'c', 'd'], 'input is not mutated');
});

test('applyForce: swap is case-insensitive and no-op when already in place', () => {
  assert.deepEqual(applyForce(['a', 'B', 'c'], 3, 'b'), ['a', 'c', 'B']);
  assert.deepEqual(applyForce(['a', 'b', 'c'], 2, 'b'), ['a', 'b', 'c']);
});

test('applyForce: replaces when the word is not in the list', () => {
  assert.deepEqual(applyForce(['a', 'b', 'c'], 2, 'z'), ['a', 'z', 'c']);
});

test('applyForce: out-of-range positions leave the list unchanged', () => {
  assert.deepEqual(applyForce(['a', 'b'], 5, 'z'), ['a', 'b']);
  assert.deepEqual(applyForce(['a', 'b'], 0, 'z'), ['a', 'b']);
});
