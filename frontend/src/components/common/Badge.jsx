import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'sm', className = '' }) => {
  const variants = {
    Work: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    Personal: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    Study: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    Health: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Finance: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    Urgent: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    General: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    Active: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    Completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Low: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    Medium: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    High: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  const selectedVariant = variants[variant] || 'bg-white/5 text-slate-300 border-white/10';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${selectedVariant} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};
