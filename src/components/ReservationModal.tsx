import { useState } from 'react';
import { RESTAURANT_INFO, OUTLETS } from '../data/restaurantData';
import { TableReservationRequest } from '../types';
import { validateGuestCount } from '../utils/reservationValidation';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultOutletId?: 'keong-saik' | 'city-square-mall';
}

export function ReservationModal({ isOpen, onClose, defaultOutletId = 'keong-saik' }: ReservationModalProps) {
  const [formData, setFormData] = useState<TableReservationRequest>({
    outlet: defaultOutletId,
    name: '',
    phone: '',
    guests: '',
    dateTime: '',
    dietaryNotes: ''
  });

  const [guestError, setGuestError] = useState<string | null>(null);
  const [guestTouched, setGuestTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const currentOutlet = OUTLETS.find((o) => o.id === formData.outlet) || OUTLETS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const guestValidation = validateGuestCount(formData.guests);
    if (!guestValidation.isValid) {
      setGuestError(guestValidation.error);
      setGuestTouched(true);
      return;
    }

    if (!formData.name.trim() || !formData.phone.trim()) return;

    try {
      const existing = JSON.parse(localStorage.getItem('koksen_reservations') || '[]');
      existing.push({
        ...formData,
        outletName: currentOutlet.name,
        outletPhone: currentOutlet.whatsappNumber,
        guestNumber: guestValidation.count,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('koksen_reservations', JSON.stringify(existing));
    } catch {
      // ignore
    }

    setSubmitted(true);
  };

  const getWhatsAppBookingLink = (outletId: 'keong-saik' | 'city-square-mall' = formData.outlet) => {
    const targetOutlet = OUTLETS.find((o) => o.id === outletId) || OUTLETS[0];
    const text = encodeURIComponent(
      `Hello Kok Sen Restaurant (${targetOutlet.shortName})! I would like to reserve a table:\n\n` +
      `• Outlet: ${targetOutlet.name}\n` +
      `• Name: ${formData.name || '(Your Name)'}\n` +
      `• Mobile: ${formData.phone || '(Contact)'}\n` +
      `• Number of Guests: ${formData.guests}\n` +
      `• Date & Time: ${formData.dateTime || 'Tonight'}\n` +
      (formData.dietaryNotes ? `• Notes: ${formData.dietaryNotes}\n` : '') +
      `\nPlease let me know if you have an open table. Thank you!`
    );
    return `https://wa.me/${targetOutlet.phoneClean}?text=${text}`;
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
        >
          <span className="material-symbols-outlined text-[22px] sm:text-[24px]">close</span>
        </button>

        <div className="flex items-center gap-2 mb-1 pr-8">
          <span className="material-symbols-outlined text-secondary text-[22px] sm:text-[24px]">table_restaurant</span>
          <h3 className="font-headline-md text-xl sm:text-headline-md text-on-surface font-bold">
            Table Reservation
          </h3>
        </div>
        <p className="font-body-md text-xs sm:text-body-md text-tertiary mb-3">
          Book your table or link directly to our mainline WhatsApp for instant assistance.
        </p>

        {/* Quick WhatsApp Mainline Buttons */}
        <div className="mb-4 p-3 rounded-xl bg-surface-container border border-surface-container-high/70">
          <span className="font-label-caps text-[11px] uppercase tracking-wider text-secondary font-bold block mb-2">
            Mainline WhatsApp Direct:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <a
              href="https://wa.me/6597272533?text=Hello%20Kok%20Sen%20(Keong%20Saik%20Outlet)!%20I%20would%20like%20to%20make%20a%20table%20reservation."
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
              href="https://wa.me/6596244244?text=Hello%20Kok%20Sen%20(City%20Square%20Mall%20Outlet)!%20I%20would%20like%20to%20make%20a%20table%20reservation."
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

        {submitted ? (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3">
            <span className="material-symbols-outlined text-emerald-400 text-[36px]">check_circle</span>
            <h4 className="font-dish-title text-dish-title text-on-surface font-bold">
              Reservation Logged for {currentOutlet.shortName}
            </h4>
            <p className="font-body-sm text-body-sm text-tertiary">
              We look forward to hosting you, {formData.name}! We have logged your request for <strong className="text-on-surface">{formData.guests} {parseInt(formData.guests) === 1 ? 'guest' : 'guests'}</strong> at <strong className="text-secondary">{currentOutlet.name}</strong>. Send your details directly to the {currentOutlet.shortName} mainline WhatsApp (<strong className="text-emerald-400 font-mono">+{currentOutlet.phoneClean}</strong>) for instant confirmation.
            </p>
            <a
              href={getWhatsAppBookingLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-button-text text-button-text uppercase tracking-wider flex items-center justify-center gap-2 font-bold shadow-md transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span>Open in WhatsApp ({currentOutlet.whatsappNumber})</span>
            </a>
            <div className="pt-2 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs text-tertiary hover:text-on-surface underline cursor-pointer"
              >
                Edit request
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-secondary text-body-sm font-semibold hover:underline cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
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
                      onClick={() => setFormData({ ...formData, outlet: outlet.id })}
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
                      <div className="text-[11px] font-medium text-secondary mt-0.5">
                        {outlet.id === 'city-square-mall' ? 'Open Daily · Mon–Sun (11:30am–2:30pm · 4:30pm–9:00pm)' : 'Tue–Sun (12:00pm–2:15pm · 5:00pm–9:15pm, Mon Closed)'}
                      </div>
                      <div className="text-[11px] font-mono font-medium text-emerald-400 mt-0.5">
                        WhatsApp: {outlet.whatsappNumber}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

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
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container text-on-surface border border-surface-container-high focus:outline-none focus:border-secondary font-body-md text-sm"
                />
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
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container text-on-surface border border-surface-container-high focus:outline-none focus:border-secondary font-body-md text-sm"
                />
              </div>
            </div>

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
                    setFormData({ ...formData, guests: val });
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
                    guestError && guestTouched
                      ? 'border-rose-500 focus:border-rose-400'
                      : 'border-surface-container-high focus:border-secondary'
                  }`}
                />
                {guestError && guestTouched && (
                  <span className="text-xs text-rose-400 flex items-center gap-1 mt-1 animate-in fade-in duration-200">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    <span>{guestError}</span>
                  </span>
                )}
              </div>

              <div>
                <label className="font-label-caps text-label-caps uppercase text-tertiary block mb-1">
                  Date &amp; Time
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Tonight 7pm / Tomorrow 12:30pm"
                  value={formData.dateTime}
                  onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container text-on-surface border border-surface-container-high focus:outline-none focus:border-secondary font-body-md text-sm"
                />
              </div>
            </div>


            <div>
              <label className="font-label-caps text-label-caps uppercase text-tertiary block mb-1">
                Notes (Optional)
              </label>
              <textarea 
                rows={2}
                placeholder="Special occasion, dietary requests..."
                value={formData.dietaryNotes}
                onChange={(e) => setFormData({ ...formData, dietaryNotes: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-surface-container text-on-surface border border-surface-container-high focus:outline-none focus:border-secondary font-body-md text-sm"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                className="flex-1 py-3 rounded-lg bg-secondary hover:bg-secondary-fixed text-on-secondary font-button-text text-button-text uppercase tracking-wider transition-colors cursor-pointer font-bold shadow-sm"
              >
                Submit Request
              </button>
              <a
                href={getWhatsAppBookingLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-button-text text-button-text uppercase tracking-wider flex items-center justify-center gap-1.5 font-bold shadow-md transition-colors"
                title={`Send reservation to ${currentOutlet.shortName} WhatsApp mainline`}
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>WhatsApp ({currentOutlet.whatsappNumber})</span>
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
