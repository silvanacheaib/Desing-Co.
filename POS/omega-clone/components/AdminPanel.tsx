'use client';
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import {
    PackagePlus, Users, TrendingUp, Plus, Trash2, Loader2,
    ClipboardCheck, Check, X, CalendarDays,
    ShoppingBag, Calendar, Image as ImageIcon, Pencil,
    Upload
} from 'lucide-react';
import { usePosStore, Product } from '../store/usePosStore';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'menu' | 'staff' | 'stats';

interface ProductForm {
    name: string;
    priceUSD: string;
    category: string;
    desc: string;
    image_url: string;
    image_file?: File | null;
}

interface TaskForm {
    staff_id: string;
    title: string;
    priority: string;
    date: string;
}

const EMPTY_PRODUCT_FORM: ProductForm = {
    name: '', priceUSD: '', category: 'Food', desc: '', image_url: '', image_file: null
};

// ─── Sub-component: ProductCard ───────────────────────────────────────────────

interface ProductCardProps {
    product: Product;
    isEditing: boolean;
    onEdit: (p: Product) => void;
    onDelete: (p: Product) => void;
}

const ProductCard = ({ product: p, isEditing, onEdit, onDelete }: ProductCardProps) => (
    <div className={`ap-product-card ${isEditing ? 'ap-product-card-active' : ''}`}>
        <div className="ap-product-thumb">
            {p.image_url
                ? <img src={p.image_url} alt={p.name} />
                : <ImageIcon size={24} color="#e2e8f0" />
            }
        </div>
        <div className="ap-product-info">
            <p className="ap-product-name">{p.name}</p>
            <p className="ap-product-price">${p.priceUSD}</p>
            <p className="ap-product-cat">{p.category}</p>
        </div>
        <div className="ap-product-actions">
            <button className="btn-icon btn-icon-edit" onClick={() => onEdit(p)} title="Edit">
                <Pencil size={16} />
            </button>
            <button className="btn-icon btn-icon-delete" onClick={() => onDelete(p)} title="Delete">
                <Trash2 size={16} />
            </button>
        </div>
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export const AdminPanel = () => {
    // --- UI State ---
    const [activeTab, setActiveTab] = useState<Tab>('menu');
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Product/Task Form State ---
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [productForm, setProductForm] = useState<ProductForm>(EMPTY_PRODUCT_FORM);
    const [taskForm, setTaskForm] = useState<TaskForm>({
        staff_id: '', title: '', priority: 'medium',
        date: new Date().toISOString().split('T')[0],
    });

    // --- Staff Leave State ---
    const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
    const [rejectionId, setRejectionId] = useState<string | null>(null); // MOVED INSIDE
    const [adminNote, setAdminNote] = useState('');                      // MOVED INSIDE

    const {
        fetchProducts, products, staff, fetchStaff,
        stats, fetchAdminStats, addProduct, updateProduct, deleteProduct,
        uploadProductImage
    } = usePosStore();

    useEffect(() => {
        fetchProducts();
        fetchStaff();
        fetchLeaveRequests();
        if (activeTab === 'stats') fetchAdminStats();
    }, [activeTab, activeTab === 'stats']);

    // ─── Data Fetching ─────────────────────────────────────────────────────────

    const fetchLeaveRequests = async () => {
        const { data } = await supabase
            .from('leave_requests')
            .select('*, staff(full_name)')
            .eq('status', 'pending')
            .order('created_at', { ascending: false });
        if (data) setLeaveRequests(data);
    };

    // ─── Image Selection ──────────────────────────────────────────────────

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
        setProductForm(prev => ({ ...prev, image_file: file }));
    };

    // ─── Product Handlers ──────────────────────────────────────────────────────

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setProductForm({
            name: product.name,
            priceUSD: String(product.priceUSD),
            category: product.category,
            image_url: product.image_url || '',
            desc: product.description || '',
            image_file: null
        });
        setImagePreview(product.image_url || null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
        setProductForm(EMPTY_PRODUCT_FORM);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleProductSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let finalUrl = productForm.image_url;

            if (productForm.image_file) {
                setUploadingImage(true);
                const uploadedUrl = await uploadProductImage(productForm.image_file);
                if (uploadedUrl) finalUrl = uploadedUrl;
                setUploadingImage(false);
            }

            const payload = {
                name: productForm.name,
                priceUSD: parseFloat(productForm.priceUSD),
                category: productForm.category,
                image_url: finalUrl,
                description: productForm.desc,
            };

            if (editingProduct) {
                await updateProduct(editingProduct.id, payload);
                setEditingProduct(null);
            } else {
                await addProduct(payload);
            }

            setProductForm(EMPTY_PRODUCT_FORM);
            setImagePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            alert('Product saved successfully!');

        } catch (err: any) {
            alert(`Error: ${err.message}`);
        } finally {
            setLoading(false);
            setUploadingImage(false);
        }
    };

    const handleDelete = async (product: Product) => {
        if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
        await deleteProduct(product.id);
    };

    // ─── Staff / Task Handlers ─────────────────────────────────────────────────

    const handleAssignTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!taskForm.staff_id || !taskForm.title) {
            alert('Please select a staff member and enter a task title.');
            return;
        }
        setLoading(true);
        try {
            const { error } = await supabase.from('daily_tasks').insert([{
                staff_id: taskForm.staff_id,
                task_title: taskForm.title,
                priority: taskForm.priority,
                task_date: taskForm.date,
                is_new: true,
                is_completed: false,
            }]);
            if (error) throw error;
            alert('Task assigned successfully!');
            setTaskForm(f => ({ ...f, title: '' }));
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleManageLeave = async (id: string, status: 'approved' | 'rejected', note?: string) => {
        if (status === 'rejected' && note === undefined) {
            setRejectionId(id);
            return;
        }

        setLoading(true);
        try {
            const request = leaveRequests.find(r => r.id === id);
            if (!request) return;

            // 1. Update the leave request status
            const { error: updateError } = await supabase
                .from('leave_requests')
                .update({
                    status,
                    admin_note: note || (status === 'approved' ? 'Approved by Admin' : '')
                })
                .eq('id', id);

            if (updateError) throw updateError;

            // 2. INSERT notification for the specific staff member
            const statusEmoji = status === 'approved' ? '✅' : '❌';
            await supabase.from('notifications').insert([{
                staff_id: request.staff_id, // Target the specific user
                message: `${statusEmoji} Your ${request.leave_type} request was ${status}.`,
                type: 'leave_request'
            }]);

            // 3. Update Admin UI
            setLeaveRequests(prev => prev.filter(r => r.id !== id));
            setRejectionId(null);
            setAdminNote('');
            
        } catch (err: any) {
            alert(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // ─── Static Data ───────────────────────────────────────────────────────────

    const TABS = [
        { id: 'menu', icon: <PackagePlus size={16} />, label: 'Menu Management' },
        { id: 'staff', icon: <Users size={16} />, label: 'Staff & Tasks' },
        { id: 'stats', icon: <TrendingUp size={16} />, label: 'Analytics' },
    ];

    const STATS = [
        { label: 'Daily Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: <TrendingUp color="#10b981" size={20} /> },
        { label: 'Total Visits', value: stats.totalVisits, icon: <Users color="#3b82f6" size={20} /> },
        { label: 'Items Sold', value: stats.itemsSold, icon: <ShoppingBag color="#f97316" size={20} /> },
        { label: 'Reservations', value: stats.reservationsCount, icon: <Calendar color="#a855f7" size={20} /> },
    ];

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            {/* Tab Bar */}
            <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                            activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'
                        }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* Menu Tab */}
            {activeTab === 'menu' && (
                <div className="grid lg:grid-cols-[400px,1fr] gap-8">
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-fit">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black">{editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}</h3>
                            {editingProduct && (
                                <button onClick={handleCancelEdit} className="text-slate-400 hover:text-red-500"><X size={20} /></button>
                            )}
                        </div>
                        <form onSubmit={handleProductSubmit} className="space-y-4">
                            <div>
                                {imagePreview ? (
                                    <div className="relative w-32 h-32 mx-auto mb-4">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-2xl shadow-md" />
                                        <button type="button" onClick={() => { setImagePreview(null); setProductForm(p => ({ ...p, image_file: null, image_url: '' })); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={14} /></button>
                                    </div>
                                ) : (
                                    <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center cursor-pointer hover:border-blue-500 bg-slate-50 mb-4">
                                        <Upload className="mx-auto text-slate-400 mb-2" size={32} />
                                        <p className="text-sm font-medium text-slate-600">Upload Image</p>
                                    </div>
                                )}
                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                            </div>
                            <input className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="Product Name" value={productForm.name} onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} required />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" step="0.01" className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none" placeholder="Price ($)" value={productForm.priceUSD} onChange={e => setProductForm(f => ({ ...f, priceUSD: e.target.value }))} required />
                                <select className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none" value={productForm.category} onChange={e => setProductForm(f => ({ ...f, category: e.target.value }))}>
                                    <option>Food</option><option>Drinks</option><option>Dessert</option><option>Appetizers</option>
                                </select>
                            </div>
                            <textarea className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none" placeholder="Description" value={productForm.desc} onChange={e => setProductForm(f => ({ ...f, desc: e.target.value }))} rows={3} />
                            <button type="submit" disabled={loading || uploadingImage} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all">
                                {loading || uploadingImage ? <Loader2 size={18} className="animate-spin" /> : editingProduct ? 'Update Product' : 'Publish Item'}
                            </button>
                        </form>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-black">Menu Items</h3>
                            <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{products.length} items</span>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {products.map(p => <ProductCard key={p.id} product={p} isEditing={editingProduct?.id === p.id} onEdit={handleEdit} onDelete={handleDelete} />)}
                        </div>
                    </div>
                </div>
            )}

            {/* Staff Tab */}
            {activeTab === 'staff' && (
                <div className="space-y-8">
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                        <h3 className="text-lg font-black mb-4 flex items-center gap-2"><CalendarDays size={20} className="text-orange-500" /> Pending Leave Requests</h3>
                        <div className="space-y-3">
                            {leaveRequests.length > 0 ? (
                                leaveRequests.map(req => (
                                    <div key={req.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-50 rounded-2xl gap-4">
                                        <div>
                                            <p className="font-bold">{req.staff?.full_name}</p>
                                            <p className="text-xs text-slate-500 capitalize">{req.leave_type}</p>
                                            <p className="text-xs text-slate-400">{req.start_date} → {req.end_date}</p>
                                        </div>
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            {rejectionId === req.id ? (
                                                <div className="flex flex-col gap-2 w-full">
                                                    <input className="text-xs p-2 border rounded-lg outline-none focus:ring-1 focus:ring-blue-500" placeholder="Reason for rejection..." value={adminNote} onChange={(e) => setAdminNote(e.target.value)} />
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleManageLeave(req.id, 'rejected', adminNote)} className="bg-red-500 text-white text-xs px-3 py-1 rounded-lg flex-1">Confirm</button>
                                                        <button onClick={() => { setRejectionId(null); setAdminNote(''); }} className="text-xs px-3 py-1 bg-slate-200 rounded-lg flex-1">Cancel</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <button onClick={() => handleManageLeave(req.id, 'approved')} className="bg-emerald-500 text-white p-2 rounded-xl"><Check size={16} /></button>
                                                    <button onClick={() => handleManageLeave(req.id, 'rejected')} className="bg-red-500 text-white p-2 rounded-xl"><X size={16} /></button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : <p className="text-center text-slate-400 py-8">No pending requests</p>}
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-3xl p-6 text-white">
                        <h3 className="text-lg font-black mb-4 flex items-center gap-2"><ClipboardCheck size={20} className="text-blue-400" /> Assign Daily Task</h3>
                        <form onSubmit={handleAssignTask} className="space-y-3">
                            <select className="w-full px-4 py-3 bg-slate-800 rounded-xl text-white outline-none" value={taskForm.staff_id} onChange={e => setTaskForm(f => ({ ...f, staff_id: e.target.value }))}>
                                <option value="">Select Staff Member</option>
                                {staff.map(member => <option key={member.id} value={member.id}>{member.full_name}</option>)}
                            </select>
                            <input className="w-full px-4 py-3 bg-slate-800 rounded-xl outline-none placeholder:text-slate-500" placeholder="Task description..." value={taskForm.title} onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))} />
                            <button type="submit" className="w-full bg-blue-600 py-3 rounded-xl font-bold hover:bg-blue-700 transition">Assign Task</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {STATS.map((stat, i) => (
                        <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">{stat.label}</p>
                            <div className="flex justify-between items-center">
                                <h3 className="text-3xl font-black">{stat.value}</h3>
                                {stat.icon}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};