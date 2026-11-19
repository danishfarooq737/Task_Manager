import React from 'react';
import { motion } from 'framer-motion';
import { Search, X, SlidersHorizontal, Trash2 } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { CATEGORIES, STATUS_FILTERS, SORT_OPTIONS } from '../../utils/constants';

export const TaskFilterBar = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    clearCompleted,
    productivityStats
  } = useTasks();

  return (
    <div className="w-full mb-6 space-y-4">
      {/* Top Search & Controls Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Quick Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by title, note, or #tag..."
            className="w-full bg-[#111622] border border-white/10 rounded-xl pl-10 pr-9 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Dropdown & Clear Completed */}
        <div className="flex items-center gap-2">
          {/* Sort Selector */}
          <div className="relative flex items-center">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#111622] border border-white/10 rounded-xl pl-8 pr-7 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id} className="bg-[#111622] text-slate-200">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Completed Action */}
          {productivityStats.completed > 0 && (
            <button
              onClick={clearCompleted}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-all duration-200 whitespace-nowrap"
              title="Delete all completed tasks from storage"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Clear Completed</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs: Status Segmented Controls & Category Badges */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Status Toggle Tabs (All | Active | Completed) */}
        <div className="flex items-center p-1 rounded-xl bg-[#111622] border border-white/10 w-fit">
          {STATUS_FILTERS.map((filter) => {
            const isActive = selectedStatus === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setSelectedStatus(filter.id)}
                className={`relative px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="statusPill"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md shadow-blue-500/30"
                    transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {filter.label}
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                      isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-400'
                    }`}
                  >
                    {filter.id === 'All'
                      ? productivityStats.total
                      : filter.id === 'Active'
                      ? productivityStats.active
                      : productivityStats.completed}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/25'
                    : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/15 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
