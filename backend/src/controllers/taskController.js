const TaskService = require('../services/taskService');
const ApiResponse = require('../utils/apiResponse');
const HTTP_STATUS = require('../constants/httpStatus');

class TaskController {
  static async createTask(req, res, next) {
    try {
      const userId = req.user ? req.user._id : null;
      const task = await TaskService.createTask(req.body, userId);

      return ApiResponse.success(res, {
        statusCode: HTTP_STATUS.CREATED,
        message: 'Task created successfully.',
        data: { task }
      });
    } catch (err) {
      next(err);
    }
  }

  static async getTasks(req, res, next) {
    try {
      const userId = req.user ? req.user._id : null;
      const { status, category, priority, search, sortBy, sortOrder, page, limit } = req.query;

      const result = await TaskService.getTasks({
        userId,
        status,
        category,
        priority,
        search,
        sortBy,
        sortOrder,
        page,
        limit
      });

      return ApiResponse.success(res, {
        statusCode: HTTP_STATUS.OK,
        message: 'Tasks retrieved successfully.',
        data: result.tasks,
        meta: result.meta
      });
    } catch (err) {
      next(err);
    }
  }

  static async getTaskById(req, res, next) {
    try {
      const userId = req.user ? req.user._id : null;
      const task = await TaskService.getTaskById(req.params.id, userId);

      return ApiResponse.success(res, {
        statusCode: HTTP_STATUS.OK,
        message: 'Task details retrieved.',
        data: { task }
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateTask(req, res, next) {
    try {
      const userId = req.user ? req.user._id : null;
      const task = await TaskService.updateTask(req.params.id, req.body, userId);

      return ApiResponse.success(res, {
        statusCode: HTTP_STATUS.OK,
        message: 'Task updated successfully.',
        data: { task }
      });
    } catch (err) {
      next(err);
    }
  }

  static async toggleTaskStatus(req, res, next) {
    try {
      const userId = req.user ? req.user._id : null;
      const task = await TaskService.toggleTaskStatus(req.params.id, userId);

      return ApiResponse.success(res, {
        statusCode: HTTP_STATUS.OK,
        message: `Task marked as ${task.status}.`,
        data: { task }
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteTask(req, res, next) {
    try {
      const userId = req.user ? req.user._id : null;
      const result = await TaskService.deleteTask(req.params.id, userId);

      return ApiResponse.success(res, {
        statusCode: HTTP_STATUS.OK,
        message: 'Task deleted successfully.',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  static async clearCompletedTasks(req, res, next) {
    try {
      const userId = req.user ? req.user._id : null;
      const result = await TaskService.clearCompletedTasks(userId);

      return ApiResponse.success(res, {
        statusCode: HTTP_STATUS.OK,
        message: `Cleared ${result.deletedCount} completed tasks.`,
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  static async reorderTasks(req, res, next) {
    try {
      const userId = req.user ? req.user._id : null;
      const result = await TaskService.reorderTasks(req.body.taskIds, userId);

      return ApiResponse.success(res, {
        statusCode: HTTP_STATUS.OK,
        message: 'Tasks order updated.',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  static async getProductivityStats(req, res, next) {
    try {
      const userId = req.user ? req.user._id : null;
      const stats = await TaskService.getProductivityStats(userId);

      return ApiResponse.success(res, {
        statusCode: HTTP_STATUS.OK,
        message: 'Productivity metrics retrieved.',
        data: stats
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = TaskController;
