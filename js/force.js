// Pure trick logic — no DOM, so it can be unit-tested with `node --test`.

/**
 * Parse what the performer secretly typed.
 * Accepts "17", "17 banana", "17banana", "banana 17".
 * Returns { position, word } or null if there's no usable number.
 * `word` falls back to `defaultWord` when none was typed.
 */
export function parseSecret(input, defaultWord = '') {
  const text = String(input ?? '').trim();
  const match = text.match(/^(\d+)\s*(.*)$/) || text.match(/^(.*?)\s*(\d+)$/);
  if (!match) return null;

  const [numPart, wordPart] = /^\d/.test(text) ? [match[1], match[2]] : [match[2], match[1]];
  const position = parseInt(numPart, 10);
  const word = wordPart.trim() || String(defaultWord).trim();
  if (!position || !word) return null;
  return { position, word };
}

/**
 * Put `word` at 1-based `position` in `words`, returning a new array.
 * If the word already appears in the list it is swapped into place, so the
 * set of words never changes (anyone re-reading the list sees the same words).
 * Otherwise the word at `position` is replaced.
 * Out-of-range positions return an unchanged copy.
 */
export function applyForce(words, position, word) {
  const result = [...words];
  const target = position - 1;
  if (target < 0 || target >= result.length) return result;

  const existing = result.findIndex((w) => w.trim().toLowerCase() === word.trim().toLowerCase());
  if (existing === -1) {
    result[target] = word;
  } else {
    [result[target], result[existing]] = [result[existing], result[target]];
  }
  return result;
}
