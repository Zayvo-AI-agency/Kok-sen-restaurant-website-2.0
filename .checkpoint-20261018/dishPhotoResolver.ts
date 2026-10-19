import clientMenuJson from '../../data/kok-sen-menu-2026-10-15.json';
import enhancedMappingJson from '../../data/enhanced-dish-mapping.json';
import { MenuItem } from '../types';

export interface ResolvedDishPhoto {
  imageUrl?: string;
  photo_source_url?: string;
  photo_status: string;
  hasOriginalPhoto: boolean;
  isConflict: boolean;
  source_item_id?: string;
}

export function normalizeEnglishName(nameEn?: string): string {
  return (nameEn || '').toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function normalizeCategoryKey(category?: string): string {
  return (category || '').toUpperCase().replace(/[^A-Z]/g, '');
}

interface ClientMenuItem {
  id: string;
  name: string;
  english_name: string;
  category: string;
  category_id: string;
  publish: boolean;
  photo?: {
    asset?: string;
    width?: number;
    height?: number;
    bytes?: number;
    sha256?: string;
  };
}

const clientItems: ClientMenuItem[] = (clientMenuJson.items as ClientMenuItem[]) || [];

const byId = new Map<string, ClientMenuItem>();
const byNormName = new Map<string, ClientMenuItem>();
const enhancedAssets = new Map<string, string>();

for (const m of (enhancedMappingJson.mappings || [])) {
  if (m.id && m.enhanced_asset) {
    enhancedAssets.set(m.id.toLowerCase(), m.enhanced_asset);
  }
}

for (const item of clientItems) {
  if (item.id) {
    byId.set(item.id.toLowerCase(), item);
  }
  if (item.name) {
    const norm = normalizeEnglishName(item.name);
    byNormName.set(norm, item);
  }
  if (item.english_name) {
    const normEn = normalizeEnglishName(item.english_name);
    byNormName.set(normEn, item);
  }
}

/**
 * Resolves verified authentic dish photography from the authoritative client catalogue
 * (data/kok-sen-menu-2026-10-15.json) with client-supplied photographs and verified enhanced versions.
 */
export function resolveDishPhoto(
  query: Partial<MenuItem> | {
    source_item_id?: string;
    sourceItemId?: string;
    id?: string;
    nameEn?: string;
    english_name?: string;
    nameZh?: string;
    chinese_name?: string;
    category?: string;
    imageUrl?: string;
    photo_source_url?: string;
    source_url?: string;
    photo_status?: string;
    isConflict?: boolean;
  }
): ResolvedDishPhoto {
  const rawId = (query.id || query.source_item_id || query.sourceItemId || '').toLowerCase();
  const enName = query.nameEn || query.english_name || query.name || '';
  const normEn = normalizeEnglishName(enName);

  // 1. Direct lookup by stable client catalogue ID
  if (rawId && byId.has(rawId)) {
    const matched = byId.get(rawId)!;
    const asset = enhancedAssets.get(matched.id.toLowerCase()) || matched.photo?.asset;
    return {
      imageUrl: asset,
      photo_source_url: asset,
      photo_status: matched.publish ? 'available' : 'awaiting_client_name',
      hasOriginalPhoto: Boolean(asset),
      isConflict: false,
      source_item_id: matched.id
    };
  }

  // 2. Lookup by normalized dish name
  if (normEn && byNormName.has(normEn)) {
    const matched = byNormName.get(normEn)!;
    const asset = enhancedAssets.get(matched.id.toLowerCase()) || matched.photo?.asset;
    return {
      imageUrl: asset,
      photo_source_url: asset,
      photo_status: matched.publish ? 'available' : 'awaiting_client_name',
      hasOriginalPhoto: Boolean(asset),
      isConflict: false,
      source_item_id: matched.id
    };
  }

  // 3. Fallback for query if it already specifies a valid client asset path
  const asset = query.imageUrl || query.photo_source_url || query.source_url;
  if (asset && asset.startsWith('/kok-sen-menu-2026-10-15/')) {
    return {
      imageUrl: asset,
      photo_source_url: asset,
      photo_status: 'available',
      hasOriginalPhoto: true,
      isConflict: false,
      source_item_id: rawId || undefined
    };
  }

  // 4. Special preservation for iconic Big Prawn Hor Fun if queried by legacy names
  if (normEn.includes('big prawn') && normEn.includes('hor fun')) {
    const bigPrawnAsset = '/kok-sen-menu-2026-10-15/hor-fun/07-big-prawn-hor-fun.png';
    return {
      imageUrl: bigPrawnAsset,
      photo_source_url: bigPrawnAsset,
      photo_status: 'available',
      hasOriginalPhoto: true,
      isConflict: false,
      source_item_id: 'ks-20261015-050'
    };
  }

  // Fallback to provided image if present
  const fallbackImg = query.imageUrl || query.photo_source_url || query.source_url;
  return {
    imageUrl: fallbackImg,
    photo_source_url: fallbackImg,
    photo_status: fallbackImg ? 'available' : 'not_provided_on_official_menu',
    hasOriginalPhoto: Boolean(fallbackImg),
    isConflict: false,
    source_item_id: rawId || undefined
  };
}
