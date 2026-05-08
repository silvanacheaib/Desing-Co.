'use client';
import React, { useState, useEffect } from 'react';
import { usePosStore } from '../store/usePosStore';
import { supabase } from '../lib/supabase';
import { Lock, Loader2, ShieldCheck } from 'lucide-react';

export const LoginScreen = () => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const { setCurrentStaff, currentStaff } = usePosStore();

  // If by some chance this component is rendered while a user exists, 
  // we show a quick redirecting state.
  if (currentStaff) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center z-[100]">
        <div className="animate-bounce bg-blue-500 p-4 rounded-full mb-4">
          <ShieldCheck className="text-white" size={32} />
        </div>
        <p className="text-white font-black uppercase tracking-widest text-xs">Redirecting to Dashboard...</p>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('pin_code', pin)
        .single();

      if (data) {
        // This triggers the localStorage save in our updated Store
        setCurrentStaff(data);
      } else {
        alert("Invalid PIN. Please try again.");
        setPin('');
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("System connection error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center z-[100] p-6">
      <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl w-full max-w-md text-center animate-in zoom-in duration-300">
        <div className="w-24 h-24 bg-slate-50 text-slate-900 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-slate-100 shadow-inner">
          <Lock size={40} strokeWidth={2.5} />
        </div>
        
        <h1 className="text-4xl font-black mb-2 tracking-tighter italic">BiteCraft <span className="text-blue-600">POS</span></h1>
        <p className="text-slate-400 font-bold mb-10 uppercase text-[10px] tracking-[0.2em]">Secure Staff Access</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <input 
              type="password" 
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} // Numbers only
              className="w-full text-center text-5xl tracking-[1.2rem] font-black p-8 bg-slate-50 rounded-[2rem] border-2 border-transparent focus:border-blue-500 focus:ring-0 transition-all placeholder:text-slate-200"
              placeholder="0000"
              autoFocus
              inputMode="numeric"
            />
          </div>

          <button 
            disabled={loading || pin.length < 4}
            className={`w-full p-6 rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3
              ${pin.length === 4 
                ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 hover:bg-black active:scale-95' 
                : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Enter System'}
          </button>
        </form>

        <p className="mt-8 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
          Authorized Personnel Only
        </p>
      </div>
    </div>
  );
};