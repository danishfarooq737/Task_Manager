import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, Tag, ChevronDown, Flag, AlertCircle } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { CATEGORIES, PRIORITIES } from '../../utils/constants';
import { Button } from '../common/Button';

export const TaskInputBar = () => {
  const { addTask } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Work');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Double-click & idempotency guard

  const handleAddTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const cleanTag = tagInput.trim().replace(/^#/, '');
      if (cleanTag && !tags.includes(cleanTag) && tags.length < 5) {
        setTags([...tags, cleanTag]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    // Immediately disable submit button to eliminate double-clicks
    setIsSubmitting(true);

    try {
      await addTask({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        tags
      });

      // Reset form
      setTitle('');
      setDescription('');
      setDueDate('');
      setTags([]);
      setTagInput('');
      setIsExpanded(false);
    } finally {
      // Re-enable submit button with debounce protection
      setTimeout(() => {
        setIsSubmitting(false);
      }, 400);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      layout
      className="w-full mb-8 rounded-2xl glass-card border border-white/10 p-3 sm:p-4 shadow-xl shadow-black/40 transition-all duration-300 focus-within:border-blue-500/50 focus-within:shadow-blue-500/10"
    >
      {/* Primary Input Line */}
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="Add a new task (e.g. Deploy Helm chart to AWS or Study Raft Protocol)..."
            className="w-full bg-transparent border-none text-slate-100 placeholder-slate-500 text-sm sm:text-base font-medium focus:outline-none focus:ring-0 px-2 py-1"
          />
        </div>

        {/* Quick Submit Action Button */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={isSubmitting}
          disabled={!title.trim() || isSubmitting}
          icon={Plus}
        >
          <span className="hidden sm:inline">Add Task</span>
        </Button>
      </div>

      {/* Expandable Advanced Options (Categories, Priorities, Due Dates, Description) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden pt-4 mt-3 border-t border-white/5 space-y-3"
          >
            {/* Description Textarea */}
            <div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add optional notes, acceptance criteria, or links..."
                rows={2}
                className="w-full bg-black/20 rounded-xl border border-white/5 text-slate-200 placeholder-slate-500 text-xs sm:text-sm p-3 focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/30 resize-none"
              />
            </div>

            {/* Selectors Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Category Selector */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'All').map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-[#111622] text-slate-200">
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Priority Selector */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Priority
                </label>
                <div className="relative">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p.id} value={p.id} className="bg-[#111622] text-slate-200">
                        {p.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Due Date Picker */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Due Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Tags Input */}
            <div className="pt-1">
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Tags (Press Enter or comma)
              </label>
              <div className="flex flex-wrap items-center gap-2 p-2 bg-black/20 border border-white/5 rounded-xl">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-white ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {tags.length < 5 && (
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder={tags.length === 0 ? 'Type tag and press enter...' : 'Add another...'}
                    className="bg-transparent border-none text-xs text-slate-200 placeholder-slate-500 focus:outline-none px-1 py-0.5"
                  />
                )}
              </div>
            </div>

            {/* Collapse action bar */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Enter creates task immediately
              </span>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                Collapse details
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
};
