import { useState } from 'react';
import { OUTLETS } from '../data/restaurantData';
import { validateGuestCount } from '../utils/reservationValidation';
import {
  ReservationOutletId,
  ReservationDetails,
  buildReservationWhatsAppUrl,
  triggerWhatsAppNavigation,
  OUTLET_WHATSAPP_CONFIG
} from '../utils/reservationWhatsApp';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultOutletId?: ReservationOutletId;
}

export function ReservationModal({ isOpen, onClose, defaultOutletId = 'keong-saik' }: ReservationModalProps) {
  const [formData, setFormData] = useState<ReservationDetails>({
    outlet: defaultOutletId,
    name: '',
    phone: '',
    guests: '',
    dateTime: '',
    notes: ''
  });

  // Inline validation errors
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [guestError, setGuestError] = useState<string | null>(null);
  const [dateTimeError, setDateTimeError] = useState<string | null>(null);
  const [guestTouched, setGuestTouched] = useState(false);

  // Recovery & fallback state
  const [preparedUrl, setPreparedUrl] = useState<string | null>(null);
  const [preparedMessage, setPreparedMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentOutlet = OUTLETS.find((o) => o.id === formData.outlet) || OUTLETS[0];
  const outletConfig = OUTLET_WHATSAPP_CONFIG[formData.outlet];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nameTrimmed = formData.name.trim();
    const phoneTrimmed = formData.phone.trim();
    const dateTimeTrimmed = formData.dateTime.trim();
    const guestValidation = validateGuestCount(formData.guests);

    let hasError = false;

    if (!nameTrimmed) {
      setNameError('Please enter your name.');
      hasError = true;
    } else {
      setNameError(null);
    }

    if (!phoneTrimmed) {
      setPhoneError('Please enter your phone or WhatsApp number.');
      hasError = true;
    } else {
      setPhoneError(null);
    }

    if (!guestValidation.isValid) {
      setGuestError(guestValidation.error || 'Please enter the number of guests.');
      setGuestTouched(true);
      hasError = true;
    } else {
      setGuestError(null);
    }

    if (!dateTimeTrimmed) {
      setDateTimeError('Please enter your requested date and time.');
      hasError = true;
    } else {
      setDateTimeError(null);
    }

    if (hasError) {
      return;
    }

    // Single submission handler; prevent concurrent duplicate navigation
    if (isSubmitting) return;
    setIsSubmitting(true);

    const { whatsappUrl, rawMessage } = buildReservationWhatsAppUrl({
      outlet: formData.outlet,
      name: nameTrimmed,
      phone: phoneTrimmed,
      guests: formData.guests.trim(),
      dateTime: dateTimeTrimmed,
      notes: formData.notes?.trim() || ''
    });

    // Provide reliable fallback link and copy option immediately
    setPreparedUrl(whatsappUrl);
    setPreparedMessage(rawMessage);

    // Trigger WhatsApp navigation directly from user action without delay
    triggerWhatsAppNavigation(whatsappUrl);

    // Reset submitting lock after brief delay
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
  };

  const handleCopyDetails = async () => {
    if (!preparedMessage) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(preparedMessage);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = preparedMessage;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('Copy failed:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-surface-container-low border border-surface-container-high rounded-2xl shadow-2xl p-4 sm:p-6 z-10 animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 text-tertiary hover:text-on-surface p-1 rounded-full hover:bg-surface-container cursor-pointer transition-colors"
          aria-label="Close reservation modal"
        >
          <span className="material-symbols-outlined text-[22px] sm:text-[24px]">close</span>
        </button>

        <div className="flex items-center gap-2 mb-1 pr-8">
          <span className="material-symbols-outlined text-secondary text-[22px] sm:text-[24px]">table_restaurant</span>
          <h3 className="font-headline-md text-xl sm:text-headline-md text-on-surface font-bold">
            Table Reservation
          </h3>
        </div>

        {/* Client-specified introductory text */}
        <p className="font-body-md text-xs sm:text-body-md text-tertiary mb-3.5 leading-relaxed">
          Complete your details below, then continue to WhatsApp and tap Send to submit your reservation request. Your booking is confirmed only after the restaurant replies with confirmation.
        </p>

        {/* Quick WhatsApp Mainline Direct Buttons (Contact without form) */}
        <div className="mb-4 p-3 rounded-xl bg-surface-container border border-surface-container-high/70">
          <span className="font-label-caps text-[11px] uppercase tracking-wider text-secondary font-bold block mb-2">
            Mainline WhatsApp Direct (Instant Chat):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <a
              href={OUTLET_WHATSAPP_CONFIG['keong-saik'].directChatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-white transition-all group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-emerald-400 text-[18px]">chat</span>
                <div className="text-left truncate">
                  <div className="text-xs font-bold text-on-surface">1) Keong Saik</div>
                  <div className="text-[11px] text-emerald-400 font-mono font-semibold">9727 2533</div>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded shrink-0">
                WhatsApp
              </span>
            </a>

            <a
              href={OUTLET_WHATSAPP_CONFIG['city-square-mall'].directChatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-white transition-all group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-emerald-400 text-[18px]">chat</span>
                <div className="text-left truncate">
                  <div className="text-xs font-bold text-on-surface">2) City Square Mall</div>
                  <div className="text-[11px] text-emerald-400 font-mono font-semibold">9624 4244</div>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded shrink-0">
                WhatsApp
              </span>
            </a>
          </div>
        </div>

        {/* Form: All inputs retained on submission; directly navigates to WhatsApp */}
        <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
          {/* Select Outlet */}
          <div>
            <label className="font-label-caps text-label-caps uppercase text-tertiary block mb-1">
              Select Outlet *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {OUTLETS.map((outlet) => {
                const isSelected = formData.outlet === outlet.id;
                return (
                  <button
                    key={outlet.id}
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, outlet: outlet.id }));
                      setPreparedUrl(null);
                    }}
                    className={`p-2.5 rounded-lg text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-secondary/15 border-secondary text-on-surface shadow-xs'
                        : 'bg-surface-container border-surface-container-high text-tertiary hover:border-outline'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm text-on-surface">
                        {outlet.id === 'keong-saik' ? '1) Keong Saik' : '2) City Square Mall'}
                      </span>
                      {isSelected && (
                        <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                      )}
                    </div>
                    <div className="text-[11px] font-medium text-secondary mt-0.5 space-y-0.5">
                      {outlet.id === 'city-square-mall' ? (
                        <>
                          <div className="text-emerald-400 font-semibold">Open daily · Monday–Sunday</div>
                          <div>Lunch: 11:30 AM–3:00 PM (Last order 2:30 PM)</div>
                          <div>Dinner: 4:30 PM–9:30 PM (Last order 9:00 PM)</div>
                        </>
                      ) : (
                        <>
                          <div className="text-rose-400 font-semibold">Tuesday–Sunday · Closed Monday</div>
                          <div>Lunch: 12:00 PM–2:45 PM (Last order 2:15 PM)</div>
                          <div>Dinner: 5:00 PM–9:45 PM (Last order 9:15 PM)</div>
                        </>
                      )}
                    </div>
                    <div className="text-[11px] font-mono font-medium text-emerald-400 mt-0.5">
                      WhatsApp: {outlet.whatsappNumber}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-label-caps text-label-caps uppercase text-tertiary block mb-1">
                Name *
              </label>
              <input 
                type="text"
                required
                placeholder="e.g. Rachel Tan"
                value={formData.name}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, name: e.target.value }));
                  if (nameError) setNameError(null);
                  setPreparedUrl(null);
                }}
                className={`w-full px-3 py-2 rounded-lg bg-surface-container text-on-surface border focus:outline-none font-body-md text-sm transition-colors ${
                  nameError
                    ? 'border-rose-500 focus:border-rose-400'
                    : 'border-surface-container-high focus:border-secondary'
                }`}
              />
              {nameError && (
                <span className="text-xs text-rose-400 flex items-center gap-1 mt-1 animate-in fade-in duration-200">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  <span>{nameError}</span>
                </span>
              )}
            </div>

            <div>
              <label className="font-label-caps text-label-caps uppercase text-tertiary block mb-1">
                Phone / WhatsApp *
              </label>
              <input 
                type="tel"
                required
                placeholder="+65 9123 4567"
                value={formData.phone}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, phone: e.target.value }));
                  if (phoneError) setPhoneError(null);
                  setPreparedUrl(null);
                }}
                className={`w-full px-3 py-2 rounded-lg bg-surface-container text-on-surface border focus:outline-none font-body-md text-sm transition-colors ${
                  phoneError
                    ? 'border-rose-500 focus:border-rose-400'
                    : 'border-surface-container-high focus:border-secondary'
                }`}
              />
              {phoneError && (
                <span className="text-xs text-rose-400 flex items-center gap-1 mt-1 animate-in fade-in duration-200">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  <span>{phoneError}</span>
                </span>
              )}
            </div>
          </div>

          {/* Number of Guests & Requested Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-label-caps text-label-caps uppercase text-tertiary block mb-1">
                Number of Guests *
              </label>
              <input
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                required
                placeholder="Enter number of guests"
                value={formData.guests}
                onKeyDown={(e) => {
                  if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData((prev) => ({ ...prev, guests: val }));
                  setPreparedUrl(null);
                  if (guestTouched) {
                    const validation = validateGuestCount(val);
                    setGuestError(validation.isValid ? null : validation.error);
                  }
                }}
                onBlur={() => {
                  setGuestTouched(true);
                  const validation = validateGuestCount(formData.guests);
                  setGuestError(validation.isValid ? null : validation.error);
                }}
                className={`w-full px-3 py-2 rounded-lg bg-surface-container text-on-surface border placeholder:text-tertiary focus:outline-none font-body-md text-sm transition-colors ${
                  guestError
                    ? 'border-rose-500 focus:border-rose-400'
                    : 'border-surface-container-high focus:border-secondary'
                }`}
              />
              {guestError ? (
                <span className="text-xs text-rose-400 flex items-center gap-1 mt-1 animate-in fade-in duration-200">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  <span>{guestError}</span>
                </span>
              ) : (
                <span className="text-[10px] text-tertiary block mt-1">
                  Seating assigned by staff upon arrival.
                </span>
              )}
            </div>

            <div>
              <label className="font-label-caps text-label-caps uppercase text-tertiary block mb-1">
                Requested Date &amp; Time *
              </label>
              <input 
                type="text"
                required
                placeholder="e.g. 25 Dec, 7:00 PM or Tonight 7:30 PM"
                value={formData.dateTime}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, dateTime: e.target.value }));
                  if (dateTimeError) setDateTimeError(null);
                  setPreparedUrl(null);
                }}
                className={`w-full px-3 py-2 rounded-lg bg-surface-container text-on-surface border placeholder:text-tertiary focus:outline-none font-body-md text-sm transition-colors ${
                  dateTimeError
                    ? 'border-rose-500 focus:border-rose-400'
                    : 'border-surface-container-high focus:border-secondary'
                }`}
              />
              {dateTimeError && (
                <span className="text-xs text-rose-400 flex items-center gap-1 mt-1 animate-in fade-in duration-200">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  <span>{dateTimeError}</span>
                </span>
              )}
            </div>
          </div>

          {/* Notes (Optional) */}
          <div>
            <label className="font-label-caps text-label-caps uppercase text-tertiary block mb-1">
              Notes (Optional)
            </label>
            <textarea 
              rows={2}
              placeholder="Special occasion, dietary requests, baby high chair..."
              value={formData.notes}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, notes: e.target.value }));
                setPreparedUrl(null);
              }}
              className="w-full px-3 py-2 rounded-lg bg-surface-container text-on-surface border border-surface-container-high focus:outline-none focus:border-secondary font-body-md text-sm"
            />
          </div>

          {/* Explicit reminder immediately above the primary button */}
          <div className="pt-1 text-xs text-secondary font-medium leading-relaxed">
            You must tap Send in WhatsApp for the restaurant to receive your request.
          </div>

          {/* Primary Action Button */}
          <div className="pt-1 flex flex-col gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-button-text font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.01] active:scale-95 cursor-pointer disabled:opacity-70"
            >
              <span className="material-symbols-outlined text-[20px]">chat</span>
              <span>Continue to WhatsApp</span>
            </button>
          </div>

          {/* Reliable Navigation Recovery / Fallback Link & Copy Option */}
          {preparedUrl && (
            <div className="mt-3 p-3.5 rounded-xl bg-surface-container border border-surface-container-high flex flex-col gap-2.5 animate-in fade-in duration-200">
              <span className="text-xs text-tertiary leading-relaxed">
                If WhatsApp did not open automatically on your device, tap below to open or copy your prefilled request:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={preparedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  <span>Open WhatsApp ({outletConfig.displayPhone})</span>
                </a>
                <button
                  type="button"
                  onClick={handleCopyDetails}
                  className="px-3 py-2 rounded-lg bg-surface-container-highest hover:bg-surface-bright text-on-surface font-semibold text-xs border border-surface-container-high flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copied ? 'check' : 'content_copy'}
                  </span>
                  <span>{copied ? 'Details Copied!' : 'Copy request details'}</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
