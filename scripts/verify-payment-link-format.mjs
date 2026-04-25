import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const distDir = path.join(repoRoot, 'dist');
const assetsDir = path.join(distDir, 'assets');

function fail(message) {
  console.error(`verify-payment-links: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(distDir)) {
  fail('dist/ missing. Run `npm run build` first.');
}

const assetFiles = fs.readdirSync(assetsDir).filter((file) => file.endsWith('.js')).sort();
if (assetFiles.length === 0) {
  fail('no JavaScript bundle found in dist/assets/.');
}

const bundlePath = path.join(assetsDir, assetFiles[assetFiles.length - 1]);
const bundle = fs.readFileSync(bundlePath, 'utf8');

const requiredTokens = ['$(server-name)', '$(mac)', '$(ip)', '$(link-status-esc)', 'https://tpay.mikhmoai.com/buy-ticketmomo'];
const forbiddenTokens = [
  '%24%28server-name%29',
  '%24%28mac%29',
  '%24%28ip%29',
  '%24%28link-status-esc%29',
];

for (const token of requiredTokens) {
  if (!bundle.includes(token)) {
    fail(`missing required token in bundle: ${token}`);
  }
}

for (const token of forbiddenTokens) {
  if (bundle.includes(token)) {
    fail(`encoded token still present in bundle: ${token}`);
  }
}

console.log(`verify-payment-links: ok (${path.basename(bundlePath)})`);
