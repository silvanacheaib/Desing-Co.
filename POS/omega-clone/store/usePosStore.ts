'use client';
import { create } from 'zustand';
import { supabase } from '../lib/supabase';

// --- Professional Interfaces ---

export interface Product {
    id: string;
    name: string;
    description: string;
    image_url: string;
    priceUSD: number;
    category: string;
}

export interface Staff {
    id: string;
    full_name: string;
    role: 'waiter' | 'manager' | 'kitchen' | 'admin';
    base_salary_usd: number;
}

export interface Shift {
    id: string;
    shift_date: string;
    start_time: string;
    end_time: string;
    status: 'scheduled' | 'completed' | 'off_day' | 'sick_leave';
}

export interface KitchenOrder {
    id: string;
    table_number: number;
    product_name: string;
    quantity: number;
    waiter_name: string;
    status: 'pending' | 'preparing' | 'ready' | 'served';
    created_at: string;
}

export interface WaiterNotification {
    id: string;
    message: string;
    table_number: number;
    timestamp: Date;
}

interface OrderItem extends Product {
    quantity: number;
    status: 'pending' | 'sent' | 'served';
}

interface Table {
    id: string;
    number: number;
    status: 'AVAILABLE' | 'OCCUPIED' | 'SERVED' | 'BILLING' | 'RESERVED' | 'available' | 'occupied' | 'served' | 'billing' | 'reserved';
    orders: OrderItem[];
    waiterId?: string;
    reservedBy?: string;
    reservationDetails?: {
        clientName: string;
        peopleCount: number;
        arrivalTime: string;
    };
}

interface AdminStats {
    totalRevenue: number;
    totalVisits: number;
    itemsSold: number;
    reservationsCount: number;
}

interface PosState {
    tables: Table[];
    products: Product[];
    staff: Staff[];
    currentStaff: Staff | null;
    staffShifts: Shift[];
    kitchenOrders: KitchenOrder[];
    notifications: WaiterNotification[];
    cart: OrderItem[];
    activeTableId: string | null;
    exchangeRate: number;
    currentView: 'floor' | 'admin' | 'kitchen' | 'menu';
    stats: AdminStats;

    // Actions
    setView: (view: 'floor' | 'admin' | 'kitchen' | 'menu') => void;
    setActiveTable: (id: string | null) => void;
    setCurrentStaff: (staff: Staff | null) => void;
    initializeAuth: () => void;

    addNotification: (order: KitchenOrder) => void;
    clearNotification: (id: string) => void;

    fetchTables: () => Promise<void>;
    reserveTable: (tableId: string, details: { name: string; people: number; time: string }) => Promise<boolean>;
    cancelReservation: (tableId: string) => Promise<void>;

    fetchProducts: () => Promise<void>;
    addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
    updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;

    fetchStaff: () => Promise<void>;
    fetchShifts: (staffId: string) => Promise<void>;
    fetchKitchenOrders: () => Promise<void>;
    fetchAdminStats: () => Promise<void>;
    
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    sendToKitchen: () => Promise<void>;
    markAsServed: (tableId: string) => Promise<void>;
    closeTable: (tableId: string) => Promise<void>;
}

export const usePosStore = create<PosState>((set, get) => ({
    tables: [
        { id: '1', number: 1, status: 'AVAILABLE', orders: [] },
        { id: '2', number: 2, status: 'AVAILABLE', orders: [] },
        { id: '3', number: 3, status: 'AVAILABLE', orders: [] },
        { id: '4', number: 4, status: 'AVAILABLE', orders: [] },
        { id: '5', number: 5, status: 'AVAILABLE', orders: [] },
        { id: '6', number: 6, status: 'AVAILABLE', orders: [] },
    ],
    products: [],
    staff: [],
    currentStaff: null,
    staffShifts: [],
    kitchenOrders: [],
    notifications: [],
    cart: [],
    activeTableId: null,
    exchangeRate: 89500,
    currentView: 'floor',
    stats: { totalRevenue: 0, totalVisits: 0, itemsSold: 0, reservationsCount: 0 },

    setView: (view) => set({ currentView: view }),

    setActiveTable: (id) => {
        const table = get().tables.find(t => t.id === id);
        set({
            activeTableId: id,
            cart: table && table.orders ? [...table.orders] : [] 
        });
    },

    setCurrentStaff: (staff) => {
        if (staff) {
            localStorage.setItem('pos_user', JSON.stringify(staff));
            get().fetchShifts(staff.id);
            get().fetchTables();
            if (staff.role === 'admin') get().fetchAdminStats();
        } else {
            localStorage.removeItem('pos_user');
        }
        set({ currentStaff: staff });
    },

    initializeAuth: () => {
        const savedUser = localStorage.getItem('pos_user');
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                set({ currentStaff: user });
                get().fetchShifts(user.id);
                get().fetchProducts();
                get().fetchTables();
                if (user.role === 'admin') get().fetchAdminStats();
            } catch (e) {
                localStorage.removeItem('pos_user');
            }
        }
    },

    fetchTables: async () => {
        const { data, error } = await supabase.from('table_sessions').select('*');
        if (!error && data) {
            set((state) => ({
                tables: state.tables.map(t => {
                    const dbTable = data.find(dt => dt.table_number === t.number);
                    if (!dbTable) return t;
                    return {
                        ...t,
                        id: dbTable.id,
                        status: dbTable.status.toUpperCase() as any,
                        reservedBy: dbTable.waiter_name,
                        orders: t.orders.length > 0 ? t.orders : []
                    };
                })
            }));
        }
    },

    fetchAdminStats: async () => {
        const today = new Date().toISOString().split('T')[0];
        const { data: sales } = await supabase.from('sales_history').select('*').gte('session_date', today);
        const { data: activeRes } = await supabase.from('table_sessions').select('id').eq('status', 'RESERVED');

        if (sales) {
            set({
                stats: {
                    totalRevenue: sales.reduce((sum, s) => sum + s.total_usd, 0),
                    totalVisits: sales.length,
                    itemsSold: sales.reduce((sum, s) => sum + s.items_sold, 0),
                    reservationsCount: (activeRes?.length || 0) + sales.filter(s => s.is_reservation).length
                }
            });
        }
    },

    fetchProducts: async () => {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true) 
            .order('name', { ascending: true });

        if (!error && data) {
            set({
                products: data.map(p => ({
                    id: p.id,
                    name: p.name,
                    description: p.description,
                    image_url: p.image_url,
                    priceUSD: p.price_usd,
                    category: p.category
                }))
            });
        }
    },

    addProduct: async (newProduct) => {
        const { error } = await supabase.from('products').insert([{
            name: newProduct.name,
            description: newProduct.description,
            image_url: newProduct.image_url,
            price_usd: newProduct.priceUSD,
            category: newProduct.category,
            is_active: true // Explicitly set to true on creation
        }]);
        if (!error) await get().fetchProducts();
        else console.error("Database Insert Error:", error.message);
    },

    updateProduct: async (id, updates) => {
        const { error } = await supabase.from('products').update({
            name: updates.name,
            description: updates.description,
            image_url: updates.image_url,
            price_usd: updates.priceUSD,
            category: updates.category
        }).eq('id', id);
        
        if (!error) await get().fetchProducts();
        else console.error("Database Update Error:", error.message);
    },

    deleteProduct: async (id) => {
    const { error } = await supabase
        .from('products')
        .update({ is_active: false }) 
        .eq('id', id);
    
    if (error) {
        console.error("Delete failed:", error.message);
    } else {
        // This line is what makes it vanish from your screen immediately
        set(state => ({ 
            products: state.products.filter(p => p.id !== id) 
        }));
    }
},

    addToCart: (product) => set((state) => {
        const existing = state.cart.find(item => item.id === product.id);
        if (existing) {
            return { cart: state.cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) };
        }
        return { cart: [...state.cart, { ...product, quantity: 1, status: 'pending' }] };
    }),

    removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter(item => item.id !== productId)
    })),

    sendToKitchen: async () => {
        const { activeTableId, cart, currentStaff, tables } = get();
        if (!activeTableId || cart.length === 0) return;

        const targetTable = tables.find(t => t.id === activeTableId);
        const dbOrders = cart.map(item => ({
            table_number: targetTable?.number,
            product_name: item.name,
            quantity: item.quantity,
            waiter_name: currentStaff?.full_name || 'System',
            status: 'pending'
        }));

        const { error } = await supabase.from('kitchen_orders').insert(dbOrders);
        if (!error) {
            await supabase.from('table_sessions').update({ status: 'OCCUPIED' }).eq('id', activeTableId);
            set((state) => ({
                tables: state.tables.map(t => t.id === activeTableId ? { ...t, status: 'OCCUPIED', orders: [...cart] } : t),
                cart: [],
                activeTableId: null
            }));
            await get().fetchTables();
        }
    },

    closeTable: async (tableId) => {
        const { tables, cart } = get();
        const targetTable = tables.find(t => t.id === tableId);
        if (!targetTable) return;

        const totalUSD = cart.reduce((sum, item) => sum + (item.priceUSD * item.quantity), 0);
        const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

        if (itemsCount > 0) {
            await supabase.from('sales_history').insert({
                table_id: tableId,
                total_usd: totalUSD,
                items_sold: itemsCount,
                waiter_name: targetTable.reservedBy || get().currentStaff?.full_name || 'Staff',
                is_reservation: targetTable.status.toUpperCase() === 'RESERVED'
            });
        }

        const { error } = await supabase.from('table_sessions').update({ 
            status: 'AVAILABLE', waiter_name: null, people_count: null, arrival_time: null 
        }).eq('id', tableId);

        if (!error) {
            set((state) => ({
                tables: state.tables.map(t => t.id === tableId ? { ...t, status: 'AVAILABLE', orders: [] } : t),
                activeTableId: null,
                cart: []
            }));
            await get().fetchTables();
            await get().fetchAdminStats();
        }
    },

    reserveTable: async (tableId, details) => {
        const { data, error } = await supabase.from('table_sessions').update({
            status: 'RESERVED', waiter_name: details.name, people_count: details.people, arrival_time: details.time
        }).eq('id', tableId).eq('status', 'AVAILABLE').select();
        if (!error && data?.length) { await get().fetchTables(); return true; }
        return false;
    },

    cancelReservation: async (tableId) => {
        await supabase.from('table_sessions').update({ status: 'AVAILABLE', waiter_name: null }).eq('id', tableId);
        await get().fetchTables();
    },

    markAsServed: async (tableId) => {
        await supabase.from('table_sessions').update({ status: 'SERVED' }).eq('id', tableId);
        await get().fetchTables();
    },

    fetchStaff: async () => {
        const { data } = await supabase.from('staff').select('*');
        if (data) set({ staff: data });
    },

    fetchShifts: async (staffId) => {
        const { data } = await supabase.from('shifts').select('*').eq('staff_id', staffId);
        if (data) set({ staffShifts: data });
    },

    fetchKitchenOrders: async () => {
        const { data } = await supabase.from('kitchen_orders').select('*').eq('status', 'pending');
        if (data) set({ kitchenOrders: data });
    },

    addNotification: (order) => set((state) => ({
        notifications: [{ id: order.id, message: `${order.product_name} ready!`, table_number: order.table_number, timestamp: new Date() }, ...state.notifications]
    })),

    clearNotification: (id) => set((state) => ({ notifications: state.notifications.filter(n => n.id !== id) })),
}));