// The Terms of Use and Privacy Policy in the app's language. Latin America shares the Spanish text.
import { getLocale } from '../i18n.js';
import en from './en.js';
import es from './es.js';
import fr from './fr.js';
import de from './de.js';
import it from './it.js';
import ptBR from './pt-BR.js';
import he from './he.js';
import ja from './ja.js';
import ko from './ko.js';

export const LEGAL = { en, es, fr, de, it, 'pt-BR': ptBR, he, ja, ko };

// `kind` is 'terms' or 'privacy'.
export function legalText(kind, locale = getLocale()) {
  return (LEGAL[locale] ?? LEGAL[locale.split('-')[0]] ?? en)[kind];
}
