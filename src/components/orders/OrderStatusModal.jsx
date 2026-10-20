import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import api from '../../api/axios';
import { Loader2, AlertCircle } from 'lucide-react';

export const OrderStatusModal = ({ isOpen, onClose, onSuccess, order }) => {
  const [status, setStatus] = useState(order?.status || 'Pending');
  const [statusNote, setStatusNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!order) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await api.put(`/orders/${order._id}`, {
        status,
        statusNote: statusNote.trim() || `Status updated to ${status}`,
      });
      onSuccess();
    } catch (err) {
      console.error('Update status error:', err);
      setError(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Update Status - ${order.trackingId}`} maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Select New Delivery Status
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'Pending', label: 'Pending (Request)' },
              { id: 'In Transit', label: 'In Transit (Dispatched)' },
              { id: 'Completion Requested', label: 'Completion Requested' },
              { id: 'Delivered', label: 'Delivered (Completed)' },
              { id: 'Cancelled', label: 'Cancelled (Rejected)' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setStatus(st.id)}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                  status === st.id
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm shadow-indigo-500/20'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Status Note / Courier Remark (Optional)
          </label>
          <textarea
            rows={3}
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            placeholder="e.g. Arrived at Central Sort facility, Out for delivery with rider"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors disabled:opacity-50"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Update Status</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
