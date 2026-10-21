# Mindfold

Magic tricks hidden in ordinary-looking apps. The first trick looks exactly like the iPhone Notes app: each note is a numbered list, a spectator names any number, and the word you predicted is secretly placed at that position.

The store apps (iOS and Android) are branded **Mindfold**; the web version keeps the "Notes" name and icon as a personal disguise.

**Live:** https://yuvalofek1.github.io/DFB/

## Install on iPhone

1. Open the link in **Safari**.
2. Share → **Add to Home Screen**. It's already named "Notes" with a Notes-style icon.
3. Open it once while online; after that it works offline.

The first launch shows a short welcome guide.

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

## Store apps (iOS & Android)

The app is wrapped with [Capacitor](https://capacitorjs.com): the same code runs as the web app and inside the native `ios/` and `android/` projects. Subscriptions are handled by [RevenueCat](https://www.revenuecat.com).

- **Mindfold All Access (native apps only):** one monthly subscription, RevenueCat entitlement `all_access`, unlocks every list, force-word choice, custom lists and every future trick. Without it, the Notes trick works with the free Celebrities list and its own force word; other lists open the paywall. Each trick also checks its own entitlement (`trick_<id>`), so single tricks can be sold later without code changes. The web version is always unlocked. Rules live in `js/access.js`.
- **Configure before publishing:** `js/config.js` holds the RevenueCat public SDK keys (iOS `appl_…`, Android `goog_…`), the entitlement id, the free list, and the Terms/Privacy links shown on the paywall. With no key set, a native build runs unlocked (development only).
- **App id:** `com.mindfold.app` (`capacitor.config.json`). It can't change after the first store upload.
- **Cloud builds:** `.github/workflows/native.yml` builds a debug Android APK (downloadable from the workflow run) and an iOS Simulator build on every push and pull request. Signed release builds and store upload are the next step.
- **Icons and launch screens:** `python3 scripts/make_icons.py` regenerates the Notes-style web icon, the Mindfold icon for iOS/Android (`icons/mindfold-1024.png` for store listings) and the plain launch screens.

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
