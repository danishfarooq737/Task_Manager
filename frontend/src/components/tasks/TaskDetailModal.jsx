import React, { useState, useEffect } from 'react';
import { useTasks } from '../../context/TaskContext';
import { Modal } from '../common/Modal';
import { CATEGORIES, PRIORITIES } from '../../utils/constants';
import { Button } from '../common/Button';
import { Save, Trash2, X } from 'lucide-react';

export const TaskDetailModal = () => {
  const { editingTask, setEditingTask, updateTask, deleteTask } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Work');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Active');
  const [dueDate, setDueDate] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setCategory(editingTask.category || 'Work');
      setPriority(editingTask.priority || 'Medium');
      setStatus(editingTask.status || 'Active');
      setDueDate(
        editingTask.dueDate ? new Date(editingTask.dueDate).toISOString().split('T')[0] : ''
      );
      setTags(editingTask.tags || []);
    }
  }, [editingTask]);

  const handleClose = () => {
    setEditingTask(null);
  };

  const handleAddTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const cleanTag = tagInput.trim().replace(/^#/, '');
      if (cleanTag && !tags.includes(cleanTag) && tags.length < 6) {
        setTags([...tags, cleanTag]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!title.trim() || !editingTask) return;

    updateTask(editingTask.id || editingTask._id, {
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      status,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      tags
    });

    handleClose();
  };

  const handleDelete = () => {
    if (!editingTask) return;
    deleteTask(editingTask.id || editingTask._id);
    handleClose();
  };

  return (
    <Modal isOpen={!!editingTask} onClose={handleClose} title="Edit Task Details">
      <form onSubmit={handleSave} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Task Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Description / Acceptance Criteria
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add detailed task notes..."
            className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>

        {/* Category & Priority Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              {CATEGORIES.filter((c) => c.id !== 'All').map((c) => (
                <option key={c.id} value={c.id} className="bg-[#111622] text-slate-200">
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              {PRIORITIES.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#111622] text-slate-200">
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="Active" className="bg-[#111622] text-slate-200">Active</option>
              <option value="Completed" className="bg-[#111622] text-slate-200">Completed</option>
            </select>
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Tags
          </label>
          <div className="flex flex-wrap items-center gap-2 p-2.5 bg-black/20 border border-white/5 rounded-xl">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {tags.length < 6 && (
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type tag & press enter..."
                className="bg-transparent border-none text-xs text-slate-200 placeholder-slate-500 focus:outline-none px-1"
              />
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-6">
          <Button type="button" variant="danger" size="sm" onClick={handleDelete} icon={Trash2}>
            Delete Task
          </Button>

          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" icon={Save}>
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
