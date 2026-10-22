import React from 'react';

export const StatusBadge = ({ status }) => {
  const styles = {
    Pending: 'bg-amber-50 text-amber-800 border border-amber-200',
    Confirmed: 'bg-sky-50 text-sky-800 border border-sky-200',
    'In Transit': 'bg-blue-50 text-blue-800 border border-blue-200',
    'Completion Requested': 'bg-purple-50 text-purple-800 border border-purple-200 shadow-xs',
    Delivered: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    Cancelled: 'bg-rose-50 text-rose-800 border border-rose-200',
    active: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    inactive: 'bg-slate-100 text-slate-600 border border-slate-200',
    admin: 'bg-purple-50 text-purple-800 border border-purple-200',
    user: 'bg-slate-100 text-slate-700 border border-slate-200',
  };

  const dotColors = {
    Pending: 'bg-amber-500',
    Confirmed: 'bg-sky-500',
    'In Transit': 'bg-blue-500 animate-pulse',
    'Completion Requested': 'bg-purple-500 animate-ping',
    Delivered: 'bg-emerald-500',
    Cancelled: 'bg-rose-500',
    active: 'bg-emerald-500',
    inactive: 'bg-slate-400',
    admin: 'bg-purple-500',
    user: 'bg-slate-400',
  };

  const displayLabels = {
    'Completion Requested': 'Awaiting Verification',
    Delivered: 'Completed',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${
        styles[status] || 'bg-slate-100 text-slate-700 border border-slate-200'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[status] || 'bg-slate-400'}`} />
      {displayLabels[status] || status}
    </span>
  );
};
