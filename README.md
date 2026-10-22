# Foldwise

Magic tricks hidden in ordinary-looking apps. The first trick looks exactly like the iPhone Notes app: each note is a numbered list, a spectator names any number, and the word you predicted is secretly placed at that position.

The store apps (iOS and Android) are branded **Foldwise**; the web version keeps the "Notes" name and icon as a personal disguise.

**Live:** https://yuvalofek1.github.io/DFB/

## Install

Foldwise is distributed only as the iOS and Android store apps. Until they are published, test with TestFlight on iPhone or the debug APK from CI on Android. The first launch shows a short welcome and getting-started guide.

The GitHub Pages web version is a personal preview for development only (always unlocked, no store features) and will be taken down. GitHub Pages must keep serving `legal/` (the Privacy Policy and Terms of Use the apps and store listings link to).

## Performing

1. Write the force word of the list you'll use as your prediction.
2. Open the note and let the spectator scroll through it.
3. Ask for a number within the length of the list.
4. While they look at the prediction, **tap anywhere on the note**. The number pad opens but nothing you type appears. Type their number, then **tap the note again**.
   - To force a different word on the spot, **long-press** instead: the letter keyboard opens; type `17 banana` and press return.
5. Scroll to their number and let them read the item out loud.

If the force word is already in the list, it **swaps** places with the item at that number, so the list still contains exactly the same items. Otherwise it replaces that item. Going back (button or swipe from the left edge) restores the original order.

## Setup

**Long-press the big "Notes" title** to open Setup:

- **Lists**: each list is its own note. Built in: Celebrities (100 celebrities), Movie night (100 movies), Travel bucket list (60 countries), Pictionary ideas (30 objects).
- Per list: title, items (one per line), **force word** (pick from the list or type any word), and whether it shows in Notes.
- Add your own lists, delete lists, or restore the defaults.
- **How to Perform** and **Install & Welcome** guides.

Settings are stored on the phone only.

## Languages

English, Spanish (Spain `es-ES` and Latin America `es-419`), French, German, Italian, Portuguese (Brazil, also used for Portugal), Hebrew, Japanese and Korean. **Automatic** (default) follows the phone, so the disguise always matches the real Notes app; any other phone language falls back to English. Setup → Language overrides it and offers that language's built-in lists.

- `js/locales/<language>.js`: every interface string, one file per language for easy native review, including the Notes disguise wording iOS uses in that language. A test fails if any language is missing a key.
- **Hebrew is right to left**: the whole interface mirrors as iOS does (back button and numbers on the right, notes slide in from the left, swipe back from the right edge).
- `scripts/lists_data.py` → `python3 scripts/build_lists.py` → `js/lists.js`: built-in lists and decoy notes per language, chosen per culture (local celebrities and films, local release titles), validated for size, duplicates and force words.
- Japanese input: full-width digits/spaces are normalized, and the return that confirms Japanese characters doesn't submit the force.
- `store/listings.json`: App Store / Google Play name, subtitle, keywords and description per locale (within each store's limits).
- Before launch, have a native speaker of each language review its locale file, lists and listing; the Notes disguise words in particular must match what iOS shows.

## Store apps (iOS & Android)

The app is wrapped with [Capacitor](https://capacitorjs.com): the same code runs as the web app and inside the native `ios/` and `android/` projects. Subscriptions are handled by [RevenueCat](https://www.revenuecat.com).

- **Paid only (native apps):** the tricks work only with Foldwise All Access (RevenueCat entitlement `com_yuvalofek_foldwise_pro`), sold as a **Monthly** subscription or a **Lifetime** one-time purchase, both packages of the current offering. Without it, the app opens on its **home screen** instead of the disguise: the tricks list, where each trick shows only what the audience experiences (never the method), language and Restore Purchases. **Unlock Foldwise** presents the **RevenueCat Paywall** designed in the dashboard (`@revenuecat/purchases-capacitor-ui`), and **Manage Subscription** presents the **Customer Center**, falling back to the store's subscriptions page. Each trick's demo video and How to Perform are for subscribers, under Setup → Help. The last known access is kept on the phone, so subscribers open straight into the disguise with no flash and stay unlocked offline. Each trick also checks `trick_<id>`, so single tricks can be sold later. The web version is always unlocked.
- **Configure before publishing:** `js/config.js` holds the RevenueCat public SDK keys (iOS `appl_…`, Android `goog_…`) and the entitlement id. With no key for its platform, a native build runs unlocked (development only), and the TestFlight workflow warns about it. The RevenueCat **Test Store** key is there too, but only for Debug runs from Xcode or Android Studio (`useTestStore: true`): RevenueCat deliberately crashes Release builds configured with it, so the TestFlight workflow refuses to build with it on. The paywall, including its Terms of Use and Privacy Policy links (`legal/` on GitHub Pages), is set up in the RevenueCat dashboard.
- **App id:** `com.yuvalofek.foldwise` (`capacitor.config.json`). It can't change after the first store upload.
- **Cloud builds:** `.github/workflows/native.yml` builds a debug Android APK (downloadable from the workflow run) and an iOS Simulator build on every push and pull request. Signed release builds and store upload are the next step.
- **App Store setup:** `.github/workflows/app-store.yml` (run by hand from the Actions tab; `plan` only shows changes, `apply` makes them) uses the [asc](https://github.com/rudrankriyam/App-Store-Connect-CLI) CLI with the secrets `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_PRIVATE_KEY` and the variable `ASC_APP_ID`. `products` runs `scripts/asc/products.sh`: the app is free in every territory, `com.yuvalofek.foldwise.allaccess.monthly` costs $4.99/month with no trial and `com.yuvalofek.foldwise.lifetime` costs $29.99 once, with `store/review/paywall.png` as the App Review screenshot. `metadata` pushes the store listing in every language from `store/listings.json` (`scripts/asc/build_metadata.py`), linking the pages in `legal/` (support, privacy, terms).
- **TestFlight:** `.github/workflows/testflight.yml` (run by hand) archives a signed iOS release on a macOS runner and uploads it to TestFlight for the `Internal Testers` group. Signing is automatic through the same App Store Connect API key, the team comes from the bundle ID, and the build number is the run number. `Info.plist` declares no non-exempt encryption, so builds skip the export-compliance question.
- **App icon choice (Setup → App Icon, native only):** Foldwise or one of three original notepad designs (Legal Pad, Index Card, Sticky Note), none resembling Apple's Notes icon. The user picks one and can always go back to Foldwise (App Store guideline 4.6), and the app name stays Foldwise. iOS uses alternate icon sets (`ASSETCATALOG_COMPILER_ALTERNATE_APPICON_NAMES`); Android uses one launcher `activity-alias` per icon. Both are switched by the app's own `AppIconPlugin` (Swift, registered in `MainViewController`; Java, registered in `MainActivity`), used from `js/appicon.js`.
- **Icons and launch screens:** `python3 scripts/make_icons.py` regenerates the Notes-style web icon, the Foldwise icon and the alternate icons for iOS/Android (`icons/foldwise-1024.png` for store listings) and the plain launch screens.

Native workflow:

```sh
npm run sync      # build www/ and copy it into ios/ and android/
npm run android   # sync, then open Android Studio
npm run ios       # sync, then open Xcode (macOS)
```

## Development

```sh
npm install
npm test          # unit tests (force logic, settings storage/migration)
npm start         # build www/ and serve it on http://localhost:8080
```

- `js/force.js`: pure trick logic (parse the secret input, apply the force)
- `js/lists.js`: built-in lists and the decoy notes
- `js/store.js`: settings shape, validation, and migration from the single-list format
- `js/app.js`: Notes imitation, transitions, secret input
- `js/setup.js`: the hidden Setup sheet and the paywall
- `js/purchases.js`: RevenueCat subscription state
- `scripts/record-demo.mjs`: records a trick's demo video from the built app (wordless overlay, so one video serves every language)
- `media/`: demo videos and their cover images, bundled into the apps
- `js/config.js`: keys and links to fill in before publishing
- `scripts/build-web.mjs`: bundles the app into `www/` with esbuild
- `sw.js`: offline cache. **Bump `VERSION` whenever you change a file**, or installed copies keep the old version.
- `scripts/make_icons.py`: regenerates `icons/` (needs Pillow)

Pushing to `main` runs the tests, builds `www/` and deploys it to GitHub Pages (`.github/workflows/pages.yml`).
