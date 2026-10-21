// Subscription state via RevenueCat. Only the native iOS/Android apps sell the subscription;
// the web version (and native builds without a key configured, for development) are unlocked.
import { Capacitor } from '@capacitor/core';
import { Purchases, PURCHASES_ERROR_CODE } from '@revenuecat/purchases-capacitor';
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

export async function init() {
  if (!isNative) return;
  const apiKey = CONFIG.revenueCatKeys[platform];
  if (!apiKey) {
    console.warn(`No RevenueCat key for ${platform}: running unlocked (development only).`);
    active = new Set([CONFIG.allAccessEntitlement]);
    return;
  }
  try {
    await Purchases.configure({ apiKey });
    configured = true;
    await Purchases.addCustomerInfoUpdateListener((info) => apply(info));
    const { customerInfo } = await Purchases.getCustomerInfo();
    apply(customerInfo);
  } catch (err) {
    console.warn('RevenueCat init failed', err);
  }
}

export const hasAllAccess = () => active.has(CONFIG.allAccessEntitlement);
// A trick is unlocked by All Access or by buying that trick alone.
export const isTrickUnlocked = (trickId) => hasAllAccess() || active.has(`trick_${trickId}`);
export const canPurchase = () => configured;

export function onChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// The plans to sell, from RevenueCat's current offering: its Monthly and Lifetime packages.
// Either can be null if it isn't set up in RevenueCat.
export async function getPlans() {
  if (!configured) return { monthly: null, lifetime: null };
  try {
    const offerings = await Purchases.getOfferings();
    const current = offerings?.current;
    return { monthly: current?.monthly ?? null, lifetime: current?.lifetime ?? null };
  } catch (err) {
    console.warn('Could not load offerings', err);
    return { monthly: null, lifetime: null };
  }
}

// Resolves true when the purchase unlocked the app, false if the user cancelled.
export async function purchase(aPackage) {
  try {
    const { customerInfo } = await Purchases.purchasePackage({ aPackage });
    apply(customerInfo);
    return hasAllAccess();
  } catch (err) {
    if (err?.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) return false;
    throw err;
  }
}

export async function restore() {
  const { customerInfo } = await Purchases.restorePurchases();
  apply(customerInfo);
  return hasAllAccess();
}

export async function managementUrl() {
  if (!configured) return null;
  const { customerInfo } = await Purchases.getCustomerInfo();
  return customerInfo?.managementURL ?? null;
}
