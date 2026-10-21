# Foldwise

Magic tricks hidden in ordinary-looking apps. The first trick looks exactly like the iPhone Notes app: each note is a numbered list, a spectator names any number, and the word you predicted is secretly placed at that position.

The store apps (iOS and Android) are branded **Foldwise**; the web version keeps the "Notes" name and icon as a personal disguise.

**Live:** https://yuvalofek1.github.io/DFB/

## Install

Foldwise is distributed only as the iOS and Android store apps. Until they are published, test with TestFlight on iPhone or the debug APK from CI on Android. The first launch shows a short welcome and getting-started guide.

The GitHub Pages web version is a personal preview for development only (always unlocked, no store features) and will be taken down.

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

- **Free uses, then Foldwise All Access (native apps only):** every user gets 3 free forces on any list (`CONFIG.freeForces`), counted per force. Once they are used, tapping a list note opens the paywall instead, so a trick never fails silently in front of spectators. All Access (RevenueCat entitlement `all_access`) comes as a **monthly subscription** or a **lifetime** one-time purchase: the current offering's Monthly and Lifetime packages, both attached to `all_access`. Each trick also checks `trick_<id>`, so single tricks can be sold later. The web version is always unlocked. Rules live in `js/access.js`.
- **Configure before publishing:** `js/config.js` holds the RevenueCat public SDK keys (iOS `appl_…`, Android `goog_…`), the entitlement id, the number of free uses, and the Terms/Privacy links shown on the paywall. With no key set, a native build runs unlocked (development only).
- **App id:** `com.foldwise.app` (`capacitor.config.json`). It can't change after the first store upload.
- **Cloud builds:** `.github/workflows/native.yml` builds a debug Android APK (downloadable from the workflow run) and an iOS Simulator build on every push and pull request. Signed release builds and store upload are the next step.
- **Icons and launch screens:** `python3 scripts/make_icons.py` regenerates the Notes-style web icon, the Foldwise icon for iOS/Android (`icons/foldwise-1024.png` for store listings) and the plain launch screens.

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
- `js/access.js`: what works with and without All Access
- `js/config.js`: keys and links to fill in before publishing
- `scripts/build-web.mjs`: bundles the app into `www/` with esbuild
- `sw.js`: offline cache. **Bump `VERSION` whenever you change a file**, or installed copies keep the old version.
- `scripts/make_icons.py`: regenerates `icons/` (needs Pillow)

Pushing to `main` runs the tests, builds `www/` and deploys it to GitHub Pages (`.github/workflows/pages.yml`).
