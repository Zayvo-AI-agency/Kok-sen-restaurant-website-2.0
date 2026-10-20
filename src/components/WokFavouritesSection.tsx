import { useState } from 'react';
import { MenuItem } from '../types';
import { TOP_SIGNATURES } from '../data/restaurantData';
import { resolveDishPhoto } from '../utils/dishPhotoResolver';
import { Plus, Check, Flame, UtensilsCrossed } from 'lucide-react';

interface WokFavouritesSectionProps {
  onSelectDish: (dish: MenuItem) => void;
  onAddToOrder: (dish: MenuItem) => void;
  orderedItemIds: string[];
  onViewAll?: () => void;
}

export function WokFavouritesSection({ 
  onSelectDish, 
  onAddToOrder, 
  orderedItemIds,
  onViewAll
}: WokFavouritesSectionProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [imageSources, setImageSources] = useState<Record<string, string>>({});

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
      return;
    }
    const el = document.getElementById('full-menu');
    if (el) {
      const headerEl = document.getElementById('main-header');
      const headerOffset = (headerEl?.offsetHeight || 90) + 10;
      const y = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
  };

  return (
    <section id="signatures" className="mt-8 sm:mt-space-3xl w-full max-w-full overflow-hidden flex flex-col gap-3.5 sm:gap-space-md">
      {/* Header with authentic heritage styling */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-surface-container-high/40 pb-2.5 sm:pb-3">
        <div>
          <span className="font-subheading-script text-xs sm:text-subheading-script text-secondary italic">
            Our legendary wok specialties
          </span>
          <h2 className="font-headline-xl text-2xl sm:text-3xl md:text-headline-xl text-on-surface mt-0.5 tracking-tight">
            Must-Try Signature Dishes
          </h2>
          <p className="font-body-md text-xs sm:text-body-md text-tertiary mt-0.5">
            Michelin recommended claypot &amp; wok specialities fired over roaring flames
          </p>
        </div>

        <button
          type="button"
          onClick={handleViewAll}
          className="text-secondary hover:text-secondary-fixed font-button-text font-bold text-xs sm:text-sm tracking-wider uppercase shrink-0 cursor-pointer hover:underline self-start sm:self-end pb-0.5"
        >
          View Full Menu →
        </button>
      </div>

      {/* Dish List Grid - Responsive 1 column on mobile, 2 columns on tablet/desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 md:gap-5 w-full">
        {TOP_SIGNATURES.map((dish, idx) => {
          const dishKey = dish.source_item_id || dish.id;
          const isAdded = orderedItemIds.includes(dish.id);
          const photoRes = resolveDishPhoto(dish);
          const currentSrc = imageSources[dishKey] || photoRes.imageUrl || dish.imageUrl || photoRes.photo_source_url || dish.photo_source_url;
          const hasValidImage = Boolean(photoRes.hasOriginalPhoto && currentSrc && !imageErrors[dishKey] && !photoRes.isConflict);

          return (
            <div 
              key={dishKey}
              className="bg-surface-container hover:bg-surface-container-high rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-surface-container-high/70 shadow-md hover:shadow-xl transition-all duration-200 flex items-start gap-3 sm:gap-4 group cursor-pointer w-full max-w-full min-w-0 overflow-hidden"
              onClick={() => onSelectDish(dish)}
            >
              {/* Square Food Image with pure white background */}
              {hasValidImage ? (
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-lg sm:rounded-xl overflow-hidden bg-white shrink-0 border border-surface-container-high/70 shadow-xs flex items-center justify-center p-1.5">
                  <img 
                    src={currentSrc} 
                    alt={dish.nameEn}
                    className="w-full h-full object-contain block"
                    loading="lazy"
                    onError={() => {
                      const fallbackUrl = photoRes.photo_source_url || dish.photo_source_url || dish.source_url;
                      if (fallbackUrl && currentSrc !== fallbackUrl) {
                        setImageSources((prev) => ({ ...prev, [dishKey]: fallbackUrl }));
                      } else {
                        setImageErrors((prev) => ({ ...prev, [dishKey]: true }));
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-lg sm:rounded-xl overflow-hidden bg-white shrink-0 border border-surface-container-high/60 shadow-xs flex flex-col items-center justify-center p-2 text-center text-tertiary select-none">
                  <span className="font-mono text-xs font-bold text-secondary mb-0.5">{dish.itemCode || dish.code}</span>
                  <span className="text-[10px] text-tertiary/70 leading-tight">Photo unavailable</span>
                </div>
              )}

              {/* Right Details - Natural flex flow, no overflowing words */}
              <div className="flex-1 min-w-0 flex flex-col justify-between min-h-[5rem] sm:min-h-[6.5rem]">
                <div className="min-w-0">
                  {/* Badges Row */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className="px-2 py-0.5 rounded-md bg-primary/20 text-primary border border-primary/30 text-[10px] font-bold shrink-0">
                      Signature #{idx + 1}
                    </span>
                    {dish.spicyLevel && dish.spicyLevel > 0 ? (
                      <span className="px-2 py-0.5 rounded-md bg-secondary/20 text-secondary border border-secondary/30 text-[10px] font-bold flex items-center gap-0.5 shrink-0">
                        <Flame className="w-3 h-3 text-secondary shrink-0" />
                        <span>Spicy</span>
                      </span>
                    ) : null}
                  </div>

                  {/* English & Chinese Dish Name */}
                  <h3 className="font-dish-title text-sm sm:text-base md:text-dish-title font-bold text-on-surface group-hover:text-secondary transition-colors break-words leading-snug">
                    {dish.nameEn}
                  </h3>
                  <p className="font-serif text-xs sm:text-sm text-secondary/90 break-words mt-0.5">
                    {dish.nameZh}
                  </p>

                  {/* Description neatly wrapped */}
                  <p className="font-body-md text-xs sm:text-body-sm text-tertiary mt-1 line-clamp-2 break-words leading-relaxed">
                    {dish.description}
                  </p>
                </div>

                {/* Portions and + Add Button Row */}
                <div className="flex items-center justify-between pt-2 mt-2 border-t border-surface-container-high/40">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {dish.sizes && (
                      <span className="text-[11px] text-tertiary">
                        <strong className="text-secondary font-medium">Portions: </strong>
                        {[
                          dish.sizes.small !== undefined && 'S',
                          dish.sizes.medium !== undefined && 'M',
                          dish.sizes.large !== undefined && 'L',
                          dish.sizes.half !== undefined && 'Half',
                          dish.sizes.whole !== undefined && 'Whole'
                        ].filter(Boolean).join(' · ')}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button 
                      type="button" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToOrder(dish);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                        isAdded 
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                          : 'bg-primary text-white hover:bg-[#8C2214]'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 shrink-0" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 shrink-0" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
