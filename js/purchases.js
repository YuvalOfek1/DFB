// Purchases via RevenueCat. Only the native iOS/Android apps sell Foldwise All Access; the web
// version is always unlocked. The plans screen is RevenueCat's Paywall (designed in the dashboard,
// shown for the current offering) and "Manage Subscription" is its Customer Center.
import { Capacitor } from '@capacitor/core';
import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor';
import { RevenueCatUI, PAYWALL_RESULT } from '@revenuecat/purchases-capacitor-ui';
import { CONFIG } from './config.js';

export const isNative = Capacitor.isNativePlatform();
export const platform = Capacitor.getPlatform();

// The last known entitlements and plan are kept on the phone, so a subscriber opens straight into
// the trick (no flash of the locked screen while RevenueCat answers) and stays unlocked with no signal.
const CACHE_KEY = 'foldwise.entitlements';
const PLAN_KEY = 'foldwise.plan';

function cached(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

let active = new Set(isNative ? cached(CACHE_KEY, []) : [CONFIG.allAccessEntitlement]); // active entitlement ids
// How All Access is held: 'subscription' (Monthly, it expires and renews), 'lifetime' (bought
// once, no expiry) or null.
let plan = isNative ? cached(PLAN_KEY, null) : null;
// Whether a subscription is still renewing. Someone who bought Lifetime while on Monthly keeps
// paying for Monthly until they cancel it.
let renewing = false;
let configured = false;
const listeners = new Set();

function apply(customerInfo) {
  const entitlements = customerInfo?.entitlements?.active ?? {};
  const next = new Set(Object.keys(entitlements));
  const access = entitlements[CONFIG.allAccessEntitlement];
  const nextPlan = access ? (access.expirationDate ? 'subscription' : 'lifetime') : null;
  // A cancelled subscription stays active until its period ends, but no longer renews.
  const nextRenewing = Object.values(customerInfo?.subscriptionsByProductIdentifier ?? {})
    .some((sub) => sub.isActive && sub.willRenew);
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify([...next]));
    localStorage.setItem(PLAN_KEY, JSON.stringify(nextPlan));
  } catch { /* ignore */ }
  if ([...next].sort().join() === [...active].sort().join() && nextPlan === plan && nextRenewing === renewing) return;
  active = next;
  plan = nextPlan;
  renewing = nextRenewing;
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

// Settles once RevenueCat has answered at launch (including a fresh install's sync), so the paywall
// isn't offered to someone whose existing purchase is still being found.
let markReady;
export const ready = new Promise((resolve) => { markReady = resolve; });

export function init() {
  return start().finally(markReady);
}

async function start() {
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
    await syncOnFreshInstall();
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

// A fresh install starts as a new anonymous RevenueCat customer, so someone who reinstalls or moves
// to a new phone would see the paywall and could pay twice. Once per install, if the app opens
// locked, hand the store account's existing purchases to RevenueCat; unlike Restore, this doesn't
// ask the user to sign in.
const SYNCED_KEY = 'foldwise.synced';
async function syncOnFreshInstall() {
  if (hasAllAccess() || cached(SYNCED_KEY, false)) return;
  try {
    localStorage.setItem(SYNCED_KEY, 'true');
  } catch { /* ignore */ }
  try {
    await Purchases.syncPurchases();
    await refresh();
  } catch (err) {
    console.warn('Could not sync existing purchases', err);
  }
}

export const hasAllAccess = () => active.has(CONFIG.allAccessEntitlement);
export const currentPlan = () => plan;
// Owns Lifetime but a monthly subscription still renews: it should be cancelled.
export const hasRedundantSubscription = () => plan === 'lifetime' && renewing;
// A trick is unlocked by All Access or by buying that trick alone.
export const isTrickUnlocked = (trickId) => hasAllAccess() || active.has(`trick_${trickId}`);

export function onChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Shows the RevenueCat Paywall for an offering: the current one (Monthly and Lifetime), or another
// by id, such as the Lifetime-only upgrade offer (falling back to the current one if it doesn't
// exist). Resolves 'unlocked' after a purchase or restore that grants All Access (the onChange
// listeners have run by then), 'closed' if dismissed, or 'unavailable' if it couldn't be shown
// (no connection, RevenueCat not set up, or no offering yet).
export async function presentPaywall(offeringId) {
  if (!configured) return 'unavailable';
  try {
    let offering;
    if (offeringId) {
      try {
        offering = (await Purchases.getOfferings()).all?.[offeringId];
      } catch { /* the current offering will do */ }
    }
    const { result } = await RevenueCatUI.presentPaywall({ displayCloseButton: true, ...(offering ? { offering } : {}) });
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

// Why the paywall can't be shown, in RevenueCat's own words (offerings are what it renders), so the
// message can name the setup step that's missing. Empty when nothing looks wrong.
export async function paywallProblem() {
  if (!configured) return 'RevenueCat is not configured.';
  try {
    const { current } = await Purchases.getOfferings();
    if (!current) return 'RevenueCat has no current offering.';
    if (!current.availablePackages?.length) return `The offering "${current.identifier}" has no products for this store.`;
    return '';
  } catch (err) {
    const code = err?.readableErrorCode ?? err?.code ?? '';
    return [code, err?.message, err?.underlyingErrorMessage].filter(Boolean).join(' · ');
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
