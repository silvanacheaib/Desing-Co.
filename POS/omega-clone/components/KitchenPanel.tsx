'use client';
import React from 'react';
import { usePosStore } from '../store/usePosStore';
import { Clock, CheckCircle2, Utensils, Zap } from 'lucide-react';

export const KitchenPanel = () => {
  const { kitchenOrders } = usePosStore();

  if (kitchenOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-300">
        <div className="p-8 bg-slate-100 rounded-[3rem] mb-6">
          <Utensils size={64} className="opacity-20" />
        </div>
        <p className="font-black uppercase text-xs tracking-[0.2em]">No Active Orders</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {kitchenOrders.map((order) => (
        <div 
          key={order.id} 
          className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-xl transition-all"
        >
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="bg-slate-900 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl italic">
                {order.table_number}
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest leading-none">
                  {order.waiter_name}
                </span>
                <span className="text-[9px] font-bold text-slate-400 mt-1 flex items-center gap-1">
                  <Clock size={10} /> {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="font-black text-lg tracking-tight text-slate-800 leading-tight">
                {order.quantity}x {order.product_name}
              </h3>
            </div>
          </div>

          <button className="mt-6 w-full py-4 bg-slate-50 group-hover:bg-emerald-500 group-hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2">
            <CheckCircle2 size={14} /> Mark Prepared
          </button>
        </div>
      ))}
    </div>
  );
};