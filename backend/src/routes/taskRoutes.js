const express = require('express');
const TaskController = require('../controllers/taskController');
const validate = require('../middleware/validateMiddleware');
const { createTaskSchema, updateTaskSchema, reorderTasksSchema } = require('../validators/taskValidator');
const { optionalAuth, requireAuth } = require('../middleware/authMiddleware');
const idempotency = require('../middleware/idempotencyMiddleware');

const router = express.Router();

// Allow optionalAuth on all routes so guest users and authenticated users both work seamlessly
router.use(optionalAuth);

// Productivity stats summary
router.get('/stats', TaskController.getProductivityStats);

// Clear completed tasks
router.delete('/completed', TaskController.clearCompletedTasks);

// Drag-and-drop reordering
router.put('/reorder', idempotency, validate(reorderTasksSchema), TaskController.reorderTasks);

// Standard CRUD Operations
router
  .route('/')
  .get(TaskController.getTasks)
  .post(idempotency, validate(createTaskSchema), TaskController.createTask);

router
  .route('/:id')
  .get(TaskController.getTaskById)
  .patch(idempotency, validate(updateTaskSchema), TaskController.updateTask)
  .delete(TaskController.deleteTask);

// Toggle complete shortcut
router.patch('/:id/toggle', idempotency, TaskController.toggleTaskStatus);

module.exports = router;
