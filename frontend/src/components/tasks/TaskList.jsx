import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, CheckCircle2, Sparkles, Filter } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { TaskItem } from './TaskItem';

export const TaskList = () => {
  const { filteredTasks, tasks, loading, selectedStatus, selectedCategory, searchQuery, setSelectedCategory, setSelectedStatus, setSearchQuery } = useTasks();

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="w-full h-20 rounded-2xl bg-white/5 border border-white/5 animate-pulse"
          />
        ))}
      </div>
    );
  }

  // Empty State
  if (filteredTasks.length === 0) {
    const isFiltered = selectedStatus !== 'All' || selectedCategory !== 'All' || searchQuery.trim() !== '';

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full py-16 px-6 rounded-3xl glass-card border border-white/10 text-center flex flex-col items-center justify-center my-6"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 shadow-lg shadow-blue-500/10">
          {isFiltered ? <Filter className="w-8 h-8" /> : <ClipboardList className="w-8 h-8" />}
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
          {isFiltered ? 'No matching tasks found' : 'No tasks on your roadmap yet'}
        </h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
          {isFiltered
            ? 'Try adjusting your search criteria, category filters, or status toggles to reveal your tasks.'
            : 'Capture your thoughts, sprint goals, or study milestones using the input bar above.'}
        </p>

        {isFiltered && (
          <button
            onClick={() => {
              setSelectedStatus('All');
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-semibold transition-all duration-200"
          >
            Reset All Filters
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <div className="w-full space-y-3">
      <AnimatePresence mode="popLayout">
        {filteredTasks.map((task, index) => (
          <TaskItem
            key={task.id || task._id || `task_${index}`}
            task={task}
            index={index}
            totalCount={filteredTasks.length}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
