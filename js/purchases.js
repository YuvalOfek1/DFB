// Subscription state via RevenueCat. Only the native iOS/Android apps sell subscriptions;
// the web version (and native builds without a key configured, for development) are unlocked.
import { Capacitor } from '@capacitor/core';
import { Purchases, PURCHASES_ERROR_CODE } from '@revenuecat/purchases-capacitor';
import { CONFIG } from './config.js';

export const isNative = Capacitor.isNativePlatform();
export const platform = Capacitor.getPlatform();

let entitled = !isNative;
let configured = false;
const listeners = new Set();

function apply(customerInfo) {
  const next = !!customerInfo?.entitlements?.active?.[CONFIG.entitlement];
  if (next === entitled) return;
  entitled = next;
  for (const fn of listeners) fn(entitled);
}

export async function init() {
  if (!isNative) return;
  const apiKey = CONFIG.revenueCatKeys[platform];
  if (!apiKey) {
    console.warn(`No RevenueCat key for ${platform}: running unlocked (development only).`);
    entitled = true;
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

export const isEntitled = () => entitled;
export const canPurchase = () => configured;

export function onChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// The package to sell: the current offering's monthly package (or its first one).
export async function getPackage() {
  if (!configured) return null;
  try {
    const offerings = await Purchases.getOfferings();
    const current = offerings?.current;
    return current?.monthly ?? current?.availablePackages?.[0] ?? null;
  } catch (err) {
    console.warn('Could not load offerings', err);
    return null;
  }
}

// Resolves true when the purchase unlocked the app, false if the user cancelled.
export async function purchase(aPackage) {
  try {
    const { customerInfo } = await Purchases.purchasePackage({ aPackage });
    apply(customerInfo);
    return entitled;
  } catch (err) {
    if (err?.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) return false;
    throw err;
  }
}

export async function restore() {
  const { customerInfo } = await Purchases.restorePurchases();
  apply(customerInfo);
  return entitled;
}

export async function managementUrl() {
  if (!configured) return null;
  const { customerInfo } = await Purchases.getCustomerInfo();
  return customerInfo?.managementURL ?? null;
}
