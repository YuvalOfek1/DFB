// Home-screen icon (Setup → App Icon), native apps only: Foldwise or one of our own notepad
// designs. Backed by AppIconPlugin on iOS (alternate icons) and Android (launcher aliases).
import { registerPlugin } from '@capacitor/core';
import { isNative } from './purchases.js';

const AppIcon = registerPlugin('AppIcon');

export const ICONS = ['Foldwise', 'LegalPad', 'IndexCard', 'StickyNote'];
export const supported = isNative;

export async function current() {
  try {
    const { name } = await AppIcon.getName();
    return name ? name.replace('AppIcon-', '') : 'Foldwise';
  } catch {
    return 'Foldwise';
  }
}

export function set(icon) {
  return AppIcon.setName(icon === 'Foldwise' ? {} : { name: `AppIcon-${icon}` });
}
