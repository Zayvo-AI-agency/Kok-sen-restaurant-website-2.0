import { TableSpreadPreset } from '../types';
import { TABLE_SPREAD_PRESETS } from '../data/restaurantData';

interface OrderingForTableSectionProps {
  onLoadPresetSpread: (preset: TableSpreadPreset) => void;
  onOpenReservation: () => void;
}

export function OrderingForTableSection({
  onLoadPresetSpread,
  onOpenReservation
}: OrderingForTableSectionProps) {
  return (
    <section id="ordering-guide" className="mt-8 sm:mt-space-3xl w-full max-w-full overflow-hidden flex flex-col gap-4 sm:gap-space-lg">
      <div className="flex flex-col gap-1 sm:gap-space-xs">
        <span className="font-subheading-script text-xs sm:text-subheading-script text-secondary italic">
          How to order zi char
        </span>
        <h2 className="font-headline-xl text-2xl sm:text-3xl md:text-headline-xl text-on-surface mt-0.5">Ordering for the Table</h2>
        <p className="font-body-md text-xs sm:text-body-md text-tertiary max-w-2xl leading-relaxed">
          Zi char is best when every dish plays a different role: one soup or gravy, one crisp fry, one hot claypot, and greens to reset the palate. Here is where most regulars begin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {TABLE_SPREAD_PRESETS.map((preset, idx) => {
          const isPopular = preset.isMostPopular;
          const isLastOnTablet = idx === 2;

          return (
            <div 
              key={preset.id}
              className={`flex flex-col justify-between p-4 sm:p-space-lg rounded-xl transition-all duration-300 ease-out relative border transform hover:scale-[1.01] hover:-translate-y-0.5 ${
                isLastOnTablet ? 'md:col-span-2 lg:col-span-1' : ''
              } ${
                isPopular
                  ? 'bg-surface-container-high border-secondary/60 shadow-[0_8px_30px_rgba(252,186,96,0.12)] hover:shadow-[0_12px_36px_rgba(252,186,96,0.2)]'
                  : 'bg-surface-container border-surface-container-high/60 shadow-md hover:bg-surface-container-high hover:shadow-xl'
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-secondary text-on-secondary font-label-caps text-[10px] uppercase font-bold tracking-widest shadow-md">
                  Most Popular
                </div>
              )}

              <div className="flex flex-col gap-2.5 sm:gap-space-sm">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-headline-md text-lg sm:text-headline-md text-on-surface">
                    {preset.title}
                  </h3>
                  <span className="font-label-caps text-xs sm:text-label-caps text-secondary font-semibold shrink-0">
                    {preset.dinerCount}
                  </span>
                </div>

                <div className="font-price-tag text-sm sm:text-price-tag text-primary font-bold">
                  {preset.estimatedTotal}
                </div>

                <p className="font-body-md text-xs sm:text-body-md text-tertiary leading-relaxed">
                  {preset.subtitle}
                </p>

                <ul className="space-y-1.5 pt-2 font-body-md text-xs sm:text-body-md text-on-surface border-t border-surface-container-highest/60">
                  {preset.dishes.map((dish, dishIdx) => (
                    <li key={dishIdx} className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-secondary shrink-0">
                        check
                      </span>
                      <span>{dish}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 sm:pt-space-md mt-3 sm:mt-space-md border-t border-surface-container-highest/60 flex flex-col gap-2.5 sm:gap-space-sm">
                <p className="font-body-sm text-xs sm:text-body-sm text-tertiary italic">
                  {preset.note}
                </p>

                {preset.id === 'eight-or-more' ? (
                  <button
                    type="button"
                    onClick={onOpenReservation}
                    className="w-full py-2.5 sm:py-3 rounded-lg bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary font-button-text text-xs sm:text-button-text uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md font-bold active:scale-98"
                  >
                    <span className="material-symbols-outlined text-[16px]">event_seat</span>
                    <span>Reserve a Round Table</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onLoadPresetSpread(preset)}
                    className={`w-full py-2.5 sm:py-3 rounded-lg font-button-text text-xs sm:text-button-text uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md font-bold active:scale-98 ${
                      isPopular
                        ? 'bg-secondary text-on-secondary hover:bg-secondary-fixed'
                        : 'bg-surface-container-highest text-on-surface hover:bg-secondary hover:text-on-secondary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                    <span>Load Preset into Order</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
