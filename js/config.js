// App-wide settings to fill in before publishing.
export const CONFIG = {
  // RevenueCat public SDK keys (Project settings → API keys). These are meant to ship inside the app.
  revenueCatKeys: {
    ios: '', // appl_...
    android: '', // goog_...
  },
  // RevenueCat entitlement unlocked by both plans (monthly subscription and lifetime purchase).
  // A single trick can later be sold on its own as `trick_<id>` without code changes.
  allAccessEntitlement: 'all_access',
  // Forces a user can perform before the paywall.
  freeForces: 3,
  // Required on the paywall by Apple and Google.
  termsUrl: 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/',
  privacyUrl: '',
};
