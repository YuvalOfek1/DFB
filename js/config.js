// App-wide settings to fill in before publishing.
export const CONFIG = {
  // RevenueCat public SDK keys (Project settings → API keys). These are meant to ship inside the app.
  revenueCatKeys: {
    ios: '', // appl_...
    android: '', // goog_...
  },
  // The RevenueCat entitlement that unlocks the app.
  entitlement: 'pro',
  // Required on the paywall by Apple and Google.
  termsUrl: 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/',
  privacyUrl: '',
};
