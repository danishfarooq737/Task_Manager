export const CATEGORIES = [
  { id: 'All', label: 'All Tasks', color: 'from-blue-500 to-indigo-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  { id: 'Work', label: 'Work', color: 'from-blue-600 to-cyan-500', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
  { id: 'Personal', label: 'Personal', color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  { id: 'Study', label: 'Study', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  { id: 'Health', label: 'Health', color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  { id: 'Finance', label: 'Finance', color: 'from-yellow-400 to-amber-600', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  { id: 'Urgent', label: 'Urgent', color: 'from-rose-500 to-red-600', bg: 'bg-rose-500/10', border: 'border-rose-500/30' }
];

export const PRIORITIES = [
  { id: 'Low', label: 'Low', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30' },
  { id: 'Medium', label: 'Medium', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  { id: 'High', label: 'High', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  { id: 'Urgent', label: 'Urgent', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' }
];

export const STATUS_FILTERS = [
  { id: 'All', label: 'All' },
  { id: 'Active', label: 'Active' },
  { id: 'Completed', label: 'Completed' }
];

export const SORT_OPTIONS = [
  { id: 'orderIndex-asc', label: 'Custom Order (Drag & Drop)' },
  { id: 'createdAt-desc', label: 'Newest First' },
  { id: 'createdAt-asc', label: 'Oldest First' },
  { id: 'dueDate-asc', label: 'Due Date (Soonest)' },
  { id: 'priority-desc', label: 'Priority (Highest)' }
];

export const LOCAL_STORAGE_KEY = 'df_taskmanager_tasks_v1';
export const LOCAL_STORAGE_THEME_KEY = 'df_taskmanager_theme';
export const LOCAL_STORAGE_MODE_KEY = 'df_taskmanager_mode';
