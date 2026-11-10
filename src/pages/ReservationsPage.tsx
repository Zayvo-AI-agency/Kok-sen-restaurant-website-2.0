import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useApp } from '../context/AppContext';
import { OUTLETS, RESTAURANT_INFO } from '../data/restaurantData';
import { 
  CalendarDays, 
  Clock, 
  Users, 
  MessageSquare, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Info,
  ChevronRight
} from 'lucide-react';

import { validateGuestCount, formatGuestsLabel } from '../utils/reservationValidation';
import {
  buildReservationWhatsAppUrl,
  triggerWhatsAppNavigation,
  OUTLET_WHATSAPP_CONFIG,
  ReservationOutletId
} from '../utils/reservationWhatsApp';

export function ReservationsPage() {
  const { selectedOutlet, setSelectedOutlet, showToast } = useApp();

  // Form state
  const [outletId, setOutletId] = useState<ReservationOutletId>(selectedOutlet.id as ReservationOutletId);
  const [date, setDate] = useState<string>(() => {
    // Default to tomorrow or today
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [time, setTime] = useState<string>('18:30');
  const [guestCount, setGuestCount] = useState<string>('');
  const [guestError, setGuestError] = useState<string | null>(null);
  const [guestTouched, setGuestTouched] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [phone, setPhone] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [preparedUrl, setPreparedUrl] = useState<string | null>(null);
  const [preparedMessage, setPreparedMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const activeOutlet = OUTLETS.find((o) => o.id === outletId) || OUTLETS[0];
  const outletConfig = OUTLET_WHATSAPP_CONFIG[outletId] || OUTLET_WHATSAPP_CONFIG['keong-saik'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nameTrimmed = name.trim();
    const phoneTrimmed = phone.trim();
    const guestValidation = validateGuestCount(guestCount);

    let hasError = false;

    if (!nameTrimmed) {
      setNameError('Please provide your name');
      hasError = true;
    } else {
      setNameError(null);
    }

    if (!phoneTrimmed) {
      setPhoneError('Please provide your contact number');
      hasError = true;
    } else {
      setPhoneError(null);
    }

    if (!guestValidation.isValid) {
      setGuestError(guestValidation.error || 'Please enter the number of guests');
      setGuestTouched(true);
      hasError = true;
    } else {
      setGuestError(null);
    }

    if (hasError) {
      showToast('Please correct the highlighted errors before continuing.');
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    const { whatsappUrl, rawMessage } = buildReservationWhatsAppUrl({
      outlet: outletId,
      name: nameTrimmed,
      phone: phoneTrimmed,
      guests: guestCount.trim(),
      dateTime: `${date} at ${time}`,
      notes: specialRequests.trim()
    });

    setPreparedUrl(whatsappUrl);
    setPreparedMessage(rawMessage);

    // Direct navigation to WhatsApp
    triggerWhatsAppNavigation(whatsappUrl);

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
    <div className="flex flex-col gap-10 sm:gap-14 animate-in fade-in duration-300 max-w-4xl mx-auto w-full">
      {/* 1. Header */}
      <section className="flex flex-col gap-3 border-b border-surface-container-high/60 pb-6 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-secondary">
          <CalendarDays className="w-4 h-4 text-primary" />
          <span className="uppercase tracking-widest font-label-caps">Mainline WhatsApp Reservations</span>
        </div>

        <h1 className="font-headline-xl text-3xl sm:text-4xl md:text-5xl text-on-surface font-extrabold tracking-tight">
          Reserve Your Table <span className="font-normal italic text-secondary text-2xl sm:text-3xl ml-1 font-serif">预订订座</span>
        </h1>

        <p className="font-body-md text-xs sm:text-body-md text-tertiary max-w-2xl leading-relaxed">
          Submit your dining preferences directly to our restaurant hosts via WhatsApp. We will confirm table availability and hold your seating.
        </p>
      </section>

      {/* 2. Direct Outlet WhatsApp Reservation Buttons */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface-container border border-surface-container-high/80 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-label-caps text-xs uppercase tracking-wider text-secondary font-bold">
            Direct Outlet WhatsApp Booking
          </span>
          <span className="text-[11px] text-tertiary">Select your preferred outlet to open WhatsApp</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="https://wa.me/6597272533?text=Hello%20Kok%20Sen%20(Keong%20Saik%20Outlet)!%20I%20would%20like%20to%20reserve%20a%20table."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/40 text-white transition-all group shadow-sm"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-left truncate">
                <div className="text-xs font-bold text-on-surface">1) Keong Saik (Flagship)</div>
                <div className="text-[11px] text-emerald-400 font-mono font-semibold">WhatsApp: 9727 2533</div>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-lg shrink-0">
              Book Keong Saik ↗
            </span>
          </a>

          <a
            href="https://wa.me/6596244244?text=Hello%20Kok%20Sen%20(City%20Square%20Mall%20Outlet)!%20I%20would%20like%20to%20reserve%20a%20table."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/40 text-white transition-all group shadow-sm"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-left truncate">
                <div className="text-xs font-bold text-on-surface">2) City Square Mall</div>
                <div className="text-[11px] text-emerald-400 font-mono font-semibold">WhatsApp: 9624 4244</div>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-lg shrink-0">
              Book City Sq Mall ↗
            </span>
          </a>
        </div>
      </div>

      {/* 3. Client Specified Reservation Notice */}
      <div className="p-4 sm:p-5 rounded-2xl bg-secondary/10 border border-secondary/30 flex items-start gap-3.5 text-xs sm:text-sm text-on-surface">
        <Info className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-secondary font-semibold block text-sm">
            Reservation Instructions
          </strong>
          <p className="text-on-surface/90 leading-relaxed">
            Complete your details below, then continue to WhatsApp and tap Send to submit your reservation request. Your booking is confirmed only after the restaurant replies with confirmation.
          </p>
        </div>
      </div>

      {/* 3. Main Reservation Form */}
      <div className="rounded-2xl bg-surface-container border border-surface-container-high/80 p-6 sm:p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Outlet Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-secondary" />
              <span>Select Outlet</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {OUTLETS.map((outlet) => {
                const isSelected = outletId === outlet.id;
                return (
                  <button
                    key={outlet.id}
                    type="button"
                    onClick={() => {
                      setOutletId(outlet.id);
                      setSelectedOutlet(outlet);
                    }}
                    className={`p-4 rounded-xl text-left border transition-all cursor-pointer flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-surface-container-highest border-secondary text-on-surface shadow-sm'
                        : 'bg-surface-container-low hover:bg-surface-container-highest/60 border-surface-container-high text-tertiary'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-on-surface">
                        {outlet.name}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-secondary" />}
                    </div>
                    <span className="text-xs text-tertiary">
                      {outlet.address}
                    </span>
                    <div className="text-[11px] text-secondary font-medium pt-1 space-y-0.5">
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
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date, Time & Party Size */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Date */}
            <div className="flex flex-col gap-2">
              <label htmlFor="res-date" className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5 text-secondary" />
                <span>Dining Date</span>
              </label>
              <input
                id="res-date"
                type="date"
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container-high text-on-surface text-xs sm:text-sm focus:outline-none focus:border-secondary"
              />
              {outletId === 'keong-saik' && (
                <span className="text-[10px] text-rose-400">Keong Saik is closed on Mondays</span>
              )}
              {outletId === 'city-square-mall' && (
                <span className="text-[10px] text-emerald-400 font-medium">Open Daily · Monday–Sunday</span>
              )}
            </div>

            {/* Time */}
            <div className="flex flex-col gap-2">
              <label htmlFor="res-time" className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-secondary" />
                <span>Preferred Seating</span>
              </label>
              <select
                id="res-time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container-high text-on-surface text-xs sm:text-sm focus:outline-none focus:border-secondary cursor-pointer"
              >
                {outletId === 'city-square-mall' ? (
                  <>
                    <optgroup label="Lunch Seating (Daily · Mon–Sun · 11:30 AM–3:00 PM)">
                      <option value="11:30">11:30 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="12:30">12:30 PM</option>
                      <option value="13:00">1:00 PM</option>
                      <option value="13:30">1:30 PM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="14:15">2:15 PM (Last Order 2:30 PM)</option>
                    </optgroup>
                    <optgroup label="Dinner Seating (Daily · Mon–Sun · 4:30 PM–9:30 PM)">
                      <option value="16:30">4:30 PM</option>
                      <option value="17:00">5:00 PM</option>
                      <option value="17:30">5:30 PM</option>
                      <option value="18:00">6:00 PM</option>
                      <option value="18:30">6:30 PM</option>
                      <option value="19:00">7:00 PM</option>
                      <option value="19:30">7:30 PM</option>
                      <option value="20:00">8:00 PM</option>
                      <option value="20:30">8:30 PM</option>
                      <option value="20:45">8:45 PM (Last Order 9:00 PM)</option>
                    </optgroup>
                  </>
                ) : (
                  <>
                    <optgroup label="Lunch Seating (Tue–Sun · Mon Closed · 12:00 PM–2:45 PM)">
                      <option value="12:00">12:00 PM</option>
                      <option value="12:30">12:30 PM</option>
                      <option value="13:00">1:00 PM</option>
                      <option value="13:30">1:30 PM</option>
                      <option value="14:00">2:00 PM (Last Order 2:15 PM)</option>
                    </optgroup>
                    <optgroup label="Dinner Seating (Tue–Sun · Mon Closed · 5:00 PM–9:45 PM)">
                      <option value="17:00">5:00 PM (Early Dinner)</option>
                      <option value="17:30">5:30 PM</option>
                      <option value="18:00">6:00 PM</option>
                      <option value="18:30">6:30 PM</option>
                      <option value="19:00">7:00 PM</option>
                      <option value="19:30">7:30 PM</option>
                      <option value="20:00">8:00 PM</option>
                      <option value="20:30">8:30 PM</option>
                      <option value="21:00">9:00 PM (Last Order 9:15 PM)</option>
                    </optgroup>
                  </>
                )}
              </select>
            </div>

            {/* Number of Guests */}
            <div className="flex flex-col gap-2">
              <label htmlFor="res-guests" className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-secondary" />
                <span>Number of Guests *</span>
              </label>
              <input
                id="res-guests"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                required
                placeholder="Enter number of guests"
                value={guestCount}
                onKeyDown={(e) => {
                  if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  const val = e.target.value;
                  setGuestCount(val);
                  if (guestTouched) {
                    const validation = validateGuestCount(val);
                    setGuestError(validation.isValid ? null : validation.error);
                  }
                }}
                onBlur={() => {
                  setGuestTouched(true);
                  const validation = validateGuestCount(guestCount);
                  setGuestError(validation.isValid ? null : validation.error);
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border text-on-surface placeholder:text-tertiary text-xs sm:text-sm focus:outline-none transition-colors ${
                  guestError && guestTouched
                    ? 'border-rose-500 focus:border-rose-400'
                    : 'border-surface-container-high focus:border-secondary'
                }`}
              />
              {guestError && guestTouched ? (
                <span className="text-xs text-rose-400 flex items-center gap-1 mt-0.5 animate-in fade-in duration-200">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{guestError}</span>
                </span>
              ) : (
                <span className="text-[11px] text-tertiary">
                  Suitable table seating will be arranged by restaurant staff.
                </span>
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="res-name" className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Lead Guest Name *
              </label>
              <input
                id="res-name"
                type="text"
                placeholder="e.g. Rachel Tan"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) setNameError(null);
                  setPreparedUrl(null);
                }}
                required
                className={`w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border text-on-surface placeholder:text-tertiary text-xs sm:text-sm focus:outline-none transition-colors ${
                  nameError
                    ? 'border-rose-500 focus:border-rose-400'
                    : 'border-surface-container-high focus:border-secondary'
                }`}
              />
              {nameError && (
                <span className="text-xs text-rose-400 flex items-center gap-1 mt-0.5 animate-in fade-in duration-200">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{nameError}</span>
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="res-phone" className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Mobile / WhatsApp Number *
              </label>
              <input
                id="res-phone"
                type="tel"
                placeholder="e.g. +65 9123 4567"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (phoneError) setPhoneError(null);
                  setPreparedUrl(null);
                }}
                required
                className={`w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border text-on-surface placeholder:text-tertiary text-xs sm:text-sm focus:outline-none transition-colors ${
                  phoneError
                    ? 'border-rose-500 focus:border-rose-400'
                    : 'border-surface-container-high focus:border-secondary'
                }`}
              />
              {phoneError && (
                <span className="text-xs text-rose-400 flex items-center gap-1 mt-0.5 animate-in fade-in duration-200">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{phoneError}</span>
                </span>
              )}
            </div>
          </div>

          {/* Special Requests */}
          <div className="flex flex-col gap-2">
            <label htmlFor="res-special" className="text-xs font-bold text-on-surface uppercase tracking-wider">
              Dietary Restrictions or Special Requests (Optional)
            </label>
            <textarea
              id="res-special"
              rows={2}
              placeholder="e.g. High chair needed, elderly guest requiring ground floor seating, severe shellfish allergy..."
              value={specialRequests}
              onChange={(e) => {
                setSpecialRequests(e.target.value);
                setPreparedUrl(null);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container-high text-on-surface placeholder:text-tertiary text-xs sm:text-sm focus:outline-none focus:border-secondary"
            />
          </div>

          {/* Explicit client instruction immediately above the primary button */}
          <div className="text-xs sm:text-sm text-secondary font-medium leading-relaxed">
            You must tap Send in WhatsApp for the restaurant to receive your request.
          </div>

          {/* Submit Action */}
          <div className="pt-1 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-button-text font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.01] active:scale-95 cursor-pointer disabled:opacity-70"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Continue to WhatsApp</span>
            </button>

            <a
              href={`tel:${activeOutlet.phoneClean}`}
              className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-surface-container-highest hover:bg-surface-bright text-on-surface font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors border border-surface-container-high"
            >
              <Phone className="w-4 h-4 text-secondary" />
              <span>Call Outlet</span>
            </a>
          </div>

          {/* Recovery Fallback Link & Copy Button */}
          {preparedUrl && (
            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high flex flex-col gap-2.5 animate-in fade-in duration-200">
              <span className="text-xs text-tertiary leading-relaxed">
                If WhatsApp did not open automatically on your device, tap below to open or copy your request details:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={preparedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Open WhatsApp ({outletConfig.displayPhone})</span>
                </a>
                <button
                  type="button"
                  onClick={handleCopyDetails}
                  className="px-4 py-2 rounded-lg bg-surface-container-highest hover:bg-surface-bright text-on-surface font-semibold text-xs border border-surface-container-high flex items-center gap-1.5 cursor-pointer transition-colors"
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

      {/* 4. Reservation Policy & Frequently Asked Questions */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-tertiary">
        <div className="p-5 rounded-2xl bg-surface-container border border-surface-container-high/60 flex flex-col gap-2">
          <strong className="text-on-surface font-semibold block text-sm">
            Table Duration &amp; Holding Policy
          </strong>
          <p className="leading-relaxed">
            Reserved tables are held for up to 15 minutes past your booking time before being released to walk-in guests. During busy weekend dinner seatings, a 75-minute dining duration allows us to accommodate all patrons comfortably.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container border border-surface-container-high/60 flex flex-col gap-2">
          <strong className="text-on-surface font-semibold block text-sm">
            Corkage &amp; Outside Food Policy
          </strong>
          <p className="leading-relaxed">
            Corkage fee is $20 per bottle of wine or champagne. Strictly no outside beers allowed. Birthday cakes may be kept in our chillers and served without cutting fees!
          </p>
        </div>
      </section>
    </div>
  );
}
