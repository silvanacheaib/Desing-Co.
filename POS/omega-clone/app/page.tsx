'use client';
import { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { OrderPanel } from '../components/OrderPanel';
import { AdminPanel } from '../components/AdminPanel';
import { LoginScreen } from '../components/LoginScreen';
import { MenuExplorer } from '../components/MenuExplorer'; 
import { KitchenFeed } from '../components/KitchenFeed';
import { StaffSchedule } from '../components/StaffSchedule';
import { usePosStore } from '../store/usePosStore';
import { supabase } from '../lib/supabase';
import { 
  Lock, Loader2, Zap, BellRing, CheckCircle2, 
  X, Users, Clock, User, Check, Maximize2, Phone
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
  const [resData, setResData] = useState({ name: '', people: 2, time: '', phone: '' });

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
        .on('postgres_changes', { event: '*', schema: 'public', table: 'table_sessions' }, () => fetchTables())
        .subscribe();

      const kitchenChannel = supabase
        .channel('kitchen-updates')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'kitchen_orders' }, () => {
          // Refresh kitchen orders if needed
        })
        .subscribe();

      return () => { 
        supabase.removeChannel(menuChannel);
        supabase.removeChannel(tableChannel);
        supabase.removeChannel(kitchenChannel);
      };
    }
  }, [currentStaff, fetchProducts, fetchStaff, fetchTables]);

  const handleTableInteraction = (table: any) => {
    const status = table.status.toUpperCase();
    if (status !== 'AVAILABLE' && status !== 'RESERVED') {
      setActiveTable(table.id);
      return;
    }
    if (status === 'AVAILABLE') {
      setSelectedTable(table);
      setResData({ name: '', people: table.capacity, time: '', phone: '' }); 
      setIsModalOpen(true);
    }
  };

  const submitReservation = async () => {
    if (!resData.name || !resData.time || !resData.phone) {
      alert("Missing Information: Name, Phone, and Arrival Time are required.");
      return;
    }

    if (resData.people > selectedTable.capacity) {
      alert(`Capacity Error: Table ${selectedTable.number} only accommodates ${selectedTable.capacity} guests.`);
      return;
    }
    
    const success = await reserveTable(selectedTable.id, resData);
    if (success) {
      setIsModalOpen(false);
      setResData({ name: '', people: 2, time: '', phone: '' });
    }
  };

  const isLateArrival = (table: any) => {
    if (table.status.toUpperCase() !== 'RESERVED' || !table.reservationDetails?.arrivalTime) return false;
    const [hours, minutes] = table.reservationDetails.arrivalTime.split(':');
    const arrival = new Date();
    arrival.setHours(parseInt(hours), parseInt(minutes), 0);
    return new Date().getTime() > (arrival.getTime() + 15 * 60000);
  };

  if (isInitializing) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-900 text-white">
        <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
        <p className="font-black text-[10px] uppercase tracking-[0.3em] opacity-30">Syncing BiteCraft POS...</p>
      </div>
    );
  }

  if (!currentStaff) return <LoginScreen />;

  const isAdmin = currentStaff.role === 'admin' || currentStaff.role === 'manager';

  const renderCurrentView = () => {
    switch (currentView) {
      case 'floor':
        return (
          <div className="tables-container flex flex-wrap gap-8 justify-start">
            {[...tables].sort((a, b) => a.number - b.number).map((table) => {
              const late = isLateArrival(table);
              // Fix: Check table type properly - use type property instead of comparing to 'large'
              const isLargeTable = table.type === 'booth' || table.type === 'round' || table.capacity >= 6;
              return (
                <div  key={table.id} onClick={() => handleTableInteraction(table)} className={`table-card ${isLargeTable ? 'large' : ''} ${table.status.toUpperCase() === 'AVAILABLE' ? 'is-available' : 'is-occupied'}
                    ${late ? 'is-late' : ''}
                    ${activeTableId === table.id ? 'is-active' : ''}
                  `}
                >
                  <div>
                    <h3 className="text-3xl font-black italic">#{table.number}</h3>
                    <div className="mt-3 flex flex-col gap-2">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase ${table.status.toUpperCase() === 'AVAILABLE' ? 'bg-slate-100 text-slate-500' : 'bg-white/10 text-white/60'}`}>
                        <Users size={12} /> {table.capacity} SEATS
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${late ? 'bg-orange-500' : table.status.toUpperCase() === 'AVAILABLE' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${late ? 'text-orange-500' : 'opacity-60'}`}>
                      {late ? 'LATE ARRIVAL' : table.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        );
      case 'menu':
        // Fix: Remove isPublic prop as it doesn't exist in MenuExplorer
        return <MenuExplorer />;
      case 'kitchen':
        return <KitchenFeed />;
      case 'staff_schedule':
        return <StaffSchedule />;
      case 'admin':
        return isAdmin ? <AdminPanel /> : <div className="text-center mt-20 opacity-20"><Lock size={80} className="mx-auto mb-4"/> ACCESS DENIED</div>;
      default:
        return null;
    }
  };

  return (
    <main className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900 relative">
      <Sidebar />

      <div className="menuPanel flex-1 flex flex-col relative overflow-hidden">
        <header className="h-24 bg-white border-b border-slate-100 flex items-center justify-between px-10 shrink-0">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black uppercase tracking-tighter leading-none italic">
              {currentView === 'floor' ? 'Main Floor' : 
               currentView === 'admin' ? 'Management' : 
               currentView === 'kitchen' ? 'Kitchen' : 
               currentView === 'staff_schedule' ? 'Staff Schedule' : 'Menu'}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{currentStaff.full_name}</span>
            </div>
          </div>
          <div className="bg-white px-5 py-3 rounded-2xl text-[11px] font-black border border-slate-100">
            <span className="opacity-40 mr-2 text-[8px] uppercase">LBP Rate</span> {exchangeRate.toLocaleString()}
          </div>
        </header>

        <div className="main-body flex-1 overflow-y-auto p-8 custom-scrollbar">
          {renderCurrentView()}
        </div>

        {(currentView === 'floor' || currentView === 'menu') && <OrderPanel />}
      </div>

      {/* Reservation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-6">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-4xl font-black italic uppercase">Table {selectedTable?.number}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={24} /></button>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input type="text" placeholder="Client Name" className="w-full bg-slate-50 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none" value={resData.name} onChange={(e) => setResData({...resData, name: e.target.value})} />
              </div>
              
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input type="tel" placeholder="Phone Number" className="w-full bg-slate-50 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none" value={resData.phone} onChange={(e) => setResData({...resData, phone: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input type="number" placeholder="Heads" className={`w-full bg-slate-50 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none ${resData.people > selectedTable?.capacity ? 'text-red-500 ring-2 ring-red-500' : ''}`} value={resData.people} onChange={(e) => setResData({...resData, people: parseInt(e.target.value) || 0})} />
                </div>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input type="time" className="w-full bg-slate-50 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none" value={resData.time} onChange={(e) => setResData({...resData, time: e.target.value})} />
                </div>
              </div>

              {resData.people > selectedTable?.capacity && (
                <p className="text-[10px] text-red-500 font-black uppercase text-center animate-bounce">Warning: Exceeds table limit of {selectedTable?.capacity}</p>
              )}

              <div className="grid grid-cols-2 gap-4 mt-6">
                <button onClick={() => { setActiveTable(selectedTable.id); setIsModalOpen(false); }} className="py-5 bg-slate-100 rounded-[2rem] font-black uppercase text-[10px] tracking-widest">Walk-In</button>
                <button onClick={submitReservation} className="py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"><Check size={16} /> Confirm</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}