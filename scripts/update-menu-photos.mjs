import fs from 'fs';

const mapping = JSON.parse(fs.readFileSync('data/oddle-confirmed-photo-mapping.json', 'utf8'));
const text = fs.readFileSync('src/data/menuData.ts', 'utf8');

const marker = 'export const FULL_MENU_ITEMS: MenuItem[] =';
const markerIdx = text.indexOf(marker);
if (markerIdx === -1) throw new Error('Marker not found in menuData.ts');

const arrayStart = text.indexOf('[', markerIdx + marker.length);
const arrayEnd = text.indexOf('];', arrayStart);

const prefix = text.substring(0, arrayStart);
const suffix = text.substring(arrayEnd + 1); // includes ";" and following code
const jsonArrayStr = text.substring(arrayStart, arrayEnd + 1); // "[ ... ]"

const items = JSON.parse(jsonArrayStr);
console.log('Successfully parsed items:', items.length);

let replaced = 0;
let retained = 0;

for (const item of items) {
  const mapEntry = mapping[item.id];
  if (mapEntry && mapEntry.action === 'REPLACED') {
    item.imageUrl = mapEntry.oddle_photo;
    item.photos = [mapEntry.oddle_photo, ...(item.photos || []).filter(p => p !== mapEntry.oddle_photo)];
    item.photo_status = 'available';
    item.oddle_source_url = mapEntry.oddle_source_url;
    item.hasOddleOriginalPhoto = true;
    replaced++;
  } else {
    retained++;
    item.hasOddleOriginalPhoto = false;
  }
}

console.log(`Replaced with Oddle original photos in FULL_MENU_ITEMS: ${replaced}`);
console.log(`Retained existing photos in FULL_MENU_ITEMS: ${retained}`);

const newContent = prefix + JSON.stringify(items, null, 2) + suffix;
fs.writeFileSync('src/data/menuData.ts', newContent);
console.log('Successfully updated src/data/menuData.ts');
