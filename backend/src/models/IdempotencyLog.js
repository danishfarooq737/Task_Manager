const mongoose = require('mongoose');

const idempotencyLogSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    method: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    statusCode: {
      type: Number,
      required: true
    },
    responseBody: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 86400 // TTL Index: automatically deletes logs after 24 hours
    }
  },
  {
    timestamps: false
  }
);

const IdempotencyLog = mongoose.model('IdempotencyLog', idempotencyLogSchema);
module.exports = IdempotencyLog;
