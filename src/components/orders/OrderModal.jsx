import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
  Package,
  MapPin,
  User,
  Phone,
  DollarSign,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Send,
  Building,
} from 'lucide-react';

export const OrderModal = ({ isOpen, onClose, onSuccess, orderToEdit = null }) => {
  const { user, isAdmin } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Simplified state
  const [formData, setFormData] = useState({
    userId: '',
    receiverName: '',
    receiverPhone: '',
    receiverCity: '',
    deliveryAddress: '',
    description: '',
    deliveryCharge: '500',
    // Optional advanced fields:
    weight: '1.0',
    quantity: '1',
    category: 'Standard Parcel',
    codAmount: '0',
    pickupAddress: '',
    specialInstructions: '',
  });

  // Fetch users list for Admin to select
  useEffect(() => {
    if (isAdmin && isOpen) {
      const fetchUsers = async () => {
        try {
          setLoadingUsers(true);
          const res = await api.get('/users?status=active');
          if (res.data.success) {
            setUsersList(res.data.users);
          }
        } catch (err) {
          console.error('Failed to load users list:', err);
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [isAdmin, isOpen]);

  // Populate form if editing or when opened
  useEffect(() => {
    if (orderToEdit) {
      setFormData({
        userId: orderToEdit.userId?._id || orderToEdit.userId || '',
        receiverName: orderToEdit.receiver?.name || '',
        receiverPhone: orderToEdit.receiver?.phone || '',
        receiverCity: orderToEdit.receiver?.city || '',
        deliveryAddress: orderToEdit.deliveryAddress || orderToEdit.receiver?.address || '',
        description: orderToEdit.parcelInfo?.description || '',
        deliveryCharge: orderToEdit.deliveryCharge?.toString() || '500',
        weight: orderToEdit.parcelInfo?.weight?.toString() || '1.0',
        quantity: orderToEdit.parcelInfo?.quantity?.toString() || '1',
        category: orderToEdit.parcelInfo?.category || 'Standard Parcel',
        codAmount: orderToEdit.codAmount?.toString() || '0',
        pickupAddress: orderToEdit.pickupAddress || '',
        specialInstructions: orderToEdit.parcelInfo?.specialInstructions || '',
      });
      setShowAdvanced(Boolean(orderToEdit.codAmount > 0 || orderToEdit.parcelInfo?.specialInstructions));
    } else {
      setFormData({
        userId: isAdmin ? '' : user?.id || user?._id || '',
        receiverName: '',
        receiverPhone: '',
        receiverCity: '',
        deliveryAddress: '',
        description: '',
        deliveryCharge: '500',
        weight: '1.0',
        quantity: '1',
        category: 'Standard Parcel',
        codAmount: '0',
        pickupAddress: user?.address || '',
        specialInstructions: '',
      });
      setShowAdvanced(false);
    }
    setError('');
  }, [orderToEdit, user, isOpen, isAdmin]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.receiverName.trim()) {
      setError('Please provide receiver name');
      return;
    }
    if (!formData.receiverPhone.trim()) {
      setError('Please provide receiver phone number');
      return;
    }
    if (!formData.deliveryAddress.trim()) {
      setError('Please provide destination delivery address');
      return;
    }
    if (!formData.description.trim()) {
      setError('Please describe what is inside the parcel (e.g., Cloth packet, Shoes, Documents)');
      return;
    }
    if (isAdmin && !orderToEdit && !formData.userId) {
      setError('Please select a customer account for this parcel');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        userId: formData.userId || undefined,
        receiver: {
          name: formData.receiverName.trim(),
          phone: formData.receiverPhone.trim(),
          city: formData.receiverCity.trim(),
          address: formData.deliveryAddress.trim(),
        },
        deliveryAddress: formData.deliveryAddress.trim(),
        pickupAddress: formData.pickupAddress?.trim() || user?.address || 'Customer Location',
        parcelInfo: {
          category: formData.category,
          weight: Number(formData.weight) || 1,
          quantity: Number(formData.quantity) || 1,
          description: formData.description.trim(),
          specialInstructions: formData.specialInstructions.trim(),
        },
        deliveryCharge: Number(formData.deliveryCharge) || 500,
        codAmount: Number(formData.codAmount) || 0,
      };

      if (orderToEdit) {
        await api.put(`/orders/${orderToEdit._id}`, payload);
      } else {
        await api.post('/orders', payload);
      }

      onSuccess();
    } catch (err) {
      console.error('Order submission error:', err);
      setError(err.response?.data?.message || 'Failed to post parcel order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={orderToEdit ? `Edit Order #${orderToEdit.trackingId}` : 'Post New Parcel'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Sender Auto-Link Badge */}
        {!isAdmin ? (
          <div className="p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400">Sender / Account:</span>{' '}
              <strong className="text-white">{user?.name}</strong>{' '}
              <span className="text-slate-400">({user?.phone})</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Auto-Linked
            </span>
          </div>
        ) : (
          !orderToEdit && (
            <div className="p-3 bg-indigo-950/20 border border-indigo-500/30 rounded-xl">
              <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-300 mb-1">
                Select Customer Account *
              </label>
              <select
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                disabled={loadingUsers}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              >
                <option value="">-- Choose Customer --</option>
                {usersList.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} {u.company ? `(${u.company})` : ''} - {u.email}
                  </option>
                ))}
              </select>
            </div>
          )
        )}

        {/* Receiver Name & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Receiver Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                name="receiverName"
                value={formData.receiverName}
                onChange={handleChange}
                placeholder="Receiver name (e.g. Ahmed Khan)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Receiver Phone *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                name="receiverPhone"
                value={formData.receiverPhone}
                onChange={handleChange}
                placeholder="0300-1234567"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Destination Address & City */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Delivery Address *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleChange}
                placeholder="Complete street address / shop / house #"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              City
            </label>
            <input
              type="text"
              name="receiverCity"
              value={formData.receiverCity}
              onChange={handleChange}
              placeholder="e.g. Lahore / Karachi"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Parcel Details / Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Parcel Details / What is inside? *
          </label>
          <div className="relative">
            <Package className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g. 2 pair shoes, Mobile charger, Garment sample packet"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
        </div>

        {/* Delivery Charges */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Delivery Charge (PKR)
          </label>
          <div className="relative">
            <DollarSign className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="number"
              min="0"
              name="deliveryCharge"
              value={formData.deliveryCharge}
              onChange={handleChange}
              placeholder="500"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-semibold"
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Standard delivery fee billed to your account ledger.
          </p>
        </div>

        {/* Collapsible Advanced Options Toggle */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>{showAdvanced ? 'Hide Optional Settings' : 'More Options (Weight, COD, Pickup Address)'}</span>
          </button>

          {showAdvanced && (
            <div className="mt-3 p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Weight (KG)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.1"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Cash On Delivery (COD) Amount</label>
                  <input
                    type="number"
                    min="0"
                    name="codAmount"
                    value={formData.codAmount}
                    onChange={handleChange}
                    placeholder="0 if no COD"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Special Pickup Address (if different from profile)</label>
                <input
                  type="text"
                  name="pickupAddress"
                  value={formData.pickupAddress}
                  onChange={handleChange}
                  placeholder={user?.address || 'Default address'}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Courier Handling Note</label>
                <input
                  type="text"
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleChange}
                  placeholder="e.g. Call before delivery, handle with care"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-indigo-600/30"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{orderToEdit ? 'Save Changes' : 'Post Parcel Order'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
