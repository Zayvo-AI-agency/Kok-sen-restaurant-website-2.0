/**
 * Validation utilities for table reservation guest count
 */

export interface GuestCountValidation {
  isValid: boolean;
  error: string | null;
  count: number | null;
}

export function validateGuestCount(raw: string | number | undefined | null): GuestCountValidation {
  const value = String(raw ?? '').trim();
  
  if (!value) {
    return {
      isValid: false,
      error: 'Please enter the number of guests.',
      count: null,
    };
  }

  // Check for decimals
  if (value.includes('.') || value.includes(',')) {
    return {
      isValid: false,
      error: 'Please enter a whole number of guests (no decimals).',
      count: null,
    };
  }

  // Check if string contains anything other than digits (rejects signs like -, +, letters, symbols)
  if (!/^\d+$/.test(value)) {
    if (value.startsWith('-')) {
      return {
        isValid: false,
        error: 'Number of guests must be at least 1.',
        count: null,
      };
    }
    return {
      isValid: false,
      error: 'Please enter a valid positive number.',
      count: null,
    };
  }

  const num = parseInt(value, 10);

  if (isNaN(num) || num < 1) {
    return {
      isValid: false,
      error: 'Number of guests must be at least 1.',
      count: null,
    };
  }

  return {
    isValid: true,
    error: null,
    count: num,
  };
}

export function formatGuestsLabel(countStr: string | number): string {
  const trimmed = String(countStr ?? '').trim();
  const num = parseInt(trimmed, 10);
  if (isNaN(num)) return trimmed;
  return `${num} ${num === 1 ? 'guest' : 'guests'}`;
}
