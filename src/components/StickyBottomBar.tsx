import { RESTAURANT_INFO } from '../data/restaurantData';
import { Sparkles } from 'lucide-react';

interface StickyBottomBarProps {
  onOpenReservation: () => void;
  onOpenOrderDrawer: () => void;
  onOpenConcierge: () => void;
  orderCount: number;
}

export function StickyBottomBar({
  onOpenReservation,
  onOpenOrderDrawer,
  onOpenConcierge,
  orderCount
}: StickyBottomBarProps) {
  return (
    <div 
      id="sticky-actions-bar"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-xl border-t border-surface-container-high/80 px-3 py-2 sm:px-6 sm:py-2.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.6)] transition-all"
    >
      <div className="max-w-[1440px] 2xl:max-w-[1560px] mx-auto flex items-center justify-between gap-2 sm:gap-3">
        {/* Left Info: Phone & Address (tablet screens) */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={`tel:${RESTAURANT_INFO.phoneClean}`}
            className="flex items-center gap-1.5 text-secondary font-price-tag text-sm hover:underline"
          >
            <span className="material-symbols-outlined text-[18px]">call</span>
            <span>+65 9727 2533</span>
          </a>
          <span className="text-surface-bright">|</span>
          <span className="text-tertiary font-body-sm text-xs">
            4 Keong Saik Road · Walk-ins Welcome
          </span>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between sm:justify-end">
          {/* AI Concierge Trigger */}
          <button
            type="button"
            onClick={onOpenConcierge}
            className="px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-semibold flex items-center gap-1.5 border border-primary/30 transition-colors shrink-0 cursor-pointer active:scale-95"
            title="Ask Kok Sen AI Dining Concierge"
          >
            <Sparkles className="w-4 h-4 text-primary shrink-0" />
            <span className="text-xs font-bold text-on-surface">Concierge</span>
          </button>

          {/* Table order tray trigger */}
          {orderCount > 0 && (
            <button
              type="button"
              onClick={onOpenOrderDrawer}
              className="px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-lg bg-primary-container text-on-primary-container font-semibold flex items-center gap-1.5 border border-primary transition-colors shrink-0 cursor-pointer shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              <span className="text-xs font-bold">Order</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white text-primary-container text-[11px] font-black">
                {orderCount}
              </span>
            </button>
          )}

          {/* Call to Order */}
          <a
            href={`tel:${RESTAURANT_INFO.phoneClean}`}
            className="px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs uppercase tracking-wider flex items-center justify-center gap-1 transition-colors border border-surface-container-high shrink-0 active:scale-95 font-semibold"
            title="Call Restaurant Directly"
          >
            <span className="material-symbols-outlined text-secondary text-[17px]">call</span>
            <span className="hidden xs:inline">Call</span>
          </a>

          {/* Reserve Table - Primary CTA */}
          <button
            type="button"
            onClick={onOpenReservation}
            className="flex-1 sm:flex-initial px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-secondary hover:bg-secondary-fixed text-on-secondary text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-[0_4px_16px_rgba(252,186,96,0.25)] cursor-pointer active:scale-95 font-bold"
          >
            <span className="material-symbols-outlined text-[17px] shrink-0">table_bar</span>
            <span className="whitespace-nowrap">Reserve Table</span>
          </button>
        </div>
      </div>
    </div>
  );
}
