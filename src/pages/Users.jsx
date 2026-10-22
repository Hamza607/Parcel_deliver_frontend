import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { StatusBadge } from '../components/common/Badge';
import { UserModal } from '../components/users/UserModal';
import { ResetPasswordModal } from '../components/users/ResetPasswordModal';
import { PaymentModal } from '../components/payments/PaymentModal';
import {
  Users as UsersIcon,
  Search,
  UserPlus,
  KeyRound,
  Edit2,
  Trash2,
  DollarSign,
  Eye,
  AlertCircle,
  Loader2,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

export const Users = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');

  // Modals state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [userToReset, setUserToReset] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedUserIdForPayment, setSelectedUserIdForPayment] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      let url = '/users?';
      if (statusFilter) url += `status=${statusFilter}&`;
      if (searchTerm) url += `search=${encodeURIComponent(searchTerm)}&`;

      const res = await api.get(url);
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch user accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleDeleteUser = async (userItem) => {
    if (window.confirm(`Are you sure you want to delete user ${userItem.name}? All associated orders will be archived.`)) {
      try {
        const res = await api.delete(`/users/${userItem.id}`);
        if (res.data.success) {
          fetchUsers();
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-['Outfit']">Customer Accounts Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Provision client login accounts, manage profile statuses, and monitor balance ledgers
          </p>
        </div>

        <button
          onClick={() => {
            setUserToEdit(null);
            setIsUserModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Provision New Customer</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl font-medium">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <form onSubmit={handleSearch} className="md:col-span-9 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer name, company, email, phone..."
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

        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">All Account Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive / Deactivated Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5 font-semibold">User & Company</th>
                <th className="px-4 py-3.5 font-semibold">Contact Info</th>
                <th className="px-4 py-3.5 font-semibold">Role & Status</th>
                <th className="px-4 py-3.5 font-semibold">Orders Count</th>
                <th className="px-4 py-3.5 font-semibold">Total Billed</th>
                <th className="px-4 py-3.5 font-semibold">Total Paid</th>
                <th className="px-4 py-3.5 font-semibold">Outstanding Balance</th>
                <th className="px-4 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                    <span>Loading customer accounts...</span>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    No users found matching query.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const hasBalance = (u.outstandingBalance || 0) > 0;
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-slate-900">{u.name}</p>
                        <p className="text-[11px] text-blue-600 font-medium">{u.company || 'Individual Client'}</p>
                      </td>

                      <td className="px-4 py-3.5">
                        <p className="font-medium text-slate-900">{u.email}</p>
                        <p className="text-[11px] text-slate-500">{u.phone}</p>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex flex-col gap-1">
                          <StatusBadge status={u.role} />
                          <StatusBadge status={u.status} />
                        </div>
                      </td>

                      <td className="px-4 py-3.5 font-bold text-slate-900">
                        {u.totalOrders || 0}
                      </td>

                      <td className="px-4 py-3.5 font-semibold text-slate-800">
                        PKR {(u.totalBilled || 0).toLocaleString()}
                      </td>

                      <td className="px-4 py-3.5 font-semibold text-emerald-600">
                        PKR {(u.totalPaid || 0).toLocaleString()}
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`font-bold text-xs px-2.5 py-0.5 rounded-full ${
                            hasBalance
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'text-slate-500'
                          }`}
                        >
                          PKR {(u.outstandingBalance || 0).toLocaleString()}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => navigate(`/users/${u.id}`)}
                            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors"
                            title="View User Ledger & Orders"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedUserIdForPayment(u.id);
                              setIsPaymentModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 transition-colors"
                            title="Record Payment for this User"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              setUserToEdit(u);
                              setIsUserModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors"
                            title="Edit Profile"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              setUserToReset(u);
                              setIsResetPasswordOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-slate-50 hover:bg-amber-50 text-slate-500 hover:text-amber-700 border border-slate-200 transition-colors"
                            title="Reset Password"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSuccess={() => {
          setIsUserModalOpen(false);
          fetchUsers();
        }}
        userToEdit={userToEdit}
      />

      <ResetPasswordModal
        isOpen={isResetPasswordOpen}
        onClose={() => setIsResetPasswordOpen(false)}
        onSuccess={() => {
          setIsResetPasswordOpen(false);
          alert('Password updated successfully');
        }}
        user={userToReset}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={() => {
          setIsPaymentModalOpen(false);
          fetchUsers();
        }}
        preselectedUserId={selectedUserIdForPayment}
      />
    </div>
  );
};
