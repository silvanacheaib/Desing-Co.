'use client';
import { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { OrderPanel } from '../components/OrderPanel';
import { AdminPanel } from '../components/AdminPanel';
import { LoginScreen } from '../components/LoginScreen';
import { MenuExplorer } from '../components/MenuExplorer'; 
import { KitchenFeed } from '../components/KitchenFeed';
import { usePosStore } from '../store/usePosStore';
import { supabase } from '../lib/supabase';
import { 
  Lock, Loader2, Zap, BellRing, CheckCircle2, 
  UserCheck, X, Users, Clock, User, Check 
} from 'lucide-react';

export default function Home() {
  const { 
    tables, 
    setActiveTable, 
    activeTableId, 
    currentView, 
    fetchProducts, 
    fetchStaff,
    fetchTables,
    exchangeRate,
    currentStaff,
    initializeAuth,
    notifications,
    addNotification,
    clearNotification,
    reserveTable,
  } = usePosStore();

  const [isInitializing, setIsInitializing] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [resData, setResData] = useState({ name: '', people: 2, time: '' });

  useEffect(() => {
    initializeAuth();
    const timer = setTimeout(() => setIsInitializing(false), 500);
    return () => clearTimeout(timer);
  }, [initializeAuth]);

  useEffect(() => {
    if (currentStaff) {
      fetchProducts();
      fetchStaff();
      fetchTables();

      const menuChannel = supabase
        .channel('menu-updates')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => fetchProducts())
        .subscribe();

      const tableChannel = supabase
        .channel('table-updates')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'table_sessions' }, () => {
          fetchTables();
        })
        .subscribe();

      return () => { 
        supabase.removeChannel(menuChannel);
        supabase.removeChannel(tableChannel);
      };
    }
  }, [currentStaff, fetchProducts, fetchStaff, fetchTables]);

  useEffect(() => {
    if (currentStaff?.role === 'waiter' || currentStaff?.role === 'admin') {
      const notificationChannel = supabase
        .channel('kitchen-updates')
        .on('postgres_changes', { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'kitchen_orders',
          filter: 'status=eq.served' 
        }, (payload: any) => {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
          audio.play().catch(() => {}); 
          addNotification(payload.new);
        })
        .subscribe();

      return () => { supabase.removeChannel(notificationChannel); };
    }
  }, [currentStaff, addNotification]);

  const handleTableInteraction = (table: any) => {
    const status = table.status.toUpperCase();
    
    // If table is occupied, open order panel directly
    if (status === 'OCCUPIED') {
      setActiveTable(table.id);
      return;
    }

    // If table is Reserved or Billing, we treat interaction as "Locked" unless handled by modal
    if (status === 'AVAILABLE') {
      setSelectedTable(table);
      setIsModalOpen(true);
    }
  };

  const submitReservation = async () => {
    if (!resData.name || !resData.time) {
      alert("Please enter a name and arrival time.");
      return;
    }
    
    const success = await reserveTable(selectedTable.id, resData);
    if (success) {
      setIsModalOpen(false);
      setResData({ name: '', people: 2, time: '' });
    } else {
      alert("Could not reserve. This table might have just been taken!");
    }
  };

  if (isInitializing) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-900">
        <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
        <p className="text-white/30 font-black text-[10px] uppercase tracking-[0.3em]">Syncing BiteCraft POS...</p>
      </div>
    );
  }

  if (!currentStaff) return <LoginScreen />;

  const isAdmin = currentStaff.role === 'admin' || currentStaff.role === 'manager';

  return (
    <main className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900 relative">
      <Sidebar />

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-24 bg-white border-b border-slate-100 flex items-center justify-between px-10 shrink-0">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black uppercase tracking-tighter leading-none italic">
              {currentView === 'floor' ? 'Main Floor' : 
               currentView === 'admin' ? 'Management' : 
               currentView === 'menu' ? 'Menu Explorer' : 'Kitchen'}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {currentStaff.full_name} • {currentStaff.role}
              </span>
            </div>
          </div>

          <div className="bg-white px-5 py-3 rounded-2xl text-[11px] font-black text-slate-900 border border-slate-100 shadow-sm">
            <span className="opacity-40 mr-2 text-[8px] uppercase">LBP Rate</span> {exchangeRate.toLocaleString()}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {currentView === 'floor' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {tables.map((table) => {
  const status = table.status.toUpperCase();
  const isAvailable = status === 'AVAILABLE';
  const isOccupied = status === 'OCCUPIED';
  const isReserved = status === 'RESERVED';
  const isBilling = status === 'BILLING';
  
  return (
    <button
      key={table.id}
      // Only disable clicking if it's RESERVED or BILLING
      disabled={isReserved || isBilling}
      onClick={() => handleTableInteraction(table)}
      className={`h-52 rounded-[3.5rem] border-4 flex flex-col items-center justify-center transition-all duration-500 relative
        ${activeTableId === table.id ? 'border-blue-500 bg-blue-50/30' : 'border-transparent shadow-sm'}
        
        /* 1. AVAILABLE STATE: Colorful, interactive, and prominent */
        ${isAvailable ? 'bg-white text-slate-900 border-slate-100 hover:border-blue-400 hover:shadow-xl hover:scale-105 cursor-pointer opacity-100' : ''}

        /* 2. OCCUPIED STATE: High visibility but different color */
        ${isOccupied ? 'text-orange-500 border-orange-100 bg-orange-50/10 cursor-pointer opacity-100' : ''}

        /* 3. DISABLED STATES: Dimmed and grayscale */
        ${isReserved ? 'text-purple-500 border-purple-100 bg-purple-50/30 opacity-40 grayscale scale-95 cursor-not-allowed' : ''}
        ${isBilling ? 'text-blue-500 border-blue-100 opacity-40 grayscale scale-95 cursor-not-allowed' : ''}
      `}
    >
      {/* Status Badge */}
      {!isAvailable && (
        <div className={`absolute top-6 flex items-center gap-1 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-white shadow-sm
          ${isReserved ? 'bg-purple-500' : isOccupied ? 'bg-orange-500' : 'bg-blue-500'}`}>
          {isReserved && <Lock size={10} />}
          {status}
        </div>
      )}

      <span className={`text-[10px] font-black uppercase mb-1 tracking-widest ${isAvailable ? 'text-blue-500 opacity-100' : 'opacity-50'}`}>
        Table
      </span>
      
      <span className={`text-6xl font-black italic ${isAvailable ? 'text-slate-900' : ''}`}>
        {table.number}
      </span>
      
      {table.reservationDetails?.clientName && (
        <span className="absolute bottom-6 text-[10px] font-black text-purple-400 truncate max-w-[80%] uppercase">
          {table.reservationDetails.clientName}
        </span>
      )}
    </button>
  );
})}
            </div>
          )}

          {currentView === 'menu' && <MenuExplorer isPublic={false} />}
          {currentView === 'admin' && (isAdmin ? <AdminPanel /> : <div className="flex flex-col items-center justify-center h-full text-slate-300"><Lock size={64} className="opacity-20 mb-6" /><p className="font-black uppercase text-xs tracking-[0.2em]">Management Access Required</p></div>)}
          {currentView === 'kitchen' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex items-center gap-3 mb-8">
                <Zap className="text-orange-500" size={20} fill="currentColor" />
                <h2 className="text-2xl font-black italic uppercase tracking-tighter">Live Order Feed</h2>
              </div>
              <KitchenFeed /> 
            </div>
          )}
        </div>

        {(currentView === 'floor' || currentView === 'menu') && <OrderPanel />}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-6">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200 relative">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">Table {selectedTable?.number}</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Status: {selectedTable?.status}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" 
                  placeholder="Client Name"
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold focus:ring-2 ring-blue-500 transition-all outline-none text-slate-900"
                  value={resData.name}
                  onChange={(e) => setResData({...resData, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="number" 
                    placeholder="People"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold outline-none text-slate-900"
                    value={resData.people}
                    onChange={(e) => setResData({...resData, people: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="time" 
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold outline-none text-slate-900"
                    value={resData.time}
                    onChange={(e) => setResData({...resData, time: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <button 
                  onClick={() => { setActiveTable(selectedTable.id); setIsModalOpen(false); }}
                  className="py-5 bg-slate-100 text-slate-900 rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all"
                >
                  Skip to Order
                </button>
                <button 
                  onClick={submitReservation}
                  className="py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-200 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"
                >
                  <Check size={16} /> Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 w-full max-w-md px-6">
        {notifications.map((n) => (
          <div key={n.id} className="bg-slate-900 text-white p-5 rounded-[2.5rem] shadow-2xl flex items-center justify-between animate-in slide-in-from-bottom-10 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-3 rounded-2xl animate-pulse"><BellRing size={18} className="text-white" /></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Pick Up Table {n.table_number}</p>
                <p className="text-sm font-bold opacity-90">{n.message}</p>
              </div>
            </div>
            <button onClick={() => clearNotification(n.id)} className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors group"><CheckCircle2 size={20} className="group-hover:text-emerald-400" /></button>
          </div>
        ))}
      </div>
    </main>
  );
}