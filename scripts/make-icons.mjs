// Generates favicon and app icons from the theme colors in site.config.ts.
// The mark is a keyhole on the alert color, same as the Logo component.
// Run: npm run icons
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';

const cfg = readFileSync(new URL('../src/config/site.config.ts', import.meta.url), 'utf8');
const pick = (key) => cfg.match(new RegExp('[^A-Za-z]' + key + ": *'(#[0-9A-Fa-f]{6})'"))[1];
const night = pick('night');
const alert = pick('alert');
const name = cfg.match(/name:\s*'([^']+)'/)[1];
const shortName = cfg.match(/shortName:\s*'([^']+)'/)[1];
const lang = cfg.match(/lang:\s*'([^']+)'/)[1];
const dir = cfg.match(/dir:\s*'([^']+)'/)[1];

// pad shrinks the mark for app icons that need a safe zone
const svg = (pad = 0) => {
  const s = (48 - pad * 2) / 48;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <rect width="48" height="48" rx="${pad ? 0 : 10}" fill="${alert}"/>
  <g transform="translate(${pad} ${pad}) scale(${s})">
    <circle cx="24" cy="19" r="7.2" fill="${night}"/>
    <path d="M20.4 22.8h7.2l2.6 14.4H17.8z" fill="${night}"/>
  </g>
</svg>`;
};

writeFileSync('public/favicon.svg', svg());
const out = [
  ['public/favicon-32.png', 32, 0],
  ['public/apple-touch-icon.png', 180, 5],
  ['public/icon-192.png', 192, 5],
  ['public/icon-512.png', 512, 5],
];
for (const [file, size, pad] of out) {
  await sharp(Buffer.from(svg(pad))).resize(size, size).png().toFile(file);
}
writeFileSync('public/site.webmanifest', JSON.stringify({
  name, short_name: shortName, lang, dir, start_url: '/', display: 'standalone',
  background_color: night, theme_color: night,
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
  ],
}, null, 2));
console.log('icons written');
