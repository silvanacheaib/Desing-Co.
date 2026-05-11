'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle2, Clock, Utensils, Hash } from 'lucide-react';

interface GroupedTicket {
  table_number: number;
  waiter_name: string;
  time: string;
  items: Array<{ name: string; qty: number }>;
  ids: string[];
}

export const KitchenFeed = () => {
  const [groupedOrders, setGroupedOrders] = useState<GroupedTicket[]>([]);

  const fetchKitchenOrders = async () => {
    const { data, error } = await supabase
      .from('kitchen_orders')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (!error && data) {
      // Grouping Logic: Bundles items by Table and Time
      const groups = data.reduce((acc: Record<string, GroupedTicket>, order: any) => {
        const timeKey = new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const groupKey = `${order.table_number}-${timeKey}`;
        
        if (!acc[groupKey]) {
          acc[groupKey] = {
            table_number: order.table_number,
            waiter_name: order.waiter_name,
            time: timeKey,
            items: [],
            ids: []
          };
        }
        acc[groupKey].items.push({ name: order.product_name, qty: order.quantity });
        acc[groupKey].ids.push(order.id);
        return acc;
      }, {});

      setGroupedOrders(Object.values(groups));
    }
  };

  useEffect(() => {
    fetchKitchenOrders();

    const channel = supabase
      .channel('kitchen-group-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'kitchen_orders' }, () => {
        fetchKitchenOrders();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const completeTicket = async (ids: string[]) => {
    const { error } = await supabase
      .from('kitchen_orders')
      .update({ status: 'served' })
      .in('id', ids);
    
    if (!error) fetchKitchenOrders();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {groupedOrders.map((ticket, index) => (
        <div key={index} className="bg-white border-2 border-slate-100 rounded-[3rem] overflow-hidden shadow-sm hover:shadow-xl transition-all group">
          <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black italic">
                {ticket.table_number}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 leading-none">Table</p>
                <p className="text-xs font-bold opacity-60 mt-1">{ticket.waiter_name}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black flex items-center gap-1 opacity-60 uppercase tracking-widest">
                <Clock size={12} /> {ticket.time}
              </span>
            </div>
          </div>

          <div className="p-8 space-y-4">
            {ticket.items.map((item, i) => (
              <div key={i} className="flex justify-between items-center border-b border-slate-50 pb-3 last:border-0">
                <p className="font-black text-lg text-slate-800 tracking-tight">{item.name}</p>
                <div className="bg-slate-100 px-3 py-1 rounded-lg font-black text-sm text-slate-500">
                  x{item.qty}
                </div>
              </div>
            ))}
          </div>

          <div className="px-8 pb-8">
            <button 
              onClick={() => completeTicket(ticket.ids)}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
            >
              <CheckCircle2 size={18} /> Complete Order
            </button>
          </div>
        </div>
      ))}

      {groupedOrders.length === 0 && (
        <div className="col-span-full py-32 flex flex-col items-center justify-center text-slate-300">
          <div className="bg-white p-10 rounded-[3rem] mb-6 shadow-sm">
            <Utensils size={48} className="opacity-20" />
          </div>
          <p className="font-black uppercase text-xs tracking-[0.3em]">Kitchen is clear!</p>
        </div>
      )}
    </div>
  );
};