import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertTriangle, Layers, TrendingUp, Sparkles } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export const TaskStatsDashboard = () => {
  const { productivityStats } = useTasks();
  const { total, active, completed, overdue, completionRate, categoryCounts } = productivityStats;

  const cards = [
    {
      label: 'Completion Rate',
      value: `${completionRate}%`,
      subtitle: `${completed} of ${total} tasks finished`,
      icon: TrendingUp,
      color: 'from-blue-500 to-indigo-600',
      textColor: 'text-blue-400',
      border: 'border-blue-500/30'
    },
    {
      label: 'Active Tasks',
      value: active,
      subtitle: 'In progress or pending',
      icon: Clock,
      color: 'from-cyan-500 to-blue-500',
      textColor: 'text-cyan-400',
      border: 'border-cyan-500/30'
    },
    {
      label: 'Completed Tasks',
      value: completed,
      subtitle: 'Successfully resolved',
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-500',
      textColor: 'text-emerald-400',
      border: 'border-emerald-500/30'
    },
    {
      label: 'Overdue Warnings',
      value: overdue,
      subtitle: overdue > 0 ? 'Urgent attention required' : 'All deadlines on track',
      icon: AlertTriangle,
      color: 'from-rose-500 to-amber-500',
      textColor: overdue > 0 ? 'text-rose-400' : 'text-slate-400',
      border: overdue > 0 ? 'border-rose-500/40 bg-rose-500/5' : 'border-slate-500/20'
    }
  ];

  return (
    <div className="w-full mb-8">
      {/* Top Productivity Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.35, ease: 'easeOut' }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className={`relative overflow-hidden p-4 sm:p-5 rounded-2xl glass-card border ${card.border}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {card.label}
                </span>
                <div className={`p-2 rounded-xl bg-white/5 ${card.textColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-1">
                <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${card.textColor}`}>
                  {card.value}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium truncate">{card.subtitle}</p>

              {/* Progress bar line for Completion Rate card */}
              {card.label === 'Completion Rate' && (
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${completionRate}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Category Pills Strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-[#111622]/60 border border-white/5"
      >
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold px-2 py-1">
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span>Category Distribution:</span>
        </div>
        {Object.entries(categoryCounts).map(([cat, count]) => (
          <div
            key={cat}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-xl bg-white/5 border border-white/5 text-slate-300"
          >
            <span>{cat}</span>
            <span className="px-1.5 py-0.2 rounded-md bg-white/10 font-mono font-bold text-[10px] text-blue-400">
              {count}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
