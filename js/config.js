// App-wide settings to fill in before publishing.
export const CONFIG = {
  // Store app id (capacitor.config.json); used for the Google Play subscriptions link.
  appId: 'com.yuvalofek.foldwise',
  // RevenueCat public SDK keys (Project settings → API keys). These are meant to ship inside the app.
  // With no key for the platform, a native build runs unlocked (development only).
  revenueCatKeys: {
    ios: 'appl_WAcxLsEQWmFpBSFwECpmTZvxkAg',
    android: '', // goog_...
  },
  // RevenueCat Test Store key (simulated purchases). RevenueCat deliberately crashes any Release
  // build configured with it, and TestFlight and store builds are always Release, so it's only used
  // when useTestStore is switched on for a Debug run from Xcode or Android Studio.
  revenueCatTestKey: 'test_uZjDYixnPvvlDwFBATsazkbzBJO',
  useTestStore: false,
  // RevenueCat entitlement unlocked by both plans (Monthly subscription and Lifetime purchase).
  // The tricks only work with it; without it the app shows its home screen (tricks, paywall).
  // A single trick can later be sold on its own as `trick_<id>` without code changes.
  allAccessEntitlement: 'com_yuvalofek_foldwise_pro',
  // RevenueCat offering shown to Monthly subscribers who tap Upgrade to Lifetime (Lifetime only).
  // Without it, the current offering's paywall is shown.
  lifetimeUpgradeOffering: 'lifetime_upgrade',
  // Tricks shown on the home screen: a demo video bundled with the app (media/) and its cover image.
  tricks: [{ id: 'notes', video: 'media/notes-demo.mp4', poster: 'media/notes-demo.jpg' }],
};
