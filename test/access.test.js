import { test } from 'node:test';
import assert from 'node:assert/strict';
import { freeForcesLeft, canForce, needsPaywall } from '../js/access.js';
import { CONFIG } from '../js/config.js';

test('3 free forces, counted down and never negative', () => {
  assert.equal(CONFIG.freeForces, 3);
  assert.equal(freeForcesLeft({}), 3);
  assert.equal(freeForcesLeft({ freeForcesUsed: 2 }), 1);
  assert.equal(freeForcesLeft({ freeForcesUsed: 7 }), 0);
});

test('forcing is allowed while free forces remain, then needs All Access', () => {
  assert.equal(canForce({ freeForcesUsed: 2 }, false), true);
  assert.equal(canForce({ freeForcesUsed: 3 }, false), false);
  assert.equal(canForce({ freeForcesUsed: 3 }, true), true);
  assert.equal(needsPaywall({ freeForcesUsed: 3 }, false), true);
  assert.equal(needsPaywall({ freeForcesUsed: 3 }, true), false);
  assert.equal(needsPaywall({ freeForcesUsed: 0 }, false), false);
});
