import { api } from './api';
import { LOCAL_STORAGE_KEY } from '../utils/constants';
import { saveToLocalStorage, loadFromLocalStorage } from '../hooks/useLocalStorage';

// Realistic initial tasks for instant presentation upon first visit
const INITIAL_DEMO_TASKS = [
  {
    id: 'task_demo_1',
    title: 'Deploy Kubernetes Helm Chart to Production Cluster',
    description: 'Verify canary rollout metrics and audit automated self-healing playbooks.',
    category: 'Work',
    priority: 'Urgent',
    status: 'Active',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: null,
    orderIndex: 0,
    tags: ['DevOps', 'Kubernetes', 'K8s']
  },
  {
    title: 'System Architecture & SOLID Review for Sprint 4',
    id: 'task_demo_2',
    description: 'Ensure modularity, single responsibility, and zero-leakage error handling.',
    category: 'Work',
    priority: 'High',
    status: 'Completed',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date().toISOString(),
    orderIndex: 1,
    tags: ['Architecture', 'Agile']
  },
  {
    id: 'task_demo_3',
    title: 'Study Distributed Consensus & Raft Protocol',
    description: 'Read the original paper and summarize leader election log replication steps.',
    category: 'Study',
    priority: 'Medium',
    status: 'Active',
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: null,
    orderIndex: 2,
    tags: ['DistributedSystems', 'Raft']
  },
  {
    id: 'task_demo_4',
    title: 'Audit AWS CloudWatch & APM Ingestion Invoices',
    description: 'Identify overprovisioned EC2 node pools to save 25% on monthly infrastructure spend.',
    category: 'Finance',
    priority: 'High',
    status: 'Active',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: null,
    orderIndex: 3,
    tags: ['FinOps', 'AWS']
  },
  {
    id: 'task_demo_5',
    title: '30-minute HIIT Cardio Session & Recovery Hydration',
    description: 'Maintain mental clarity and peak physical stamina during delivery sprints.',
    category: 'Health',
    priority: 'Medium',
    status: 'Completed',
    dueDate: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    orderIndex: 4,
    tags: ['Fitness', 'Cardio']
  }
];

export const TaskService = {
  /**
   * Fetch all tasks (Hybrid: tries backend API, falls back to browser localStorage)
   */
  async getAllTasks() {
    try {
      const response = await api.get('/tasks', { retries: 1, timeout: 3000 });
      if (response && response.success && Array.isArray(response.data)) {
        // Cache to localStorage for offline access
        saveToLocalStorage(LOCAL_STORAGE_KEY, response.data);
        return { tasks: response.data, source: 'cloud' };
      }
    } catch {
      // Backend is unavailable or offline: gracefully use localStorage
    }

    let localTasks = loadFromLocalStorage(LOCAL_STORAGE_KEY, null);
    if (!localTasks || localTasks.length === 0) {
      localTasks = INITIAL_DEMO_TASKS;
      saveToLocalStorage(LOCAL_STORAGE_KEY, localTasks);
    }

    return { tasks: localTasks, source: 'local' };
  },

  /**
   * Create Task
   */
  async createTask(taskData) {
    const newTask = {
      id: 'local_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      ...taskData,
      status: taskData.status || 'Active',
      completedAt: taskData.status === 'Completed' ? new Date().toISOString() : null,
      createdAt: new Date().toISOString(),
      orderIndex: 0
    };

    // Attempt cloud sync in background if online
    try {
      const response = await api.post('/tasks', taskData, { retries: 1, timeout: 4000 });
      if (response && response.success && response.data?.task) {
        return response.data.task;
      }
    } catch {
      // Local fallback handled by context
    }

    return newTask;
  },

  /**
   * Update Task
   */
  async updateTask(id, updateData) {
    try {
      const response = await api.patch(`/tasks/${id}`, updateData, { retries: 1, timeout: 4000 });
      if (response && response.success && response.data?.task) {
        return response.data.task;
      }
    } catch {
      // Handled locally
    }
    return { id, ...updateData };
  },

  /**
   * Toggle Task Status
   */
  async toggleTaskStatus(id) {
    try {
      const response = await api.patch(`/tasks/${id}/toggle`, {}, { retries: 1, timeout: 4000 });
      if (response && response.success && response.data?.task) {
        return response.data.task;
      }
    } catch {
      // Handled locally
    }
    return null;
  },

  /**
   * Delete Task
   */
  async deleteTask(id) {
    try {
      await api.delete(`/tasks/${id}`, { retries: 1, timeout: 4000 });
    } catch {
      // Handled locally
    }
    return id;
  },

  /**
   * Clear all completed tasks
   */
  async clearCompleted() {
    try {
      await api.delete('/tasks/completed', { retries: 1, timeout: 4000 });
    } catch {
      // Handled locally
    }
  },

  /**
   * Reorder Tasks (Drag & Drop)
   */
  async reorderTasks(taskIds) {
    try {
      await api.put('/tasks/reorder', { taskIds }, { retries: 1, timeout: 3000 });
    } catch {
      // Handled locally
    }
  }
};
