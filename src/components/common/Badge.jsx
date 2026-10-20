import React from 'react';

export const StatusBadge = ({ status }) => {
  const styles = {
    Pending: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    Confirmed: 'bg-sky-500/15 text-sky-400 border border-sky-500/30',
    'In Transit': 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    'Completion Requested': 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-500/20',
    Delivered: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    Cancelled: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
    active: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    inactive: 'bg-zinc-500/15 text-zinc-400 border border-zinc-500/30',
    admin: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
    user: 'bg-slate-500/15 text-slate-300 border border-slate-500/30',
  };

  const dotColors = {
    Pending: 'bg-amber-400',
    Confirmed: 'bg-sky-400',
    'In Transit': 'bg-blue-400 animate-pulse',
    'Completion Requested': 'bg-purple-400 animate-ping',
    Delivered: 'bg-emerald-400',
    Cancelled: 'bg-rose-400',
    active: 'bg-emerald-400',
    inactive: 'bg-zinc-400',
    admin: 'bg-purple-400',
    user: 'bg-slate-400',
  };

  const displayLabels = {
    'Completion Requested': 'Awaiting Verification',
    Delivered: 'Completed',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide ${
        styles[status] || 'bg-slate-800 text-slate-300 border border-slate-700'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[status] || 'bg-slate-400'}`} />
      {displayLabels[status] || status}
    </span>
  );
};
