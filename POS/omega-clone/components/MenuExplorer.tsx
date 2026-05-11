'use client';
import React, { useState, useMemo } from 'react';
import { usePosStore } from '../store/usePosStore';
import { 
  Search, UtensilsCrossed, Star, ArrowUpDown, Filter, Image as ImageIcon 
} from 'lucide-react';

export const MenuExplorer = () => {
  const { products, addToCart } = usePosStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name');

  const categories = ['All', 'Food', 'Drinks', 'Dessert', 'Appetizers'];

  const filteredAndSortedItems = useMemo(() => {
    let result = products.filter(item => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    return result.sort((a, b) => {
      if (sortBy === 'price') return a.priceUSD - b.priceUSD;
      if (sortBy === 'rating') return (b as any).rating - (a as any).rating;
      return a.name.localeCompare(b.name);
    });
  }, [products, searchQuery, activeCategory, sortBy]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 pb-32">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search 100+ items..."
            className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                ${activeCategory === cat ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl">
          <ArrowUpDown size={16} className="text-slate-400" />
          <select 
            className="bg-transparent border-none text-xs font-black uppercase tracking-widest focus:ring-0 cursor-pointer"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="rating">Sort by Rating</option>
          </select>
        </div>
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredAndSortedItems.map((item: any) => (
          <div key={item.id} className="group bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col">
            <div className="relative h-48 overflow-hidden bg-slate-100">
              <img 
                src={item.image_url || 'https://via.placeholder.com/400x300?text=No+Image'} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                alt={item.name}
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Star size={12} className="text-orange-500 fill-orange-500" />
                <span className="text-[10px] font-black">{item.rating || '4.5'}</span>
              </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-black text-lg text-slate-800 leading-tight">{item.name}</h3>
                <span className="font-black text-blue-600">${item.priceUSD.toFixed(2)}</span>
              </div>
              <p className="text-slate-400 text-xs font-medium line-clamp-2 mb-6">
                {item.description}
              </p>
              
              <button 
                onClick={() => addToCart(item)}
                className="mt-auto w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-colors"
              >
                Add to Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};