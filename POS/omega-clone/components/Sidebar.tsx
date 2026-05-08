'use client';
import React from 'react';
import { usePosStore } from '../store/usePosStore';
import {
  LayoutDashboard,
  LayoutGrid,
  Utensils,
  Calendar,
  Settings,
  LogOut,
  UserCircle,
  Bell
} from 'lucide-react';

export const Sidebar = () => {
  const {
    currentView,
    setView,
    currentStaff,
    setCurrentStaff,
    notifications
  } = usePosStore();

  const allMenuItems = [
    {
      id: 'floor',
      icon: <LayoutDashboard size={22} />,
      label: 'Floor Plan',
      roles: ['admin', 'manager', 'waiter']
    },
    {
      id: 'menu',
      icon: <LayoutGrid size={22} />,
      label: 'Menu Explorer',
      roles: ['admin', 'manager', 'waiter']
    },
    {
      id: 'kitchen',
      icon: <Utensils size={22} />,
      label: 'Kitchen Feed',
      roles: ['admin', 'manager', 'kitchen', 'waiter']
    },
    {
      id: 'staff_schedule',
      icon: <Calendar size={22} />,
      label: 'My Schedule',
      roles: ['admin', 'manager', 'waiter', 'kitchen']
    },
    {
      id: 'admin',
      icon: <Settings size={22} />,
      label: 'Management',
      roles: ['admin', 'manager']
    },
  ];

  const visibleItems = allMenuItems.filter(item =>
    currentStaff && item.roles.includes(currentStaff.role)
  );

  return (
    <aside className="w-24 bg-slate-950 flex flex-col items-center py-10 justify-between z-40 relative shadow-[10px_0_30px_rgba(0,0,0,0.05)]">

      {/* 1. Top Section: Logo & Nav */}
      <div className="flex flex-col items-center w-full gap-8">
        <div className="relative group cursor-pointer">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-[1.6rem] flex items-center justify-center text-white font-black italic text-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
            B
          </div>
          <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 -z-10 group-hover:opacity-40 transition-opacity" />
        </div>

        <nav className="flex flex-col gap-3 w-full items-center">
          {visibleItems.map((item) => {
            const isActive = currentView === item.id;
            const hasNotifications = item.id === 'kitchen' && notifications.length > 0;

            return (
              <button
                key={item.id}
                onClick={() => setView(item.id as any)}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all group relative
                  ${isActive
                    ? 'bg-white/10 text-white shadow-inner'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
              >
                {item.icon}

                {hasNotifications && (
                  <div className="absolute top-3 right-3 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-slate-950 text-[7px] font-black flex items-center justify-center">
                      {notifications.length}
                    </span>
                  </div>
                )}

                <span className="absolute left-full ml-6 px-4 py-2 bg-slate-900 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-8px] group-hover:translate-x-0 whitespace-nowrap shadow-2xl z-50">
                  {item.label}
                </span>

                {isActive && (
                  <div className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full shadow-[2px_0_10px_rgba(59,130,246,0.5)]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 2. Bottom Section: Notifications & User Profile */}
      <div className="flex flex-col items-center gap-6">

        <button className="w-14 h-14 text-slate-500 hover:text-white transition-colors relative group">
          <Bell size={22} />
          {notifications.length > 0 && (
            <div className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full" />
          )}
        </button>

        {/* PROFILE SECTION WITH HOVER FIX */}
        <div className="group relative">
          <button className="w-12 h-12 bg-white/5 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-white/10 hover:text-white transition-all border border-white/5 overflow-hidden">
            <UserCircle size={24} />
          </button>

          {/* Invisible Bridge Wrapper: 
              - 'pl-6' creates a physical hoverable area between the button and menu.
              - Uses opacity/pointer-events instead of 'hidden' for a smooth fade.
          */}
          <div className="absolute bottom-0 left-full pl-6 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 z-50 translate-x-[-10px] group-hover:translate-x-0">
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
                className="w-full flex items-center justify-between text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-red-400 p-4 rounded-2xl hover:bg-red-400/10 transition-all group/logout"
              >
                Sign Out
                <LogOut size={16} className="group-hover/logout:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};