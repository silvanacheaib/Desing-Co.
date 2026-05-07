import React, { useState } from 'react';
import { usePosStore } from '../store/usePosStore';
import { PackagePlus, ImageIcon } from 'lucide-react';

export const AdminPanel = () => {
  const addProduct = usePosStore((state) => state.addProduct);
  const [form, setForm] = useState({ name: '', price: '', category: 'Food', desc: '', img: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      id: Math.random().toString(),
      name: form.name,
      description: form.desc,
      image_url: form.img || 'https://via.placeholder.com/150',
      priceUSD: Number(form.price),
      category: form.category,
      is_available: true
    });
    setForm({ name: '', price: '', category: 'Food', desc: '', img: '' });
    alert("Item added to Menu!");
  };

  return (
    <div className="max-w-2xl bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl"><PackagePlus /></div>
        <h2 className="text-2xl font-black">Menu Manager</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block text-xs font-black text-slate-400 uppercase mb-2">Item Name</label>
          <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Double Patty Burger" />
        </div>

        <div>
          <label className="block text-xs font-black text-slate-400 uppercase mb-2">Price ($)</label>
          <input required type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none" placeholder="12.00" />
        </div>

        <div>
          <label className="block text-xs font-black text-slate-400 uppercase mb-2">Category</label>
          <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none">
            <option>Food</option>
            <option>Drinks</option>
            <option>Dessert</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-black text-slate-400 uppercase mb-2">Description</label>
          <textarea value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none" rows={3} placeholder="Ingredients, calories, etc." />
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-black text-slate-400 uppercase mb-2">Image URL</label>
          <div className="relative">
            <input value={form.img} onChange={e => setForm({...form, img: e.target.value})} className="w-full p-4 pl-12 bg-slate-50 rounded-2xl border-none" placeholder="https://..." />
            <ImageIcon className="absolute left-4 top-4 text-slate-300" size={20} />
          </div>
        </div>

        <button className="col-span-2 bg-blue-600 text-white p-5 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
          SAVE TO MENU
        </button>
      </form>
    </div>
  );
};