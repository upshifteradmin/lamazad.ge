import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from './products';

// Clean up any legacy mock or test cart keys from older versions
if (typeof window !== 'undefined') {
  try {
    const legacyKeys = ['cart-storage', 'lamazad_cart', 'lamazad_cart_v1', 'lamazad_cart_v2', 'lmz_cart'];
    legacyKeys.forEach((key) => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
      }
    });
  } catch {
    // Ignore in private/restricted storage modes
  }
}

export interface CartItem {
  id: string; // unique item id (composite for custom items)
  productId?: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
  colorName?: string;
  isCustomStudio?: boolean;
  customDetails?: {
    garmentType: string;
    garmentColor: string;
    textPrint?: string;
    textFont?: string;
    printStyle?: string;
    stickersCount?: number;
    compositeDataUrl?: string;
  };
}

interface CartStore {
  items: CartItem[];
  isDrawerOpen: boolean;
  isCheckoutOpen: boolean;
  quickViewProduct: Product | null;
  soundEnabled: boolean;
  
  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  setQuickViewProduct: (product: Product | null) => void;
  toggleSound: () => void;
  
  // Computed helpers
  getTotalCount: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Fresh empty cart for all visitors
      items: [],
      isDrawerOpen: false,
      isCheckoutOpen: false,
      quickViewProduct: null,
      soundEnabled: true,

      addItem: (item) => {
        const uniqueId = item.isCustomStudio
          ? `custom-${Date.now()}`
          : `${item.productId || 'item'}-${item.size}-${item.colorName || 'def'}`;

        set((state) => {
          const existing = state.items.find((i) => i.id === uniqueId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === uniqueId ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
              isDrawerOpen: true,
            };
          }
          return {
            items: [...state.items, { ...item, id: uniqueId }],
            isDrawerOpen: true,
          };
        });
      },

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      updateQuantity: (id, delta) =>
        set((state) => ({
          items: state.items
            .map((i) => {
              if (i.id === id) {
                const nextQty = i.quantity + delta;
                return nextQty > 0 ? { ...i, quantity: nextQty } : null;
              }
              return i;
            })
            .filter(Boolean) as CartItem[],
        })),

      clearCart: () => set({ items: [] }),

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      openCheckout: () => set({ isCheckoutOpen: true, isDrawerOpen: false }),
      closeCheckout: () => set({ isCheckoutOpen: false }),

      setQuickViewProduct: (product) => set({ quickViewProduct: product }),

      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

      getTotalCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'lamazad_cart_v3', // Unique visitor isolated storage
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : (undefined as any))),
      partialize: (state) => ({
        items: state.items,
        soundEnabled: state.soundEnabled,
      }),
    }
  )
);

