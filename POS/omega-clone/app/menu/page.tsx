'use client';
import { useEffect, useState } from 'react';
import { MenuExplorer } from '@/components/MenuExplorer';
import { usePosStore } from '@/store/usePosStore';
import { supabase } from '@/lib/supabase'; // Ensure this import exists
import { Loader2, Utensils, Globe } from 'lucide-react';

export default function PublicMenuPage() {
  const { fetchProducts, products } = usePosStore();
  const [hasLoaded, setHasLoaded] = useState(false);

  // 1. Optimized Data Fetching with Realtime Listener
  useEffect(() => {
    const loadMenu = async () => {
      await fetchProducts();
      setHasLoaded(true);
    };

    loadMenu();

    // REALTIME: Sync menu if products change in Supabase
    const channel = supabase
      .channel('public-menu-sync')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'products' 
      }, () => {
        fetchProducts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchProducts]);

  // 2. High-End Loading State
  if (!hasLoaded) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-900">
        <div className="relative">
           <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
           <Utensils className="absolute inset-0 m-auto text-blue-500/10" size={16} />
        </div>
        <p className="text-white/30 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">
          Syncing Digital Menu...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
      {/* Dynamic Public Header */}
      <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 md:px-12 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 p-2.5 rounded-2xl text-white rotate-3 shadow-lg shadow-blue-500/20">
            <Utensils size={22} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tighter italic leading-none">
              BITE<span className="text-blue-600">CRAFT</span>
            </h1>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1 flex items-center gap-1">
              <Globe size={10} /> Live Digital Menu
            </span>
          </div>
        </div>
        
        <div className="hidden md:block">
           <span className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
             Kitchen Open
           </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* If no products are found, show a helpful message */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-300">
            <Utensils size={48} className="mb-4 opacity-20" />
            <p className="font-black uppercase text-xs tracking-widest">The menu is being updated...</p>
          </div>
        ) : (
          <MenuExplorer isPublic={true} />
        )}
      </main>

      <footer className="py-16 border-t border-slate-100 bg-white flex flex-col items-center">
        <div className="flex items-center gap-2 mb-4 opacity-20">
           <div className="w-8 h-[1px] bg-slate-900" />
           <Utensils size={14} />
           <div className="w-8 h-[1px] bg-slate-900" />
        </div>
        <p className="text-slate-400 font-black text-[9px] uppercase tracking-[0.4em]">
          © {new Date().getFullYear()} BiteCraft Restaurant Group
        </p>
      </footer>
    </div>
  );
}