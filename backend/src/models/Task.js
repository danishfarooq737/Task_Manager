const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [1, 'Title cannot be empty'],
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: ''
    },
    category: {
      type: String,
      required: true,
      enum: ['Work', 'Personal', 'Study', 'Health', 'Finance', 'Urgent', 'General'],
      default: 'Work',
      index: true
    },
    status: {
      type: String,
      required: true,
      enum: ['Active', 'Completed'],
      default: 'Active',
      index: true
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
      index: true
    },
    dueDate: {
      type: Date,
      default: null,
      index: true
    },
    completedAt: {
      type: Date,
      default: null
    },
    orderIndex: {
      type: Number,
      default: 0,
      index: true
    },
    tags: {
      type: [String],
      default: []
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Compound indexes for optimized multi-field filtering & sorting
taskSchema.index({ user: 1, status: 1, orderIndex: 1 });
taskSchema.index({ user: 1, category: 1 });
taskSchema.index({ user: 1, dueDate: 1 });

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
