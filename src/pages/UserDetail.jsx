import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { StatusBadge } from '../components/common/Badge';
import { StatCard } from '../components/common/StatCard';
import { PaymentModal } from '../components/payments/PaymentModal';
import { OrderDetailModal } from '../components/orders/OrderDetailModal';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  CreditCard,
  Package,
  DollarSign,
  PlusCircle,
  Eye,
  Loader2,
} from 'lucide-react';

export const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'payments'

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/users/${id}`);
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load user details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!data?.user) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Customer account not found.</p>
        <button
          onClick={() => navigate('/users')}
          className="mt-4 px-4 py-2 bg-indigo-600 rounded-xl text-white text-xs font-semibold"
        >
          Back to Users
        </button>
      </div>
    );
  }

  const { user, stats, orders, payments } = data;

  return (
    <div className="space-y-6">
      {/* Back button & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/users')}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 font-['Outfit']">{user.name}</h1>
              <StatusBadge status={user.status} />
            </div>
            <p className="text-xs text-slate-500">{user.company || 'Customer Account Ledger'}</p>
          </div>
        </div>

        <button
          onClick={() => setIsPaymentModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <DollarSign className="w-4 h-4" />
          <span>Record Customer Payment</span>
        </button>
      </div>

      {/* User Info Overview & Financial Balance Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block border-b border-slate-200 pb-2">
            Account Profile
          </span>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Phone className="w-4 h-4 text-slate-400" />
              <span>{user.phone}</span>
            </div>
            {user.company && (
              <div className="flex items-center gap-2 text-slate-700">
                <Building className="w-4 h-4 text-slate-400" />
                <span>{user.company}</span>
              </div>
            )}
            {user.address && (
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{user.address}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-slate-500 pt-2 border-t border-slate-100 text-[11px]">
              <Calendar className="w-3.5 h-3.5" />
              <span>Registered: {new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Financial Ledger Stats */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Total Billed"
            value={`PKR ${(stats.totalBilled || 0).toLocaleString()}`}
            subtitle={`${stats.totalOrders || 0} active orders`}
            icon={Package}
            color="indigo"
          />
          <StatCard
            title="Total Payments"
            value={`PKR ${(stats.totalPaid || 0).toLocaleString()}`}
            subtitle="Collected to date"
            icon={CheckCircle2}
            color="emerald"
          />
          <StatCard
            title="Unpaid Balance"
            value={`PKR ${(stats.outstandingBalance || 0).toLocaleString()}`}
            subtitle={stats.outstandingBalance > 0 ? 'Pending payment' : 'Cleared in full'}
            icon={CreditCard}
            color={stats.outstandingBalance > 0 ? 'amber' : 'emerald'}
          />
        </div>
      </div>

      {/* Tabs: Orders / Payments */}
      <div className="space-y-4">
        <div className="flex items-center gap-6 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-sm font-semibold transition-all relative cursor-pointer ${
              activeTab === 'orders'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Consignment Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`pb-3 text-sm font-semibold transition-all relative cursor-pointer ${
              activeTab === 'payments'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Recorded Payments ({payments.length})
          </button>
        </div>

        {activeTab === 'orders' ? (
          <div className="overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5 font-semibold">Tracking ID</th>
                    <th className="px-4 py-3.5 font-semibold">Date</th>
                    <th className="px-4 py-3.5 font-semibold">Receiver</th>
                    <th className="px-4 py-3.5 font-semibold">Destination</th>
                    <th className="px-4 py-3.5 font-semibold">Delivery Charge</th>
                    <th className="px-4 py-3.5 font-semibold">Status</th>
                    <th className="px-4 py-3.5 font-semibold text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                        No orders recorded under this user account yet.
                      </td>
                    </tr>
                  ) : (
                    orders.map((o) => (
                      <tr key={o._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3.5 font-mono font-bold text-blue-600">
                          {o.trackingId}
                        </td>
                        <td className="px-4 py-3.5 text-slate-500">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-slate-900">{o.receiver?.name}</td>
                        <td className="px-4 py-3.5 truncate max-w-[200px] text-slate-500">
                          {o.deliveryAddress}
                        </td>
                        <td className="px-4 py-3.5 font-bold text-slate-900">
                          PKR {o.deliveryCharge?.toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5">
                          <StatusBadge status={o.status} />
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => {
                              setSelectedOrder(o);
                              setIsDetailModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5 font-semibold">Payment Date</th>
                    <th className="px-4 py-3.5 font-semibold">Amount Received</th>
                    <th className="px-4 py-3.5 font-semibold">Payment Method</th>
                    <th className="px-4 py-3.5 font-semibold">Reference / Receipt #</th>
                    <th className="px-4 py-3.5 font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                        No payments recorded for this account yet.
                      </td>
                    </tr>
                  ) : (
                    payments.map((p) => (
                      <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3.5 text-slate-600">
                          {new Date(p.date || p.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3.5 font-bold text-emerald-600 text-sm">
                          PKR {p.amount?.toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            {p.method}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-mono text-slate-700">
                          {p.reference || '—'}
                        </td>
                        <td className="px-4 py-3.5 text-slate-500">{p.notes || '—'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={() => {
          setIsPaymentModalOpen(false);
          fetchUserDetails();
        }}
        preselectedUserId={user.id || user._id}
      />

      <OrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
};
