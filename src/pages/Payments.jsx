import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { PaymentModal } from '../components/payments/PaymentModal';
import { StatCard } from '../components/common/StatCard';
import {
  CreditCard,
  PlusCircle,
  Search,
  Filter,
  DollarSign,
  Calendar,
  Edit2,
  Trash2,
  CheckCircle2,
  FileText,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export const Payments = () => {
  const { user, isAdmin } = useAuth();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [methodFilter, setMethodFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [summaryData, setSummaryData] = useState(null);

  // Modals state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentToEdit, setPaymentToEdit] = useState(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      let url = '/payments?';
      if (methodFilter) url += `method=${methodFilter}&`;
      if (searchTerm) url += `search=${encodeURIComponent(searchTerm)}&`;

      const res = await api.get(url);
      if (res.data.success) {
        setPayments(res.data.payments);
      }

      // If regular user, also get customer billing summary
      if (!isAdmin && user) {
        const sumRes = await api.get(`/payments/user/${user.id || user._id}/summary`);
        if (sumRes.data.success) {
          setSummaryData(sumRes.data.summary);
        }
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [methodFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPayments();
  };

  const handleDelete = async (payment) => {
    if (window.confirm(`Are you sure you want to delete payment of PKR ${payment.amount}?`)) {
      try {
        const res = await api.delete(`/payments/${payment._id}`);
        if (res.data.success) {
          fetchPayments();
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete payment');
      }
    }
  };

  const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Outfit']">
            {isAdmin ? 'Payment Ledger & Collections' : 'My Payment History & Balance'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {isAdmin
              ? 'Record manual offline payments, track client account balances, and audit collections'
              : 'View all payments credited to your account and inspect your net balance'}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => {
              setPaymentToEdit(null);
              setIsPaymentModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Record New Payment</span>
          </button>
        )}
      </div>

      {/* User Financial Summary Card if regular user */}
      {!isAdmin && summaryData && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Total Delivery Billing"
            value={`PKR ${(summaryData.totalBilled || 0).toLocaleString()}`}
            subtitle={`${summaryData.totalOrders || 0} active consignments`}
            icon={FileText}
            color="indigo"
          />
          <StatCard
            title="Total Paid by Me"
            value={`PKR ${(summaryData.totalPaid || 0).toLocaleString()}`}
            subtitle="Verified payment credits"
            icon={CheckCircle2}
            color="emerald"
          />
          <StatCard
            title="Net Outstanding Balance"
            value={`PKR ${(summaryData.outstandingBalance || 0).toLocaleString()}`}
            subtitle={summaryData.outstandingBalance > 0 ? 'Payable to courier' : 'Account in good standing'}
            icon={CreditCard}
            color={summaryData.outstandingBalance > 0 ? 'amber' : 'emerald'}
          />
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <form onSubmit={handleSearch} className="md:col-span-8 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reference number, transaction note..."
              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
          >
            Search
          </button>
        </form>

        <div className="md:col-span-4">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Payment Methods</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer (IBFT)</option>
            <option value="EasyPaisa">EasyPaisa</option>
            <option value="JazzCash">JazzCash</option>
            <option value="Cheque">Cheque</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5 font-semibold">Date</th>
                {isAdmin && <th className="px-4 py-3.5 font-semibold">Customer / Account</th>}
                <th className="px-4 py-3.5 font-semibold">Amount (PKR)</th>
                <th className="px-4 py-3.5 font-semibold">Payment Method</th>
                <th className="px-4 py-3.5 font-semibold">Ref / Receipt #</th>
                <th className="px-4 py-3.5 font-semibold">Linked Order</th>
                <th className="px-4 py-3.5 font-semibold">Notes</th>
                {isAdmin && <th className="px-4 py-3.5 font-semibold text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={isAdmin ? 8 : 6} className="px-4 py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-400" />
                    <span>Loading payment ledger records...</span>
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 8 : 6} className="px-4 py-12 text-center text-slate-400">
                    No payment records match the current criteria.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <p className="font-medium text-white">
                        {new Date(p.date || p.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(p.date || p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>

                    {isAdmin && (
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-white">{p.userId?.name || 'Customer'}</p>
                        <p className="text-[10px] text-slate-400">{p.userId?.company || p.userId?.email}</p>
                      </td>
                    )}

                    <td className="px-4 py-3.5 font-bold text-emerald-400 text-sm whitespace-nowrap">
                      PKR {p.amount?.toLocaleString()}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800 text-slate-200 border border-slate-700">
                        {p.method}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-slate-300">
                      {p.reference || '—'}
                    </td>

                    <td className="px-4 py-3.5 font-mono text-indigo-400">
                      {p.orderId ? p.orderId.trackingId : <span className="text-slate-500 font-sans">General Credit</span>}
                    </td>

                    <td className="px-4 py-3.5 text-slate-400 max-w-[180px] truncate">
                      {p.notes || '—'}
                    </td>

                    {isAdmin && (
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setPaymentToEdit(p);
                              setIsPaymentModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                            title="Edit Payment"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                            title="Delete Payment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Ledger Bottom Summary Bar */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
          <span>
            Total Entries: <strong className="text-white">{payments.length}</strong>
          </span>
          <span>
            Filtered Total Sum:{' '}
            <strong className="text-emerald-400 text-sm">
              PKR {totalAmount.toLocaleString()}
            </strong>
          </span>
        </div>
      </div>

      {/* Payment Modal */}
      {isAdmin && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onSuccess={() => {
            setIsPaymentModalOpen(false);
            fetchPayments();
          }}
          paymentToEdit={paymentToEdit}
        />
      )}
    </div>
  );
};
