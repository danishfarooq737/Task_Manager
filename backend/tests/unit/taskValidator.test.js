const { createTaskSchema, updateTaskSchema, reorderTasksSchema } = require('../../src/validators/taskValidator');

describe('Unit Test: Task Validator (Zod Schema)', () => {
  describe('createTaskSchema', () => {
    it('should validate a valid task payload with default values', () => {
      const validPayload = {
        title: 'Review Sprint 1 Deliverables',
        category: 'Work',
        priority: 'High'
      };

      const result = createTaskSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('Review Sprint 1 Deliverables');
        expect(result.data.category).toBe('Work');
        expect(result.data.priority).toBe('High');
        expect(result.data.description).toBe('');
      }
    });

    it('should reject when title is missing or empty', () => {
      const invalidPayload = {
        title: '',
        category: 'Work'
      };

      const result = createTaskSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toContain('Title cannot be empty');
    });

    it('should reject invalid category not in enum', () => {
      const invalidPayload = {
        title: 'Random Task',
        category: 'NonExistentCategory'
      };

      const result = createTaskSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it('should reject invalid date strings', () => {
      const invalidPayload = {
        title: 'Task with bad date',
        dueDate: 'not-a-valid-date-string'
      };

      const result = createTaskSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });

  describe('updateTaskSchema', () => {
    it('should allow partial updates (e.g., status toggle only)', () => {
      const partialPayload = {
        status: 'Completed'
      };

      const result = updateTaskSchema.safeParse(partialPayload);
      expect(result.success).toBe(true);
      expect(result.data.status).toBe('Completed');
    });
  });

  describe('reorderTasksSchema', () => {
    it('should validate array of string IDs', () => {
      const payload = {
        taskIds: ['660000000000000000000001', '660000000000000000000002']
      };

      const result = reorderTasksSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('should fail when taskIds is empty', () => {
      const payload = {
        taskIds: []
      };

      const result = reorderTasksSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });
});
