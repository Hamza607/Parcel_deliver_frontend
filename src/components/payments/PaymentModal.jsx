import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import api from '../../api/axios';
import { Loader2, AlertCircle, DollarSign, Calendar, FileText, CreditCard, User } from 'lucide-react';

export const PaymentModal = ({ isOpen, onClose, onSuccess, paymentToEdit = null, preselectedUserId = '' }) => {
  const [usersList, setUsersList] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [formData, setFormData] = useState({
    userId: '',
    orderId: '',
    amount: '',
    method: 'Cash',
    date: new Date().toISOString().slice(0, 10),
    reference: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch users list
  useEffect(() => {
    if (isOpen) {
      const fetchUsers = async () => {
        try {
          setLoadingUsers(true);
          const res = await api.get('/users?status=active');
          if (res.data.success) {
            setUsersList(res.data.users);
          }
        } catch (err) {
          console.error('Failed to load users for payment:', err);
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [isOpen]);

  // Set initial form state
  useEffect(() => {
    if (paymentToEdit) {
      setFormData({
        userId: paymentToEdit.userId?._id || paymentToEdit.userId || '',
        orderId: paymentToEdit.orderId?._id || paymentToEdit.orderId || '',
        amount: paymentToEdit.amount || '',
        method: paymentToEdit.method || 'Cash',
        date: paymentToEdit.date ? new Date(paymentToEdit.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        reference: paymentToEdit.reference || '',
        notes: paymentToEdit.notes || '',
      });
    } else {
      setFormData({
        userId: preselectedUserId || '',
        orderId: '',
        amount: '',
        method: 'Cash',
        date: new Date().toISOString().slice(0, 10),
        reference: '',
        notes: '',
      });
    }
    setError('');
  }, [paymentToEdit, preselectedUserId, isOpen]);

  // Fetch orders when user is selected
  useEffect(() => {
    if (formData.userId) {
      const fetchOrdersForUser = async () => {
        try {
          setLoadingOrders(true);
          const res = await api.get(`/orders?userId=${formData.userId}`);
          if (res.data.success) {
            setUserOrders(res.data.orders);
          }
        } catch (err) {
          console.error('Failed to load user orders:', err);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrdersForUser();
    } else {
      setUserOrders([]);
    }
  }, [formData.userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.userId) {
      setError('Please select a customer');
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      setError('Please enter a valid payment amount greater than zero');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        userId: formData.userId,
        orderId: formData.orderId || null,
        amount: Number(formData.amount),
        method: formData.method,
        date: formData.date,
        reference: formData.reference,
        notes: formData.notes,
      };

      if (paymentToEdit) {
        await api.put(`/payments/${paymentToEdit._id}`, payload);
      } else {
        await api.post('/payments', payload);
      }
      onSuccess();
    } catch (err) {
      console.error('Payment submit error:', err);
      setError(err.response?.data?.message || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={paymentToEdit ? 'Edit Payment Record' : 'Record Received Customer Payment'}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Customer / Account *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <select
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              disabled={Boolean(paymentToEdit) || loadingUsers}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50"
              required
            >
              <option value="">-- Choose Customer --</option>
              {usersList.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} {u.company ? `(${u.company})` : ''} - Bal: PKR {u.outstandingBalance?.toLocaleString()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Link to Specific Order (Optional)
          </label>
          <select
            name="orderId"
            value={formData.orderId}
            onChange={handleChange}
            disabled={loadingOrders || !formData.userId}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50"
          >
            <option value="">-- General Account Credit (No specific order) --</option>
            {userOrders.map((o) => (
              <option key={o._id} value={o._id}>
                {o.trackingId} - PKR {o.deliveryCharge} ({o.status})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Amount Received (PKR) *
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="number"
                min="1"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="e.g. 5000"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Payment Method *
            </label>
            <div className="relative">
              <CreditCard className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <select
                name="method"
                value={formData.method}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer (IBFT)</option>
                <option value="EasyPaisa">EasyPaisa</option>
                <option value="JazzCash">JazzCash</option>
                <option value="Cheque">Cheque</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Payment Date *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Ref / Txn / Cheque #
            </label>
            <input
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              placeholder="e.g. TXN-1098234"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Notes / Remarks (Optional)
          </label>
          <div className="relative">
            <FileText className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="e.g. Advance payment for upcoming shipments"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{paymentToEdit ? 'Update Payment' : 'Record Payment'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
