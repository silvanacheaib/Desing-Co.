import React from 'react';
import { usePosStore } from '../store/usePosStore';
import { X, Trash2, Send, CheckCircle, Printer, CreditCard } from 'lucide-react';

export const OrderPanel = () => {
  const { 
    activeTableId, setActiveTable, products, cart, 
    addToCart, removeFromCart, sendToKitchen, 
    tables, checkoutTable, closeTable, exchangeRate 
  } = usePosStore();

  const currentTable = tables.find(t => t.id === activeTableId);
  if (!activeTableId || !currentTable) return null;

  const cartTotal = cart.reduce((acc, item) => acc + (item.priceUSD * item.quantity), 0);
  const existingTotal = currentTable.orders.reduce((acc, item) => acc + (item.priceUSD * item.quantity), 0);
  const grandTotal = cartTotal + existingTotal;

  // Checkout View
  if (currentTable.status === 'billing') {
    return (
      <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-slate-50 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right">
        <div className="p-6 bg-green-600 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold font-mono">RECEIPT: TABLE {currentTable.number}</h2>
          <button onClick={() => setActiveTable(null)}><X /></button>
        </div>
        
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="bg-white p-8 shadow-sm rounded-none border-t-4 border-black font-mono">
            <div className="text-center mb-6">
              <h3 className="text-xl font-black">OMEGA CLONE RESTO</h3>
              <p className="text-xs">Beirut, Lebanon</p>
              <div className="border-b border-dashed border-slate-300 my-4" />
            </div>

            {currentTable.orders.map((item, i) => (
              <div key={i} className="flex justify-between text-sm mb-2">
                <span>{item.quantity} x {item.name}</span>
                <span>${(item.priceUSD * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            <div className="border-b border-dashed border-slate-300 my-4" />
            
            <div className="flex justify-between font-black text-lg">
              <span>TOTAL USD</span>
              <span>${existingTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-black text-lg text-green-700">
              <span>TOTAL LBP</span>
              <span>{(existingTotal * exchangeRate).toLocaleString()} L.L.</span>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 bg-white border-2 border-slate-200 py-4 rounded-xl font-bold hover:bg-slate-100">
            <Printer size={20} /> PRINT
          </button>
          <button 
            onClick={() => closeTable(currentTable.id)}
            className="flex items-center justify-center gap-2 bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700"
          >
            <CreditCard size={20} /> PAID
          </button>
        </div>
      </div>
    );
  }

  // Regular Ordering View
  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right">
      <div className="p-6 bg-slate-900 text-white flex justify-between items-center shrink-0">
        <h2 className="text-xl font-bold">Table {currentTable.number}</h2>
        <button onClick={() => setActiveTable(null)}><X /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Sent Orders List */}
        {currentTable.orders.length > 0 && (
          <div className="mb-6 bg-blue-50 p-4 rounded-2xl">
            <p className="text-[10px] font-black text-blue-400 uppercase mb-3">Kitchen Orders</p>
            {currentTable.orders.map((item, i) => (
              <div key={i} className="flex justify-between text-sm py-1 font-medium text-slate-600">
                <span>{item.quantity}x {item.name}</span>
                <span>${(item.priceUSD * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}

        <h3 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Menu</h3>
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="p-4 border border-slate-100 rounded-2xl hover:border-blue-500 text-left transition-all active:scale-95"
            >
              <div className="font-bold text-slate-800">{product.name}</div>
              <div className="text-blue-600 font-bold">${product.priceUSD.toFixed(2)}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 bg-slate-50 border-t">
        {cart.length > 0 && (
          <div className="mb-4 space-y-2">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-orange-100">
                <span className="text-sm font-bold">{item.quantity}x {item.name}</span>
                <button onClick={() => removeFromCart(item.id)} className="text-red-400"><Trash2 size={16}/></button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-end mb-6">
          <span className="font-bold text-slate-400">Grand Total</span>
          <div className="text-right">
            <div className="text-3xl font-black text-slate-900">${grandTotal.toFixed(2)}</div>
            <div className="text-xs text-slate-400 font-bold">{(grandTotal * exchangeRate).toLocaleString()} L.L.</div>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={sendToKitchen}
            disabled={cart.length === 0}
            className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
          >
            <Send size={18} /> FIRE
          </button>
          
          {currentTable.orders.length > 0 && (
            <button 
              onClick={() => checkoutTable(currentTable.id)}
              className="px-6 bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center"
            >
              <Printer size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};