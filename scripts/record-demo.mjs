// Records the Notes trick demo (media/notes-demo.mp4) from the built app.
// The overlay (tap markers, number pad, highlight) has no words, so one video works in every language.
//
// Needs Playwright with Chromium, and ffmpeg:
//   npm run build && python3 -m http.server 8092 --directory www &
//   node scripts/record-demo.mjs
//   ffmpeg -f concat -safe 0 -i .demo/frames/list.txt -vf "fps=30,format=yuv420p" \
//     -c:v libx264 -crf 26 -preset slow -movflags +faststart -an media/notes-demo.mp4
import { mkdirSync } from 'node:fs';
import { chromium, devices } from 'playwright';

const OUT = '.demo';
mkdirSync(OUT, { recursive: true });
const b = await chromium.launch();
// First run (not recorded): dismiss the welcome so the recording starts on the notes.
{ const c0 = await b.newContext({ ...devices['iPhone 13'], locale: 'en-US' }); const p0 = await c0.newPage();
  await p0.goto('http://localhost:8092/'); await p0.waitForTimeout(1000);
  await p0.locator('.sheet-nav-btn').last().click(); await p0.waitForTimeout(600);
  await c0.storageState({ path: OUT + '/state.json' }); await c0.close(); }
const ctx = await b.newContext({ ...devices['iPhone 13'], viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'en-US', storageState: OUT + '/state.json' });
const p = await ctx.newPage();
await p.goto('http://localhost:8092/'); await p.waitForTimeout(800);
const fs = await import('node:fs');
// Capture full-resolution screenshots continuously; each frame keeps its real time.
const frames = [];
let capturing = true;
const capture = (async () => {
  while (capturing) {
    const t = performance.now() / 1000;
    const data = await p.screenshot({ type: 'jpeg', quality: 88 });
    frames.push({ t, data });
  }
})();

// Demo overlay (only in the recording): tap ripples and a number pad, no words so it works in every language
await p.evaluate(() => {
  const css = document.createElement('style');
  css.textContent = `
    .demo-tap { position: fixed; width: 54px; height: 54px; margin: -27px 0 0 -27px; border-radius: 50%; background: rgba(120,120,128,.45); border: 2px solid rgba(255,255,255,.9); z-index: 99; pointer-events: none; animation: demo-tap .7s ease-out forwards; }
    @keyframes demo-tap { from { transform: scale(.4); opacity: 1 } to { transform: scale(1.4); opacity: 0 } }
    .demo-pad { position: fixed; left: 0; right: 0; bottom: 0; z-index: 98; background: #d1d3d9; padding: 8px 6px 28px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; transform: translateY(100%); transition: transform .35s cubic-bezier(.32,.72,0,1); }
    .demo-pad.up { transform: none; }
    .demo-pad span { background: #fff; border-radius: 6px; height: 46px; display: flex; align-items: center; justify-content: center; font: 500 25px -apple-system, sans-serif; color: #000; box-shadow: 0 1px 0 rgba(0,0,0,.35); transition: background .15s; }
    .demo-pad span.on { background: #aeb3be; }
    .demo-pad span.blank { background: transparent; box-shadow: none; }
    .demo-row { position: absolute; left: 0; right: 0; background: rgba(255,214,10,.35); border-radius: 6px; pointer-events: none; transition: opacity .4s; }`;
  document.head.append(css);
  const pad = document.createElement('div'); pad.className = 'demo-pad';
  for (const k of ['1','2','3','4','5','6','7','8','9','','0','']) { const s = document.createElement('span'); s.textContent = k; if (!k) s.className = 'blank'; s.dataset.k = k; pad.append(s); }
  document.body.append(pad);
  window.demoTap = (x, y) => { const d = document.createElement('div'); d.className = 'demo-tap'; d.style.left = x + 'px'; d.style.top = y + 'px'; document.body.append(d); setTimeout(() => d.remove(), 800); };
  window.demoPad = (up) => pad.classList.toggle('up', up);
  window.demoKey = (k) => { const s = pad.querySelector('[data-k="' + k + '"]'); s.classList.add('on'); setTimeout(() => s.classList.remove('on'), 180); };
});
const tap = async (locator) => { const bx = await locator.boundingBox(); const x = bx.x + Math.min(120, bx.width / 2), y = bx.y + bx.height / 2; await p.evaluate(([x, y]) => window.demoTap(x, y), [x, y]); await p.waitForTimeout(150); await locator.tap({ position: { x: Math.min(120, bx.width / 2), y: bx.height / 2 } }); };
const scroll = async (dy, steps = 30) => { for (let i = 0; i < steps; i++) { await p.evaluate((d) => document.getElementById('note-scroll').scrollBy(0, d), dy / steps); await p.waitForTimeout(16); } };
await p.waitForTimeout(900);
await tap(p.locator('.cell', { hasText: 'Celebrities' })); await p.waitForTimeout(1000);
// The spectator browses the list
await scroll(900, 70); await p.waitForTimeout(400); await scroll(-900, 60); await p.waitForTimeout(1200);
// Secret entry: tap the note, type 18, tap again
await tap(p.locator('#note-body li').nth(4)); await p.evaluate(() => window.demoPad(true)); await p.waitForTimeout(700);
for (const k of ['1', '8']) { await p.evaluate((k) => window.demoKey(k), k); await p.keyboard.type(k); await p.waitForTimeout(450); }
await p.waitForTimeout(300);
await p.evaluate(() => window.demoPad(false)); await tap(p.locator('#note-body li').nth(8)); await p.waitForTimeout(1000);
// The reveal: scroll to 18 and highlight it
const row = p.locator('#note-body li').nth(17);
const target = await row.evaluate((li) => li.getBoundingClientRect().top - 330);
await scroll(target, 45); await p.waitForTimeout(300);
await row.evaluate((li) => { li.parentElement.style.position = 'relative'; const h = document.createElement('div'); h.className = 'demo-row'; h.style.top = (li.offsetTop - 2) + 'px'; h.style.height = (li.offsetHeight + 4) + 'px'; li.parentElement.append(h); });
console.log('#18 =', await row.textContent());
await p.waitForTimeout(2600);
capturing = false; await capture;
// Write frames and an ffmpeg concat list with each frame's real duration
fs.mkdirSync(OUT + '/frames', { recursive: true });
let list = '';
frames.forEach((f, i) => {
  const name = 'f' + String(i).padStart(5, '0') + '.jpg';
  fs.writeFileSync(OUT + '/frames/' + name, f.data);
  const dur = i + 1 < frames.length ? frames[i + 1].t - f.t : 0.5;
  list += "file '" + name + "'\nduration " + dur.toFixed(4) + "\n";
});
list += "file 'f" + String(frames.length - 1).padStart(5, '0') + ".jpg'\n";
fs.writeFileSync(OUT + '/frames/list.txt', list);
console.log('frames:', frames.length, 'seconds:', (frames.at(-1).t - frames[0].t).toFixed(1));
await ctx.close(); await b.close();
