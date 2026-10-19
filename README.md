# DFB — Digital Force Bag

A PWA that looks exactly like the iPhone Notes app. It shows a numbered list of words; a spectator names any number, and your chosen word is secretly placed at that position.

## Performing

1. Open "Notes" from your home screen and tap the **Charades ideas** note (100 celebrities).
2. Let the spectator scroll through the list.
3. Ask them for a number (e.g. "pick a number from 1 to 100").
4. **Tap the empty space below the list.** The keyboard opens and a cursor blinks after the last word, as if you were about to edit the note. Nothing you type appears.
   - Type the number, e.g. `17`, and press **done** → your default force word is now #17.
   - Or type a number and a word, e.g. `17 banana` → "banana" is now #17.
5. Count down to their number together.

If the force word is already in the list, it **swaps** places with the word at that number, so the list still contains exactly the same words they saw. Otherwise it replaces that word.

Tapping **‹ Notes** resets the list to its original order, ready for the next performance.

## Setup screen

**Long-press the big "Notes" title** on the folder screen to change the note title, the default force word and the word list (one per line). Settings are saved on the phone.

## Install on iPhone

1. Open the hosted URL in **Safari**.
2. Share → **Add to Home Screen**. It's already named "Notes" with a Notes-style icon.
3. Open it once while online; after that it works offline.

Tip: put it in your dock in place of the real Notes, or on your first home-screen page.

## Hosting (free)

`.github/workflows/pages.yml` runs the tests and deploys to GitHub Pages on every push to `main`.
Enable it once in **Settings → Pages → Source: GitHub Actions**.
Free GitHub accounts can only use Pages on **public** repos. If you want to keep the repo private, deploy the folder to Netlify, Vercel or Cloudflare Pages instead (all free); it's a static site with no build step.

## Development

```sh
npm test          # unit tests for the force logic (js/force.js)
npm start         # serve on http://localhost:8080
```

- `js/force.js`: pure trick logic (parse the secret input, apply the force)
- `js/app.js`: UI, Notes imitation, hidden settings
- `sw.js`: offline cache. **Bump `VERSION` whenever you change a file**, or installed copies keep the old version.
- `scripts/make_icons.py`: regenerates `icons/` (needs Pillow)
