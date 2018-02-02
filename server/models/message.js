const mongoose = require('mongoose')
const { Schema } = mongoose;

const MessageSchema = new Schema({
  n: {
    type: String,
    required: true,
    alias: 'senderName',
  },

  i: {
    type: Schema.Types.ObjectId,
    required: true,
    alias: 'taskId',
  },

  c: {
    type: String,
    alias: 'content',
  },

  t: {
    type: Date,
    default: Date.now(),
    alias: 'create_at',
  },

  s: {
    type: Boolean,
    default: false,
    alias: 'seen'
  }
});

module.exports = MessageSchema