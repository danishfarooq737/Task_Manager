import React from 'react';
import { motion } from 'framer-motion';
import { Check, Calendar, ArrowUp, ArrowDown, Edit3, Trash2, Clock, AlertCircle } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { Badge } from '../common/Badge';
import { formatDate, formatRelativeTime, isOverdue, isDueSoon } from '../../utils/dateUtils';

export const TaskItem = ({ task, index, totalCount }) => {
  const { toggleTaskStatus, deleteTask, setEditingTask, moveTask } = useTasks();

  const isCompleted = task.status === 'Completed';
  const taskOverdue = isOverdue(task.dueDate, task.status);
  const taskDueSoon = isDueSoon(task.dueDate, task.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      whileHover={{ y: -2 }}
      className={`group relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl glass-card border transition-all duration-300 gap-3 ${
        isCompleted
          ? 'bg-[#111622]/40 border-white/5 opacity-70 hover:opacity-100'
          : taskOverdue
          ? 'border-rose-500/30 hover:border-rose-500/50 bg-rose-500/5'
          : 'border-white/10 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10'
      }`}
    >
      {/* Left: Interactive Checkbox & Details */}
      <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
        {/* Animated Custom Checkbox */}
        <motion.button
          type="button"
          onClick={() => toggleTaskStatus(task.id || task._id)}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          className={`mt-0.5 sm:mt-0 w-6 h-6 rounded-lg flex items-center justify-center border transition-all duration-300 cursor-pointer shrink-0 ${
            isCompleted
              ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 border-emerald-400 text-white shadow-md shadow-emerald-500/30'
              : 'border-white/20 hover:border-blue-400 bg-white/5 text-transparent'
          }`}
          aria-label={isCompleted ? 'Mark active' : 'Mark completed'}
        >
          <motion.div
            initial={false}
            animate={{ scale: isCompleted ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </motion.div>
        </motion.button>

        {/* Task Info Body */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h4
              onClick={() => toggleTaskStatus(task.id || task._id)}
              className={`text-sm sm:text-base font-semibold transition-all duration-300 cursor-pointer truncate max-w-full ${
                isCompleted
                  ? 'line-through text-slate-500'
                  : 'text-slate-100 group-hover:text-white'
              }`}
            >
              {task.title}
            </h4>
          </div>

          {/* Description snippet */}
          {task.description && (
            <p className="text-xs text-slate-400 line-clamp-1 mb-2 font-normal">
              {task.description}
            </p>
          )}

          {/* Metadata Badges (Category, Priority, Due Date, Tags) */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={task.category}>{task.category}</Badge>
            <Badge variant={task.priority} size="xs">
              {task.priority} Priority
            </Badge>

            {/* Due Date Indicator */}
            {task.dueDate && (
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                  isCompleted
                    ? 'text-slate-500 border-white/5 bg-white/5'
                    : taskOverdue
                    ? 'text-rose-400 border-rose-500/30 bg-rose-500/10'
                    : taskDueSoon
                    ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
                    : 'text-slate-400 border-white/10 bg-white/5'
                }`}
              >
                {taskOverdue ? (
                  <AlertCircle className="w-3 h-3 text-rose-400" />
                ) : (
                  <Calendar className="w-3 h-3" />
                )}
                <span>{formatDate(task.dueDate)}</span>
                <span className="text-[10px] opacity-75 font-mono">
                  ({formatRelativeTime(task.dueDate)})
                </span>
              </span>
            )}

            {/* Tags */}
            {Array.isArray(task.tags) &&
              task.tags.map((t) => (
                <span key={t} className="text-[10px] text-slate-400 font-mono">
                  #{t}
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* Right: Quick Action Controls */}
      <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5 w-full sm:w-auto justify-end">
        {/* Reordering Controls (Move Up / Down) */}
        <div className="flex items-center rounded-lg bg-white/5 border border-white/5 p-0.5">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => moveTask(index, 'up')}
            className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded hover:bg-white/10 transition-colors"
            title="Move task up"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={index === totalCount - 1}
            onClick={() => moveTask(index, 'down')}
            className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded hover:bg-white/10 transition-colors"
            title="Move task down"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Edit Button */}
        <button
          type="button"
          onClick={() => setEditingTask(task)}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition-colors"
          title="Edit task"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>

        {/* Delete Button */}
        <button
          type="button"
          onClick={() => deleteTask(task.id || task._id)}
          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 transition-colors"
          title="Delete task"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};
