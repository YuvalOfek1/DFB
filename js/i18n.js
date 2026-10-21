// Interface text in every supported language. The Notes disguise uses the wording iOS itself shows in
// that language, so a spectator sees exactly what their own phone would show.
//
// Lookup order: exact locale (es-ES, es-419) → base language (es) → English.
// A value is a string, or a function taking parameters (counts, names, prices).

import en from './locales/en.js';
import es from './locales/es.js';
import es419 from './locales/es-419.js';
import ja from './locales/ja.js';
import he from './locales/he.js';
import fr from './locales/fr.js';
import de from './locales/de.js';
import ptBR from './locales/pt-BR.js';
import it from './locales/it.js';
import ko from './locales/ko.js';

export const LOCALES = ['en', 'es-ES', 'es-419', 'fr', 'de', 'it', 'pt-BR', 'he', 'ja', 'ko'];

// Languages written right to left; the whole interface mirrors, as iOS does.
export const isRTL = (locale) => locale === 'he';

export const LANGUAGE_NAMES = {
  en: 'English',
  'es-ES': 'Español (España)',
  'es-419': 'Español (Latinoamérica)',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  'pt-BR': 'Português (Brasil)',
  he: 'עברית',
  ja: '日本語',
  ko: '한국어',
};

// `preference` is the user's choice ('auto' or a locale); `languages` is navigator.languages.
export function resolveLocale(preference, languages = []) {
  if (LOCALES.includes(preference)) return preference;
  for (const raw of languages) {
    const lang = String(raw).toLowerCase();
    if (lang === 'es-es') return 'es-ES';
    if (lang.startsWith('es')) return 'es-419';
    if (lang.startsWith('pt')) return 'pt-BR'; // Portugal falls back to Brazilian Portuguese
    if (lang.startsWith('he') || lang.startsWith('iw')) return 'he'; // "iw" is the old code for Hebrew
    const base = lang.split(/[-_]/)[0];
    if (['en', 'fr', 'de', 'it', 'ja', 'ko'].includes(base)) return base;
  }
  return 'en';
}

export const STRINGS = { en, es, 'es-419': es419, ja, he, fr, de, 'pt-BR': ptBR, it, ko };

let current = 'en';

export function setLocale(locale) {
  current = LOCALES.includes(locale) ? locale : 'en';
}

export const getLocale = () => current;

export function translate(locale, key, ...args) {
  const base = locale.split('-')[0];
  const value = STRINGS[locale]?.[key] ?? STRINGS[base]?.[key] ?? en[key];
  if (value === undefined) throw new Error(`Missing string: ${key}`);
  return typeof value === 'function' ? value(...args) : value;
}

export const t = (key, ...args) => translate(current, key, ...args);
