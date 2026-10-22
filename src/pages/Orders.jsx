import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/common/Badge';
import { OrderDetailModal } from '../components/orders/OrderDetailModal';
import { OrderStatusModal } from '../components/orders/OrderStatusModal';
import { OrderModal } from '../components/orders/OrderModal';
import {
  Package,
  Search,
  Filter,
  PlusCircle,
  Eye,
  Edit2,
  Trash2,
  RotateCcw,
  Calendar,
  AlertCircle,
  ChevronDown,
  Loader2,
} from 'lucide-react';

export const Orders = () => {
  const { user, isAdmin } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [usersList, setUsersList] = useState([]);

  // Modals state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [orderForStatus, setOrderForStatus] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Deletion feedback
  const [deleteError, setDeleteError] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let url = `/orders?status=${statusFilter}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
      if (userFilter) url += `&userId=${userFilter}`;

      const res = await api.get(url);
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, userFilter]);

  // Load users list for admin filter
  useEffect(() => {
    if (isAdmin) {
      const loadUsers = async () => {
        try {
          const res = await api.get('/users');
          if (res.data.success) {
            setUsersList(res.data.users);
          }
        } catch (err) {
          console.error('Failed to load users:', err);
        }
      };
      loadUsers();
    }
  }, [isAdmin]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleDelete = async (order) => {
    if (!isAdmin && order.status === 'Delivered') {
      alert('Delivered orders cannot be deleted to protect financial transaction records');
      return;
    }

    if (window.confirm(`Are you sure you want to archive parcel order ${order.trackingId}?`)) {
      try {
        setDeleteError('');
        const res = await api.delete(`/orders/${order._id}`);
        if (res.data.success) {
          fetchOrders();
        }
      } catch (err) {
        setDeleteError(err.response?.data?.message || 'Failed to delete order');
      }
    }
  };

  const handleClientRequestComplete = async (order) => {
    if (window.confirm(`Have you delivered parcel ${order.trackingId}? This will send a verification request to Admin to finalize completion.`)) {
      try {
        await api.put(`/orders/${order._id}/request-completion`, {
          note: 'Client marked parcel as delivered. Requesting admin verification.'
        });
        fetchOrders();
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
        fetchOrders();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to verify completion');
      }
    }
  };

  const statusTabs = [
    { label: 'All Orders', value: 'all' },
    { label: 'Pending', value: 'Pending' },
    { label: '⚠️ Awaiting Verification', value: 'Completion Requested' },
    { label: 'Completed (Delivered)', value: 'Delivered' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-['Outfit']">
            {isAdmin ? 'All Consignments & Orders' : 'My Parcel Orders'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isAdmin
              ? 'Manage and monitor all parcels across all client accounts'
              : 'Book new parcel dispatches, track status and view receipts'}
          </p>
        </div>

        <button
          onClick={() => {
            setOrderToEdit(null);
            setIsOrderModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post Parcel</span>
        </button>
      </div>

      {deleteError && (
        <div className="flex items-center gap-2 p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl font-medium">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{deleteError}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === tab.value
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Extra Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <form onSubmit={handleSearchSubmit} className="md:col-span-8 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Tracking ID, Receiver, Sender, Phone, Address..."
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

          {isAdmin && (
            <div className="md:col-span-4">
              <select
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">All Customer Accounts</option>
                {usersList.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} {u.company ? `(${u.company})` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5 font-semibold">Tracking ID & Date</th>
                <th className="px-4 py-3.5 font-semibold">Sender</th>
                <th className="px-4 py-3.5 font-semibold">Receiver & City</th>
                {isAdmin && <th className="px-4 py-3.5 font-semibold">Customer</th>}
                <th className="px-4 py-3.5 font-semibold">Parcel Info</th>
                <th className="px-4 py-3.5 font-semibold">Delivery Charge</th>
                <th className="px-4 py-3.5 font-semibold">Status</th>
                <th className="px-4 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={isAdmin ? 8 : 7} className="px-4 py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                    <span>Loading parcel orders...</span>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 8 : 7} className="px-4 py-12 text-center text-slate-400">
                    No parcel orders match your current filters.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const canEdit = isAdmin || (order.status !== 'Delivered' && order.status !== 'Cancelled');
                  const canDelete = isAdmin || order.status !== 'Delivered';

                  return (
                    <tr key={order._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className="font-mono font-bold text-blue-600 block">
                          {order.trackingId}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-slate-900">{order.sender?.name}</p>
                        <p className="text-[11px] text-slate-500">{order.sender?.phone}</p>
                      </td>

                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-slate-900">{order.receiver?.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {order.receiver?.city ? `${order.receiver.city} • ` : ''}
                          {order.receiver?.phone}
                        </p>
                      </td>

                      {isAdmin && (
                        <td className="px-4 py-3.5 text-slate-700">
                          <p className="font-semibold text-slate-900">{order.userId?.name || 'Customer'}</p>
                          <p className="text-[10px] text-slate-400">{order.userId?.company}</p>
                        </td>
                      )}

                      <td className="px-4 py-3.5 max-w-[160px]">
                        <p className="truncate font-medium text-slate-900">{order.parcelInfo?.description}</p>
                        <p className="text-[10px] text-slate-500">
                          {order.parcelInfo?.category} • {order.parcelInfo?.weight || 1}kg
                        </p>
                      </td>

                      <td className="px-4 py-3.5 font-bold text-slate-900 whitespace-nowrap">
                        PKR {order.deliveryCharge?.toLocaleString()}
                        {order.codAmount > 0 && (
                          <span className="block text-[10px] text-emerald-600 font-semibold">
                            COD: PKR {order.codAmount?.toLocaleString()}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <StatusBadge status={order.status} />
                      </td>

                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsDetailModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors"
                            title="View Slip"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Client Actions */}
                          {!isAdmin && (
                            <>
                              {order.status !== 'Delivered' && order.status !== 'Cancelled' && order.status !== 'Completion Requested' && (
                                <button
                                  onClick={() => handleClientRequestComplete(order)}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                                  title="Mark parcel as delivered (Sends verification request to Admin)"
                                >
                                  <span>📦 Mark Delivered</span>
                                </button>
                              )}

                              {order.status === 'Completion Requested' && (
                                <span className="text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-lg whitespace-nowrap">
                                  ⏳ Awaiting Admin Approval
                                </span>
                              )}
                            </>
                          )}

                          {/* Admin Actions */}
                          {isAdmin && (
                            <>
                              {order.status === 'Completion Requested' && (
                                <>
                                  <button
                                    onClick={() => handleAdminVerifyComplete(order._id, 'approve')}
                                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs flex items-center gap-1 cursor-pointer"
                                    title="Verify delivery and mark as completed"
                                  >
                                    ✓ Verify
                                  </button>
                                  <button
                                    onClick={() => handleAdminVerifyComplete(order._id, 'reject')}
                                    className="px-2 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-semibold cursor-pointer"
                                    title="Reject completion request"
                                  >
                                    ✗ Reject
                                  </button>
                                </>
                              )}

                              <button
                                onClick={() => {
                                  setOrderForStatus(order);
                                  setIsStatusModalOpen(true);
                                }}
                                className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-[11px] font-semibold transition-colors"
                                title="Change to any status"
                              >
                                Status
                              </button>
                            </>
                          )}

                          {canEdit && (
                            <button
                              onClick={() => {
                                setOrderToEdit(order);
                                setIsOrderModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors"
                              title="Edit Order"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {canDelete && (
                            <button
                              onClick={() => handleDelete(order)}
                              className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 transition-colors"
                              title="Archive / Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
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
            fetchOrders();
          }}
          order={orderForStatus}
        />
      )}

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onSuccess={() => {
          setIsOrderModalOpen(false);
          fetchOrders();
        }}
        orderToEdit={orderToEdit}
      />
    </div>
  );
};
