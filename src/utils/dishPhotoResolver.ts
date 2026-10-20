import clientPhotoMapJson from '../../data/oddle-photos-2026-10-19/client-photo-map.json';
import clientMenuJson from '../../data/kok-sen-menu-2026-10-15.json';
import oddleThreeOverridesJson from '../../data/oddle-three-photo-overrides-2026-10-19.json';
import { MenuItem } from '../types';

export interface ResolvedDishPhoto {
  imageUrl?: string;
  photo_source_url?: string;
  photo_status: string;
  hasOriginalPhoto: boolean;
  isConflict: boolean;
  source_item_id?: string;
  isOddleOriginal?: boolean;
}

export function normalizeEnglishName(nameEn?: string): string {
  return (nameEn || '').toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function normalizeCategoryKey(category?: string): string {
  return (category || '').toUpperCase().replace(/[^A-Z]/g, '');
}

interface ClientPhotoMapItem {
  client_item_id: string;
  client_name: string;
  client_category?: string;
  publish: boolean;
  status: 'matched' | 'no_photo_on_oddle' | 'no_confirmed_oddle_match' | 'unpublished_awaiting_client_name';
  oddle_name?: string;
  oddle_source_item_ids?: string[];
  photo?: {
    asset: string;
    file: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
    sha256: string;
    source_sha256: string;
    source_bytes: number;
    source_width: number;
    source_height: number;
    upscaled: boolean;
    cropped: boolean;
    background_removed: boolean;
    ai_generated_by_this_export: boolean;
    webp_quality: number;
    source_assignment_conflict: boolean;
    source_url: string;
  };
  match_basis?: string;
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

interface PhotoOverrideItem {
  dish_name: string;
  chinese_name: string;
  client_item_id: string | null;
  existing_client_name: string | null;
  allowed_exact_name_matches: string[];
  photo: {
    asset: string;
    file: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
    sha256: string;
  };
}

const clientPhotoMap = clientPhotoMapJson as { items: ClientPhotoMapItem[] };
const clientItems: ClientMenuItem[] = (clientMenuJson.items as ClientMenuItem[]) || [];
const photoOverrides = (oddleThreeOverridesJson as { items: PhotoOverrideItem[] }).items || [];

const byClientItemId = new Map<string, ClientPhotoMapItem>();
const byNormName = new Map<string, ClientPhotoMapItem>();
const clientFallbackById = new Map<string, ClientMenuItem>();
const clientFallbackByNormName = new Map<string, ClientMenuItem>();

for (const item of clientPhotoMap.items) {
  if (item.client_item_id) {
    byClientItemId.set(item.client_item_id.toLowerCase(), item);
  }
  if (item.client_name) {
    byNormName.set(normalizeEnglishName(item.client_name), item);
  }
}

for (const item of clientItems) {
  if (item.id) {
    clientFallbackById.set(item.id.toLowerCase(), item);
  }
  if (item.name) {
    clientFallbackByNormName.set(normalizeEnglishName(item.name), item);
  }
  if (item.english_name) {
    clientFallbackByNormName.set(normalizeEnglishName(item.english_name), item);
  }
}

import exactUploadPhotoMap from '../data/exactUploadPhotoMap.json';

const uploadMap = exactUploadPhotoMap as Record<string, string>;

/**
 * Resolves verified authentic dish photography.
 * Highest precedence:
 * - Newly uploaded verified photos in /images/ mapped via exactUploadPhotoMap.json
 * - Fallbacks to existing high quality assets for dishes without new photos
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
    name?: string;
  }
): ResolvedDishPhoto {
  const rawId = (query.id || query.source_item_id || query.sourceItemId || '').toLowerCase();
  const enName = query.nameEn || query.english_name || query.name || '';
  const normEn = normalizeEnglishName(enName);
  const canonicalId =
    rawId ||
    (normEn
      ? (
          byNormName.get(normEn)?.client_item_id ||
          clientFallbackByNormName.get(normEn)?.id ||
          ''
        ).toLowerCase()
      : '');

  // 0. Primary: Newly uploaded exact dish photos from user zip
  if (canonicalId && uploadMap[canonicalId]) {
    const asset = uploadMap[canonicalId];
    return {
      imageUrl: asset,
      photo_source_url: asset,
      photo_status: 'available',
      hasOriginalPhoto: true,
      isConflict: false,
      source_item_id: canonicalId,
      isOddleOriginal: false
    };
  }

  // Priority 2: Big Prawns Hor Fun / Big Prawn Hor Fun (ID ks-20261015-050 or exact allowed name)
  if (
    canonicalId === 'ks-20261015-050' ||
    normEn === 'big prawn hor fun' ||
    normEn === 'big prawns hor fun'
  ) {
    const override = photoOverrides.find((o) => o.client_item_id === 'ks-20261015-050');
    const asset = override?.photo.asset || '/oddle-three-exact-2026-10-19/big-prawns-hor-fun.png';
    return {
      imageUrl: asset,
      photo_source_url: asset,
      photo_status: 'available',
      hasOriginalPhoto: true,
      isConflict: false,
      source_item_id: 'ks-20261015-050',
      isOddleOriginal: false
    };
  }

  // Priority 3: Curry Fish Tail (Strict check: Never match HK Steamed Fish Tail or Curry Fish Head)
  if (
    normEn === 'curry fish tail' &&
    canonicalId !== 'ks-20261015-023' &&
    canonicalId !== 'ks-20261015-026'
  ) {
    const override = photoOverrides.find((o) => o.dish_name === 'Curry Fish Tail');
    const asset = override?.photo.asset || '/oddle-three-exact-2026-10-19/curry-fish-tail.png';
    return {
      imageUrl: asset,
      photo_source_url: asset,
      photo_status: 'available',
      hasOriginalPhoto: true,
      isConflict: false,
      isOddleOriginal: false
    };
  }

  // 1. Direct lookup by canonical dish ID against 2026-10-19 client-photo-map
  if (canonicalId && byClientItemId.has(canonicalId)) {
    const entry = byClientItemId.get(canonicalId)!;
    if (entry.status === 'matched' && entry.photo?.asset) {
      return {
        imageUrl: entry.photo.asset,
        photo_source_url: entry.photo.source_url,
        photo_status: 'available',
        hasOriginalPhoto: true,
        isConflict: false,
        source_item_id: entry.client_item_id,
        isOddleOriginal: true
      };
    }

    if (entry.status === 'unpublished_awaiting_client_name') {
      const fallback = clientFallbackById.get(canonicalId);
      const fallbackAsset = fallback?.photo?.asset || query.imageUrl;
      return {
        imageUrl: fallbackAsset,
        photo_source_url: fallbackAsset,
        photo_status: 'awaiting_client_name',
        hasOriginalPhoto: Boolean(fallbackAsset),
        isConflict: false,
        source_item_id: entry.client_item_id,
        isOddleOriginal: false
      };
    }

    // 18 Retained dishes without Oddle match or with multi-variant ambiguity
    const fallback = clientFallbackById.get(canonicalId);
    const fallbackAsset = query.imageUrl || fallback?.photo?.asset;
    return {
      imageUrl: fallbackAsset,
      photo_source_url: fallbackAsset,
      photo_status: 'available',
      hasOriginalPhoto: Boolean(fallbackAsset),
      isConflict: false,
      source_item_id: entry.client_item_id,
      isOddleOriginal: false
    };
  }

  // 2. Lookup by normalized name against 2026-10-19 client-photo-map
  if (normEn && byNormName.has(normEn)) {
    const entry = byNormName.get(normEn)!;
    if (entry.status === 'matched' && entry.photo?.asset) {
      return {
        imageUrl: entry.photo.asset,
        photo_source_url: entry.photo.source_url,
        photo_status: 'available',
        hasOriginalPhoto: true,
        isConflict: false,
        source_item_id: entry.client_item_id,
        isOddleOriginal: true
      };
    }

    const fallback = clientFallbackByNormName.get(normEn);
    const fallbackAsset = query.imageUrl || fallback?.photo?.asset;
    return {
      imageUrl: fallbackAsset,
      photo_source_url: fallbackAsset,
      photo_status: entry.publish ? 'available' : 'awaiting_client_name',
      hasOriginalPhoto: Boolean(fallbackAsset),
      isConflict: false,
      source_item_id: entry.client_item_id,
      isOddleOriginal: false
    };
  }

  // 3. Direct valid oddle-photos-web URL or client photo URL passed in query
  const directAsset = query.imageUrl || query.photo_source_url || query.source_url;
  if (directAsset && (directAsset.startsWith('/images/') || directAsset.startsWith('/oddle-photos-web-') || directAsset.startsWith('/kok-sen-') || directAsset.startsWith('/menu-photos/'))) {
    return {
      imageUrl: directAsset,
      photo_source_url: directAsset,
      photo_status: 'available',
      hasOriginalPhoto: true,
      isConflict: false,
      source_item_id: canonicalId || undefined,
      isOddleOriginal: directAsset.startsWith('/oddle-photos-web-') || directAsset.startsWith('/menu-photos/')
    };
  }

  // 4. Fallback to provided image if present
  return {
    imageUrl: directAsset,
    photo_source_url: directAsset,
    photo_status: directAsset ? 'available' : 'not_provided_on_official_menu',
    hasOriginalPhoto: Boolean(directAsset),
    isConflict: false,
    source_item_id: canonicalId || undefined,
    isOddleOriginal: Boolean(directAsset && directAsset.startsWith('/oddle-photos-web-'))
  };
}

export interface DisplayedDishPhoto {
  dishId: string;
  src: string | undefined;
  fallbackSrc: string | undefined;
  hasValidPhoto: boolean;
  isConflict: boolean;
}

/**
 * Single shared image-resolution method used by both menu cards and the dish detail modal.
 * Never reads legacy `dish.photos[]` arrays or alternate gallery photos.
 * If the clicked card passed its active `overrideSrc` (including a loaded fallback),
 * that exact image is preserved.
 */
export function getDisplayedDishPhoto(
  dish: MenuItem | null | undefined,
  overrideSrc?: string
): DisplayedDishPhoto {
  if (!dish) {
    return {
      dishId: '',
      src: undefined,
      fallbackSrc: undefined,
      hasValidPhoto: false,
      isConflict: false,
    };
  }

  const dishId = dish.source_item_id || dish.id || '';
  const photoRes = resolveDishPhoto(dish);
  const isConflict = Boolean(
    dish.isConflict ||
    photoRes.isConflict ||
    dish.photo_status === 'conflict_unresolved' ||
    dish.photo_status === 'official_image_conflict_requires_client_review'
  );

  const src =
    overrideSrc ||
    dish.resolvedDisplayImage ||
    photoRes.imageUrl ||
    dish.imageUrl ||
    photoRes.photo_source_url ||
    dish.photo_source_url ||
    dish.source_url;

  const fallbackSrc =
    photoRes.photo_source_url ||
    dish.photo_source_url ||
    dish.source_url;

  const hasValidPhoto = Boolean(photoRes.hasOriginalPhoto && src && !isConflict);

  return {
    dishId,
    src,
    fallbackSrc,
    hasValidPhoto,
    isConflict,
  };
}
