const { z } = require('zod');

const createTaskSchema = z.object({
  title: z
    .string({ required_error: 'Task title is required' })
    .trim()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title cannot exceed 200 characters'),
  description: z.string().trim().max(1000, 'Description cannot exceed 1000 characters').optional().default(''),
  category: z
    .enum(['Work', 'Personal', 'Study', 'Health', 'Finance', 'Urgent', 'General'], {
      errorMap: () => ({ message: 'Category must be Work, Personal, Study, Health, Finance, Urgent, or General' })
    })
    .default('Work'),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']).default('Medium'),
  dueDate: z
    .string()
    .nullable()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Invalid date format'
    }),
  tags: z.array(z.string().trim().max(30)).max(10, 'Maximum 10 tags allowed').optional().default([])
});

const updateTaskSchema = createTaskSchema.partial().extend({
  status: z.enum(['Active', 'Completed']).optional(),
  orderIndex: z.number().int().min(0).optional(),
  isArchived: z.boolean().optional()
});

const reorderTasksSchema = z.object({
  taskIds: z.array(z.string()).min(1, 'taskIds array is required')
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  reorderTasksSchema
};
