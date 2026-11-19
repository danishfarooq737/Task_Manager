import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { TaskService } from '../services/taskService';
import { LOCAL_STORAGE_KEY } from '../utils/constants';
import { saveToLocalStorage, loadFromLocalStorage } from '../hooks/useLocalStorage';
import { sanitizeInput } from '../utils/sanitize';

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncSource, setSyncSource] = useState('local'); // 'cloud' | 'local'

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All'); // 'All' | 'Active' | 'Completed'
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('orderIndex-asc');

  // Active task for edit modal
  const [editingTask, setEditingTask] = useState(null);

  // Global Toasts
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Confetti burst for task completion celebrations
  const triggerCelebration = useCallback(() => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899']
      });
    } catch {
      // Ignore if confetti not supported
    }
  }, []);

  // Load initial tasks on mount
  useEffect(() => {
    let isMounted = true;
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const { tasks: initialTasks, source } = await TaskService.getAllTasks();
        if (isMounted) {
          setTasks(initialTasks);
          setSyncSource(source);
        }
      } catch (err) {
        console.error('Failed loading tasks:', err);
        const fallback = loadFromLocalStorage(LOCAL_STORAGE_KEY, []);
        if (isMounted) {
          setTasks(fallback);
          setSyncSource('local');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchInitialData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Helper to persist state to localStorage automatically on state changes
  const updateTasksState = useCallback((updater) => {
    setTasks((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveToLocalStorage(LOCAL_STORAGE_KEY, next);
      return next;
    });
  }, []);

  /**
   * Complete Task CRUD Implementations
   */

  // 1. Create Task
  const addTask = useCallback(
    async (taskData) => {
      const sanitized = {
        title: sanitizeInput(taskData.title),
        description: sanitizeInput(taskData.description || ''),
        category: taskData.category || 'Work',
        priority: taskData.priority || 'Medium',
        dueDate: taskData.dueDate || null,
        tags: Array.isArray(taskData.tags) ? taskData.tags.map((t) => sanitizeInput(t)) : []
      };

      if (!sanitized.title) {
        showToast('Task title cannot be empty', 'error');
        return null;
      }

      // Optimistic state update
      const tempId = 'task_' + Date.now();
      const localNewTask = {
        id: tempId,
        ...sanitized,
        status: 'Active',
        completedAt: null,
        createdAt: new Date().toISOString(),
        orderIndex: 0
      };

      updateTasksState((prev) => [localNewTask, ...prev.map((t, idx) => ({ ...t, orderIndex: idx + 1 }))]);
      showToast('Task created successfully', 'success');

      // Async cloud sync
      try {
        const serverTask = await TaskService.createTask(sanitized);
        if (serverTask && serverTask.id) {
          updateTasksState((prev) =>
            prev.map((t) => (t.id === tempId ? { ...serverTask, id: serverTask.id || serverTask._id } : t))
          );
        }
      } catch (err) {
        console.warn('Task created locally (offline mode):', err.message);
      }

      return localNewTask;
    },
    [showToast, updateTasksState]
  );

  // 2. Update Task
  const updateTask = useCallback(
    async (id, updates) => {
      const sanitizedUpdates = { ...updates };
      if (sanitizedUpdates.title) {
        sanitizedUpdates.title = sanitizeInput(sanitizedUpdates.title);
      }
      if (sanitizedUpdates.description) {
        sanitizedUpdates.description = sanitizeInput(sanitizedUpdates.description);
      }

      updateTasksState((prev) =>
        prev.map((t) => (t.id === id || t._id === id ? { ...t, ...sanitizedUpdates } : t))
      );
      showToast('Task updated', 'info');

      try {
        await TaskService.updateTask(id, sanitizedUpdates);
      } catch (err) {
        console.warn('Task updated locally:', err.message);
      }
    },
    [showToast, updateTasksState]
  );

  // 3. Toggle Task Completion
  const toggleTaskStatus = useCallback(
    async (id) => {
      let nowCompleted = false;

      updateTasksState((prev) =>
        prev.map((t) => {
          if (t.id === id || t._id === id) {
            const nextStatus = t.status === 'Active' ? 'Completed' : 'Active';
            nowCompleted = nextStatus === 'Completed';
            return {
              ...t,
              status: nextStatus,
              completedAt: nowCompleted ? new Date().toISOString() : null
            };
          }
          return t;
        })
      );

      if (nowCompleted) {
        triggerCelebration();
        showToast('Awesome! Task marked as completed 🎉', 'success');
      } else {
        showToast('Task moved back to Active', 'info');
      }

      try {
        await TaskService.toggleTaskStatus(id);
      } catch (err) {
        console.warn('Status toggled locally:', err.message);
      }
    },
    [showToast, triggerCelebration, updateTasksState]
  );

  // 4. Delete Task
  const deleteTask = useCallback(
    async (id) => {
      updateTasksState((prev) => prev.filter((t) => t.id !== id && t._id !== id));
      showToast('Task deleted', 'info');

      try {
        await TaskService.deleteTask(id);
      } catch (err) {
        console.warn('Task deleted locally:', err.message);
      }
    },
    [showToast, updateTasksState]
  );

  // 5. Clear All Completed Tasks
  const clearCompleted = useCallback(async () => {
    const completedCount = tasks.filter((t) => t.status === 'Completed').length;
    if (completedCount === 0) {
      showToast('No completed tasks to clear', 'info');
      return;
    }

    updateTasksState((prev) => prev.filter((t) => t.status !== 'Completed'));
    showToast(`Cleared ${completedCount} completed task${completedCount > 1 ? 's' : ''}`, 'success');

    try {
      await TaskService.clearCompleted();
    } catch (err) {
      console.warn('Completed tasks cleared locally:', err.message);
    }
  }, [tasks, showToast, updateTasksState]);

  // 6. Reorder Tasks
  const reorderTasks = useCallback(
    async (reorderedTasks) => {
      const indexed = reorderedTasks.map((t, idx) => ({ ...t, orderIndex: idx }));
      updateTasksState(indexed);

      try {
        const taskIds = indexed.map((t) => t.id || t._id);
        await TaskService.reorderTasks(taskIds);
      } catch (err) {
        console.warn('Reorder saved locally:', err.message);
      }
    },
    [updateTasksState]
  );

  // Move task up or down by 1 position (accessible keyboard / mobile reordering)
  const moveTask = useCallback(
    (index, direction) => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= tasks.length) return;

      const updated = [...tasks];
      const [moved] = updated.splice(index, 1);
      updated.splice(targetIndex, 0, moved);
      reorderTasks(updated);
    },
    [tasks, reorderTasks]
  );

  /**
   * Filtered & Sorted Tasks (Memoized for peak performance)
   */
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // 1. Status Filter
      if (selectedStatus !== 'All' && task.status !== selectedStatus) {
        return false;
      }

      // 2. Category Filter
      if (selectedCategory !== 'All' && task.category !== selectedCategory) {
        return false;
      }

      // 3. Priority Filter
      if (selectedPriority !== 'All' && task.priority !== selectedPriority) {
        return false;
      }

      // 4. Quick Search Filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = task.title?.toLowerCase().includes(query);
        const matchDesc = task.description?.toLowerCase().includes(query);
        const matchTags = Array.isArray(task.tags) && task.tags.some((tag) => tag.toLowerCase().includes(query));
        if (!matchTitle && !matchDesc && !matchTags) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'orderIndex-asc') {
        return (a.orderIndex ?? 0) - (b.orderIndex ?? 0);
      }
      if (sortBy === 'createdAt-desc') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      if (sortBy === 'createdAt-asc') {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
      if (sortBy === 'dueDate-asc') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (sortBy === 'priority-desc') {
        const priorityRank = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
        return (priorityRank[b.priority] || 0) - (priorityRank[a.priority] || 0);
      }
      return 0;
    });
  }, [tasks, selectedStatus, selectedCategory, selectedPriority, searchQuery, sortBy]);

  /**
   * Productivity Metrics Summary (Memoized)
   */
  const productivityStats = useMemo(() => {
    const total = tasks.length;
    let active = 0;
    let completed = 0;
    let overdue = 0;
    const now = new Date();

    const categoryCounts = {
      Work: 0,
      Personal: 0,
      Study: 0,
      Health: 0,
      Finance: 0,
      Urgent: 0
    };

    for (const t of tasks) {
      if (t.status === 'Completed') {
        completed++;
      } else {
        active++;
        if (t.dueDate && new Date(t.dueDate) < now) {
          overdue++;
        }
      }

      if (categoryCounts[t.category] !== undefined) {
        categoryCounts[t.category]++;
      }
    }

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      active,
      completed,
      overdue,
      completionRate,
      categoryCounts
    };
  }, [tasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        loading,
        syncSource,
        setSyncSource,
        selectedCategory,
        setSelectedCategory,
        selectedStatus,
        setSelectedStatus,
        selectedPriority,
        setSelectedPriority,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        editingTask,
        setEditingTask,
        toasts,
        showToast,
        removeToast,
        triggerCelebration,
        addTask,
        updateTask,
        toggleTaskStatus,
        deleteTask,
        clearCompleted,
        reorderTasks,
        moveTask,
        productivityStats
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
