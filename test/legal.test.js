import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LEGAL, legalText } from '../js/legal/index.js';
import { LOCALES } from '../js/i18n.js';

// Each block is a paragraph (string) or a list (array of strings).
const shape = (doc) => doc.sections.map(([heading, ...blocks]) => [
  typeof heading,
  ...blocks.map((b) => (Array.isArray(b) ? `list:${b.length}` : typeof b)),
]);

test('every translation of the Terms and Privacy Policy has the same sections and lists as English', () => {
  for (const [lang, doc] of Object.entries(LEGAL)) {
    for (const kind of ['terms', 'privacy']) {
      assert.deepEqual(shape(doc[kind]), shape(LEGAL.en[kind]), `${lang} ${kind}`);
      assert.ok(doc[kind].effective && doc[kind].summary, `${lang} ${kind} needs a date and summary`);
    }
  }
});

test('every app language has its own Terms and Privacy Policy', () => {
  for (const locale of LOCALES) {
    const terms = legalText('terms', locale);
    if (locale !== 'en') assert.notEqual(terms, LEGAL.en.terms, `${locale} falls back to English`);
  }
});
