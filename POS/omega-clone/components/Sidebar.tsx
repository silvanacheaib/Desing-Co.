'use client';
import React from 'react';
import { usePosStore } from '../store/usePosStore';
import {
  LayoutDashboard,
  LayoutGrid,
  Utensils,
  Calendar,
  Settings,
  UserCircle,
  Bell,
  X,
  Trash2,
  Clock
} from 'lucide-react';

export const Sidebar = () => {
  const {
    currentView,
    setView,
    currentStaff,
    setCurrentStaff,
    notifications,
    clearNotification,
    isNotificationOpen,
    setNotificationOpen
  } = usePosStore();

  const unreadCount = notifications.length;

  const allMenuItems = [
    { id: 'floor', icon: <LayoutDashboard size={22} />, label: 'Floor Plan', roles: ['admin', 'manager', 'waiter'] },
    { id: 'menu', icon: <LayoutGrid size={22} />, label: 'Menu Explorer', roles: ['admin', 'manager', 'waiter'] },
    { id: 'kitchen', icon: <Utensils size={22} />, label: 'Kitchen Feed', roles: ['admin', 'manager', 'kitchen', 'waiter'] },
    { id: 'staff_schedule', icon: <Calendar size={22} />, label: 'My Schedule', roles: ['admin', 'manager', 'waiter', 'kitchen'] },
    { id: 'admin', icon: <Settings size={22} />, label: 'Management', roles: ['admin', 'manager'] },
  ];

  const visibleItems = allMenuItems.filter(item => 
    item.roles.includes(currentStaff?.role || '')
  );

  return (
    <aside className="sidebar fixed left-0 top-0 h-screen w-24 bg-white border-r border-slate-100 flex flex-col items-center py-8 z-[60]">
      {/* Brand Logo */}
      <div className="w-12 h-12 bg-slate-900 rounded-2xl mb-12 flex items-center justify-center font-black text-white italic">
        B
      </div>

      {/* Navigation Icons */}
      <nav className="flex-grow flex flex-col gap-4">
        {visibleItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as any)}
            className={`p-4 rounded-2xl transition-all group relative ${
              currentView === item.id ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'text-slate-400 hover:bg-slate-50'
            }`}
          >
            {item.icon}
            <span className="absolute left-20 bg-slate-900 text-white text-[10px] font-black px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all uppercase tracking-widest whitespace-nowrap z-50">
              {item.label}
            </span>
          </button>
        ))}

        <div className="h-px bg-slate-100 w-8 mx-auto my-2" />

        {/* Notification Bell Trigger */}
        <button
          onClick={() => setNotificationOpen(!isNotificationOpen)}
          className={`p-4 rounded-2xl transition-all group relative ${
            isNotificationOpen ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:bg-slate-50'
          }`}
        >
          <Bell size={22} />
          {unreadCount > 0 && (
            <span className="absolute top-3 right-3 w-5 h-5 bg-red-500 border-2 border-white text-white text-[9px] font-black rounded-full flex items-center justify-center animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>
      </nav>

      {/* Notification Popup Panel */}
      {isNotificationOpen && (
        <>
          <div 
            className="fixed inset-0 bg-slate-900/5 backdrop-blur-sm z-[-1]" 
            onClick={() => setNotificationOpen(false)} 
          />
          
          <div className="absolute left-28 top-20 w-80 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[2.5rem] border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-900">Notifications</h3>
              <button onClick={() => setNotificationOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X size={16} />
              </button>
            </div>

            <div className="max-h-[450px] overflow-y-auto p-4 space-y-3">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div key={n.id} className="group relative p-5 bg-white border border-slate-100 rounded-[1.5rem] hover:border-blue-200 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <span className="bg-blue-100 text-blue-600 text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                        Table {n.table_number}
                      </span>
                      <span className="text-[9px] font-bold text-slate-300 flex items-center gap-1">
                        <Clock size={10} /> {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-700 leading-relaxed pr-6">{n.message}</p>
                    
                    <button 
                      onClick={() => clearNotification(n.id)}
                      className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-16 text-center">
                  <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">No New Alerts</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Profile Section */}
      <div className="mt-auto group relative">
        <button className="p-4 text-slate-400 hover:text-slate-900 transition-all">
          <UserCircle size={28} />
        </button>

        <div className="absolute left-20 bottom-0 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 z-50 translate-x-[-10px] group-hover:translate-x-0">
          <div className="w-64 bg-slate-900 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] p-7 backdrop-blur-xl">
            <div className="mb-6">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Authenticated As</p>
              <p className="font-black text-lg text-white tracking-tight">{currentStaff?.full_name || 'Staff Member'}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{currentStaff?.role || 'User'}</p>
              </div>
            </div>

            <div className="h-px bg-white/5 w-full mb-6" />

            <button
              onClick={() => setCurrentStaff(null)}
              className="w-full flex items-center justify-between text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-red-400 p-4 rounded-2xl hover:bg-red-400/10 transition-all"
            >
              Log Out System
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};