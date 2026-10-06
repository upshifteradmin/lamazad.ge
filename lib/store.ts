import { create } from 'zustand';
import { Product } from './products';

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

export const useCartStore = create<CartStore>((set, get) => ({
  items: [
    // Pre-populate with 1 stylish item so the user immediately sees the experience
    {
      id: 'demo-item-1',
      productId: 'prod-01',
      title: 'HOODIE "BATUMI NOCTURNE" (500 GSM)',
      price: 185,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
      size: 'L',
      colorName: 'Washed Black',
    },
  ],
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
}));
