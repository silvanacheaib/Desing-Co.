import { create } from 'zustand';

// Product structure for the Content Manager
interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  priceUSD: number;
  category: string;
  is_available: boolean;
}

interface OrderItem extends Product {
  quantity: number;
  status: 'pending' | 'sent' | 'served';
}

interface Table {
  id: string;
  number: number;
  status: 'available' | 'occupied' | 'billing';
  orders: OrderItem[];
}

interface PosState {
  tables: Table[];
  products: Product[];
  cart: OrderItem[];
  activeTableId: string | null;
  exchangeRate: number;
  currentView: 'floor' | 'settings' | 'admin' | 'kitchen';
  setActiveTable: (id: string | null) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  sendToKitchen: () => void;
  checkoutTable: (id: string) => void;
  closeTable: (id: string) => void;
  setExchangeRate: (rate: number) => void;
  setView: (view: PosState['currentView']) => void;
  // Admin Action
  addProduct: (product: Product) => void;
}

export const usePosStore = create<PosState>((set) => ({
  exchangeRate: 89500,
  currentView: 'floor',
  activeTableId: null,
  cart: [],
  
  tables: [
    { id: '1', number: 1, status: 'available', orders: [] },
    { id: '2', number: 2, status: 'available', orders: [] },
    { id: '3', number: 3, status: 'available', orders: [] },
    { id: '4', number: 4, status: 'available', orders: [] },
  ],
  
  // Now starts empty - will be filled by Admin
  products: [],

  setActiveTable: (id) => set({ activeTableId: id, cart: [] }),
  setView: (view) => set({ currentView: view }),
  setExchangeRate: (rate) => set({ exchangeRate: rate }),

  addProduct: (product) => set((state) => ({
    products: [...state.products, product]
  })),

  addToCart: (product) => set((state) => {
    const existing = state.cart.find(item => item.id === product.id);
    if (existing) {
      return {
        cart: state.cart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      };
    }
    return { cart: [...state.cart, { ...product, quantity: 1, status: 'pending' }] };
  }),

  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter(item => item.id !== productId)
  })),

  sendToKitchen: () => set((state) => ({
    tables: state.tables.map(t => {
      if (t.id === state.activeTableId) {
        return {
          ...t,
          status: 'occupied',
          orders: [...t.orders, ...state.cart.map(item => ({ ...item, status: 'sent' as const }))]
        };
      }
      return t;
    }),
    cart: [],
    activeTableId: null
  })),

  checkoutTable: (id) => set((state) => ({
    tables: state.tables.map(t => t.id === id ? { ...t, status: 'billing' } : t),
    activeTableId: null
  })),

  closeTable: (id) => set((state) => ({
    tables: state.tables.map(t => t.id === id ? { ...t, status: 'available', orders: [] } : t),
    activeTableId: null
  })),
}));