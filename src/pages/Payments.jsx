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
          <h1 className="text-2xl font-bold text-slate-900 font-['Outfit']">
            {isAdmin ? 'Payment Ledger & Collections' : 'My Payment History & Balance'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
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
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
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
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reference number, transaction note..."
              className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>

        <div className="md:col-span-4">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
      <div className="overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] border-b border-slate-200">
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
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={isAdmin ? 8 : 6} className="px-4 py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
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
                  <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <p className="font-semibold text-slate-900">
                        {new Date(p.date || p.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(p.date || p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>

                    {isAdmin && (
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-slate-900">{p.userId?.name || 'Customer'}</p>
                        <p className="text-[10px] text-slate-500">{p.userId?.company || p.userId?.email}</p>
                      </td>
                    )}

                    <td className="px-4 py-3.5 font-bold text-emerald-600 text-sm whitespace-nowrap">
                      PKR {p.amount?.toLocaleString()}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {p.method}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-slate-700">
                      {p.reference || '—'}
                    </td>

                    <td className="px-4 py-3.5 font-mono font-bold text-blue-600">
                      {p.orderId ? p.orderId.trackingId : <span className="text-slate-400 font-sans font-normal">General Credit</span>}
                    </td>

                    <td className="px-4 py-3.5 text-slate-600 max-w-[180px] truncate">
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
                            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors"
                            title="Edit Payment"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p)}
                            className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 transition-colors"
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
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-3">
          <span>
            Total Entries: <strong className="text-slate-900">{payments.length}</strong>
          </span>
          <span>
            Filtered Total Sum:{' '}
            <strong className="text-emerald-600 text-sm font-bold">
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
