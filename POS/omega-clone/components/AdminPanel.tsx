'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
    PackagePlus,
    Users,
    TrendingUp,
    Plus,
    Trash2,
    Loader2,
    ClipboardCheck,
    Check,
    X,
    CalendarDays,
    Clock,
    TrendingUp as RevenueIcon, // Added for stats
    ShoppingBag,
    Calendar,
    Image as ImageIcon
} from 'lucide-react';
import { usePosStore } from '../store/usePosStore';

export const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState<'menu' | 'staff' | 'stats'>('menu');
    const [loading, setLoading] = useState(false);
    const { 
        fetchProducts, 
        products, 
        staff, 
        fetchStaff, 
        stats, 
        fetchAdminStats 
    } = usePosStore();

    // Form States
    const [productForm, setProductForm] = useState({
        name: '', price_usd: '', category: 'Food', desc: '', img: ''
    });

    const [taskForm, setTaskForm] = useState({
        staff_id: '',
        title: '',
        priority: 'medium',
        date: new Date().toISOString().split('T')[0]
    });

    const [leaveRequests, setLeaveRequests] = useState<any[]>([]);

    useEffect(() => {
        fetchProducts();
        fetchStaff();
        fetchLeaveRequests();
        if (activeTab === 'stats') {
            fetchAdminStats();
        }
    }, [activeTab]);

    const fetchLeaveRequests = async () => {
        const { data } = await supabase
            .from('leave_requests')
            .select('*, staff(full_name)')
            .eq('status', 'pending')
            .order('created_at', { ascending: false });
        if (data) setLeaveRequests(data);
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.from('products').insert([{
                name: productForm.name,
                description: productForm.desc,
                price_usd: parseFloat(productForm.price_usd),
                category: productForm.category,
                image_url: productForm.img || null
            }]);
            if (error) throw error;
            alert("Item added successfully!");
            setProductForm({ name: '', price_usd: '', category: 'Food', desc: '', img: '' });
            fetchProducts();
        } catch (err: any) { alert(err.message); } finally { setLoading(false); }
    };

    const handleAssignTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!taskForm.staff_id || !taskForm.title) {
            alert("Please select a staff member and enter a task title.");
            return;
        }
        setLoading(true);
        try {
            const { error } = await supabase.from('daily_tasks').insert([
                {
                    staff_id: taskForm.staff_id,
                    task_title: taskForm.title,
                    priority: taskForm.priority,
                    task_date: taskForm.date,
                    is_new: true,
                    is_completed: false
                }
            ]);
            if (error) throw error;
            alert("Task assigned successfully!");
            setTaskForm({ ...taskForm, title: '' });
        } catch (err: any) { alert(err.message); } finally { setLoading(false); }
    };

    const manageLeave = async (id: string, status: 'approved' | 'rejected') => {
        const note = prompt(`Reason for ${status}? (Optional)`);
        const { error } = await supabase
            .from('leave_requests')
            .update({ status, admin_note: note })
            .eq('id', id);
        if (!error) {
            setLeaveRequests(leaveRequests.filter(r => r.id !== id));
            alert(`Request ${status}`);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">

            {/* Tab Navigation */}
            <div className="flex gap-4 mb-8 bg-white p-2 rounded-[2rem] shadow-sm w-fit border border-slate-100">
                {[
                    { id: 'menu', icon: <PackagePlus size={18} />, label: 'Menu' },
                    { id: 'staff', icon: <Users size={18} />, label: 'Staff & Ops' },
                    { id: 'stats', icon: <TrendingUp size={18} />, label: 'Stats' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all
              ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* MENU TAB */}
            {activeTab === 'menu' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 h-fit">
                        <h3 className="text-xl font-black mb-6">New Product</h3>
                        <form onSubmit={handleAddProduct} className="space-y-4">
                            <input placeholder="Product Name" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold" required />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" step="0.01" placeholder="Price ($)" value={productForm.price_usd} onChange={e => setProductForm({ ...productForm, price_usd: e.target.value })} className="p-4 bg-slate-50 rounded-2xl border-none font-bold" required />
                                <select value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} className="p-4 bg-slate-50 rounded-2xl border-none font-bold">
                                    <option>Food</option><option>Drinks</option><option>Dessert</option>
                                </select>
                            </div>
                            <input placeholder="Image URL" value={productForm.img} onChange={e => setProductForm({ ...productForm, img: e.target.value })} className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-xs" />
                            <textarea placeholder="Description" value={productForm.desc} onChange={e => setProductForm({ ...productForm, desc: e.target.value })} className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold h-24 resize-none" />
                            <button disabled={loading} className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                                {loading ? <Loader2 className="animate-spin" /> : <><Plus size={18} /> PUBLISH</>}
                            </button>
                        </form>
                    </div>

                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-xl font-black px-4">Menu Inventory</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {products.map((p) => (
                                <div key={p.id} className="bg-white p-4 rounded-[2rem] flex items-center gap-4 border border-slate-100 group shadow-sm">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center">
                                        {p.image_url ? <img src={p.image_url} className="w-full h-full object-cover" alt={p.name} /> : <ImageIcon className="text-slate-200" size={24} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-sm truncate">{p.name}</p>
                                        <p className="text-blue-600 font-black text-xs uppercase tracking-tighter">${p.priceUSD}</p>
                                    </div>
                                    <button className="p-3 text-slate-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* STAFF TAB */}
            {activeTab === 'staff' && (
                <div className="space-y-10">
                    <div className="bg-white p-8 rounded-[3rem] border border-slate-100">
                        <h3 className="text-xl font-black mb-6 flex items-center gap-3"><CalendarDays className="text-orange-500" /> Pending Leave Requests</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {leaveRequests.length > 0 ? leaveRequests.map(req => (
                                <div key={req.id} className="bg-slate-50 p-6 rounded-3xl flex justify-between items-center border border-slate-100">
                                    <div>
                                        <p className="font-black text-sm">{req.staff?.full_name}</p>
                                        <p className="text-[10px] font-black text-blue-600 uppercase mb-2">{req.leave_type}</p>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400"><Clock size={12} /> {req.start_date} to {req.end_date}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => manageLeave(req.id, 'approved')} className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 shadow-lg"><Check size={18} /></button>
                                        <button onClick={() => manageLeave(req.id, 'rejected')} className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 shadow-lg"><X size={18} /></button>
                                    </div>
                                </div>
                            )) : <p className="text-slate-400 font-bold italic text-sm px-2">No pending requests.</p>}
                        </div>
                    </div>

                    <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white">
                        <h3 className="text-xl font-black mb-6 flex items-center gap-3"><ClipboardCheck className="text-blue-400" /> Assign Duty</h3>
                        <form onSubmit={handleAssignTask} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <select value={taskForm.staff_id} onChange={e => setTaskForm({ ...taskForm, staff_id: e.target.value })} className="p-5 bg-white/10 rounded-2xl border-none font-bold text-white"><option value="" className="text-black">Staff...</option>{staff.map(s => <option key={s.id} value={s.id} className="text-black">{s.full_name}</option>)}</select>
                            <input placeholder="Task..." value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} className="p-5 bg-white/10 rounded-2xl border-none font-bold text-white" />
                            <select value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })} className="p-5 bg-white/10 rounded-2xl border-none font-bold text-white"><option value="low" className="text-black">Low</option><option value="medium" className="text-black">Medium</option><option value="high" className="text-black">High</option></select>
                            <button className="bg-blue-600 p-5 rounded-2xl font-black hover:bg-blue-500 transition-all shadow-lg">ASSIGN</button>
                        </form>
                    </div>

                    <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50"><tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest"><th className="px-10 py-5">Employee</th><th className="px-10 py-5">Role</th><th className="px-10 py-5">Salary (USD)</th></tr></thead>
                            <tbody className="divide-y divide-slate-50">{staff.map((s) => (<tr key={s.id} className="hover:bg-slate-50 transition-colors"><td className="px-10 py-6 font-black text-sm">{s.full_name}</td><td className="px-10 py-6 uppercase text-[10px] font-bold text-blue-500">{s.role}</td><td className="px-10 py-6 font-bold text-slate-600">${s.base_salary_usd}</td></tr>))}</tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* STATS TAB (NEWLY ADDED) */}
            {activeTab === 'stats' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'Daily Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: <RevenueIcon className="text-emerald-500" /> },
                            { label: 'Total Visits', value: stats.totalVisits, icon: <Users className="text-blue-500" /> },
                            { label: 'Items Sold', value: stats.itemsSold, icon: <ShoppingBag className="text-orange-500" /> },
                            { label: 'Reservations', value: stats.reservationsCount, icon: <Calendar className="text-purple-500" /> }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:shadow-md transition-all">
                                <div className="p-3 bg-slate-50 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">{stat.icon}</div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                <h3 className="text-4xl font-black italic tracking-tighter text-slate-900">{stat.value}</h3>
                            </div>
                        ))}
                    </div>

                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] h-64 flex flex-col items-center justify-center">
                        <TrendingUp className="text-slate-200 mb-4" size={48} />
                        <p className="text-slate-400 font-bold italic uppercase tracking-widest text-xs">Analytics Charting Placeholder</p>
                    </div>
                </div>
            )}
        </div>
    );
};