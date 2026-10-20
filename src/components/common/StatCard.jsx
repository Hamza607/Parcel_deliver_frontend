import React from 'react';

export const StatCard = ({ title, value, icon: Icon, color = 'indigo', subtitle, trend }) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      text: 'text-indigo-400',
      glow: 'group-hover:border-indigo-500/40',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      glow: 'group-hover:border-emerald-500/40',
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      text: 'text-amber-400',
      glow: 'group-hover:border-amber-500/40',
    },
    rose: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      text: 'text-rose-400',
      glow: 'group-hover:border-rose-500/40',
    },
    blue: {
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/20',
      text: 'text-sky-400',
      glow: 'group-hover:border-sky-500/40',
    },
    purple: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      text: 'text-purple-400',
      glow: 'group-hover:border-purple-500/40',
    },
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-slate-800/80 p-5 transition-all duration-300 hover:shadow-xl hover:shadow-black/40 ${scheme.glow}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-white font-['Outfit']">
            {value}
          </h3>
          {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${scheme.bg} ${scheme.border} border`}>
          <Icon className={`w-6 h-6 ${scheme.text}`} />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center text-xs text-slate-400">
          <span className="text-emerald-400 font-medium mr-1.5">{trend}</span>
          <span>vs last period</span>
        </div>
      )}
    </div>
  );
};
