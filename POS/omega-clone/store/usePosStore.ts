'use client';
import { create } from 'zustand';
import { supabase } from '../lib/supabase';

// --- Interfaces ---

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
    pin_code: string;
}

export interface Shift {
    id: string;
    shift_date: string;
    start_time: string;
    end_time: string;
    status: 'scheduled' | 'completed' | 'off_day' | 'sick_leave';
    staff_id: string;
}

export interface KitchenOrder {
    id: string;
    table_number: number;
    product_name: string;
    quantity: number;
    waiter_name: string;
    status: 'pending' | 'preparing' | 'ready' | 'served';
    station: 'Grill' | 'Bar' | 'Cold' | 'General';
    priority: 'Normal' | 'VIP' | 'Urgent';
    created_at: string;
}

export interface WaiterNotification {
    id: string;
    message: string;
    type: 'order_ready' | 'leave_request' | 'system';
    table_number?: number;
    timestamp: Date;
}

export interface OrderItem extends Product {
    quantity: number;
    status: 'pending' | 'sent' | 'served';
}

export interface Table {
    id: string;
    number: number;
    capacity: number;         
    type: 'booth' | 'round' | 'bar' | 'standard' | 'large';
    zone: 'Inside' | 'Patio' | 'VIP';
    tags: string[];
    status: 'AVAILABLE' | 'OCCUPIED' | 'SERVED' | 'BILLING' | 'RESERVED' | 'DIRTY'; 
    orders: OrderItem[];
    reservationDetails?: {
        clientName: string;
        peopleCount: number;
        arrivalTime: string;
        phoneNumber?: string;
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
    isNotificationOpen: boolean;
    cart: OrderItem[];
    suggestedItems: Product[];
    activeTableId: string | null;
    exchangeRate: number;
    currentView: 'floor' | 'admin' | 'kitchen' | 'menu' | 'staff_schedule';
    stats: AdminStats;
    kitchenStressLevel: 'Low' | 'Medium' | 'High';

    // Actions
    setView: (view: 'floor' | 'admin' | 'kitchen' | 'menu' | 'staff_schedule') => void;
    setNotificationOpen: (open: boolean) => void;
    setActiveTable: (id: string | null) => void;
    setCurrentStaff: (staff: Staff | null) => void;
    initializeAuth: () => void;
    
    // Notifications
    addNotification: (message: string, type: WaiterNotification['type'], tableNumber?: number) => void;
    fetchNotifications: () => Promise<void>;
    markNotificationRead: (id: string) => Promise<void>;
    clearNotification: (id: string) => void;

    // Database / Business Logic
    fetchTables: () => Promise<void>;
    fetchStaff: () => Promise<void>;
    reserveTable: (tableId: string, details: { name: string; people: number; time: string; phone?: string }) => Promise<boolean>;
    cancelReservation: (tableId: string) => Promise<void>;
    fetchProducts: () => Promise<void>;
    addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
    updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    addToCart: (product: Product) => void;
    updateUpsellSuggestions: () => void;
    removeFromCart: (productId: string) => void;
    sendToKitchen: () => Promise<void>;
    deductInventory: (items: OrderItem[]) => Promise<void>; // Added to interface
    markAsServed: (tableId: string) => Promise<void>;
    closeTable: (tableId: string) => Promise<void>;
    fetchKitchenOrders: () => Promise<void>;
    fetchAdminStats: () => Promise<void>;
    fetchShifts: (staffId: string) => Promise<void>;
    uploadProductImage: (file: File) => Promise<string>;
    submitLeaveRequest: (details: { type: string, start: string, end: string, reason: string }) => Promise<void>;
}

export const usePosStore = create<PosState>((set, get) => ({
    // --- Initial State ---
    tables: [
        { id: '1', number: 1, capacity: 2, type: 'bar', zone: 'Inside', tags: ['High Top'], status: 'AVAILABLE', orders: [] },
        { id: '2', number: 2, capacity: 2, type: 'standard', zone: 'Patio', tags: ['Pet Friendly'], status: 'AVAILABLE', orders: [] },
        { id: '3', number: 3, capacity: 4, type: 'booth', zone: 'Inside', tags: ['Quiet'], status: 'AVAILABLE', orders: [] },
        { id: '4', number: 4, capacity: 4, type: 'round', zone: 'Inside', tags: ['Center View'], status: 'AVAILABLE', orders: [] },
        { id: '5', number: 5, capacity: 6, type: 'standard', zone: 'VIP', tags: ['Exclusive'], status: 'AVAILABLE', orders: [] },
        { id: '6', number: 6, capacity: 8, type: 'large', zone: 'Inside', tags: ['Party Table'], status: 'AVAILABLE', orders: [] },
    ],
    products: [],
    staff: [],
    currentStaff: null,
    staffShifts: [],
    kitchenOrders: [],
    notifications: [],
    isNotificationOpen: false,
    cart: [],
    suggestedItems: [],
    activeTableId: null,
    exchangeRate: 89500,
    currentView: 'floor',
    kitchenStressLevel: 'Low',
    stats: { totalRevenue: 0, totalVisits: 0, itemsSold: 0, reservationsCount: 0 },

    // --- Actions ---
    setView: (view) => set({ currentView: view }),
    setNotificationOpen: (open) => set({ isNotificationOpen: open }),
    setActiveTable: (id) => {
        const table = get().tables.find(t => t.id === id);
        set({ activeTableId: id, cart: table && table.orders ? [...table.orders] : [] });
        get().updateUpsellSuggestions();
    },
    setCurrentStaff: (staff) => {
        if (staff) {
            localStorage.setItem('pos_user', JSON.stringify(staff));
            get().fetchShifts(staff.id);
            get().fetchTables();
            get().fetchKitchenOrders();
            get().fetchNotifications();
            if (staff.role === 'admin' || staff.role === 'manager') get().fetchAdminStats();
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
                get().fetchStaff();
                get().fetchNotifications();
            } catch (e) { localStorage.removeItem('pos_user'); }
        }
    },

    fetchNotifications: async () => {
        const { currentStaff } = get();
        if (!currentStaff) return;
        const { data, error } = await supabase.from('notifications').select('*').eq('staff_id', currentStaff.id).eq('is_read', false).order('created_at', { ascending: false });
        if (!error && data) {
            set({ notifications: data.map(n => ({ id: n.id, message: n.message, type: n.type as WaiterNotification['type'], timestamp: new Date(n.created_at) })) });
        }
    },
    markNotificationRead: async (id) => {
        await supabase.from('notifications').update({ is_read: true }).eq('id', id);
        set(state => ({ notifications: state.notifications.filter(n => n.id !== id) }));
    },
    addNotification: (message, type, tableNumber) => set((state) => ({ 
        notifications: [{ id: Math.random().toString(36).substring(7), message, type, table_number: tableNumber, timestamp: new Date() }, ...state.notifications] 
    })),
    clearNotification: (id) => get().markNotificationRead(id),

    fetchStaff: async () => {
        const { data, error } = await supabase.from('staff').select('*').order('full_name', { ascending: true });
        if (!error && data) set({ staff: data });
    },
    fetchTables: async () => {
        const { data, error } = await supabase.from('table_sessions').select('*').order('table_number', { ascending: true }); 
        if (!error && data) {
            set((state) => ({
                tables: state.tables.map(localTable => {
                    const dbMatch = data.find(db => db.table_number === localTable.number);
                    return dbMatch ? { ...localTable, status: dbMatch.status.toUpperCase() as any, reservationDetails: { clientName: dbMatch.waiter_name || '', peopleCount: dbMatch.people_count || 0, arrivalTime: dbMatch.arrival_time || '', phoneNumber: dbMatch.phone_number || '' } } : localTable;
                })
            }));
        }
    },
    reserveTable: async (tableId, details) => {
        const table = get().tables.find(t => t.id === tableId);
        if (table && details.people > table.capacity) { alert(`Capacity Error: Max ${table.capacity} seats.`); return false; }
        const { error } = await supabase.from('table_sessions').update({ status: 'RESERVED', waiter_name: details.name, people_count: details.people, arrival_time: details.time, phone_number: details.phone }).eq('id', tableId);
        if (!error) { await get().fetchTables(); return true; }
        return false;
    },
    cancelReservation: async (tableId) => { 
        await supabase.from('table_sessions').update({ status: 'AVAILABLE', waiter_name: null, people_count: null, arrival_time: null, phone_number: null }).eq('id', tableId); 
        await get().fetchTables(); 
    },
    updateUpsellSuggestions: () => {
        const { cart, products } = get();
        if (cart.length === 0) { set({ suggestedItems: products.slice(0, 3) }); return; }
        const categories = new Set(cart.map(i => i.category));
        let suggestions = categories.has('Food') && !categories.has('Drinks') ? products.filter(p => p.category === 'Drinks').slice(0, 2) : products.filter(p => p.category === 'Dessert').slice(0, 2);
        set({ suggestedItems: suggestions.length > 0 ? suggestions : products.slice(0, 2) });
    },
    addToCart: (product) => {
        set((state) => {
            const existing = state.cart.find(item => item.id === product.id);
            return { cart: existing ? state.cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...state.cart, { ...product, quantity: 1, status: 'pending' }] };
        });
        get().updateUpsellSuggestions();
    },
    removeFromCart: (productId) => set((state) => ({ cart: state.cart.filter(item => item.id !== productId) })),
    fetchKitchenOrders: async () => {
        const { data, error } = await supabase.from('kitchen_orders').select('*').eq('status', 'pending').order('created_at', { ascending: true });
        if (!error && data) set({ kitchenOrders: data, kitchenStressLevel: data.length > 10 ? 'High' : data.length > 5 ? 'Medium' : 'Low' });
    },
    sendToKitchen: async () => {
        const { activeTableId, cart, currentStaff, tables } = get();
        if (!activeTableId || cart.length === 0) return;
        const targetTable = tables.find(t => t.id === activeTableId);
        const dbOrders = cart.map(item => ({
            table_number: targetTable?.number, product_name: item.name, quantity: item.quantity, waiter_name: currentStaff?.full_name || 'System', status: 'pending',
            station: item.category === 'Drinks' ? 'Bar' : item.category === 'Dessert' ? 'Cold' : 'Grill',
            priority: targetTable?.zone === 'VIP' ? 'VIP' : 'Normal'
        }));
        const { error } = await supabase.from('kitchen_orders').insert(dbOrders);
        if (!error) {
            await get().deductInventory(cart);
            await supabase.from('table_sessions').update({ status: 'OCCUPIED' }).eq('id', activeTableId);
            set({ cart: [], activeTableId: null });
            await get().fetchTables();
            await get().fetchKitchenOrders();
        }
    },
    deductInventory: async (items) => {
        for (const item of items) {
            const { data: recipe } = await supabase.from('product_ingredients').select('ingredient_id, quantity_required').eq('product_id', item.id);
            if (recipe) {
                for (const ing of recipe) {
                    await supabase.rpc('decrement_stock', { row_id: ing.ingredient_id, amount: ing.quantity_required * item.quantity });
                }
            }
        }
    },
    markAsServed: async (tableId) => { await supabase.from('table_sessions').update({ status: 'SERVED' }).eq('id', tableId); await get().fetchTables(); },
    closeTable: async (tableId) => {
        const { tables, cart, currentStaff } = get();
        const targetTable = tables.find(t => t.id === tableId);
        if (!targetTable) return;
        const total = cart.reduce((sum, i) => sum + (i.priceUSD * i.quantity), 0);
        if (cart.length > 0) {
            await supabase.from('sales_history').insert({ table_id: tableId, table_number: targetTable.number, total_usd: total, items_sold: cart.length, waiter_name: currentStaff?.full_name || 'Staff', session_date: new Date().toISOString().split('T')[0] });
        }
        await supabase.from('table_sessions').update({ status: 'AVAILABLE', waiter_name: null, people_count: null, arrival_time: null }).eq('id', tableId);
        set({ activeTableId: null, cart: [] });
        await get().fetchTables();
    },
    fetchProducts: async () => {
        const { data, error } = await supabase.from('products').select('*').eq('is_active', true).order('name', { ascending: true });
        if (!error && data) set({ products: data.map(p => ({ id: p.id, name: p.name, description: p.description || '', image_url: p.image_url || '', priceUSD: p.price_usd, category: p.category })) });
    },
    addProduct: async (p) => { await supabase.from('products').insert([{ name: p.name, description: p.description, image_url: p.image_url, price_usd: p.priceUSD, category: p.category, is_active: true }]); await get().fetchProducts(); },
    updateProduct: async (id, p) => { await supabase.from('products').update({ name: p.name, description: p.description, price_usd: p.priceUSD, category: p.category }).eq('id', id); await get().fetchProducts(); },
    deleteProduct: async (id) => { await supabase.from('products').update({ is_active: false }).eq('id', id); await get().fetchProducts(); },
    fetchShifts: async (id) => { const { data } = await supabase.from('shifts').select('*').eq('staff_id', id); if (data) set({ staffShifts: data }); },
    fetchAdminStats: async () => {
        const today = new Date().toISOString().split('T')[0];
        const { data: sales } = await supabase.from('sales_history').select('*').gte('session_date', today);
        if (sales) set({ stats: { totalRevenue: sales.reduce((sum, s) => sum + s.total_usd, 0), totalVisits: sales.length, itemsSold: sales.reduce((sum, s) => sum + s.items_sold, 0), reservationsCount: 0 } });
    },
    submitLeaveRequest: async (d) => {
        const { currentStaff } = get();
        if (!currentStaff) return;
        await supabase.from('leave_requests').insert([{ staff_id: currentStaff.id, leave_type: d.type, start_date: d.start, end_date: d.end, reason: d.reason, status: 'pending' }]);
        get().addNotification(`New ${d.type} from ${currentStaff.full_name}`, 'leave_request');
    },
    uploadProductImage: async (file) => {
        const path = `uploads/${Date.now()}-${file.name}`;
        await supabase.storage.from('product-images').upload(path, file);
        return supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl;
    }
}));