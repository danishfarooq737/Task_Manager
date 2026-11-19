/**
 * Date Utility Functions for Task Management
 */

export const formatDate = (dateString) => {
  if (!dateString) return null;
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return null;

  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  });
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `${Math.abs(diffDays)}d overdue`;
  }
  if (diffDays === 0) {
    return 'Due today';
  }
  if (diffDays === 1) {
    return 'Due tomorrow';
  }
  return `Due in ${diffDays}d`;
};

export const isOverdue = (dateString, status) => {
  if (!dateString || status === 'Completed') return false;
  const date = new Date(dateString);
  const now = new Date();
  return date < now;
};

export const isDueSoon = (dateString, status) => {
  if (!dateString || status === 'Completed') return false;
  const date = new Date(dateString);
  const now = new Date();
  const diffHours = (date - now) / (1000 * 60 * 60);
  return diffHours >= 0 && diffHours <= 48; // within next 48 hours
};
