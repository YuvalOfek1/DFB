// App-wide settings to fill in before publishing.
export const CONFIG = {
  // RevenueCat public SDK keys (Project settings → API keys). These are meant to ship inside the app.
  revenueCatKeys: {
    ios: '', // appl_...
    android: '', // goog_...
  },
  // RevenueCat entitlements: All Access unlocks every trick. A single trick can later be sold on
  // its own as the entitlement `trick_<id>` (e.g. trick_notes) without code changes.
  allAccessEntitlement: 'all_access',
  // What works without a subscription: the Notes trick with this built-in list and its own force word.
  freeListId: 'celebrities',
  // Required on the paywall by Apple and Google.
  termsUrl: 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/',
  privacyUrl: '',
};
