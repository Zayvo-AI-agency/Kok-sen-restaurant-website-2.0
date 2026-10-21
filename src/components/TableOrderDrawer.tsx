import { TableOrderItem } from '../types';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface TableOrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orderItems: TableOrderItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearOrder: () => void;
}

export function TableOrderDrawer({
  isOpen,
  onClose,
  orderItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearOrder
}: TableOrderDrawerProps) {
  if (!isOpen) return null;

  const totalItemCount = orderItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = orderItems.reduce((acc, curr) => {
    const price = curr.unitPrice ?? curr.item.price;
    return acc + price * curr.quantity;
  }, 0);
  const gst = Math.round(subtotal * 0.09 * 100) / 100;
  const estimatedTotal = subtotal;

  const generateWhatsAppOrder = () => {
    let orderList = orderItems
      .map((item) => {
        const sizeTag = item.size ? ` [${item.size}]` : '';
        return `• ${item.quantity}x ${item.item.nameEn}${sizeTag} (${item.item.nameZh})`;
      })
      .join('\n');

    const msg = encodeURIComponent(
      `Hello Kok Sen Restaurant (國成餐室)! I would like to place/pre-order a table order:\n\n` +
      `${orderList}\n\n` +
      `Total items: ${totalItemCount}\n\n` +
      `Please let me know current pricing, estimated preparation time, or dining availability. Thank you!`
    );
    return `https://wa.me/${RESTAURANT_INFO.reservationPhoneClean}?text=${msg}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="relative w-full max-w-md bg-surface-container-low border-l border-surface-container-high h-full flex flex-col z-10 shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-surface-container-high flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[24px]">receipt_long</span>
            <div>
              <h3 className="font-dish-title text-dish-title text-on-surface font-bold">
                Table Order / Spread
              </h3>
              <span className="text-body-sm text-tertiary">
                {orderItems.length} dish{orderItems.length === 1 ? '' : 'es'} selected
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-high text-tertiary hover:text-on-surface flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {orderItems.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6">
              <span className="material-symbols-outlined text-[48px] text-tertiary-container mb-2">
                soup_kitchen
              </span>
              <p className="font-dish-title text-dish-title text-on-surface font-semibold">
                Your Table Spread is Empty
              </p>
              <p className="font-body-sm text-body-sm text-tertiary mt-1">
                Browse our Wok Favourites or Full Menu, or tap "Load Preset Spread" to add dishes to your table plan.
              </p>
            </div>
          ) : (
            orderItems.map(({ item, quantity, size, unitPrice }) => {
              const effectivePrice = unitPrice ?? item.price;
              return (
                <div 
                  key={`${item.id}-${size || 'default'}`}
                  className="p-3 rounded-lg bg-surface-container border border-surface-container-high/60 flex items-center justify-between gap-3"
                >
                  <div className="flex-1">
                    <div className="font-body-md text-on-surface font-bold flex items-center gap-1.5 flex-wrap">
                      <span>{item.nameEn}</span>
                      {size && (
                        <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-secondary text-[11px] font-bold">
                          Size {size}
                        </span>
                      )}
                      {(item.categoryId === 'dining' || item.category?.toLowerCase() === 'dining' || item.nameEn?.toLowerCase().includes('crab')) && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-500/30">
                          Dine-in Only
                        </span>
                      )}
                    </div>
                    <div className="text-body-sm text-tertiary">
                      {item.nameZh}
                    </div>
                  </div>

                {/* Counter controls */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="w-7 h-7 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="w-5 text-center font-price-tag text-on-surface font-bold text-sm">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="w-7 h-7 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="ml-1 text-tertiary hover:text-error"
                    title="Remove item"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

        {/* Footer Summary */}
        {orderItems.length > 0 && (
          <div className="p-3.5 sm:p-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-surface-container-high bg-surface-container space-y-2.5 sm:space-y-3 shrink-0">
            <div className="space-y-1.5 text-body-sm">
              <div className="flex justify-between text-tertiary">
                <span>Selected Dishes</span>
                <span className="text-on-surface font-semibold">{totalItemCount} item{totalItemCount === 1 ? '' : 's'}</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <a
                href={generateWhatsAppOrder()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-button-text text-button-text uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Send Table Order via WhatsApp</span>
              </a>

              <div className="flex gap-2">
                <a
                  href={`tel:${RESTAURANT_INFO.phoneClean}`}
                  className="flex-1 py-2.5 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface font-button-text text-body-sm flex items-center justify-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  <span>Call Kitchen</span>
                </a>
                <button
                  type="button"
                  onClick={onClearOrder}
                  className="px-3 py-2.5 rounded bg-surface-container-high text-tertiary hover:text-error text-body-sm transition-colors"
                  title="Clear entire table order"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
