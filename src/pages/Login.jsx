import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide your email and password');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (type) => {
    if (type === 'admin') {
      setEmail('admin@parcel.com');
      setPassword('admin123');
    } else {
      setEmail('client@fastlogistics.com');
      setPassword('user123');
    }
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glowing blurs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        {/* Left Info Panel */}
        <div className="lg:col-span-6 space-y-6 lg:pr-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white font-['Outfit']">
                Parcel<span className="text-indigo-400">Flow</span>
              </h1>
              <span className="text-xs text-indigo-400 font-semibold tracking-wider uppercase">
                Enterprise Logistics & Delivery
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight font-['Outfit']">
              Complete Parcel & Delivery Management System
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Private portal for automated consignment tracking, parcel dispatching, role-based customer management, and manual payment ledgers.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {[
              'Private System: Accounts securely provisioned by Admin',
              'Consignment booking with auto-tracking ID generation',
              'Multi-stage status lifecycle (Pending, In Transit, Delivered)',
              'Accurate payment ledger with real-time balance calculations',
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Quick Demo Credentials Box */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 1-Click Demo Login
              </span>
              <span className="text-[11px] text-slate-400">Click to fill form</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => fillCredentials('admin')}
                className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-left hover:bg-purple-500/20 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300 group-hover:text-purple-200">
                    Admin Portal
                  </span>
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 truncate">admin@parcel.com</p>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('client')}
                className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-left hover:bg-indigo-500/20 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300 group-hover:text-indigo-200">
                    Client Account
                  </span>
                  <Package className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 truncate">client@fastlogistics.com</p>
              </button>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="lg:col-span-6">
          <div className="bg-[#101524] border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white font-['Outfit']">Sign In to Your Account</h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter the credentials provided by your system administrator
              </p>
            </div>

            {error && (
              <div className="mb-5 flex items-center gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 transition-all duration-200 shadow-lg shadow-indigo-600/30 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
              <p className="text-xs text-slate-400">
                Don't have an account?{' '}
                <span className="text-indigo-400 font-medium">
                  Contact System Admin for account provisioning
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
