import React from 'react';
import { Menu, PlusCircle, Bell, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar = ({ onOpenSidebar, onNewOrderClick }) => {
  const { user, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium text-slate-700">Parcel System Online</span>
          <span className="text-slate-300">|</span>
          <span className="text-blue-600 font-medium">Internal Dispatch Portal</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {onNewOrderClick && (
          <button
            onClick={onNewOrderClick}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Parcel</span>
          </button>
        )}

        {/* User indicator pill */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 text-xs">
          <div className="hidden md:block text-right">
            <p className="font-semibold text-slate-900">{user?.name}</p>
            <p className="text-[11px] text-slate-500">{user?.company || user?.email}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};
