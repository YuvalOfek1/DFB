# DFB — Digital Force Bag

A PWA that looks exactly like the iPhone Notes app. Each note is a numbered list. A spectator names any number, and the word you predicted is secretly placed at that position.

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

## Development

```sh
npm test          # unit tests (force logic, settings storage/migration)
npm start         # serve on http://localhost:8080
```

- `js/force.js`: pure trick logic (parse the secret input, apply the force)
- `js/lists.js`: built-in lists and the decoy notes
- `js/store.js`: settings shape, validation, and migration from the single-list format
- `js/app.js`: Notes imitation, transitions, secret input
- `js/setup.js`: the hidden Setup sheet
- `sw.js`: offline cache. **Bump `VERSION` whenever you change a file**, or installed copies keep the old version.
- `scripts/make_icons.py`: regenerates `icons/` (needs Pillow)

Pushing to `main` runs the tests and deploys to GitHub Pages (`.github/workflows/pages.yml`).
