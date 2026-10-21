// What a user can do with or without All Access. Pure functions, so they can be unit-tested.
import { CONFIG } from './config.js';

// Free forces left before the paywall (never negative).
export function freeForcesLeft(settings) {
  return Math.max(0, CONFIG.freeForces - (settings.freeForcesUsed ?? 0));
}

// A force is allowed with All Access, or while free forces remain. It never fails silently
// mid-trick: once none are left, list notes open the paywall before the trick starts.
export function canForce(settings, allAccess) {
  return allAccess || freeForcesLeft(settings) > 0;
}

// Opening a list note without All Access and without free forces shows the paywall instead.
export function needsPaywall(settings, allAccess) {
  return !canForce(settings, allAccess);
}
