import React, { useState, useMemo, useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useApp } from '../context/AppContext';
import { MENU_CATEGORIES, FULL_MENU_ITEMS, TABLE_SPREAD_PRESETS } from '../data/restaurantData';
import { MenuItem } from '../types';
import { resolveDishPhoto } from '../utils/dishPhotoResolver';
import { getDishFocalPosition } from '../data/dishFocalPositions';
import { 
  Search, 
  X, 
  Plus, 
  UtensilsCrossed, 
  Users, 
  Sparkles, 
  ChevronRight,
  Bookmark
} from 'lucide-react';

export function isItemInCategory(item: MenuItem, catId: string): boolean {
  if (!catId || catId === 'all') return true;
  const target = catId.toLowerCase().trim();
  const itemCatId = (item.categoryId || '').toLowerCase().trim();
  const itemCat = (item.category || '').toLowerCase().trim();
  const itemCatNormalized = itemCat.replace(/[^a-z0-9]/g, '-');
  return (
    itemCatId === target ||
    itemCat === target ||
    itemCatNormalized === target
  );
}

export function MenuPage() {
  const { searchParams, setSearchParam } = useNavigation();
  const { 
    handleAddToOrder, 
    setSelectedDish, 
    handleOpenConcierge, 
    handleLoadPresetSpread,
    orderedItemIds,
    setOrderDrawerOpen,
    totalItemCount
  } = useApp();

  // Category & search query from URL
  const initialCategory = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [showPresets, setShowPresets] = useState<boolean>(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [imageSources, setImageSources] = useState<Record<string, string>>({});

  // Sync state when URL params change
  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    const q = searchParams.get('q') || '';
    setActiveCategory(cat);
    setSearchQuery(q);
  }, [searchParams]);

  // Handle category switch (Smooth jump to section in all-sections view, or filter)
  const handleSelectCategory = (catId: string, forceFilter = false) => {
    if (catId === 'all') {
      setActiveCategory('all');
      setSearchParam('category', null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!forceFilter && activeCategory === 'all' && !searchQuery.trim()) {
      // Smooth scroll directly to the section in the full menu
      const element = document.getElementById(catId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }

    // Otherwise filter to single category
    setActiveCategory(catId);
    setSearchParam('category', catId);
    setTimeout(() => {
      const element = document.getElementById(catId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  // Handle search input change
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setSearchParam('q', val.trim() ? val : null);
  };

  // Clear filters
  const handleClearFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setSearchParam('category', null);
    setSearchParam('q', null);
  };

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    let result = FULL_MENU_ITEMS.filter(item => item.publish !== false);

    // Filter by category
    if (activeCategory !== 'all') {
      result = result.filter((item) => isItemInCategory(item, activeCategory));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((item) => {
        const nameEn = item.nameEn?.toLowerCase() || item.name?.toLowerCase() || '';
        const nameZh = item.nameZh?.toLowerCase() || item.chinese_name?.toLowerCase() || '';
        const code = (item.itemCode || item.code)?.toLowerCase() || '';
        const desc = item.description?.toLowerCase() || '';
        const cat = item.category?.toLowerCase() || '';
        return (
          nameEn.includes(q) ||
          nameZh.includes(q) ||
          code.includes(q) ||
          desc.includes(q) ||
          cat.includes(q)
        );
      });
    }

    return result;
  }, [activeCategory, searchQuery]);

  // Group dishes by category sections so dishes are ALWAYS organized by section
  const categorySections = useMemo(() => {
    const targetCategories = activeCategory === 'all'
      ? MENU_CATEGORIES.filter((c) => c.id !== 'all')
      : MENU_CATEGORIES.filter((c) => c.id === activeCategory);

    return targetCategories.map((cat) => {
      const dishes = filteredDishes.filter((item) => isItemInCategory(item, cat.id));
      return {
        category: cat,
        dishes
      };
    }).filter((section) => section.dishes.length > 0);
  }, [activeCategory, filteredDishes]);

  // Active category display name
  const currentCategoryDef = MENU_CATEGORIES.find((c) => c.id === activeCategory);

  // Reusable dish card renderer
  const renderDishCard = (dish: MenuItem) => {
    const dishKey = dish.source_item_id || dish.id;
    const isOrdered = orderedItemIds.includes(dish.id);
    const photoRes = resolveDishPhoto(dish);
    const currentSrc = imageSources[dishKey] || photoRes.imageUrl || dish.imageUrl || photoRes.photo_source_url || dish.photo_source_url;
    const hasValidImage = Boolean(photoRes.hasOriginalPhoto && currentSrc && !imageErrors[dishKey] && !photoRes.isConflict);

    return (
      <div
        key={dishKey}
        className="group relative flex flex-col w-full max-w-full min-w-0 rounded-2xl bg-surface-container border border-surface-container-high/80 overflow-hidden shadow-md transition-all duration-300 hover:border-secondary/40 hover:-translate-y-1 hover:shadow-xl"
      >
        {/* Food Image - Edge-to-edge frame with custom focal positioning, zero gaps */}
        <div 
          className="relative w-full aspect-square overflow-hidden bg-surface-container-high border-b border-surface-container-high/60 cursor-pointer"
          onClick={() => setSelectedDish(dish)}
        >
          {hasValidImage ? (
            <img
              src={currentSrc}
              alt={dish.nameEn || dish.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 block"
              style={{ objectPosition: getDishFocalPosition(dish.id) }}
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
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-surface-container-high/80 text-tertiary p-4 text-center select-none">
              <span className="font-mono text-xs font-bold text-secondary mb-1 px-2 py-0.5 rounded bg-surface-container-highest border border-surface-container-high/60 shadow-xs">
                {dish.itemCode || dish.code}
              </span>
              <span className="font-dish-title text-sm font-bold text-on-surface line-clamp-1">{dish.nameEn || dish.name}</span>
              <span className="text-xs text-tertiary mt-0.5 line-clamp-1">{dish.nameZh || dish.chinese_name}</span>
              <span className="text-[10px] text-tertiary/70 mt-1 font-medium">
                Photo unavailable
              </span>
            </div>
          )}

          {/* Code Badge */}
          <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-mono font-bold text-secondary border border-secondary/30 shadow-md z-10">
            {dish.itemCode || dish.code}
          </div>

          {dish.isSignature && (
            <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-primary/95 text-white text-[10px] font-bold uppercase tracking-wider shadow-md z-10">
              Signature
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-start justify-between gap-2">
              <h3
                onClick={() => setSelectedDish(dish)}
                className="font-dish-title text-base font-bold text-on-surface hover:text-primary transition-colors cursor-pointer leading-snug line-clamp-2"
              >
                {dish.nameEn || dish.name}
              </h3>
            </div>

            {(dish.nameZh || dish.chinese_name) && (
              <span className="text-xs font-semibold text-tertiary">
                {dish.nameZh || dish.chinese_name}
              </span>
            )}

            <div className="text-[11px] font-medium text-secondary">
              {dish.category}
            </div>

            {dish.sizes && (
              <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-tertiary pt-0.5">
                <span className="text-secondary font-medium">Available:</span>
                <span className="font-semibold text-on-surface-variant">
                  {[
                    dish.sizes.small !== undefined && 'Small (S)',
                    dish.sizes.medium !== undefined && 'Medium (M)',
                    dish.sizes.large !== undefined && 'Large (L)',
                    dish.sizes.half !== undefined && 'Half',
                    dish.sizes.whole !== undefined && 'Whole',
                  ].filter(Boolean).join(' · ')}
                </span>
              </div>
            )}

            {dish.description && (
              <p className="text-xs text-tertiary line-clamp-2 leading-relaxed mt-1">
                {dish.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-surface-container-high/60">
            <button
              type="button"
              onClick={() => setSelectedDish(dish)}
              className="w-full py-1.5 px-2.5 rounded-lg bg-surface-container-highest hover:bg-surface-bright text-on-surface text-xs font-semibold transition-colors cursor-pointer text-center truncate"
            >
              Sizes &amp; Info
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8 sm:gap-12 animate-in fade-in duration-300">
      {/* 1. Header & Page Intro */}
      <section className="flex flex-col gap-3 border-b border-surface-container-high/60 pb-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-secondary">
            <UtensilsCrossed className="w-4 h-4 text-primary" />
            <span className="uppercase tracking-widest font-label-caps">99 Verified Dishes Across 15 Authentic Categories</span>
          </div>
          
          <button
            type="button"
            onClick={() => handleOpenConcierge('Help me choose dishes from the menu based on my party size')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-highest text-secondary hover:text-white border border-secondary/30 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Need Dish Advice? Ask Concierge</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h1 className="font-headline-xl text-3xl sm:text-4xl md:text-5xl text-on-surface font-extrabold tracking-tight">
              Parchment Menu <span className="font-normal italic text-secondary text-2xl sm:text-3xl ml-1 font-serif">菜谱</span>
            </h1>
            <p className="font-body-md text-xs sm:text-body-md text-tertiary max-w-2xl mt-1.5 leading-relaxed">
              Prepared fresh to order across our traditional wok stations, steam ovens, and bubbling claypots with time-honoured Cantonese craft and generous portions. Choose your sizes and add directly to your table order.
            </p>
          </div>

          {/* Table Spread Planner Toggle Button */}
          <button
            type="button"
            onClick={() => setShowPresets(!showPresets)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-highest text-on-surface border border-surface-container-high text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer"
          >
            <Users className="w-4 h-4 text-secondary" />
            <span>{showPresets ? 'Hide Group Spreads' : 'View Group Spreads (2, 4, 8 Diners)'}</span>
          </button>
        </div>
      </section>

      {/* 2. Group Spread Presets (Collapsible) */}
      {showPresets && (
        <section className="p-5 sm:p-6 rounded-2xl bg-surface-container-low border border-surface-container-high/80 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="font-headline-md text-lg sm:text-xl font-bold text-on-surface flex items-center gap-2">
                <Users className="w-5 h-5 text-secondary" />
                <span>Ordering for the Table · Pre-Balanced Combinations</span>
              </h2>
              <p className="text-xs text-tertiary mt-0.5">
                Balanced combinations of wok greens, bubbling claypots, signature poultry, and charred hor fun.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowPresets(false)}
              className="p-1 rounded-lg text-tertiary hover:text-on-surface hover:bg-surface-container"
              aria-label="Close presets"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TABLE_SPREAD_PRESETS.map((preset) => (
              <div
                key={preset.id}
                className="p-4 rounded-xl bg-surface-container border border-surface-container-high/60 flex flex-col justify-between gap-3 shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                      {preset.dinerCount}
                    </span>
                    <span className="text-xs font-semibold text-tertiary">
                      {preset.estimatedTotal}
                    </span>
                  </div>
                  <h3 className="font-dish-title text-base font-bold text-on-surface mt-1">
                    {preset.title}
                  </h3>
                  <p className="text-xs text-tertiary mt-0.5">{preset.subtitle}</p>

                  <ul className="mt-3 space-y-1 text-xs text-on-surface-variant border-t border-surface-container-high/60 pt-2.5">
                    {preset.dishes.map((dishName, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 truncate">
                        <span className="text-primary font-bold">·</span>
                        <span className="truncate">{dishName}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => handleLoadPresetSpread(preset)}
                  className="w-full py-2 px-3 rounded-lg bg-primary hover:bg-primary-container text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Load {preset.title} Spread</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Search Bar & Filter Controls (Sticky on scroll) */}
      <div className="sticky top-14 sm:top-20 z-30 bg-surface/95 backdrop-blur-xl pt-2 pb-3 border-b border-surface-container-high/60 flex flex-col gap-3 -mx-3 sm:-mx-6 md:-mx-8 lg:-mx-12 xl:-mx-16 px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Live Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search 99 menu listings by English, Chinese, or code (e.g. Beef, Hor Fun, #050)..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-surface-container border border-surface-container-high text-on-surface placeholder:text-tertiary text-xs sm:text-sm focus:outline-none focus:border-secondary transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-on-surface p-0.5 rounded cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Clear Button if filtered */}
          {(activeCategory !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-3 py-2.5 rounded-xl bg-surface-container-highest hover:bg-surface-bright text-on-surface text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}

          {/* View Order Tray Button (Mobile / Desktop) */}
          {totalItemCount > 0 && (
            <button
              type="button"
              onClick={() => setOrderDrawerOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all shrink-0 cursor-pointer active:scale-95"
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Review Table Order ({totalItemCount})</span>
            </button>
          )}
        </div>

        {/* Category Filter Horizontal Segmented Bar (Mobile Scrollable) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar touch-scroll py-1">
          {MENU_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-secondary text-on-secondary shadow-xs font-bold ring-2 ring-secondary/50'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-white border border-surface-container-high/60'
                }`}
              >
                <span>{cat.nameEn}</span>
                {cat.nameZh && <span className="opacity-75 font-normal text-[11px]">{cat.nameZh}</span>}
                {cat.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-black/20 text-white' : 'bg-surface-container-highest text-tertiary'}`}>
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Active Results Summary */}
      <div className="flex items-center justify-between text-xs text-tertiary">
        <span>
          Showing <strong className="text-on-surface font-semibold">{filteredDishes.length}</strong> {filteredDishes.length === 1 ? 'dish' : 'dishes'}
          {activeCategory !== 'all' && (
            <> in <span className="text-secondary font-semibold">{currentCategoryDef?.nameEn} {currentCategoryDef?.nameZh ? `(${currentCategoryDef.nameZh})` : ''}</span></>
          )}
          {searchQuery && <> matching &quot;<span className="text-on-surface font-semibold">{searchQuery}</span>&quot;</>}
        </span>

        {activeCategory !== 'all' && (
          <button
            type="button"
            onClick={() => handleSelectCategory('all')}
            className="text-secondary hover:underline cursor-pointer"
          >
            Show All Categories
          </button>
        )}
      </div>

      {/* 5. Dishes Rendering: Grouped Sections when 'all' & no query, otherwise Grid */}
      {filteredDishes.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-surface-container border border-surface-container-high flex flex-col items-center gap-3">
          <UtensilsCrossed className="w-10 h-10 text-tertiary/40" />
          <h3 className="font-headline-md text-lg font-bold text-on-surface">
            No dishes found matching your query
          </h3>
          <p className="text-xs text-tertiary max-w-md">
            Try checking for different spelling or clear your category filter to see the entire menu.
          </p>
          <button
            type="button"
            onClick={handleClearFilters}
            className="mt-2 px-4 py-2 rounded-xl bg-secondary text-on-secondary text-xs font-bold hover:bg-secondary-fixed transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* Section-by-section categorized view across all browsing and search modes */
        <div className="flex flex-col gap-12 sm:gap-14">
          {categorySections.map(({ category, dishes }) => (
            <section 
              key={category.id} 
              id={category.id} 
              className="scroll-mt-36 flex flex-col gap-5 border-t first:border-t-0 border-surface-container-high/60 pt-8 first:pt-0"
            >
              {/* Category Section Header */}
              <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-surface-container-high/40">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-6 rounded-full bg-secondary" />
                  <h2 className="font-headline-md text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight">
                    {category.nameEn}
                    {category.nameZh && (
                      <span className="ml-2 font-normal text-secondary font-serif text-lg sm:text-xl">
                        {category.nameZh}
                      </span>
                    )}
                  </h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-surface-container-highest text-tertiary font-semibold border border-surface-container-high">
                    {dishes.length} {dishes.length === 1 ? 'dish' : 'dishes'}
                  </span>
                </div>

                {activeCategory === 'all' ? (
                  <button
                    type="button"
                    onClick={() => handleSelectCategory(category.id, true)}
                    className="inline-flex items-center gap-1 text-xs text-secondary hover:text-white transition-colors cursor-pointer font-semibold"
                  >
                    <span>Filter only {category.nameEn}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSelectCategory('all')}
                    className="text-xs text-secondary hover:underline cursor-pointer font-medium"
                  >
                    Back to All 15 Sections
                  </button>
                )}
              </div>

              {/* Grid of Dishes in this Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {dishes.map((dish) => renderDishCard(dish))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
