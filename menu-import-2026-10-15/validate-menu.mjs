// Read-only verification. Run from any working directory using Node.js.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const menu = JSON.parse(fs.readFileSync(path.join(root, 'data/kok-sen-menu-2026-10-15.json'), 'utf8'));
const errors = [];
const ids = new Set();
const assets = new Set();
const names = new Set();
const categories = new Set(menu.categories.map(c => c.id));
const published = menu.items.filter(item => item.publish === true);
const pending = menu.items.filter(item => item.publish !== true);
if (menu.items.length !== 100) errors.push('Expected 100 client photo records.');
if (published.length !== 99) errors.push('Expected 99 initially publishable named entries.');
if (pending.length !== 1 || pending[0]?.id !== 'ks-20261015-032') errors.push('Expected only the unnamed frog photo to remain in review.');
if (menu.price_display !== false) errors.push('Food prices must remain hidden.');
for (const item of menu.items) {
  if (ids.has(item.id)) errors.push(`Duplicate ID: ${item.id}`);
  ids.add(item.id);
  if (!categories.has(item.category_id)) errors.push(`Unknown category: ${item.id}`);
  if (item.publish && (!item.name || item.name !== item.english_name)) errors.push(`Missing/inconsistent display name: ${item.id}`);
  if (item.publish) {
    const key = `${item.category_id}|${item.name.toLowerCase()}`;
    if (names.has(key)) errors.push(`Duplicate named dish in category: ${item.name}`);
    names.add(key);
  }
  for (const field of ['chinese_name', 'description', 'variants', 'prices']) {
    if (item[field] !== null) errors.push(`Unsupplied field populated: ${item.id}.${field}`);
  }
  const asset = item.photo?.asset;
  if (!asset?.startsWith('/kok-sen-menu-2026-10-15/') || asset.includes('..') || asset.includes('\\')) {
    errors.push(`Invalid asset URL: ${item.id}`);
    continue;
  }
  if (assets.has(asset)) errors.push(`Shared asset path across different source items: ${asset}`);
  assets.add(asset);
  const localPath = path.join(root, 'public', asset.slice(1));
  if (!fs.existsSync(localPath)) {
    errors.push(`Missing photo file: ${localPath}`);
    continue;
  }
  const bytes = fs.readFileSync(localPath);
  if (bytes.length !== item.photo.bytes) errors.push(`Byte count mismatch: ${asset}`);
  if (crypto.createHash('sha256').update(bytes).digest('hex') !== item.photo.sha256) errors.push(`Original image hash mismatch: ${asset}`);
}
for (const category of menu.categories) {
  const members = menu.items.filter(i => i.category_id === category.id);
  if (members.length !== category.count_all || members.filter(i => i.publish).length !== category.count_publishable) errors.push(`Category count mismatch: ${category.id}`);
}
const result = {
  passed: errors.length === 0,
  source_images: menu.items.length,
  publishable_menu_items: published.length,
  items_awaiting_client_name: pending.length,
  display_groups: menu.categories.length,
  unique_ids: ids.size,
  unique_asset_paths: assets.size,
  prices_hidden: menu.price_display === false,
  original_image_byte_hashes_verified: errors.length === 0,
  scope: 'Package integrity and source-to-asset mapping. This does not verify integration into an external website or browser rendering.',
  errors
};
console.log(JSON.stringify(result, null, 2));
process.exitCode = errors.length ? 1 : 0;
