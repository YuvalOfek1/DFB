import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STRINGS, LOCALES, resolveLocale, translate } from '../js/i18n.js';
import { listSet } from '../js/lists.js';

test('every language translates every English string (no silent English fallback)', () => {
  for (const lang of ['es', 'ja', 'he', 'fr', 'de', 'pt-BR', 'it', 'ko']) {
    for (const key of Object.keys(STRINGS.en)) {
      assert.ok(key in STRINGS[lang], `${lang} is missing "${key}"`);
      assert.equal(typeof STRINGS[lang][key], typeof STRINGS.en[key], `${lang}.${key} has the wrong type`);
    }
  }
});

test('Latin American overrides only use known keys', () => {
  for (const key of Object.keys(STRINGS['es-419'])) assert.ok(key in STRINGS.en, key);
});

test('step lists have the same number of steps in every language', () => {
  for (const key of ['routineSteps', 'goodToKnowSteps', 'gettingStartedSteps', 'features']) {
    const n = STRINGS.en[key].length;
    for (const locale of LOCALES) assert.equal(translate(locale, key).length, n, `${locale}.${key}`);
  }
});

test('resolveLocale follows the user choice, then the phone languages', () => {
  assert.equal(resolveLocale('ja', ['en-US']), 'ja');
  assert.equal(resolveLocale('auto', ['ja-JP', 'en-US']), 'ja');
  assert.equal(resolveLocale('auto', ['es-ES']), 'es-ES');
  assert.equal(resolveLocale('auto', ['es-MX']), 'es-419');
  assert.equal(resolveLocale('auto', ['es-419']), 'es-419');
  assert.equal(resolveLocale('auto', ['he-IL', 'en-GB']), 'he');
  assert.equal(resolveLocale('auto', ['iw-IL']), 'he');
  assert.equal(resolveLocale('auto', ['fr-CA']), 'fr');
  assert.equal(resolveLocale('auto', ['de-AT']), 'de');
  assert.equal(resolveLocale('auto', ['pt-PT']), 'pt-BR');
  assert.equal(resolveLocale('auto', ['ko-KR']), 'ko');
  assert.equal(resolveLocale('auto', ['ru-RU', 'it-IT']), 'it');
  assert.equal(resolveLocale('auto', ['ru-RU']), 'en');
  assert.equal(resolveLocale('auto', []), 'en');
});

test('lookup falls back from region to base language', () => {
  assert.equal(translate('es-419', 'addList'), 'Agregar lista');
  assert.equal(translate('es-ES', 'addList'), 'Añadir lista');
  assert.equal(translate('es-419', 'notes'), 'Notas');
  assert.equal(translate('ja', 'noteCount', 6), '6件のメモ');
  assert.equal(translate('ko', 'noteCount', 6), '메모 6개');
});

test('Hebrew puts a hyphen before Latin words after a prefix letter', () => {
  assert.match(translate('he', 'legal', translate('he', 'googlePlayAccount')), /יחויב בחשבון Google Play/);
  assert.match(translate('he', 'legal', 'Google Play'), /יחויב ב-Google Play/);
});

test('every language has its own built-in lists with the same ids', () => {
  const ids = listSet('en').lists.map((l) => l.id);
  for (const locale of LOCALES) {
    const set = listSet(locale);
    assert.deepEqual(set.lists.map((l) => l.id), ids, locale);
    assert.equal(set.decoys.length, listSet('en').decoys.length, locale);
    for (const list of set.lists) {
      assert.ok(list.items.includes(list.force), `${locale}/${list.id}: force word in list`);
      assert.equal(new Set(list.items.map((w) => w.toLowerCase())).size, list.items.length, `${locale}/${list.id}: unique`);
    }
  }
  assert.notDeepEqual(listSet('es-ES').lists[1].items, listSet('es-419').lists[1].items, 'Spain and Latin America differ');
  for (const locale of LOCALES.filter((l) => l !== 'en')) {
    assert.notEqual(listSet(locale), listSet('en'), `${locale} has its own lists, not the English fallback`);
  }
});
