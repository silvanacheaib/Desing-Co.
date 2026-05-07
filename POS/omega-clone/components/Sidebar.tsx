import React from 'react';
import { usePosStore } from '../store/usePosStore';
import { 
  LayoutGrid, 
  Settings, 
  ChefHat, 
  Database, 
  LogOut,
  TrendingUp
} from 'lucide-react';

export const Sidebar = () => {
  const { currentView, setView } = usePosStore();

  return (
    <aside className="w-20 md:w-64 bg-slate-950 h-screen flex flex-col text-white transition-all duration-300 ease-in-out shrink-0">
      {/* Brand Logo */}
      <div className="p-6 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="font-black text-xl">Ω</span>
          </div>
          <div className="hidden md:block">
            <h1 className="font-black text-lg leading-none tracking-tighter">OMEGA</h1>
            <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Clone POS</span>
          </div>
        </div>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2">
        <SidebarItem 
          icon={<LayoutGrid size={22} />} 
          label="Floor Map" 
          active={currentView === 'floor'} 
          onClick={() => setView('floor')} 
        />

        <SidebarItem 
          icon={<ChefHat size={22} />} 
          label="Kitchen" 
          active={currentView === 'kitchen'} 
          onClick={() => setView('kitchen')} 
        />

        <div className="my-6 border-t border-slate-900 mx-2" />
        <p className="hidden md:block px-4 mb-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">Management</p>

        <SidebarItem 
          icon={<Database size={22} />} 
          label="Menu Admin" 
          active={currentView === 'admin'} 
          onClick={() => setView('admin')} 
        />

        <SidebarItem 
          icon={<TrendingUp size={22} />} 
          label="Reports" 
          active={currentView === 'settings'} // Currently grouped with settings
          onClick={() => setView('settings')} 
        />
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-900 bg-slate-950/50">
        <button 
          className="w-full flex items-center gap-4 p-4 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all group"
          onClick={() => window.location.reload()} // Simple logout simulation
        >
          <LogOut size={22} className="group-hover:translate-x-1 transition-transform" />
          <span className="hidden md:block font-bold text-sm">Exit System</span>
        </button>
      </div>
    </aside>
  );
};

// Sub-component for reusable Sidebar Buttons
interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const SidebarItem = ({ icon, label, active = false, onClick }: SidebarItemProps) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 group
      ${active 
        ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' 
        : 'text-slate-500 hover:bg-slate-900 hover:text-slate-200'}`}
  >
    <div className={`${active ? 'text-white' : 'group-hover:scale-110 transition-transform'}`}>
      {icon}
    </div>
    <span className="hidden md:block font-bold text-sm tracking-tight">{label}</span>
    
    {active && (
      <div className="hidden md:block ml-auto w-1.5 h-1.5 bg-white rounded-full" />
    )}
  </button>
);