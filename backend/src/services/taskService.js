const Task = require('../models/Task');
const AppError = require('../utils/appError');
const HTTP_STATUS = require('../constants/httpStatus');

class TaskService {
  /**
   * Create Task
   */
  static async createTask(data, userId = null) {
    // Determine highest orderIndex to place new task at the top/bottom
    const highestOrderTask = await Task.findOne(userId ? { user: userId } : { user: null })
      .sort({ orderIndex: -1 })
      .select('orderIndex');

    const nextOrder = highestOrderTask && typeof highestOrderTask.orderIndex === 'number' ? highestOrderTask.orderIndex + 1 : 0;

    const task = await Task.create({
      ...data,
      user: userId,
      orderIndex: nextOrder,
      completedAt: data.status === 'Completed' ? new Date() : null
    });

    return task;
  }

  /**
   * Get Tasks with Filtering, Searching, and Pagination
   */
  static async getTasks({
    userId = null,
    status,
    category,
    priority,
    search,
    sortBy = 'orderIndex',
    sortOrder = 'asc',
    page = 1,
    limit = 50
  }) {
    const query = { isArchived: false };

    // Support both user-bound tasks and guest/demo tasks
    if (userId) {
      query.$or = [{ user: userId }, { user: null }];
    }

    if (status && ['Active', 'Completed'].includes(status)) {
      query.status = status;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    if (search && search.trim() !== '') {
      const sanitizedSearch = search.trim();
      query.$or = [
        { title: { $regex: sanitizedSearch, $options: 'i' } },
        { description: { $regex: sanitizedSearch, $options: 'i' } },
        { tags: { $in: [new RegExp(sanitizedSearch, 'i')] } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      Task.find(query).sort(sortOptions).skip(skip).limit(limit).lean(),
      Task.countDocuments(query)
    ]);

    return {
      tasks,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get Task By ID
   */
  static async getTaskById(taskId, userId = null) {
    const task = await Task.findById(taskId);
    if (!task || task.isArchived) {
      throw new AppError('Task not found or has been archived.', HTTP_STATUS.NOT_FOUND);
    }

    // Access control: If user-owned, verify ownership
    if (task.user && userId && task.user.toString() !== userId.toString()) {
      throw new AppError('You do not have permission to view this task.', HTTP_STATUS.FORBIDDEN);
    }

    return task;
  }

  /**
   * Update Task
   */
  static async updateTask(taskId, updateData, userId = null) {
    const task = await this.getTaskById(taskId, userId);

    if (updateData.status) {
      if (updateData.status === 'Completed' && task.status !== 'Completed') {
        task.completedAt = new Date();
      } else if (updateData.status === 'Active') {
        task.completedAt = null;
      }
    }

    Object.assign(task, updateData);
    await task.save();
    return task;
  }

  /**
   * Toggle Task Status
   */
  static async toggleTaskStatus(taskId, userId = null) {
    const task = await this.getTaskById(taskId, userId);
    const nextStatus = task.status === 'Active' ? 'Completed' : 'Active';

    task.status = nextStatus;
    task.completedAt = nextStatus === 'Completed' ? new Date() : null;
    await task.save();
    return task;
  }

  /**
   * Delete Task
   */
  static async deleteTask(taskId, userId = null) {
    const task = await this.getTaskById(taskId, userId);
    await task.deleteOne();
    return { id: taskId };
  }

  /**
   * Clear all completed tasks
   */
  static async clearCompletedTasks(userId = null) {
    const query = { status: 'Completed' };
    if (userId) {
      query.user = userId;
    }
    const result = await Task.deleteMany(query);
    return { deletedCount: result.deletedCount };
  }

  /**
   * Reorder Tasks (Bulk Drag & Drop)
   */
  static async reorderTasks(taskIds, userId = null) {
    const bulkOps = taskIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id, ...(userId && { user: userId }) },
        update: { $set: { orderIndex: index } }
      }
    }));

    if (bulkOps.length > 0) {
      await Task.bulkWrite(bulkOps);
    }

    return { reorderedCount: bulkOps.length };
  }

  /**
   * Productivity Metrics & Analytics
   */
  static async getProductivityStats(userId = null) {
    const query = { isArchived: false };
    if (userId) {
      query.$or = [{ user: userId }, { user: null }];
    }

    const now = new Date();
    const tasks = await Task.find(query).select('status category priority dueDate completedAt').lean();

    const total = tasks.length;
    let active = 0;
    let completed = 0;
    let overdue = 0;

    const byCategory = {
      Work: 0,
      Personal: 0,
      Study: 0,
      Health: 0,
      Finance: 0,
      Urgent: 0,
      General: 0
    };

    const byPriority = {
      Low: 0,
      Medium: 0,
      High: 0,
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

      if (byCategory[t.category] !== undefined) {
        byCategory[t.category]++;
      }
      if (byPriority[t.priority] !== undefined) {
        byPriority[t.priority]++;
      }
    }

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      active,
      completed,
      overdue,
      completionRate,
      byCategory,
      byPriority
    };
  }
}

module.exports = TaskService;
