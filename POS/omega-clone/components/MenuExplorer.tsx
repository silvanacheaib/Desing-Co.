'use client';
import React, { useState, useMemo } from 'react';
import { usePosStore } from '../store/usePosStore';
import { 
  Search, UtensilsCrossed, PlusCircle, Info, Image as ImageIcon 
} from 'lucide-react';

export const MenuExplorer = ({ isPublic = false }: { isPublic?: boolean }) => {
  const { products, addToCart, currentStaff } = usePosStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Food', 'Drinks', 'Dessert'];

  const filteredItems = useMemo(() => {
    return products.filter(item => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, searchQuery, activeCategory]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      {/* (Search & Header Logic stays the same) */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            className="group bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
          >
            {/* --- UPDATED: Fallback Image Section --- */}
            <div className="relative h-56 overflow-hidden bg-slate-100">
              {item.image_url ? (
                <img 
                  src={item.image_url} 
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    // Fallback for broken links
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
                  }}
                />
              ) : (
                // Styled Placeholder for missing data
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                  <ImageIcon size={40} strokeWidth={1.5} />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50">No Image Available</span>
                </div>
              )}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl font-black text-sm text-slate-900 shadow-lg">
                ${(item.priceUSD || 0).toFixed(2)}
              </div>
            </div>
            {/* (Rest of content stays the same) */}
          </div>
        ))}
      </div>
    </div>
  );
};