import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  CreditCard,
  UserCheck,
  LogOut,
  ShieldCheck,
  User as UserIcon,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      adminOnly: false,
    },
    {
      label: isAdmin ? 'All Orders' : 'My Orders',
      path: '/orders',
      icon: Package,
      adminOnly: false,
    },
    {
      label: 'Users Management',
      path: '/users',
      icon: Users,
      adminOnly: true,
    },
    {
      label: isAdmin ? 'Payment Ledger' : 'My Payments',
      path: '/payments',
      icon: CreditCard,
      adminOnly: false,
    },
    {
      label: 'My Profile',
      path: '/profile',
      icon: UserIcon,
      adminOnly: false,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0d121f] border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-lg">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white font-['Outfit']">
                Parcel<span className="text-indigo-400">Flow</span>
              </span>
              <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                Delivery System
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white lg:hidden rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 mx-4 my-4 rounded-xl bg-slate-900/60 border border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {isAdmin ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-400">
                    <ShieldCheck className="w-3 h-3" /> Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                    <UserCheck className="w-3 h-3 text-emerald-400" /> Client
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          {navItems
            .filter((item) => !item.adminOnly || isAdmin)
            .map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
        </nav>

        {/* Footer with logout */}
        <div className="p-4 border-t border-slate-800/80">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
