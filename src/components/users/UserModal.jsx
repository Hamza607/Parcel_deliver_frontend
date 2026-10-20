import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import api from '../../api/axios';
import { Loader2, AlertCircle, User, Mail, Lock, Phone, Building, MapPin } from 'lucide-react';

export const UserModal = ({ isOpen, onClose, onSuccess, userToEdit = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    company: '',
    address: '',
    role: 'user',
    status: 'active',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        name: userToEdit.name || '',
        email: userToEdit.email || '',
        password: '',
        phone: userToEdit.phone || '',
        company: userToEdit.company || '',
        address: userToEdit.address || '',
        role: userToEdit.role || 'user',
        status: userToEdit.status || 'active',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        company: '',
        address: '',
        role: 'user',
        status: 'active',
      });
    }
    setError('');
  }, [userToEdit, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.phone) {
      setError('Please provide Name, Email, and Phone number');
      return;
    }

    if (!userToEdit && (!formData.password || formData.password.length < 6)) {
      setError('Initial password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      if (userToEdit) {
        await api.put(`/users/${userToEdit.id || userToEdit._id}`, {
          name: formData.name,
          phone: formData.phone,
          company: formData.company,
          address: formData.address,
          role: formData.role,
          status: formData.status,
        });
      } else {
        await api.post('/users', formData);
      }
      onSuccess();
    } catch (err) {
      console.error('User save error:', err);
      setError(err.response?.data?.message || 'Failed to save user account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={userToEdit ? `Edit User - ${userToEdit.name}` : 'Provision New User Account'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Kamran Khan"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={Boolean(userToEdit)}
                placeholder="kamran@company.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                required
              />
            </div>
          </div>
        </div>

        {!userToEdit && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Initial Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Temporary login password (min 6 chars)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Share these credentials securely with the customer.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0300-1234567"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Company / Business Name
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Fast Logistics Traders"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Business / Shop Address
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Shop 12, Commercial Market, Lahore"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Account Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="user">User / Client</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Account Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="active">Active (Can Login)</option>
              <option value="inactive">Inactive / Deactivated</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{userToEdit ? 'Save Changes' : 'Create User Account'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
