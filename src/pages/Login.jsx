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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center z-10">
        {/* Left Info Panel */}
        <div className="lg:col-span-6 space-y-6 lg:pr-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xs">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-['Outfit']">
                Parcel<span className="text-blue-600">Flow</span>
              </h1>
              <span className="text-xs text-blue-700 font-bold tracking-wider uppercase">
                Enterprise Logistics & Delivery
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight font-['Outfit']">
              Complete Parcel & Delivery Management System
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Private portal for automated consignment tracking, parcel dispatching, role-based customer management, and manual payment ledgers.
            </p>
          </div>

          <div className="space-y-3 pt-1">
            {[
              'Private System: Accounts securely provisioned by Admin',
              'Consignment booking with auto-tracking ID generation',
              'Multi-stage status lifecycle (Pending, In Transit, Delivered)',
              'Accurate payment ledger with real-time balance calculations',
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Quick Demo Credentials Box */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 1-Click Demo Login
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Click to fill form</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => fillCredentials('admin')}
                className="p-3 rounded-xl bg-purple-50/80 border border-purple-200 text-left hover:bg-purple-100/70 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-900 group-hover:text-purple-950">
                    Admin Portal
                  </span>
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <p className="text-[11px] text-purple-700 mt-1 truncate">admin@parcel.com</p>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('client')}
                className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-left hover:bg-blue-100/70 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 group-hover:text-blue-950">
                    Client Account
                  </span>
                  <Package className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <p className="text-[11px] text-blue-700 mt-1 truncate">client@fastlogistics.com</p>
              </button>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="lg:col-span-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-lg shadow-slate-200/50 relative">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">Sign In to Your Account</h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter the credentials provided by your system administrator
              </p>
            </div>

            {error && (
              <div className="mb-5 flex items-center gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
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

            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                Don't have an account?{' '}
                <span className="text-blue-600 font-semibold">
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
