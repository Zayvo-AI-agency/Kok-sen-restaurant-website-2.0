/**
 * Kok Sen Restaurant - Table Reservation WhatsApp Utilities
 *
 * Implements strict recipient routing, single-encode URL formatting,
 * and standard prefilled message schema.
 */

export type ReservationOutletId = 'keong-saik' | 'city-square-mall';

export interface ReservationDetails {
  outlet: ReservationOutletId;
  name: string;
  phone: string;
  guests: string;
  dateTime: string;
  notes?: string;
}

export interface OutletWhatsAppConfig {
  id: ReservationOutletId;
  name: string;
  displayPhone: string;
  whatsappNumber: string;
  directChatUrl: string;
}

export const OUTLET_WHATSAPP_CONFIG: Record<ReservationOutletId, OutletWhatsAppConfig> = {
  'keong-saik': {
    id: 'keong-saik',
    name: 'Keong Saik Flagship',
    displayPhone: '+65 9727 2533',
    whatsappNumber: '6597272533',
    directChatUrl: 'https://wa.me/6597272533?text=Hello%20Kok%20Sen%20(Keong%20Saik%20Outlet)!%20I%20would%20like%20to%20make%20a%20table%20reservation.',
  },
  'city-square-mall': {
    id: 'city-square-mall',
    name: 'City Square Mall',
    displayPhone: '+65 9624 4244',
    whatsappNumber: '6596244244',
    directChatUrl: 'https://wa.me/6596244244?text=Hello%20Kok%20Sen%20(City%20Square%20Mall%20Outlet)!%20I%20would%20like%20to%20make%20a%20table%20reservation.',
  },
};

/**
 * Builds the exact prefilled reservation message and wa.me URL
 *
 * Prefilled format:
 * Hello Kok Sen, I would like to request a table reservation.
 *
 * Outlet: [selected outlet]
 * Name: [customer name]
 * Phone / WhatsApp: [customer phone]
 * Number of guests: [exact entered number]
 * Requested date and time: [customer’s entered date and time]
 * Notes: [customer notes, or omit this line if empty]
 *
 * Please confirm whether a table is available. I understand this is a request and my booking is subject to your confirmation.
 */
export function buildReservationWhatsAppUrl(details: ReservationDetails): {
  rawMessage: string;
  encodedMessage: string;
  whatsappUrl: string;
  outletConfig: OutletWhatsAppConfig;
} {
  const config = OUTLET_WHATSAPP_CONFIG[details.outlet] || OUTLET_WHATSAPP_CONFIG['keong-saik'];

  const lines: string[] = [
    'Hello Kok Sen, I would like to request a table reservation.',
    '',
    `Outlet: ${config.name}`,
    `Name: ${details.name.trim()}`,
    `Phone / WhatsApp: ${details.phone.trim()}`,
    `Number of guests: ${details.guests.trim()}`,
    `Requested date and time: ${details.dateTime.trim()}`,
  ];

  const trimmedNotes = (details.notes ?? '').trim();
  if (trimmedNotes) {
    lines.push(`Notes: ${trimmedNotes}`);
  }

  lines.push('');
  lines.push('Please confirm whether a table is available. I understand this is a request and my booking is subject to your confirmation.');

  const rawMessage = lines.join('\n');
  const encodedMessage = encodeURIComponent(rawMessage);
  const whatsappUrl = `https://wa.me/${config.whatsappNumber}?text=${encodedMessage}`;

  return {
    rawMessage,
    encodedMessage,
    whatsappUrl,
    outletConfig: config,
  };
}

/**
 * Detects if the current window is embedded within an iframe.
 */
export function isInsideIframe(): boolean {
  try {
    return typeof window !== 'undefined' && window.self !== window.top;
  } catch {
    return true;
  }
}

/**
 * Reliable navigation: prefers same-tab navigation in standard browser,
 * with graceful handling for iframes or blocked popups.
 */
export function triggerWhatsAppNavigation(whatsappUrl: string): boolean {
  if (typeof window === 'undefined') return false;

  // Normal website context: prefer same-tab navigation
  if (!isInsideIframe()) {
    try {
      window.location.href = whatsappUrl;
      return true;
    } catch (err) {
      console.warn('Same-tab location.href assignment failed:', err);
    }
  }

  // Inside iframe (e.g. AI Studio development environment):
  // WhatsApp rejects loading in iframes via X-Frame-Options: DENY,
  // so try opening in a new tab first.
  try {
    const opened = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    if (opened) return true;
  } catch (err) {
    console.warn('window.open blocked:', err);
  }

  // Ultimate fallback
  try {
    window.location.href = whatsappUrl;
    return true;
  } catch {
    return false;
  }
}
