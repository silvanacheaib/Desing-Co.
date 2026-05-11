'use client';
import React, { useState } from 'react';
import { usePosStore } from '../store/usePosStore';
import { ShoppingBag, Send, X, Plus, Minus, Search, Loader2, CheckCircle2, Receipt } from 'lucide-react';

export const OrderPanel = () => {
    const { 
        activeTableId, 
        setActiveTable, 
        products, 
        cart, 
        addToCart, 
        removeFromCart, 
        sendToKitchen, 
        closeTable, // Ensure this is imported from your store
        exchangeRate,
        tables
    } = usePosStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!activeTableId) return null;

    const currentTable = tables.find(t => t.id === activeTableId);
    const tableDisplay = currentTable?.number || activeTableId;
    // A table is checkout-ready if it's currently occupied
    const isOccupied = currentTable?.status.toUpperCase() === 'OCCUPIED';

    const totalUSD = cart.reduce((sum, item) => {
        return sum + (item.priceUSD * item.quantity); // Matches your store property
    }, 0);

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSendToKitchen = async () => {
        setIsSending(true);
        try {
            await sendToKitchen();
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                setIsSending(false);
                setActiveTable(null);
            }, 1500);
        } catch (error) {
            setIsSending(false);
        }
    };

    // NEW: Handle the Checkout/Close logic
    const handleCloseTable = async () => {
        if (!window.confirm(`Close Table ${tableDisplay} and clear the bill?`)) return;
        
        setIsClosing(true);
        try {
            await closeTable(activeTableId);
            setActiveTable(null);
        } catch (error) {
            console.error("Failed to close table");
        } finally {
            setIsClosing(false);
        }
    };

    return (
        <div className="orderPanel flex flex-col animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
            {/* Header */}
            <header className="h-24 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-[1.8rem] flex flex-col items-center justify-center text-white shadow-lg">
                        <span className="text-[10px] font-black uppercase leading-none opacity-70">Table</span>
                        <span className="text-3xl font-black italic leading-none">{tableDisplay}</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter italic">Create Order</h2>
                    </div>
                </div>
                <button onClick={() => setActiveTable(null)} className="p-4 hover:bg-slate-100 rounded-full transition-colors">
                    <X size={24} className="text-slate-400" />
                </button>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Side: Menu Grid */}
                <main className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {filteredProducts.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => addToCart(item)}
                                className="bg-white p-4 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-500 group flex flex-col items-center"
                            >
                                <div className="w-full aspect-square overflow-hidden rounded-[2rem] mb-4 bg-slate-100">
                                    <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <h4 className="font-black text-sm text-slate-800">{item.name}</h4>
                                <p className="text-blue-600 font-black text-sm">${item.priceUSD.toFixed(2)}</p>
                            </button>
                        ))}
                    </div>
                </main>

                {/* Right Side: Bill Summary */}
                <aside className="orderPanel w-[450px] bg-white border-l border-slate-200 flex flex-col">
                    <div className="p-8 flex-1 overflow-y-auto">
                        <h3 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-8">Current Bill</h3>
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-[2rem]">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-sm text-slate-800 truncate">{item.name}</p>
                                        <p className="text-blue-600 font-bold text-xs">${(item.priceUSD * item.quantity).toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl shadow-sm border border-slate-100">
                                        <button onClick={() => removeFromCart(item.id)} className="text-slate-400"><Minus size={14} /></button>
                                        <span className="font-black text-xs">{item.quantity}</span>
                                        <button onClick={() => addToCart(item)} className="text-slate-400"><Plus size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FOOTER: THE CHECKOUT SECTION */}
                    <div className="p-10 bg-slate-950 text-white rounded-t-[4rem] shadow-2xl">
                        <div className="flex justify-between items-end mb-8 px-2">
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Amount</p>
                                <h3 className="text-5xl font-black italic tracking-tighter">${totalUSD.toFixed(2)}</h3>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">LBP</p>
                                <p className="text-2xl font-black text-slate-300">{(totalUSD * exchangeRate).toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={handleSendToKitchen}
                                disabled={cart.length === 0 || isSending || isClosing}
                                className="bg-blue-600 hover:bg-blue-700 py-6 rounded-[2rem] font-black flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest transition-all disabled:opacity-30"
                            >
                                {isSending ? <Loader2 className="animate-spin" size={18} /> : isSuccess ? <CheckCircle2 size={18} /> : <Send size={18} />}
                                {isSending ? 'Sending...' : 'Send Items'}
                            </button>

                            <button
                                onClick={handleCloseTable}
                                disabled={!isOccupied || isClosing || isSending}
                                className="bg-emerald-600 hover:bg-emerald-700 py-6 rounded-[2rem] font-black flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest transition-all disabled:opacity-30"
                            >
                                {isClosing ? <Loader2 className="animate-spin" size={18} /> : <Receipt size={18} />}
                                Checkout
                            </button>
                        </div>
                        
                        {!isOccupied && cart.length > 0 && (
                            <p className="text-center text-[9px] font-black text-blue-400 uppercase mt-4 tracking-widest animate-pulse">
                                Table status will change to occupied after sending
                            </p>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
};