'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
    PackagePlus, Users, TrendingUp, Plus, Trash2, Loader2,
    ClipboardCheck, Check, X, CalendarDays, Clock,
    ShoppingBag, Calendar, Image as ImageIcon, Pencil,
} from 'lucide-react';
import { usePosStore, Product } from '../store/usePosStore';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'menu' | 'staff' | 'stats';

interface ProductForm {
    name: string;
    price_usd: string;
    category: string;
    desc: string;
    img: string;
}

interface TaskForm {
    staff_id: string;
    title: string;
    priority: string;
    date: string;
}

const EMPTY_PRODUCT_FORM: ProductForm = {
    name: '', price_usd: '', category: 'Food', desc: '', img: ''
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
    const [activeTab, setActiveTab]           = useState<Tab>('menu');
    const [loading, setLoading]               = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [productForm, setProductForm]       = useState<ProductForm>(EMPTY_PRODUCT_FORM);
    const [taskForm, setTaskForm]             = useState<TaskForm>({
        staff_id: '', title: '', priority: 'medium',
        date: new Date().toISOString().split('T')[0],
    });
    const [leaveRequests, setLeaveRequests] = useState<any[]>([]);

    const {
        fetchProducts, products, staff, fetchStaff,
        stats, fetchAdminStats, addProduct, updateProduct, deleteProduct,
    } = usePosStore();

    useEffect(() => {
        fetchProducts();
        fetchStaff();
        fetchLeaveRequests();
        if (activeTab === 'stats') fetchAdminStats();
    }, [activeTab]);

    // ─── Data Fetching ─────────────────────────────────────────────────────────

    const fetchLeaveRequests = async () => {
        const { data } = await supabase
            .from('leave_requests')
            .select('*, staff(full_name)')
            .eq('status', 'pending')
            .order('created_at', { ascending: false });
        if (data) setLeaveRequests(data);
    };

    // ─── Product Handlers ──────────────────────────────────────────────────────

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setProductForm({
            name:      product.name,
            price_usd: String(product.priceUSD),
            category:  product.category,
            img:       product.image_url || '',
            desc:      product.description || '',
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
        setProductForm(EMPTY_PRODUCT_FORM);
    };

    const handleProductSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const payload = {
            name:        productForm.name,
            priceUSD:    parseFloat(productForm.price_usd),
            category:    productForm.category,
            image_url:   productForm.img,
            description: productForm.desc,
        };
        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, payload);
                setEditingProduct(null);
            } else {
                await addProduct(payload);
            }
            setProductForm(EMPTY_PRODUCT_FORM);
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
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
                staff_id:     taskForm.staff_id,
                task_title:   taskForm.title,
                priority:     taskForm.priority,
                task_date:    taskForm.date,
                is_new:       true,
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

    const handleManageLeave = async (id: string, status: 'approved' | 'rejected') => {
        const note = prompt(`Reason for ${status}? (Optional)`);
        const { error } = await supabase
            .from('leave_requests')
            .update({ status, admin_note: note })
            .eq('id', id);
        if (!error) {
            setLeaveRequests(prev => prev.filter(r => r.id !== id));
            alert(`Request ${status}`);
        }
    };

    // ─── Static Data ───────────────────────────────────────────────────────────

    const TABS = [
        { id: 'menu',  icon: <PackagePlus size={16} />, label: 'Menu' },
        { id: 'staff', icon: <Users        size={16} />, label: 'Staff & Ops' },
        { id: 'stats', icon: <TrendingUp   size={16} />, label: 'Stats' },
    ];

    const STATS = [
        { label: 'Daily Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: <TrendingUp  color="#10b981" size={20} /> },
        { label: 'Total Visits',  value: stats.totalVisits,             icon: <Users       color="#3b82f6" size={20} /> },
        { label: 'Items Sold',    value: stats.itemsSold,               icon: <ShoppingBag color="#f97316" size={20} /> },
        { label: 'Reservations',  value: stats.reservationsCount,       icon: <Calendar    color="#a855f7" size={20} /> },
    ];

    // ─── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="ap-wrapper">

            {/* ── Tab Bar ─────────────────────────────────────────────────────── */}
            <div className="ap-tab-bar">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className={`ap-tab ${activeTab === tab.id ? 'ap-tab-active' : ''}`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Menu Tab ────────────────────────────────────────────────────── */}
            {activeTab === 'menu' && (
                <div className="ap-menu-layout">

                    {/* Product Form */}
                    <div className={`card ${editingProduct ? 'ap-card-editing' : ''}`}>
                        <div className="ap-form-header">
                            <h3 className="ap-form-title">
                                {editingProduct ? '✏️ Edit Product' : 'New Product'}
                            </h3>
                            {editingProduct && (
                                <button className="btn-icon" onClick={handleCancelEdit} title="Cancel">
                                    <X size={18} />
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleProductSubmit} className="ap-form-stack">
                            <input
                                className="input"
                                placeholder="Product Name"
                                value={productForm.name}
                                onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))}
                                required
                            />
                            <div className="ap-form-row">
                                <input
                                    className="input"
                                    type="number"
                                    step="0.01"
                                    placeholder="Price ($)"
                                    value={productForm.price_usd}
                                    onChange={e => setProductForm(f => ({ ...f, price_usd: e.target.value }))}
                                    required
                                />
                                <select
                                    className="select"
                                    value={productForm.category}
                                    onChange={e => setProductForm(f => ({ ...f, category: e.target.value }))}
                                >
                                    <option>Food</option>
                                    <option>Drinks</option>
                                    <option>Dessert</option>
                                </select>
                            </div>
                            <input
                                className="input"
                                placeholder="Image URL"
                                value={productForm.img}
                                onChange={e => setProductForm(f => ({ ...f, img: e.target.value }))}
                            />
                            <textarea
                                className="textarea"
                                placeholder="Description"
                                value={productForm.desc}
                                onChange={e => setProductForm(f => ({ ...f, desc: e.target.value }))}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className={editingProduct ? 'btn-blue' : 'btn-primary'}
                            >
                                {loading
                                    ? <Loader2 size={18} className="spin" />
                                    : editingProduct
                                        ? <><Check size={16} /> Save Changes</>
                                        : <><Plus  size={16} /> Publish</>
                                }
                            </button>
                            {editingProduct && (
                                <button type="button" className="btn-secondary" onClick={handleCancelEdit}>
                                    Cancel
                                </button>
                            )}
                        </form>
                    </div>

                    {/* Inventory List */}
                    <div>
                        <h3 className="section-title">
                            Menu Inventory
                            <span className="section-title-meta">{products.length} items</span>
                        </h3>
                        <div className="ap-inventory-grid">
                            {products.map(p => (
                                <ProductCard
                                    key={p.id}
                                    product={p}
                                    isEditing={editingProduct?.id === p.id}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Staff Tab ───────────────────────────────────────────────────── */}
            {activeTab === 'staff' && (
                <div className="ap-staff-layout">

                    {/* Leave Requests */}
                    <div className="card">
                        <h3 className="section-title">
                            <CalendarDays size={20} color="#f97316" /> Pending Leave Requests
                        </h3>
                        <div className="ap-leave-grid">
                            {leaveRequests.length > 0
                                ? leaveRequests.map(req => (
                                    <div key={req.id} className="ap-leave-card">
                                        <div>
                                            <p className="ap-leave-name">{req.staff?.full_name}</p>
                                            <p className="ap-leave-type">{req.leave_type}</p>
                                            <div className="ap-leave-dates">
                                                <Clock size={12} />
                                                {req.start_date} → {req.end_date}
                                            </div>
                                        </div>
                                        <div className="ap-leave-actions">
                                            <button className="btn-approve" onClick={() => handleManageLeave(req.id, 'approved')}><Check size={16} /></button>
                                            <button className="btn-reject"  onClick={() => handleManageLeave(req.id, 'rejected')}><X    size={16} /></button>
                                        </div>
                                    </div>
                                ))
                                : <p className="empty-state">No pending requests.</p>
                            }
                        </div>
                    </div>

                    {/* Assign Task */}
                    <div className="card-dark">
                        <h3 className="section-title">
                            <ClipboardCheck size={20} color="#60a5fa" /> Assign Duty
                        </h3>
                        <form onSubmit={handleAssignTask} className="ap-assign-form">
                            <select
                                className="input-dark"
                                value={taskForm.staff_id}
                                onChange={e => setTaskForm(f => ({ ...f, staff_id: e.target.value }))}
                            >
                                <option value="">Staff...</option>
                                {staff.map(member => (
                                    <option key={member.id} value={member.id}>{member.full_name}</option>
                                ))}
                            </select>
                            <input
                                className="input-dark"
                                placeholder="Task..."
                                value={taskForm.title}
                                onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))}
                            />
                            <select
                                className="input-dark"
                                value={taskForm.priority}
                                onChange={e => setTaskForm(f => ({ ...f, priority: e.target.value }))}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                            <button type="submit" className="ap-btn-assign">Assign</button>
                        </form>
                    </div>

                    {/* Staff Table */}
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <table className="ap-table">
                            <thead className="ap-table-head">
                                <tr>
                                    <th>Employee</th>
                                    <th>Role</th>
                                    <th>Salary (USD)</th>
                                </tr>
                            </thead>
                            <tbody className="ap-table-body">
                                {staff.map(member => (
                                    <tr key={member.id}>
                                        <td className="ap-td-name">{member.full_name}</td>
                                        <td className="ap-td-role">{member.role}</td>
                                        <td className="ap-td-salary">${member.base_salary_usd}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── Stats Tab ───────────────────────────────────────────────────── */}
            {activeTab === 'stats' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="ap-stats-grid">
                        {STATS.map((stat, i) => (
                            <div key={i} className="ap-stat-card">
                                <div className="ap-stat-icon">{stat.icon}</div>
                                <p className="ap-stat-label">{stat.label}</p>
                                <h3 className="ap-stat-value">{stat.value}</h3>
                            </div>
                        ))}
                    </div>
                    <div className="ap-chart-placeholder">
                        <TrendingUp size={48} />
                        <p>Analytics Chart — Coming Soon</p>
                    </div>
                </div>
            )}

        </div>
    );
};
