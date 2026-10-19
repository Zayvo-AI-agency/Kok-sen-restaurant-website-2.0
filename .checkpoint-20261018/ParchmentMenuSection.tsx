import { useState, useMemo } from 'react';
import { MenuItem } from '../types';
import { FULL_MENU_ITEMS, MENU_CATEGORIES, RESTAURANT_INFO } from '../data/restaurantData';
import { resolveDishPhoto } from '../utils/dishPhotoResolver';

interface ParchmentMenuSectionProps {
  onSelectDish: (dish: MenuItem) => void;
  onAddToOrder: (dish: MenuItem) => void;
  orderedItemIds: string[];
}

// Popular dish name search suggestions for quick real-time filtering
const POPULAR_DISH_SEARCHES = [
  'Big Prawns Hor Fun',
  'Claypot Yong Tau Foo',
  'Prawn Paste Chicken',
  'Golden Dragon Chicken',
  'Bittergourd Pork Ribs',
  'Curry Fish Head',
  'Prawn Roll',
  'Kai Lan Stir Fried with Roasted Pork'
];

export function ParchmentMenuSection({
  onSelectDish,
  onAddToOrder,
  orderedItemIds
}: ParchmentMenuSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [chefRecOnly, setChefRecOnly] = useState<boolean>(false);
  const [vegOnly, setVegOnly] = useState<boolean>(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [imageSources, setImageSources] = useState<Record<string, string>>({});

  // Real-time filter strictly based on dish name (English name & Chinese characters) & item code
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const isDishMatch = (item: MenuItem) => {
    if (!normalizedQuery) return true;
    const nameEnMatch = item.nameEn?.toLowerCase().includes(normalizedQuery);
    const nameZhMatch = item.nameZh ? item.nameZh.toLowerCase().includes(normalizedQuery) : false;
    const codeMatch = item.itemCode ? item.itemCode.toLowerCase().includes(normalizedQuery) : false;
    const catMatch = item.category?.toLowerCase().includes(normalizedQuery);
    const descMatch = item.description ? item.description.toLowerCase().includes(normalizedQuery) : false;
    return Boolean(nameEnMatch || nameZhMatch || codeMatch || catMatch || descMatch);
  };

  const isFilterMatch = (item: MenuItem) => {
    if (vegOnly && !item.isVegetarianAvailable) return false;
    if (chefRecOnly && !item.isChefRecommendation) return false;
    if (selectedCategory !== 'all') {
      return item.category === selectedCategory || item.categoryId === selectedCategory || item.category.toLowerCase() === selectedCategory.toLowerCase();
    }
    return true;
  };

  // Filtered menu items
  const filteredItems = useMemo(
    () => FULL_MENU_ITEMS.filter((i) => isFilterMatch(i) && isDishMatch(i)),
    [normalizedQuery, selectedCategory, chefRecOnly, vegOnly]
  );

  // Group items by category for the ledger view
  const categoryGroups = useMemo(() => {
    const groups: { categoryId: string; nameEn: string; nameZh: string; codePrefix?: string; items: MenuItem[] }[] = [];

    // Filter categories to only those with matching items
    MENU_CATEGORIES.forEach((cat) => {
      if (cat.id === 'all') return;
      const itemsInCat = filteredItems.filter((i) => i.category === cat.id || i.categoryId === cat.id || i.category.toLowerCase() === cat.nameEn.toLowerCase());
      if (itemsInCat.length > 0) {
        groups.push({
          categoryId: cat.id,
          nameEn: cat.nameEn,
          nameZh: cat.nameZh || '',
          codePrefix: cat.codePrefix,
          items: itemsInCat
        });
      }
    });

    return groups;
  }, [filteredItems]);

  // Real-time highlighter for matching dish names
  const renderHighlightedText = (text: string) => {
    if (!normalizedQuery) return text;

    const regex = new RegExp(`(${normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-[#C83E2B]/20 text-[#8C2214] font-extrabold px-1 py-0.5 rounded"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const renderDishRow = (item: MenuItem) => {
    const dishKey = item.source_item_id || item.id;
    const isAdded = orderedItemIds.includes(item.id);
    const photoRes = resolveDishPhoto(item);
    const currentSrc = imageSources[dishKey] || photoRes.imageUrl || item.imageUrl || photoRes.photo_source_url || item.photo_source_url;
    const hasValidImage = Boolean(photoRes.hasOriginalPhoto && currentSrc && !imageErrors[dishKey] && !photoRes.isConflict);

    return (
      <div 
        key={dishKey}
        className="group/item flex items-start gap-2.5 sm:gap-3.5 p-2.5 sm:p-3 rounded-xl bg-[#F5EFE4]/80 hover:bg-[#E2D8C5]/95 transition-all duration-200 ease-out cursor-pointer border border-[#DDD3C1]/80 hover:border-[#C83E2B]/40 hover:shadow-md transform hover:scale-[1.01] active:scale-[0.99] w-full max-w-full min-w-0 overflow-hidden"
        onClick={() => onSelectDish(item)}
      >
        {/* Thumbnail Image or Clean Neutral Placeholder */}
        {hasValidImage ? (
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0 border border-[#DDD3C1] bg-[#FAF6EE] shadow-xs group-hover/item:border-[#C83E2B]/40">
            <img 
              src={currentSrc} 
              alt={item.nameEn}
              className="w-full h-full object-contain p-1 group-hover/item:scale-105 transition-transform duration-300"
              loading="lazy"
              decoding="async"
              onError={() => {
                const fallbackUrl = photoRes.photo_source_url || item.photo_source_url || item.source_url;
                if (fallbackUrl && currentSrc !== fallbackUrl) {
                  setImageSources((prev) => ({ ...prev, [dishKey]: fallbackUrl }));
                } else {
                  setImageErrors((prev) => ({ ...prev, [dishKey]: true }));
                }
              }}
            />
            {item.itemCode && (
              <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/75 text-[9px] sm:text-[10px] font-mono font-bold text-white leading-none">
                {item.itemCode}
              </span>
            )}
          </div>
        ) : (
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0 border border-[#DDD3C1] bg-[#EAE2D2] shadow-xs flex flex-col items-center justify-center p-1 text-center select-none">
            <span className="font-mono text-[10px] font-bold text-[#63574A]">
              {item.itemCode || item.code}
            </span>
            <span className="text-[9px] text-[#8A7F73] leading-tight mt-0.5">
              No photo
            </span>
          </div>
        )}

        {/* Dish Info - Strictly contained within card width */}
        <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch gap-1">
          <div className="min-w-0">
            <div className="flex items-start justify-between gap-1.5 sm:gap-2">
              {/* Dish Name & Item Code */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap min-w-0">
                  {item.itemCode && (
                    <span className="font-mono text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded bg-[#DDD3C1] text-[#63574A] border border-[#C5B9A6] shrink-0">
                      {item.itemCode}
                    </span>
                  )}
                  <span className="font-dish-title text-sm sm:text-dish-title font-bold text-[#1E1B18] group-hover/item:text-[#C83E2B] transition-colors break-words">
                    {renderHighlightedText(item.nameEn)}
                  </span>
                  {item.nameZh && (
                    <span className="font-normal text-xs sm:text-sm text-[#736A5E] break-words">
                      ({renderHighlightedText(item.nameZh)})
                    </span>
                  )}
                </div>
              </div>

              {/* Add to Order button */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 pt-0.5">
                <button
                  type="button"
                  title="Add to Table Order"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToOrder(item);
                  }}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-90 shrink-0 ${
                    isAdded 
                      ? 'bg-[#C83E2B] text-white shadow-[#C83E2B]/30' 
                      : 'bg-[#DDD3C1] text-[#1E1B18] hover:bg-[#C83E2B] hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px]">
                    {isAdded ? 'check' : 'add'}
                  </span>
                </button>
              </div>
            </div>

            {/* Badges in neat wrapping row - Never spills outside */}
            {(item.isChefRecommendation || item.isVegetarianAvailable || item.isSignature) && (
              <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap mt-1">
                {item.isChefRecommendation && (
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-900 border border-amber-600/30 flex items-center gap-0.5 shrink-0">
                    <span className="material-symbols-outlined text-[11px]">star</span>
                    Chef Rec
                  </span>
                )}
                {item.isVegetarianAvailable && (
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-800/10 text-emerald-800 border border-emerald-800/20 shrink-0">
                    Veg opt
                  </span>
                )}
                {item.isSignature && (
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#C83E2B]/10 text-[#C83E2B] shrink-0">
                    Signature
                  </span>
                )}
              </div>
            )}

            {/* Description - fully contained */}
            <p className="font-body-md text-xs sm:text-body-md text-[#544D45] mt-1 break-words line-clamp-2 overflow-hidden">
              {item.description}
            </p>

            {item.orderingNotes && item.orderingNotes.length > 0 && (
              <div className="mt-1 p-1.5 rounded bg-[#EAE2D2] border border-[#C5B9A6] text-[10px] text-[#63574A]">
                <span className="font-bold block text-[9px] uppercase tracking-wider mb-0.5">Online Order Note:</span>
                {item.orderingNotes.map((note, idx) => (
                  <span key={idx} className="block leading-tight mt-0.5">• {note}</span>
                ))}
              </div>
            )}

            {/* Size Pills without prices */}
            {item.sizes && (
              <div className="flex items-center gap-1.5 mt-1 text-[10px] sm:text-[11px] text-[#736A5E] font-medium flex-wrap">
                <span className="font-semibold text-[#1E1B18]">Portions:</span>
                {item.sizes.small !== undefined && (
                  <span className="px-1.5 py-0.5 rounded bg-[#FAF6EE] border border-[#DDD3C1]">Small (S)</span>
                )}
                {item.sizes.medium !== undefined && (
                  <span className="px-1.5 py-0.5 rounded bg-[#FAF6EE] border border-[#DDD3C1]">Medium (M)</span>
                )}
                {item.sizes.large !== undefined && (
                  <span className="px-1.5 py-0.5 rounded bg-[#FAF6EE] border border-[#DDD3C1]">Large (L)</span>
                )}
                {item.sizes.half !== undefined && (
                  <span className="px-1.5 py-0.5 rounded bg-[#FAF6EE] border border-[#DDD3C1]">Half (半只)</span>
                )}
                {item.sizes.whole !== undefined && (
                  <span className="px-1.5 py-0.5 rounded bg-[#FAF6EE] border border-[#DDD3C1]">Whole (一只)</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section 
      id="full-menu"
      className="mt-8 sm:mt-space-3xl rounded-2xl p-3.5 sm:p-space-lg md:p-space-xl lg:p-space-2xl bg-[#EDE6D8] text-[#1E1B18] shadow-2xl relative overflow-hidden w-full max-w-full min-w-0"
    >
      {/* Header with Title and Narrative */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-space-md pb-3 sm:pb-space-md border-b border-[#DDD3C1]">
        <div>
          <span className="font-subheading-script text-xs sm:text-subheading-script text-primary-container italic font-medium">
            From our kitchen to your table
          </span>
          <h2 className="font-headline-xl text-2xl sm:text-3xl md:text-headline-xl text-[#1E1B18] tracking-tight mt-0.5">
            Our Full Menu
          </h2>
          <p className="font-body-md text-xs sm:text-body-md text-[#544D45] max-w-2xl mt-1 leading-relaxed">
            Authentic heritage Cantonese zi char from 4 Keong Saik Road. Morning market seafood, slow-braised claypots, and roaring high-flame wok hei noodles.
          </p>
        </div>

        {/* Real-time Result Badge */}
        <div className="flex items-center gap-2 self-start md:self-end">
          <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-[#E2D8C5] border border-[#D5C9B3] text-xs sm:text-body-sm font-semibold text-[#1E1B18]">
            <span className="material-symbols-outlined text-[15px] sm:text-[16px] text-primary-container">restaurant</span>
            <span>
              {normalizedQuery || selectedCategory !== 'all' || chefRecOnly || vegOnly
                ? `${filteredItems.length} ${filteredItems.length === 1 ? 'dish' : 'dishes'} found` 
                : `${FULL_MENU_ITEMS.length} Heritage Dishes`}
            </span>
          </span>
        </div>
      </div>


      {/* Prominent Real-Time Dish Name Search Bar */}
      <div className="pt-3 sm:pt-space-md pb-2 sm:pb-space-sm flex flex-col gap-2.5 sm:gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          {/* Search Input Bar */}
          <div className="relative flex-1 group">
            <label htmlFor="menu-dish-search" className="sr-only">
              Search menu items by dish name or item code
            </label>
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-[#736A5E] group-focus-within:text-[#C83E2B] transition-colors">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </div>
            <input 
              id="menu-dish-search"
              type="text"
              autoComplete="off"
              placeholder="Search dishes (e.g. H1, hor fun, ribs, 苦瓜)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 sm:py-2.5 rounded-lg bg-[#FAF6EE] text-[#1E1B18] placeholder:text-[#8A7F73] text-xs sm:text-body-md font-body-md border-2 border-[#DDD3C1] focus:border-[#C83E2B] focus:bg-white focus:outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => setSearchQuery('')}
                aria-label="Clear dish search"
                title="Clear dish search"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#DDD3C1]/80 hover:bg-[#C83E2B] text-[#544D45] hover:text-white flex items-center justify-center text-[12px] font-bold transition-all cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Filter Toggles: Chef Rec & Veg Opt */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setChefRecOnly(!chefRecOnly)}
              className={`flex-1 sm:flex-initial px-3 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 font-label-caps text-xs ${
                chefRecOnly 
                  ? 'bg-amber-600 text-white shadow-sm font-bold ring-1 ring-amber-700' 
                  : 'bg-[#DDD3C1] text-[#1E1B18] hover:bg-amber-600 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">star</span>
              <span>Chef Recs</span>
            </button>

            <button
              type="button"
              onClick={() => setVegOnly(!vegOnly)}
              className={`flex-1 sm:flex-initial px-3 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 font-label-caps text-xs ${
                vegOnly 
                  ? 'bg-emerald-800 text-white shadow-sm font-bold ring-1 ring-emerald-900' 
                  : 'bg-[#DDD3C1] text-[#1E1B18] hover:bg-emerald-800 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">eco</span>
              <span>Veg Opt</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills - Horizontally scrollable without expanding width */}
        <div className="w-full max-w-full min-w-0 flex items-center gap-1.5 overflow-x-auto no-scrollbar touch-scroll py-1">
          {MENU_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#C83E2B] text-white border-[#C83E2B] shadow-sm font-bold'
                    : 'bg-[#DDD3C1]/80 text-[#362E25] border-[#C5B9A6] hover:bg-[#C83E2B] hover:text-white hover:border-[#C83E2B]'
                }`}
              >
                <span>{cat.nameEn}</span>
                <span className="ml-1 opacity-75 text-[11px] font-normal">({cat.nameZh})</span>
              </button>
            );
          })}
        </div>

        {/* Real-time popular dish search chips - Smooth horizontal scroll on mobile */}
        <div className="w-full max-w-full min-w-0 flex items-center gap-1.5 text-xs text-[#736A5E] overflow-x-auto no-scrollbar touch-scroll py-0.5">
          <span className="shrink-0 text-[11px] font-semibold text-[#8A7F73] flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">trending_up</span>
            Popular:
          </span>
          {POPULAR_DISH_SEARCHES.map((dishName) => {
            const isActive = searchQuery.toLowerCase() === dishName.toLowerCase();
            return (
              <button
                key={dishName}
                type="button"
                onClick={() => setSearchQuery(isActive ? '' : dishName)}
                className={`shrink-0 px-2 py-0.5 rounded-md text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-[#C83E2B] text-white border-[#C83E2B]'
                    : 'bg-[#FAF6EE]/80 text-[#544D45] border-[#DDD3C1] hover:border-[#C83E2B] hover:text-[#C83E2B]'
                }`}
              >
                {dishName}
              </button>
            );
          })}
          {(searchQuery || selectedCategory !== 'all' || chefRecOnly || vegOnly) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setChefRecOnly(false);
                setVegOnly(false);
              }}
              className="shrink-0 text-[11px] text-[#C83E2B] underline hover:text-[#8C2214] ml-1 font-semibold cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Real-Time Filter Results / Empty State */}
      {filteredItems.length === 0 ? (
        <div className="my-space-xl p-space-xl text-center flex flex-col items-center justify-center bg-[#FAF6EE] rounded-xl border-2 border-dashed border-[#DDD3C1]">
          <div className="w-14 h-14 rounded-full bg-[#E2D8C5] flex items-center justify-center mb-3 text-primary-container">
            <span className="material-symbols-outlined text-[28px]">search_off</span>
          </div>
          <h3 className="font-headline-md text-headline-md text-[#1E1B18] font-bold">
            No dishes found matching &ldquo;{searchQuery}&rdquo;
          </h3>
          <p className="font-body-md text-[#544D45] mt-1 max-w-md">
            We couldn&apos;t find any dishes under your current search criteria. Try clearing search filters or selecting another category.
          </p>
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setChefRecOnly(false);
                setVegOnly(false);
              }}
              className="px-4 py-2 rounded-lg bg-primary-container text-white font-button-text hover:bg-[#8C2214] transition-colors shadow-sm cursor-pointer"
            >
              View Full Menu
            </button>
          </div>
        </div>
      ) : (
        /* Categorized Ledger Layout: 2 Columns on Desktop */
        <div className="pt-space-md border-t border-[#DDD3C1]/80 mt-space-sm space-y-space-xl">
          {categoryGroups.map((group) => {
            // Split items into 2 columns for comfortable desktop scanning
            const mid = Math.ceil(group.items.length / 2);
            const col1 = group.items.slice(0, mid);
            const col2 = group.items.slice(mid);

            return (
              <div key={group.categoryId} className="flex flex-col gap-space-md" id={`menu-category-${group.categoryId}`}>
                {/* Category Section Header */}
                <div className="flex flex-wrap items-baseline justify-between pb-2 border-b-2 border-[#DDD3C1] gap-2">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-headline-md text-lg sm:text-headline-md text-primary-container font-bold">
                      {group.nameZh}
                    </span>
                    <h3 className="font-headline-md text-lg sm:text-headline-md text-[#1E1B18] font-serif">
                      {group.nameEn}
                    </h3>
                    <span className="text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-[#E2D8C5] text-[#544D45] border border-[#D5C9B3]">
                      {group.items.length} dishes
                    </span>
                  </div>
                  {group.codePrefix && (
                    <span className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#8A7F73]">
                      Code [{group.codePrefix}]
                    </span>
                  )}
                </div>

                {/* 2-Column Dish List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 xl:gap-x-12 gap-y-2.5">
                  <div className="space-y-2">
                    {col1.map((item) => renderDishRow(item))}
                  </div>
                  <div className="space-y-2">
                    {col2.map((item) => renderDishRow(item))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table Drinks & Special Dietary Callout Card */}
      <div className="mt-8 sm:mt-space-xl p-3.5 sm:p-space-md rounded-xl bg-[#E2D8C5] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-space-md border border-[#D5C9B3]">
        <div className="flex items-start md:items-center gap-2.5 sm:gap-space-sm">
          <span className="material-symbols-outlined text-primary-container text-[22px] sm:text-[24px] shrink-0 mt-0.5 md:mt-0">
            local_cafe
          </span>
          <p className="font-body-md text-xs sm:text-body-md text-[#1E1B18] leading-relaxed">
            <strong className="font-semibold">Tableside Service:</strong> Traditional Chinese tea (Pu-erh, Tie Guan Yin), chilled homemade barley, soft drinks, and ice-cold Tiger Beer. Vegetarian adaptations available upon order.
          </p>
        </div>
        <a 
          className="shrink-0 w-full md:w-auto px-4 py-2.5 rounded-lg bg-primary-container text-on-primary-container hover:bg-[#8C2214] font-button-text text-xs sm:text-button-text uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-1.5 font-bold cursor-pointer" 
          href={`https://wa.me/${RESTAURANT_INFO.reservationPhoneClean}?text=Hello%20Kok%20Sen%20Restaurant,%20I%20would%20like%20to%20inquire%20about%20pre-ordering`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="material-symbols-outlined text-[16px]">chat</span>
          <span>WhatsApp Pre-Order</span>
        </a>
      </div>
    </section>
  );
}
