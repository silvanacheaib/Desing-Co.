'use client';
import React, { useEffect } from 'react';
import { usePosStore } from '../store/usePosStore';
import { TrendingUp, Users, Package, Calendar } from 'lucide-react';

export const StatsView = () => {
    const { stats, fetchAdminStats } = usePosStore();

    useEffect(() => {
        fetchAdminStats();
    }, [fetchAdminStats]);

    const dashboardCards = [
        { 
            label: 'Daily Revenue', 
            value: `$${stats.totalRevenue.toLocaleString()}`, 
            icon: <TrendingUp className="text-emerald-500" />,
            description: 'Total sales today' 
        },
        { 
            label: 'Client Visits', 
            value: stats.totalVisits, 
            icon: <Users className="text-blue-500" />,
            description: 'Total tables closed' 
        },
        { 
            label: 'Items Sold', 
            value: stats.itemsSold, 
            icon: <Package className="text-orange-500" />,
            description: 'Total products delivered' 
        },
        { 
            label: 'Reservations', 
            value: stats.reservationsCount, 
            icon: <Calendar className="text-purple-500" />,
            description: 'Completed bookings' 
        },
    ];

    return (
        <div className="p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {dashboardCards.map((card, index) => (
                    <div 
                        key={index} 
                        className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform">
                                {card.icon}
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                {card.label}
                            </p>
                            <h3 className="text-4xl font-black italic tracking-tighter text-slate-900">
                                {card.value}
                            </h3>
                            <p className="text-[10px] text-slate-400 mt-2 font-medium">
                                {card.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Placeholder for future Chart logic */}
            <div className="mt-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] h-64 flex items-center justify-center">
                <p className="text-slate-400 font-bold italic uppercase tracking-widest text-xs">
                    Hourly Sales Chart Coming Soon
                </p>
            </div>
        </div>
    );
};