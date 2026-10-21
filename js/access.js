// What a user can do with or without All Access. Pure functions, so they can be unit-tested.
import { CONFIG } from './config.js';

export const isFreeList = (list) => list.id === CONFIG.freeListId;

// Lists shown as notes: everything visible with All Access; only the free list without it.
export function availableLists(lists, allAccess) {
  return lists.filter((list) => list.visible && (allAccess || isFreeList(list)));
}

// The free list forces only its own force word (no typing a different word on the spot).
export function canForce(list, word, allAccess) {
  if (allAccess) return true;
  const norm = (w) => String(w).normalize('NFKC').trim().toLowerCase();
  return !!list && isFreeList(list) && !!list.force && norm(word) === norm(list.force);
}
