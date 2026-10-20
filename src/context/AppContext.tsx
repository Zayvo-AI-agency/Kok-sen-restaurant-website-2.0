import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MenuItem, TableOrderItem, TableSpreadPreset, OutletInfo } from '../types';
import { OUTLETS, FULL_MENU_ITEMS, TOP_SIGNATURES } from '../data/restaurantData';
import { getDisplayedDishPhoto } from '../utils/dishPhotoResolver';

interface AppContextType {
  // Cart / Table Order
  orderItems: TableOrderItem[];
  totalItemCount: number;
  totalOrderAmount: number;
  orderedItemIds: string[];
  handleAddToOrder: (dish: MenuItem, quantity?: number, size?: string, unitPrice?: number) => void;
  handleUpdateQuantity: (id: string, delta: number) => void;
  handleRemoveItem: (id: string) => void;
  handleClearOrder: () => void;
  handleLoadPresetSpread: (preset: TableSpreadPreset) => void;

  // Selected Outlet & Table
  selectedOutlet: OutletInfo;
  setSelectedOutlet: (outlet: OutletInfo) => void;
  currentTable: number | null;
  setCurrentTable: (tableNum: number | null) => void;

  // Modals
  reservationOpen: boolean;
  setReservationOpen: (open: boolean) => void;
  orderDrawerOpen: boolean;
  setOrderDrawerOpen: (open: boolean) => void;
  conciergeOpen: boolean;
  setConciergeOpen: (open: boolean) => void;
  conciergeInitialPrompt?: string;
  setConciergeInitialPrompt: (prompt?: string) => void;
  handleOpenConcierge: (prompt?: string) => void;
  scanTableOpen: boolean;
  setScanTableOpen: (open: boolean) => void;
  deliveryOpen: boolean;
  setDeliveryOpen: (open: boolean) => void;
  selectedDish: MenuItem | null;
  selectedDishImage?: string;
  setSelectedDish: (dish: MenuItem | null, resolvedImage?: string) => void;

  // Toast
  toastMessage: string | null;
  showToast: (message: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Outlets
  const [selectedOutlet, setSelectedOutletState] = useState<OutletInfo>(() => {
    try {
      const savedId = localStorage.getItem('koksen_selected_outlet');
      if (savedId) {
        const found = OUTLETS.find((o) => o.id === savedId);
        if (found) return found;
      }
    } catch {
      // fallback
    }
    return OUTLETS[0]; // Keong Saik flagship default
  });

  const setSelectedOutlet = (outlet: OutletInfo) => {
    setSelectedOutletState(outlet);
    try {
      localStorage.setItem('koksen_selected_outlet', outlet.id);
    } catch {
      // ignore
    }
  };

  // Dine-in table number
  const [currentTable, setCurrentTableState] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem('koksen_table_num');
      return saved ? parseInt(saved, 10) : null;
    } catch {
      return null;
    }
  });

  const setCurrentTable = (tableNum: number | null) => {
    setCurrentTableState(tableNum);
    try {
      if (tableNum !== null) {
        localStorage.setItem('koksen_table_num', tableNum.toString());
      } else {
        localStorage.removeItem('koksen_table_num');
      }
    } catch {
      // ignore
    }
  };

  // Order Items
  const [orderItems, setOrderItems] = useState<TableOrderItem[]>(() => {
    try {
      const saved = localStorage.getItem('koksen_table_order');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('koksen_table_order', JSON.stringify(orderItems));
    } catch {
      // ignore
    }
  }, [orderItems]);

  // Modals
  const [reservationOpen, setReservationOpen] = useState(false);
  const [orderDrawerOpen, setOrderDrawerOpen] = useState(false);
  const [conciergeOpen, setConciergeOpen] = useState(false);
  const [conciergeInitialPrompt, setConciergeInitialPrompt] = useState<string | undefined>(undefined);
  const [scanTableOpen, setScanTableOpen] = useState(false);
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [selectedDish, setSelectedDishState] = useState<MenuItem | null>(null);
  const [selectedDishImage, setSelectedDishImage] = useState<string | undefined>(undefined);

  const setSelectedDish = useCallback((dish: MenuItem | null, resolvedImage?: string) => {
    if (!dish) {
      setSelectedDishState(null);
      setSelectedDishImage(undefined);
      return;
    }
    const resolved = getDisplayedDishPhoto(dish, resolvedImage);
    setSelectedDishImage(resolved.src);
    setSelectedDishState({
      ...dish,
      resolvedDisplayImage: resolved.src,
    });
  }, []);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3200);
  }, []);

  const handleOpenConcierge = useCallback((prompt?: string) => {
    setConciergeInitialPrompt(prompt);
    setConciergeOpen(true);
  }, []);

  const handleAddToOrder = useCallback((dish: MenuItem, quantity = 1, size?: string, unitPrice?: number) => {
    const effectivePrice =
      unitPrice ??
      (size && dish.sizes
        ? size === 'S' && dish.sizes.small !== undefined
          ? dish.sizes.small
          : size === 'M' && dish.sizes.medium !== undefined
          ? dish.sizes.medium
          : size === 'L' && dish.sizes.large !== undefined
          ? dish.sizes.large
          : size === 'Half' && dish.sizes.half !== undefined
          ? dish.sizes.half
          : size === 'Whole' && dish.sizes.whole !== undefined
          ? dish.sizes.whole
          : dish.price
        : dish.price);

    setOrderItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.item.id === dish.id && item.size === size);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          unitPrice: effectivePrice,
        };
        return updated;
      }
      return [...prev, { item: dish, quantity, size, unitPrice: effectivePrice }];
    });
    showToast(`Added ${dish.nameEn}${size ? ` (${size})` : ''} to table order`);
  }, [showToast]);

  const handleUpdateQuantity = useCallback((id: string, delta: number) => {
    setOrderItems((prev) => {
      return prev
        .map((item) => {
          if (item.item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is TableOrderItem => item !== null);
    });
  }, []);

  const handleRemoveItem = useCallback((id: string) => {
    setOrderItems((prev) => prev.filter((item) => item.item.id !== id));
  }, []);

  const handleClearOrder = useCallback(() => {
    setOrderItems([]);
    showToast('Table order cleared');
  }, [showToast]);

  const handleLoadPresetSpread = useCallback((preset: TableSpreadPreset) => {
    const allDishes = [...TOP_SIGNATURES, ...FULL_MENU_ITEMS];
    const newItems: TableOrderItem[] = [];

    preset.suggestedItems.forEach((itemId) => {
      const dish = allDishes.find((d) => d.id === itemId);
      if (dish) {
        newItems.push({ item: dish, quantity: 1, unitPrice: dish.price });
      }
    });

    if (newItems.length > 0) {
      setOrderItems(newItems);
      setOrderDrawerOpen(true);
      showToast(`Loaded ${preset.title} spread (${newItems.length} dishes) into Table Order`);
    }
  }, [showToast]);

  const totalItemCount = orderItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalOrderAmount = orderItems.reduce((acc, curr) => {
    const price = curr.unitPrice !== undefined ? curr.unitPrice : curr.item.price;
    return acc + price * curr.quantity;
  }, 0);
  const orderedItemIds = orderItems.map((oi) => oi.item.id);

  return (
    <AppContext.Provider
      value={{
        orderItems,
        totalItemCount,
        totalOrderAmount,
        orderedItemIds,
        handleAddToOrder,
        handleUpdateQuantity,
        handleRemoveItem,
        handleClearOrder,
        handleLoadPresetSpread,
        selectedOutlet,
        setSelectedOutlet,
        currentTable,
        setCurrentTable,
        reservationOpen,
        setReservationOpen,
        orderDrawerOpen,
        setOrderDrawerOpen,
        conciergeOpen,
        setConciergeOpen,
        conciergeInitialPrompt,
        setConciergeInitialPrompt,
        handleOpenConcierge,
        scanTableOpen,
        setScanTableOpen,
        deliveryOpen,
        setDeliveryOpen,
        selectedDish,
        selectedDishImage,
        setSelectedDish,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
