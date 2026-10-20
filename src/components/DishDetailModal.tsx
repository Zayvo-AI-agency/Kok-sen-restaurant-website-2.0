import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MenuItem } from '../types';
import { getDisplayedDishPhoto } from '../utils/dishPhotoResolver';

interface DishDetailModalProps {
  dish: MenuItem | null;
  resolvedImage?: string;
  dishes?: MenuItem[];
  onSelectDish?: (dish: MenuItem) => void;
  onClose: () => void;
  onAddToOrder: (dish: MenuItem, quantity: number, size?: string, unitPrice?: number) => void;
}

export function DishDetailModal({
  dish,
  resolvedImage,
  dishes,
  onSelectDish,
  onClose,
  onAddToOrder,
}: DishDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('S');
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollBodyRef = useRef<HTMLDivElement>(null);

  const resolvedPhoto = useMemo(() => {
    return getDisplayedDishPhoto(dish, resolvedImage);
  }, [dish, resolvedImage]);

  const deduplicatedDishes = useMemo(() => {
    if (!dishes || dishes.length === 0) return dish ? [dish] : [];
    const seen = new Set<string>();
    const list: MenuItem[] = [];
    for (const item of dishes) {
      if (!item || item.publish === false) continue;
      const key = item.source_item_id || item.id;
      if (key && !seen.has(key)) {
        seen.add(key);
        list.push(item);
      }
    }
    return list;
  }, [dishes, dish]);

  const currentDishKey = dish ? dish.source_item_id || dish.id : '';
  const currentIndex = useMemo(() => {
    if (!currentDishKey) return -1;
    return deduplicatedDishes.findIndex((d) => (d.source_item_id || d.id) === currentDishKey);
  }, [deduplicatedDishes, currentDishKey]);

  const showNavigation = Boolean(onSelectDish && deduplicatedDishes.length > 1 && currentIndex !== -1);
  const prevDish = showNavigation && currentIndex > 0 ? deduplicatedDishes[currentIndex - 1] : null;
  const nextDish =
    showNavigation && currentIndex < deduplicatedDishes.length - 1
      ? deduplicatedDishes[currentIndex + 1]
      : null;

  const handlePrevDish = useCallback(() => {
    if (prevDish && onSelectDish) {
      onSelectDish(prevDish);
    }
  }, [prevDish, onSelectDish]);

  const handleNextDish = useCallback(() => {
    if (nextDish && onSelectDish) {
      onSelectDish(nextDish);
    }
  }, [nextDish, onSelectDish]);

  const dishIdentityKey = dish ? `${dish.source_item_id || dish.id}-${resolvedPhoto.src || ''}` : 'none';
  const [overrideState, setOverrideState] = useState<{
    key: string;
    fallbackSrc?: string;
    hasError: boolean;
  }>({ key: dishIdentityKey, fallbackSrc: undefined, hasError: false });

  useEffect(() => {
    setQuantity(1);
    setOverrideState({ key: dishIdentityKey, fallbackSrc: undefined, hasError: false });
    if (scrollBodyRef.current) {
      scrollBodyRef.current.scrollTop = 0;
    }
    if (dish?.sizes) {
      if (dish.sizes.small !== undefined) setSelectedSize('S');
      else if (dish.sizes.half !== undefined) setSelectedSize('Half');
      else if (dish.sizes.whole !== undefined) setSelectedSize('Whole');
      else if (dish.sizes.medium !== undefined) setSelectedSize('M');
      else if (dish.sizes.large !== undefined) setSelectedSize('L');
      else setSelectedSize('S');
    } else {
      setSelectedSize('S');
    }
  }, [dish, dishIdentityKey]);

  useEffect(() => {
    if (!dish) return;
    if (dialogRef.current && !dialogRef.current.contains(document.activeElement)) {
      dialogRef.current.focus();
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tagName = target?.tagName?.toUpperCase() || '';
      const role = target?.getAttribute?.('role') || '';
      const isInteractiveInput =
        tagName === 'INPUT' ||
        tagName === 'TEXTAREA' ||
        tagName === 'SELECT' ||
        Boolean(target?.isContentEditable) ||
        role === 'listbox' ||
        role === 'combobox' ||
        role === 'slider';

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (isInteractiveInput) return;

      if (e.key === 'ArrowLeft' && prevDish) {
        e.preventDefault();
        handlePrevDish();
      } else if (e.key === 'ArrowRight' && nextDish) {
        e.preventDefault();
        handleNextDish();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dish, prevDish, nextDish, handlePrevDish, handleNextDish, onClose]);

  if (!dish) return null;

  const isCurrentDishState = overrideState.key === dishIdentityKey;
  const imageError = isCurrentDishState ? overrideState.hasError : false;
  const currentPhoto = (isCurrentDishState && overrideState.fallbackSrc) || resolvedPhoto.src;
  const hasValidPhoto = Boolean(currentPhoto && !imageError && resolvedPhoto.hasValidPhoto);

  // Determine effective unit price based on selected size or base price
  let currentUnitPrice = dish.price;
  if (dish.sizes) {
    if (selectedSize === 'S' && dish.sizes.small !== undefined) currentUnitPrice = dish.sizes.small;
    else if (selectedSize === 'M' && dish.sizes.medium !== undefined) currentUnitPrice = dish.sizes.medium;
    else if (selectedSize === 'L' && dish.sizes.large !== undefined) currentUnitPrice = dish.sizes.large;
    else if (selectedSize === 'Half' && dish.sizes.half !== undefined) currentUnitPrice = dish.sizes.half;
    else if (selectedSize === 'Whole' && dish.sizes.whole !== undefined) currentUnitPrice = dish.sizes.whole;
  }

  const handleAdd = () => {
    onAddToOrder(dish, quantity, dish.sizes ? selectedSize : undefined, currentUnitPrice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal & Desktop Side Navigation Wrapper */}
      <div className="relative z-10 flex items-center justify-center gap-3 lg:gap-4 w-full max-w-full">
        {/* Desktop Previous Dish Arrow (beside modal, inside viewport) */}
        {showNavigation && (
          <button
            type="button"
            onClick={handlePrevDish}
            disabled={!prevDish}
            aria-label={prevDish ? `Previous dish: ${prevDish.nameEn || prevDish.name}` : 'No previous dish'}
            title={prevDish ? `Previous: ${prevDish.nameEn || prevDish.name}` : 'First dish'}
            className={`hidden md:flex w-11 h-11 lg:w-12 lg:h-12 shrink-0 rounded-full items-center justify-center border transition-all shadow-xl ${
              prevDish
                ? 'bg-surface-container-low/95 hover:bg-surface-container-high text-on-surface hover:text-secondary border-surface-container-high hover:border-secondary/50 cursor-pointer active:scale-95'
                : 'bg-surface-container-low/40 text-tertiary/30 border-surface-container-high/30 cursor-not-allowed opacity-40'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Modal Dialog */}
        <div
          ref={dialogRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label={dish.nameEn || dish.name}
          className="relative w-full max-w-lg max-h-[90vh] sm:max-h-[92vh] flex flex-col bg-surface-container-low border border-surface-container-high rounded-2xl shadow-2xl overflow-hidden focus:outline-none animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-9 h-9 rounded-full bg-black/65 text-white hover:bg-black/85 flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] sm:text-[20px]">close</span>
          </button>

          {/* Scrollable Body */}
          <div ref={scrollBodyRef} className="overflow-y-auto flex-1">
            {/* Dish Image - Single approved photo matching the clicked card, proportional with original background and no white padding */}
            {hasValidPhoto ? (
              <div className="relative w-full max-h-[48vh] sm:max-h-[58vh] overflow-hidden bg-surface-container-lowest border-b border-surface-container-high/60 flex items-center justify-center shrink-0">
                <img 
                  key={dishIdentityKey}
                  src={currentPhoto} 
                  alt={dish.nameEn || dish.name} 
                  className="w-full h-auto max-h-[48vh] sm:max-h-[58vh] object-contain transition-opacity duration-200 block"
                  onError={() => {
                    const fallbackUrl = resolvedPhoto.fallbackSrc;
                    if (fallbackUrl && currentPhoto !== fallbackUrl) {
                      setOverrideState({
                        key: dishIdentityKey,
                        fallbackSrc: fallbackUrl,
                        hasError: false,
                      });
                    } else {
                      setOverrideState({
                        key: dishIdentityKey,
                        fallbackSrc: undefined,
                        hasError: true,
                      });
                    }
                  }}
                />
                {dish.signatureNumber && (
                  <span className="absolute bottom-3 left-3 sm:left-4 px-2.5 py-1 rounded bg-secondary text-on-secondary font-label-caps text-[11px] sm:text-label-caps uppercase font-bold shadow-md">
                    Signature {dish.signatureNumber} · Wok Hei
                  </span>
                )}
              </div>
            ) : (
              <div className="relative h-32 sm:h-36 w-full bg-surface-container border-b border-surface-container-high/80 flex flex-col items-center justify-center p-4 text-center select-none shrink-0">
                <span className="font-mono text-xs font-bold text-secondary mb-1 px-2.5 py-0.5 rounded bg-surface-container-highest border border-surface-container-high">
                  {dish.itemCode || dish.code}
                </span>
                <span className="font-dish-title text-base font-bold text-on-surface line-clamp-1">{dish.nameEn}</span>
                <span className="text-xs text-tertiary mt-0.5">{dish.nameZh}</span>
                <span className="text-[11px] text-tertiary/80 mt-1 font-medium">
                  Photo unavailable
                </span>
              </div>
            )}

            {/* Dish Navigation Bar: Always visible on mobile inside modal with >=44x44px touch targets; compact position indicator on desktop */}
            {showNavigation && (
              <div className="px-3 py-2 sm:px-5 sm:py-2.5 bg-surface-container border-b border-surface-container-high/70 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handlePrevDish}
                  disabled={!prevDish}
                  aria-label={prevDish ? `Previous dish: ${prevDish.nameEn || prevDish.name}` : 'No previous dish'}
                  className={`min-w-[44px] min-h-[44px] md:min-h-[34px] px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
                    prevDish
                      ? 'bg-surface-container-high hover:bg-surface-bright text-on-surface border-surface-container-highest cursor-pointer active:scale-95'
                      : 'bg-surface-container-low text-tertiary/35 border-surface-container-high/40 cursor-not-allowed opacity-45'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4 shrink-0" />
                  <span>Prev Dish</span>
                </button>

                <span className="text-[11px] font-semibold text-tertiary text-center truncate px-1">
                  Dish <strong className="text-on-surface">{currentIndex + 1}</strong> of{' '}
                  <strong className="text-on-surface">{deduplicatedDishes.length}</strong>
                </span>

                <button
                  type="button"
                  onClick={handleNextDish}
                  disabled={!nextDish}
                  aria-label={nextDish ? `Next dish: ${nextDish.nameEn || nextDish.name}` : 'No next dish'}
                  className={`min-w-[44px] min-h-[44px] md:min-h-[34px] px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
                    nextDish
                      ? 'bg-surface-container-high hover:bg-surface-bright text-on-surface border-surface-container-highest cursor-pointer active:scale-95'
                      : 'bg-surface-container-low text-tertiary/35 border-surface-container-high/40 cursor-not-allowed opacity-45'
                  }`}
                >
                  <span>Next Dish</span>
                  <ChevronRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            )}

          {/* Content */}
          <div className="p-4 sm:p-6 space-y-3.5 sm:space-y-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              {dish.itemCode && (
                <span className="font-mono text-sm font-bold px-2 py-0.5 rounded bg-surface-container-high text-secondary border border-surface-container-highest">
                  {dish.itemCode}
                </span>
              )}
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                {dish.nameEn}
              </h3>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-secondary font-headline-md text-base">
                {dish.nameZh}
              </span>
              {dish.isChefRecommendation && (
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">star</span>
                  Chef Recommendation
                </span>
              )}
              {dish.spicyLevel && dish.spicyLevel > 0 && (
                <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded text-xs font-bold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[13px]">local_fire_department</span>
                  {'🌶️'.repeat(dish.spicyLevel)}
                </span>
              )}
            </div>
          </div>

          <p className="font-body-md text-body-md text-tertiary leading-relaxed">
            {dish.description}
          </p>

          {dish.orderingNotes && dish.orderingNotes.length > 0 && (
            <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/25 text-xs text-secondary space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-xs uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]">info</span>
                <span>Online Ordering Conditions</span>
              </div>
              {dish.orderingNotes.map((note, idx) => (
                <div key={idx} className="leading-relaxed pl-1">• {note}</div>
              ))}
            </div>
          )}


          {/* Portion Size Selector if multi-size */}
          {dish.sizes && (
            <div className="pt-1">
              <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
                Available Portion Sizes:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {dish.sizes.small !== undefined && (
                  <button
                    type="button"
                    onClick={() => setSelectedSize('S')}
                    className={`py-2 px-3 rounded-lg border text-sm font-semibold transition-all ${
                      selectedSize === 'S'
                        ? 'border-primary bg-primary/20 text-on-surface ring-1 ring-primary'
                        : 'border-surface-container-high bg-surface-container text-tertiary hover:text-on-surface'
                    }`}
                  >
                    <div className="font-bold">Small (S)</div>
                  </button>
                )}

                {dish.sizes.medium !== undefined && (
                  <button
                    type="button"
                    onClick={() => setSelectedSize('M')}
                    className={`py-2 px-3 rounded-lg border text-sm font-semibold transition-all ${
                      selectedSize === 'M'
                        ? 'border-primary bg-primary/20 text-on-surface ring-1 ring-primary'
                        : 'border-surface-container-high bg-surface-container text-tertiary hover:text-on-surface'
                    }`}
                  >
                    <div className="font-bold">Medium (M)</div>
                  </button>
                )}

                {dish.sizes.large !== undefined && (
                  <button
                    type="button"
                    onClick={() => setSelectedSize('L')}
                    className={`py-2 px-3 rounded-lg border text-sm font-semibold transition-all ${
                      selectedSize === 'L'
                        ? 'border-primary bg-primary/20 text-on-surface ring-1 ring-primary'
                        : 'border-surface-container-high bg-surface-container text-tertiary hover:text-on-surface'
                    }`}
                  >
                    <div className="font-bold">Large (L)</div>
                  </button>
                )}

                {dish.sizes.half !== undefined && (
                  <button
                    type="button"
                    onClick={() => setSelectedSize('Half')}
                    className={`py-2 px-3 rounded-lg border text-sm font-semibold transition-all ${
                      selectedSize === 'Half'
                        ? 'border-primary bg-primary/20 text-on-surface ring-1 ring-primary'
                        : 'border-surface-container-high bg-surface-container text-tertiary hover:text-on-surface'
                    }`}
                  >
                    <div className="font-bold">Half (半只)</div>
                  </button>
                )}

                {dish.sizes.whole !== undefined && (
                  <button
                    type="button"
                    onClick={() => setSelectedSize('Whole')}
                    className={`py-2 px-3 rounded-lg border text-sm font-semibold transition-all ${
                      selectedSize === 'Whole'
                        ? 'border-primary bg-primary/20 text-on-surface ring-1 ring-primary'
                        : 'border-surface-container-high bg-surface-container text-tertiary hover:text-on-surface'
                    }`}
                  >
                    <div className="font-bold">Whole (一只)</div>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Details & Tags */}
          <div className="space-y-2 pt-2 border-t border-surface-container-high/60">
            {dish.portionSize && (
              <div className="flex items-center gap-2 text-body-sm text-tertiary">
                <span className="material-symbols-outlined text-[18px] text-secondary">group</span>
                <span>Portion Recommendation: <strong className="text-on-surface">{dish.portionSize}</strong></span>
              </div>
            )}

            {dish.allergens && dish.allergens.length > 0 && (
              <div className="flex items-center gap-2 text-body-sm text-tertiary">
                <span className="material-symbols-outlined text-[18px] text-primary">info</span>
                <span>Contains: {dish.allergens.join(', ')}</span>
              </div>
            )}

            {dish.isVegetarianAvailable && (
              <div className="flex items-center gap-2 text-body-sm text-emerald-400">
                <span className="material-symbols-outlined text-[18px]">eco</span>
                <span>Vegetarian adjustment available on request</span>
              </div>
            )}


          </div>

          </div>
        </div>

        {/* Sticky Bottom Action Row */}
        <div className="shrink-0 p-3 sm:p-4 bg-surface-container border-t border-surface-container-high/80 flex items-center justify-between gap-2.5 sm:gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface flex items-center justify-center font-bold text-base sm:text-lg cursor-pointer"
            >
              -
            </button>
            <span className="w-6 sm:w-8 text-center font-price-tag text-on-surface font-bold text-sm sm:text-base">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface flex items-center justify-center font-bold text-base sm:text-lg cursor-pointer"
            >
              +
            </button>
          </div>

          {/* Add Button */}
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg bg-secondary hover:bg-secondary-fixed text-on-secondary font-button-text text-xs sm:text-button-text uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg transition-colors cursor-pointer font-bold active:scale-98"
          >
            <span className="material-symbols-outlined text-[16px] sm:text-[18px]">add_shopping_cart</span>
            <span className="truncate">Add to Table Spread</span>
          </button>
        </div>
        </div>

        {/* Desktop Next Dish Arrow (beside modal, inside viewport) */}
        {showNavigation && (
          <button
            type="button"
            onClick={handleNextDish}
            disabled={!nextDish}
            aria-label={nextDish ? `Next dish: ${nextDish.nameEn || nextDish.name}` : 'No next dish'}
            title={nextDish ? `Next: ${nextDish.nameEn || nextDish.name}` : 'Last dish'}
            className={`hidden md:flex w-11 h-11 lg:w-12 lg:h-12 shrink-0 rounded-full items-center justify-center border transition-all shadow-xl ${
              nextDish
                ? 'bg-surface-container-low/95 hover:bg-surface-container-high text-on-surface hover:text-secondary border-surface-container-high hover:border-secondary/50 cursor-pointer active:scale-95'
                : 'bg-surface-container-low/40 text-tertiary/30 border-surface-container-high/30 cursor-not-allowed opacity-40'
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}
