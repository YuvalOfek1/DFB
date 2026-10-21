// App-wide settings to fill in before publishing.
export const CONFIG = {
  // RevenueCat public SDK keys (Project settings → API keys). These are meant to ship inside the app.
  revenueCatKeys: {
    ios: '', // appl_...
    android: '', // goog_...
  },
  // RevenueCat entitlement unlocked by both plans (monthly subscription and lifetime purchase).
  // The tricks only work with it; without it the app shows its home screen (demos, how-to, paywall).
  // A single trick can later be sold on its own as `trick_<id>` without code changes.
  allAccessEntitlement: 'all_access',
  // Tricks shown on the home screen: a demo video bundled with the app (media/) and its cover image.
  tricks: [{ id: 'notes', video: 'media/notes-demo.mp4', poster: 'media/notes-demo.jpg' }],
  // Required on the paywall by Apple and Google.
  termsUrl: 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/',
  privacyUrl: '',
};
