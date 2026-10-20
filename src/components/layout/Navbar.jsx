import React from 'react';
import { Menu, PlusCircle, Bell, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar = ({ onOpenSidebar, onNewOrderClick }) => {
  const { user, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0b0f19]/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Parcel System Online</span>
          <span className="text-slate-600">|</span>
          <span className="text-indigo-400 font-medium">MongoDB v9.x Connected</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {onNewOrderClick && (
          <button
            onClick={onNewOrderClick}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl shadow-lg shadow-indigo-600/25 transition-all duration-200 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Parcel</span>
          </button>
        )}

        {/* User indicator pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800 text-xs">
          <div className="hidden md:block text-right">
            <p className="font-medium text-slate-200">{user?.name}</p>
            <p className="text-[11px] text-slate-400">{user?.company || user?.email}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-semibold text-xs flex items-center justify-center border border-indigo-400/30">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};
