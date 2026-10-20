import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/common/StatCard';
import { StatusBadge } from '../components/common/Badge';
import { OrderDetailModal } from '../components/orders/OrderDetailModal';
import { OrderStatusModal } from '../components/orders/OrderStatusModal';
import { OrderModal } from '../components/orders/OrderModal';
import { PaymentModal } from '../components/payments/PaymentModal';
import { UserModal } from '../components/users/UserModal';
import {
  Users,
  Package,
  Clock,
  Truck,
  CheckCircle2,
  DollarSign,
  CreditCard,
  PlusCircle,
  Eye,
  ArrowUpRight,
  Shield,
  Activity,
  UserPlus,
  RefreshCw,
} from 'lucide-react';

export const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modals state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [orderForStatusUpdate, setOrderForStatusUpdate] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/stats/dashboard');
      if (res.data.success) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    const handleOrderCreated = () => fetchDashboardData();
    window.addEventListener('order-created', handleOrderCreated);
    return () => window.removeEventListener('order-created', handleOrderCreated);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const handleClientRequestComplete = async (order) => {
    if (window.confirm(`Have you delivered parcel ${order.trackingId}? This will send a verification request to Admin to finalize completion.`)) {
      try {
        await api.put(`/orders/${order._id}/request-completion`, {
          note: 'Client marked parcel as delivered. Requesting admin verification.'
        });
        fetchDashboardData();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to submit completion request');
      }
    }
  };

  const handleAdminVerifyComplete = async (orderId, action = 'approve') => {
    const confirmMsg = action === 'approve'
      ? 'Verify and mark this parcel as officially Delivered & Completed?'
      : 'Reject this delivery completion request? (Will revert back to Pending)';
    if (window.confirm(confirmMsg)) {
      try {
        await api.put(`/orders/${orderId}/verify-completion`, {
          action,
          note: action === 'approve' ? 'Delivery verified and completed by admin' : 'Admin rejected completion request'
        });
        fetchDashboardData();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to verify completion');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Loading dashboard analytics...</p>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const recentOrders = dashboardData?.recentOrders || [];
  const recentPayments = dashboardData?.recentPayments || [];
  const recentActivities = dashboardData?.recentActivities || [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-slate-900 border border-indigo-500/20 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {isAdmin ? 'Administrator Portal' : 'Customer Dashboard'}
              </span>
              <span className="text-xs text-slate-400">• Active Session</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit']">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              {isAdmin
                ? 'Central monitoring hub for orders, customer billing accounts, delivery progress, and payment ledgers.'
                : 'Track your dispatched consignments, view real-time delivery statuses, and monitor your outstanding balance.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
              title="Refresh Dashboard Data"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>

            {isAdmin && (
              <>
                <button
                  onClick={() => setIsAddUserOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
                >
                  <UserPlus className="w-4 h-4 text-purple-400" />
                  <span>Add Customer</span>
                </button>
                <button
                  onClick={() => setIsPaymentOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
                >
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Record Payment</span>
                </button>
              </>
            )}

            <button
              onClick={() => setIsCreateOrderOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Parcel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pending Verification Alert Banner for Admin */}
      {isAdmin && (stats.completionRequestedOrders || 0) > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border border-purple-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 font-bold text-lg">
              🔔
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {stats.completionRequestedOrders} Delivery Completion Request{stats.completionRequestedOrders > 1 ? 's' : ''} Awaiting Verification
              </h4>
              <p className="text-xs text-purple-200/80">
                Clients have marked parcels as delivered. Verify to finalize order and balance.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/orders')}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md whitespace-nowrap self-start sm:self-auto cursor-pointer"
          >
            Review & Verify
          </button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {isAdmin ? (
          <>
            <StatCard
              title="Active Customers"
              value={`${stats.activeUsers || 0} / ${stats.totalUsers || 0}`}
              subtitle="Registered accounts"
              icon={Users}
              color="purple"
            />
            <StatCard
              title="Total Consignments"
              value={stats.totalOrders || 0}
              subtitle={`${stats.pendingOrders || 0} pending, ${stats.inTransitOrders || 0} in transit`}
              icon={Package}
              color="indigo"
            />
            <StatCard
              title="Total Deliveries"
              value={stats.deliveredOrders || 0}
              subtitle="Delivered successfully"
              icon={CheckCircle2}
              color="emerald"
            />
            <StatCard
              title="Outstanding Balance"
              value={`PKR ${(stats.outstandingBalance || 0).toLocaleString()}`}
              subtitle={`Billed: PKR ${(stats.totalBilled || 0).toLocaleString()}`}
              icon={CreditCard}
              color={stats.outstandingBalance > 0 ? 'amber' : 'emerald'}
            />
          </>
        ) : (
          <>
            <StatCard
              title="My Total Orders"
              value={stats.totalOrders || 0}
              subtitle="All booked consignments"
              icon={Package}
              color="indigo"
            />
            <StatCard
              title="In Transit"
              value={stats.inTransitOrders || 0}
              subtitle="En route for delivery"
              icon={Truck}
              color="blue"
            />
            <StatCard
              title="Successfully Delivered"
              value={stats.deliveredOrders || 0}
              subtitle="Completed deliveries"
              icon={CheckCircle2}
              color="emerald"
            />
            <StatCard
              title="My Outstanding Balance"
              value={`PKR ${(stats.outstandingBalance || 0).toLocaleString()}`}
              subtitle={`Paid: PKR ${(stats.totalPaid || 0).toLocaleString()}`}
              icon={CreditCard}
              color={stats.outstandingBalance > 0 ? 'amber' : 'emerald'}
            />
          </>
        )}
      </div>

      {/* Main Content 2-Column: Recent Orders & Payment/Activity Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8-cols: Recent Orders Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white font-['Outfit']">Recent Parcel Orders</h2>
              <p className="text-xs text-slate-400">Latest active consignments processed</p>
            </div>
            <button
              onClick={() => navigate('/orders')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              <span>View All Orders</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Tracking ID</th>
                    <th className="px-4 py-3 font-semibold">Destination / Receiver</th>
                    {isAdmin && <th className="px-4 py-3 font-semibold">Customer</th>}
                    <th className="px-4 py-3 font-semibold">Charges</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={isAdmin ? 6 : 5} className="px-4 py-8 text-center text-slate-400">
                        No orders recorded yet. Click "Book Parcel Order" to start!
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3 font-mono font-semibold text-indigo-300">
                          {order.trackingId}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-white">{order.receiver?.name}</p>
                          <p className="text-[11px] text-slate-400 truncate max-w-[180px]">
                            {order.deliveryAddress}
                          </p>
                        </td>
                        {isAdmin && (
                          <td className="px-4 py-3 text-slate-300 font-medium">
                            {order.userId?.name || 'Customer'}
                          </td>
                        )}
                        <td className="px-4 py-3 font-semibold text-white">
                          PKR {order.deliveryCharge?.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsDetailModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                              title="View Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            {/* Client Action */}
                            {!isAdmin && (
                              <>
                                {order.status !== 'Delivered' && order.status !== 'Cancelled' && order.status !== 'Completion Requested' && (
                                  <button
                                    onClick={() => handleClientRequestComplete(order)}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                                    title="Mark parcel as delivered (Sends verification request to Admin)"
                                  >
                                    <span>📦 Mark Delivered</span>
                                  </button>
                                )}

                                {order.status === 'Completion Requested' && (
                                  <span className="text-[10px] font-medium text-purple-300 bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 rounded-lg whitespace-nowrap">
                                    ⏳ Awaiting Verification
                                  </span>
                                )}
                              </>
                            )}

                            {/* Admin Action */}
                            {isAdmin && (
                              <>
                                {order.status === 'Completion Requested' ? (
                                  <>
                                    <button
                                      onClick={() => handleAdminVerifyComplete(order._id, 'approve')}
                                      className="px-2 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white text-[11px] font-bold shadow-md shadow-emerald-500/20"
                                      title="Verify delivery and mark completed"
                                    >
                                      ✓ Verify & Complete
                                    </button>
                                    <button
                                      onClick={() => handleAdminVerifyComplete(order._id, 'reject')}
                                      className="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[11px] font-semibold"
                                      title="Reject request"
                                    >
                                      ✗ Reject
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setOrderForStatusUpdate(order);
                                      setIsStatusModalOpen(true);
                                    }}
                                    className="px-2 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-[11px] font-medium"
                                  >
                                    Status
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 4-cols: Payments / Activities */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white font-['Outfit']">
                {isAdmin ? 'Recent Payments' : 'Payment History'}
              </h2>
              <p className="text-xs text-slate-400">Latest recorded transactions</p>
            </div>
            <button
              onClick={() => navigate('/payments')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              <span>Ledger</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3 shadow-lg">
            {recentPayments.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                No recorded payment transactions yet.
              </p>
            ) : (
              recentPayments.map((p) => (
                <div
                  key={p._id}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">
                        {isAdmin ? p.userId?.name : p.method}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {new Date(p.date || p.createdAt).toLocaleDateString()} • {p.method}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400">
                      +PKR {p.amount?.toLocaleString()}
                    </span>
                    {p.reference && (
                      <span className="block text-[10px] text-slate-400 font-mono truncate max-w-[100px]">
                        {p.reference}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Admin System Activity Log Feed */}
          {isAdmin && recentActivities.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Activity className="w-3.5 h-3.5 text-indigo-400" />
                <span>Audit & Activity Stream</span>
              </div>
              <div className="space-y-2">
                {recentActivities.slice(0, 4).map((act) => (
                  <div key={act._id} className="text-xs border-l-2 border-indigo-500 pl-2.5 py-0.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-200">{act.action}</span>
                      <span className="text-slate-500">
                        {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      By {act.actorId?.name || 'System Admin'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <OrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        order={selectedOrder}
      />

      {isAdmin && (
        <OrderStatusModal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          onSuccess={() => {
            setIsStatusModalOpen(false);
            fetchDashboardData();
          }}
          order={orderForStatusUpdate}
        />
      )}

      <OrderModal
        isOpen={isCreateOrderOpen}
        onClose={() => setIsCreateOrderOpen(false)}
        onSuccess={() => {
          setIsCreateOrderOpen(false);
          fetchDashboardData();
        }}
      />

      {isAdmin && (
        <>
          <UserModal
            isOpen={isAddUserOpen}
            onClose={() => setIsAddUserOpen(false)}
            onSuccess={() => {
              setIsAddUserOpen(false);
              fetchDashboardData();
            }}
          />
          <PaymentModal
            isOpen={isPaymentOpen}
            onClose={() => setIsPaymentOpen(false)}
            onSuccess={() => {
              setIsPaymentOpen(false);
              fetchDashboardData();
            }}
          />
        </>
      )}
    </div>
  );
};
