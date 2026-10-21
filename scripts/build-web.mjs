// Builds the app into www/: the folder Capacitor bundles into the native apps and GitHub Pages
// serves. js/app.js and its imports (including the Capacitor and RevenueCat packages) are
// bundled into a single module with esbuild; everything else is copied as is.
import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { build } from 'esbuild';

const OUT = 'www';
const STATIC = ['index.html', 'styles.css', 'sw.js', 'manifest.webmanifest', 'icons', 'media'];

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT);
for (const file of STATIC) cpSync(file, `${OUT}/${file}`, { recursive: true });

await build({
  entryPoints: ['js/app.js'],
  outfile: `${OUT}/js/app.js`,
  bundle: true,
  format: 'esm',
  target: ['safari15', 'chrome100'],
  minify: true,
  sourcemap: true,
  logLevel: 'warning',
});
console.log(`Built ${OUT}/`);
