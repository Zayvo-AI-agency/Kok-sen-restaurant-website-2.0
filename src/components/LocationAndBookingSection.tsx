import { useState } from 'react';
import { RESTAURANT_INFO, OUTLETS, getOpeningStatus, PHOTO_ASSETS } from '../data/restaurantData';
import { TableReservationRequest } from '../types';
import { validateGuestCount } from '../utils/reservationValidation';
import {
  buildReservationWhatsAppUrl,
  triggerWhatsAppNavigation,
  OUTLET_WHATSAPP_CONFIG,
  ReservationOutletId
} from '../utils/reservationWhatsApp';

export function LocationAndBookingSection() {
  const [selectedOutletTab, setSelectedOutletTab] = useState<'keong-saik' | 'city-square-mall'>('keong-saik');
  const status = getOpeningStatus(selectedOutletTab);

  const [formData, setFormData] = useState<TableReservationRequest>({
    outlet: 'keong-saik',
    name: '',
    phone: '',
    guests: '',
    dateTime: '',
    dietaryNotes: ''
  });

  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [guestError, setGuestError] = useState<string | null>(null);
  const [dateTimeError, setDateTimeError] = useState<string | null>(null);
  const [guestTouched, setGuestTouched] = useState(false);
  const [preparedUrl, setPreparedUrl] = useState<string | null>(null);
  const [preparedMessage, setPreparedMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentOutlet = OUTLETS.find((o) => o.id === formData.outlet) || OUTLETS[0];
  const outletConfig = OUTLET_WHATSAPP_CONFIG[formData.outlet as ReservationOutletId] || OUTLET_WHATSAPP_CONFIG['keong-saik'];

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

    if (hasError) return;

    if (isSubmitting) return;
    setIsSubmitting(true);

    const { whatsappUrl, rawMessage } = buildReservationWhatsAppUrl({
      outlet: formData.outlet as ReservationOutletId,
      name: nameTrimmed,
      phone: phoneTrimmed,
      guests: formData.guests.trim(),
      dateTime: dateTimeTrimmed,
      notes: formData.dietaryNotes.trim()
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
    <section id="find-us-and-hours" className="mt-8 sm:mt-space-3xl w-full max-w-full overflow-hidden flex flex-col gap-4 sm:gap-space-lg">
      <div className="flex flex-col gap-1 sm:gap-space-xs">
        <span className="font-subheading-script text-xs sm:text-subheading-script text-secondary italic">
          Keong Saik Flagship &amp; City Square Mall
        </span>
        <h2 className="font-headline-xl text-2xl sm:text-3xl md:text-headline-xl text-on-surface mt-0.5">Tables &amp; Outlets</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-gutter xl:gap-8">
        {/* Left Column: Hours, Location, Outlets switcher */}
        <div className="lg:col-span-6 flex flex-col gap-3.5 sm:gap-space-md">
          {/* Status badge */}
          <div className="p-3 sm:p-space-md rounded-xl bg-surface-container border border-surface-container-high/60 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-space-sm min-w-0">
              <span className={`w-3 h-3 rounded-full shrink-0 ${status.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-secondary'}`} />
              <span className="font-price-tag text-xs sm:text-price-tag text-on-surface truncate">
                {status.message}
              </span>
            </div>
            <span className="font-label-caps text-[10px] sm:text-label-caps text-secondary uppercase font-bold tracking-wider shrink-0">
              Live Kitchens
            </span>
          </div>

          {/* Outlets Information Card */}
          <div className="p-4 sm:p-space-lg rounded-xl bg-surface-container border border-surface-container-high/60 flex flex-col gap-3.5 sm:gap-space-md">
            {/* Tabs for Outlet details */}
            <div className="flex items-center gap-2 border-b border-surface-container-highest/60 pb-2.5">
              <button
                type="button"
                onClick={() => setSelectedOutletTab('keong-saik')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedOutletTab === 'keong-saik'
                    ? 'bg-secondary text-on-secondary shadow-xs'
                    : 'text-tertiary hover:text-on-surface hover:bg-surface-container-high'
                }`}
              >
                1) Keong Saik (Flagship)
              </button>
              <button
                type="button"
                onClick={() => setSelectedOutletTab('city-square-mall')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedOutletTab === 'city-square-mall'
                    ? 'bg-secondary text-on-secondary shadow-xs'
                    : 'text-tertiary hover:text-on-surface hover:bg-surface-container-high'
                }`}
              >
                2) City Square Mall
              </button>
            </div>

            {selectedOutletTab === 'keong-saik' ? (
              <>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-xs uppercase tracking-wider text-secondary">
                      Keong Saik Flagship Shophouse
                    </span>
                    <a
                      href="https://wa.me/6597272533"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 font-bold text-xs flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">chat</span>
                      <span>WA: 9727 2533</span>
                    </a>
                  </div>
                  <p className="font-dish-title text-base sm:text-dish-title text-on-surface font-semibold mt-1">
                    4 Keong Saik Road, Singapore 089110
                  </p>
                  <p className="font-body-sm text-xs sm:text-body-sm text-tertiary mt-0.5">
                    Historic Chinatown / Keong Saik Conservation Area
                  </p>
                </div>

                <div className="border-t border-surface-container-highest/60 pt-3 sm:pt-space-md">
                  <span className="font-label-caps text-xs uppercase tracking-wider text-secondary">
                    Opening Hours
                  </span>
                  <div className="mt-2 space-y-1.5 font-body-md text-xs sm:text-body-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 border-b border-surface-container-high/30 gap-0.5 sm:gap-2">
                      <span className="text-on-surface font-semibold">Monday</span>
                      <span className="text-rose-400 font-semibold sm:text-right">Closed (Weekly Kitchen Rest)</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 border-b border-surface-container-high/30 gap-1 sm:gap-2">
                      <span className="text-on-surface font-semibold shrink-0">Tuesday – Sunday</span>
                      <div className="sm:text-right space-y-0.5 text-tertiary">
                        <div><span className="text-secondary/90 font-medium">Lunch:</span> 12:00 PM–2:45 PM <span className="text-tertiary text-xs">(Last order 2:15 PM)</span></div>
                        <div><span className="text-secondary/90 font-medium">Dinner:</span> 5:00 PM–9:45 PM <span className="text-tertiary text-xs">(Last order 9:15 PM)</span></div>
                      </div>
                    </div>
                    <div className="text-[11px] sm:text-xs text-secondary/90 italic pt-1 leading-relaxed">
                      * Last order for lunch: 2:15 PM · Last order for dinner: 9:15 PM. Evening queue begins ~15m before doors open.
                    </div>
                  </div>
                </div>

                <div className="border-t border-surface-container-highest/60 pt-3 sm:pt-space-md">
                  <span className="font-label-caps text-xs uppercase tracking-wider text-secondary">
                    Getting Here (MRT &amp; Parking)
                  </span>
                  <ul className="mt-2 space-y-1.5 font-body-sm text-xs sm:text-body-sm text-tertiary">
                    {RESTAURANT_INFO.mrtStations.map((station, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-secondary shrink-0">train</span>
                        <span><strong className="text-on-surface">{station.name}:</strong> {station.distance}</span>
                      </li>
                    ))}
                    <li className="flex items-start gap-2 pt-1 text-tertiary">
                      <span className="material-symbols-outlined text-[16px] text-primary shrink-0 mt-0.5">local_parking</span>
                      <span>Metered street parking along Keong Saik Rd, or multi-storey at Kreta Ayer Complex &amp; Duxton Plain.</span>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-xs uppercase tracking-wider text-secondary">
                      City Square Mall Outlet
                    </span>
                    <a
                      href="https://wa.me/6596244244"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 font-bold text-xs flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">chat</span>
                      <span>WA: 9624 4244</span>
                    </a>
                  </div>
                  <p className="font-dish-title text-base sm:text-dish-title text-on-surface font-semibold mt-1">
                    180 Kitchener Rd, #04-31/32 City Square Mall, Singapore 208539
                  </p>
                  <p className="font-body-sm text-xs sm:text-body-sm text-tertiary mt-0.5">
                    Kitchener Road / Farrer Park MRT Station (Direct Underground Link)
                  </p>
                </div>

                <div className="border-t border-surface-container-highest/60 pt-3 sm:pt-space-md">
                  <span className="font-label-caps text-xs uppercase tracking-wider text-secondary">
                    Opening Hours
                  </span>
                  <div className="mt-2 space-y-1.5 font-body-md text-xs sm:text-body-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 border-b border-surface-container-high/30 gap-1 sm:gap-2">
                      <span className="text-on-surface font-semibold shrink-0">Open daily · Monday–Sunday</span>
                      <div className="sm:text-right space-y-0.5 text-tertiary">
                        <div><span className="text-secondary/90 font-medium">Lunch:</span> 11:30 AM–3:00 PM <span className="text-tertiary text-xs">(Last order 2:30 PM)</span></div>
                        <div><span className="text-secondary/90 font-medium">Dinner:</span> 4:30 PM–9:30 PM <span className="text-tertiary text-xs">(Last order 9:00 PM)</span></div>
                      </div>
                    </div>
                    <div className="text-[11px] sm:text-xs text-secondary/90 italic pt-1 leading-relaxed">
                      * Last order for lunch: 2:30 PM · Last order for dinner: 9:00 PM. Fully air-conditioned dining room.
                    </div>
                  </div>
                </div>

                <div className="border-t border-surface-container-highest/60 pt-3 sm:pt-space-md">
                  <span className="font-label-caps text-xs uppercase tracking-wider text-secondary">
                    Getting Here (MRT &amp; Parking)
                  </span>
                  <ul className="mt-2 space-y-1.5 font-body-sm text-xs sm:text-body-sm text-tertiary">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-secondary shrink-0">train</span>
                      <span><strong className="text-on-surface">Farrer Park MRT (NE8):</strong> Direct connection via Exit I</span>
                    </li>
                    <li className="flex items-start gap-2 pt-1 text-tertiary">
                      <span className="material-symbols-outlined text-[16px] text-primary shrink-0 mt-0.5">local_parking</span>
                      <span>Ample indoor sheltered parking inside City Square Mall basement carpark.</span>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>

          {/* Keong Saik Streetscape preview */}
          <div className="h-44 sm:h-52 rounded-xl overflow-hidden relative group bg-surface-container border border-surface-container-high/60 shadow-md">
            <img 
              alt="Daytime view of Keong Saik Road shophouses outside Kok Sen Restaurant with Pinnacle@Duxton in background" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              src={PHOTO_ASSETS.streetAwning}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/30 to-transparent flex items-end justify-between p-3 sm:p-space-md">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-primary text-[22px] sm:text-[24px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                  location_on
                </span>
                <div className="min-w-0">
                  <span className="font-dish-title text-sm sm:text-dish-title text-on-surface block truncate">
                    Kok Sen Heritage
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-tertiary truncate block">Michelin Bib Gourmand 2016–2026</span>
                </div>
              </div>
              <a 
                href={RESTAURANT_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold flex items-center gap-1.5 shadow-md hover:bg-primary/90 transition-colors cursor-pointer"
              >
                <span>Google Maps</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Table Reservation Form */}
        <div className="lg:col-span-6">
          <div className="p-4 sm:p-space-lg md:p-space-xl rounded-xl bg-surface-container border border-surface-container-high/60 shadow-xl flex flex-col justify-between h-full">
            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <h3 className="font-headline-md text-xl sm:text-headline-md text-on-surface">
                  Request a Table
                </h3>
                <span className="font-label-caps text-xs sm:text-label-caps text-secondary font-bold">
                  No Booking Fees
                </span>
              </div>
              <p className="font-body-md text-xs sm:text-body-md text-tertiary mb-3 sm:mb-space-md leading-relaxed">
                Complete your details below, then continue to WhatsApp and tap Send to submit your reservation request. Your booking is confirmed only after the restaurant replies with confirmation.
              </p>

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2.5 sm:gap-space-sm">
                {/* Outlet Selection */}
                <div>
                  <label className="font-label-caps text-[11px] sm:text-label-caps uppercase text-tertiary block mb-1">
                    Choose Outlet *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {OUTLETS.map((outlet) => {
                      const isSelected = formData.outlet === outlet.id;
                      return (
                        <button
                          key={outlet.id}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, outlet: outlet.id });
                            setSelectedOutletTab(outlet.id);
                            setPreparedUrl(null);
                          }}
                          className={`p-2.5 rounded-lg text-left border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-secondary/15 border-secondary text-on-surface shadow-xs'
                              : 'bg-surface-container-low border-surface-container-high text-tertiary hover:border-outline'
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
                          <div className="text-[11px] font-mono text-emerald-400 font-semibold mt-0.5">
                            WhatsApp: {outlet.whatsappNumber}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-space-sm">
                  <div>
                    <label className="font-label-caps text-[11px] sm:text-label-caps uppercase text-tertiary block mb-1">
                      Your Name *
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Rachel Tan"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (nameError) setNameError(null);
                        setPreparedUrl(null);
                      }}
                      className={`w-full px-3 py-2 sm:py-2.5 rounded-lg bg-surface-container-low text-on-surface border text-sm focus:outline-none transition-colors ${
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
                    <label className="font-label-caps text-[11px] sm:text-label-caps uppercase text-tertiary block mb-1">
                      Mobile / WhatsApp *
                    </label>
                    <input 
                      type="tel"
                      required
                      placeholder="+65 9123 4567"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (phoneError) setPhoneError(null);
                        setPreparedUrl(null);
                      }}
                      className={`w-full px-3 py-2 sm:py-2.5 rounded-lg bg-surface-container-low text-on-surface border text-sm focus:outline-none transition-colors ${
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-space-sm">
                  <div>
                    <label className="font-label-caps text-[11px] sm:text-label-caps uppercase text-tertiary block mb-1">
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
                        setFormData({ ...formData, guests: val });
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
                      className={`w-full px-3 py-2 sm:py-2.5 rounded-lg bg-surface-container-low text-on-surface border placeholder:text-tertiary focus:outline-none text-sm transition-colors ${
                        guestError && guestTouched
                          ? 'border-rose-500 focus:border-rose-400'
                          : 'border-surface-container-high focus:border-secondary'
                      }`}
                    />
                    {guestError && guestTouched ? (
                      <span className="text-xs text-rose-400 flex items-center gap-1 mt-1 animate-in fade-in duration-200">
                        <span className="material-symbols-outlined text-[14px]">error</span>
                        <span>{guestError}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-tertiary block mt-1">
                        Seating arranged by restaurant staff.
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="font-label-caps text-[11px] sm:text-label-caps uppercase text-tertiary block mb-1">
                      Requested Date &amp; Time *
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. 25 Dec, 7:00 PM or Tonight 7:30 PM"
                      value={formData.dateTime}
                      onChange={(e) => {
                        setFormData({ ...formData, dateTime: e.target.value });
                        if (dateTimeError) setDateTimeError(null);
                        setPreparedUrl(null);
                      }}
                      className={`w-full px-3 py-2 sm:py-2.5 rounded-lg bg-surface-container-low text-on-surface border text-sm focus:outline-none transition-colors ${
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

                <div>
                  <label className="font-label-caps text-[11px] sm:text-label-caps uppercase text-tertiary block mb-1">
                    Dietary Preferences / Notes (Optional)
                  </label>
                  <textarea 
                    rows={2}
                    placeholder="e.g. Birthday dinner, less spicy, one vegetarian diner..."
                    value={formData.dietaryNotes}
                    onChange={(e) => {
                      setFormData({ ...formData, dietaryNotes: e.target.value });
                      setPreparedUrl(null);
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface border border-surface-container-high focus:outline-none focus:border-secondary text-sm"
                  />
                </div>

                <div className="pt-1 text-xs text-secondary font-medium leading-relaxed">
                  You must tap Send in WhatsApp for the restaurant to receive your request.
                </div>

                <div className="pt-1.5 flex flex-col sm:flex-row gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-button-text text-xs sm:text-button-text uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer font-bold text-center flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                    <span>Continue to WhatsApp</span>
                  </button>
                </div>

                {preparedUrl && (
                  <div className="mt-2 p-3 rounded-lg bg-surface-container-low border border-surface-container-high flex flex-col gap-2 animate-in fade-in duration-200">
                    <span className="text-xs text-tertiary leading-relaxed">
                      If WhatsApp did not open automatically, tap below to open or copy your details:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={preparedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">chat</span>
                        <span>Open WhatsApp ({outletConfig.displayPhone})</span>
                      </a>
                      <button
                        type="button"
                        onClick={handleCopyDetails}
                        className="px-3 py-1.5 rounded-lg bg-surface-container-highest hover:bg-surface-bright text-on-surface font-semibold text-xs border border-surface-container-high flex items-center gap-1.5 cursor-pointer transition-colors"
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

            {/* Direct Mainline WhatsApp Lines */}
            <div className="pt-3 sm:pt-space-md mt-3 sm:mt-space-md border-t border-surface-container-highest/60 flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-body-sm text-tertiary gap-2.5">
              <span className="font-semibold text-on-surface">Mainline WhatsApp Reservations:</span>
              <div className="flex flex-wrap items-center gap-3">
                <a 
                  href="https://wa.me/6597272533?text=Hello%20Kok%20Sen%20Keong%20Saik!%20I%20would%20like%20to%20make%20a%20reservation."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 font-bold hover:underline flex items-center gap-1"
                  title="WhatsApp Keong Saik Outlet"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  <span>1) Keong Saik: 9727 2533</span>
                </a>
                <span className="text-surface-bright hidden sm:inline">|</span>
                <a 
                  href="https://wa.me/6596244244?text=Hello%20Kok%20Sen%20City%20Square%20Mall!%20I%20would%20like%20to%20make%20a%20reservation."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 font-bold hover:underline flex items-center gap-1"
                  title="WhatsApp City Square Mall Outlet"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  <span>2) City Sq Mall: 9624 4244</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
