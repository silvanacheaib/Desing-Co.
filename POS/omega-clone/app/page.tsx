'use client';

import { Sidebar } from '../components/Sidebar';
import { OrderPanel } from '../components/OrderPanel';
import { AdminPanel } from '../components/AdminPanel';
import { usePosStore } from '../store/usePosStore';

export default function Home() {
  const { tables, setActiveTable, activeTableId, currentView, exchangeRate } = usePosStore();

  return (
    <main className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      <Sidebar />

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div>
            <h1 className="text-2xl font-black">
              {currentView === 'floor' && 'Floor Map'}
              {currentView === 'admin' && 'Menu Management'}
              {currentView === 'kitchen' && 'Kitchen Orders'}
              {currentView === 'settings' && 'System Settings'}
            </h1>
          </div>
          <div className="bg-slate-100 px-4 py-2 rounded-full text-xs font-black text-slate-500">
            RATE: {exchangeRate.toLocaleString()} L.L.
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {currentView === 'floor' && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {tables.map((table) => (
                <button
                  key={table.id}
                  onClick={() => setActiveTable(table.id)}
                  className={`h-40 rounded-[2.5rem] border-2 flex flex-col items-center justify-center transition-all shadow-sm relative
                    ${activeTableId === table.id ? 'ring-4 ring-blue-500 ring-offset-4' : ''}
                    ${table.status === 'occupied' ? 'bg-orange-50 border-orange-200 text-orange-600' : 
                      table.status === 'billing' ? 'bg-green-50 border-green-200 text-green-600' : 
                      'bg-white border-slate-100 text-slate-300 hover:border-blue-200 hover:text-blue-500'}`}
                >
                  <span className="text-4xl font-black">{table.number}</span>
                  <div className={`absolute top-5 right-5 w-3 h-3 rounded-full ${
                    table.status === 'available' ? 'bg-slate-200' : 
                    table.status === 'occupied' ? 'bg-orange-400' : 'bg-green-400'
                  }`} />
                </button>
              ))}
            </div>
          )}

          {currentView === 'admin' && <AdminPanel />}
          
          {currentView === 'kitchen' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {tables.filter(t => t.orders.length > 0).map(t => (
                 <div key={t.id} className="bg-white p-6 rounded-[2rem] border-t-8 border-orange-500 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-black text-xl text-orange-600">TABLE {t.number}</h3>
                      <span className="text-xs font-bold text-slate-400">Order #882</span>
                    </div>
                    {t.orders.map((o, i) => (
                      <div key={i} className="flex justify-between py-2 border-b border-slate-50 font-bold">
                        <span>{o.quantity}x {o.name}</span>
                      </div>
                    ))}
                    <button className="w-full mt-6 bg-slate-900 text-white py-3 rounded-xl font-bold">COMPLETE</button>
                 </div>
               ))}
            </div>
          )}
        </div>

        <OrderPanel />
      </div>
    </main>
  );
}