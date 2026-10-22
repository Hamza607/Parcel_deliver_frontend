import React from 'react';

export const StatCard = ({ title, value, icon: Icon, color = 'indigo', subtitle, trend }) => {
  const colorMap = {
    indigo: {
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      text: 'text-blue-600',
    },
    emerald: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      text: 'text-emerald-600',
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      text: 'text-amber-600',
    },
    rose: {
      bg: 'bg-rose-50',
      border: 'border-rose-100',
      text: 'text-rose-600',
    },
    blue: {
      bg: 'bg-sky-50',
      border: 'border-sky-100',
      text: 'text-sky-600',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      text: 'text-purple-600',
    },
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-slate-300"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 font-['Outfit']">
            {value}
          </h3>
          {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${scheme.bg} ${scheme.border} border`}>
          <Icon className={`w-5 h-5 ${scheme.text}`} />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center text-xs text-slate-500">
          <span className="text-emerald-600 font-semibold mr-1.5">{trend}</span>
          <span>vs last period</span>
        </div>
      )}
    </div>
  );
};
