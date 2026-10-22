// Purchases via RevenueCat. Only the native iOS/Android apps sell Foldwise All Access; the web
// version is always unlocked. The plans screen is RevenueCat's Paywall (designed in the dashboard,
// shown for the current offering) and "Manage Subscription" is its Customer Center.
import { Capacitor } from '@capacitor/core';
import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor';
import { RevenueCatUI, PAYWALL_RESULT } from '@revenuecat/purchases-capacitor-ui';
import { CONFIG } from './config.js';

export const isNative = Capacitor.isNativePlatform();
export const platform = Capacitor.getPlatform();

// The last known entitlements are kept on the phone, so a subscriber opens straight into the trick
// (no flash of the locked screen while RevenueCat answers) and stays unlocked with no signal.
const CACHE_KEY = 'foldwise.entitlements';

function cachedEntitlements() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) ?? [];
  } catch {
    return [];
  }
}

let active = new Set(isNative ? cachedEntitlements() : [CONFIG.allAccessEntitlement]); // active entitlement ids
let configured = false;
const listeners = new Set();

function apply(customerInfo) {
  const next = new Set(Object.keys(customerInfo?.entitlements?.active ?? {}));
  try { localStorage.setItem(CACHE_KEY, JSON.stringify([...next])); } catch { /* ignore */ }
  if ([...next].sort().join() === [...active].sort().join()) return;
  active = next;
  for (const fn of listeners) fn();
}

// Asks RevenueCat for the latest customer info; the cached entitlements stand if it can't answer.
async function refresh() {
  try {
    const { customerInfo } = await Purchases.getCustomerInfo();
    apply(customerInfo);
  } catch (err) {
    console.warn('Could not refresh customer info', err);
  }
}

// The Test Store key when switched on for a Debug run (it crashes Release builds), else the
// store's key for this platform.
const apiKey = () => (CONFIG.useTestStore ? CONFIG.revenueCatTestKey : CONFIG.revenueCatKeys[platform]);

export async function init() {
  if (!isNative) return;
  if (!apiKey()) {
    console.warn(`No RevenueCat key for ${platform}: running unlocked (development only).`);
    active = new Set([CONFIG.allAccessEntitlement]);
    return;
  }
  try {
    await Purchases.setLogLevel({ level: LOG_LEVEL.WARN });
    await Purchases.configure({ apiKey: apiKey() });
    configured = true;
    if (uiLocale) await Purchases.overridePreferredUILocale({ locale: uiLocale });
    await Purchases.addCustomerInfoUpdateListener((info) => apply(info));
    await refresh();
  } catch (err) {
    console.warn('RevenueCat init failed', err);
  }
}

// RevenueCat's Paywall and Customer Center follow the app's language (Setup → Language): the chosen
// locale, or null for the phone's.
let uiLocale = null;
export function setUILocale(locale) {
  uiLocale = locale;
  if (configured) Purchases.overridePreferredUILocale({ locale }).catch((err) => console.warn('Could not set the paywall language', err));
}

export const hasAllAccess = () => active.has(CONFIG.allAccessEntitlement);
// A trick is unlocked by All Access or by buying that trick alone.
export const isTrickUnlocked = (trickId) => hasAllAccess() || active.has(`trick_${trickId}`);

export function onChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Shows the RevenueCat Paywall for the current offering (Monthly and Lifetime). Resolves
// 'unlocked' after a purchase or restore that grants All Access (the onChange listeners have run
// by then), 'closed' if dismissed, or 'unavailable' if it couldn't be shown (no connection,
// RevenueCat not set up, or no offering yet).
export async function presentPaywall() {
  if (!configured) return 'unavailable';
  try {
    const { result } = await RevenueCatUI.presentPaywall({ displayCloseButton: true });
    if (result === PAYWALL_RESULT.PURCHASED || result === PAYWALL_RESULT.RESTORED) {
      await refresh();
      return hasAllAccess() ? 'unlocked' : 'closed';
    }
    if (result === PAYWALL_RESULT.ERROR || result === PAYWALL_RESULT.NOT_PRESENTED) return 'unavailable';
    return 'closed';
  } catch (err) {
    console.warn('Could not present the paywall', err);
    return 'unavailable';
  }
}

// Customer Center: manage or cancel the subscription, restore, request a refund, contact support.
// Resolves false if it couldn't be shown, so the caller can fall back to the store's own page.
export async function presentCustomerCenter() {
  if (!configured) return false;
  try {
    await RevenueCatUI.presentCustomerCenter();
    await refresh(); // a cancellation or restore may have changed access
    return true;
  } catch (err) {
    console.warn('Could not present the Customer Center', err);
    return false;
  }
}

// Resolves true when this store account has All Access.
export async function restore() {
  const { customerInfo } = await Purchases.restorePurchases();
  apply(customerInfo);
  return hasAllAccess();
}

// The store's own subscriptions page, for when the Customer Center can't be shown.
const STORE_SUBSCRIPTIONS = {
  ios: 'https://apps.apple.com/account/subscriptions',
  android: `https://play.google.com/store/account/subscriptions?package=${CONFIG.appId}`,
};

export async function managementUrl() {
  if (configured) {
    try {
      const { customerInfo } = await Purchases.getCustomerInfo();
      if (customerInfo?.managementURL) return customerInfo.managementURL;
    } catch (err) {
      console.warn('Could not load the management URL', err);
    }
  }
  return STORE_SUBSCRIPTIONS[platform] ?? null;
}
