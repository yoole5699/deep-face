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

  tt: {
    type: String,
    alias: 'title',
  },

  u: {
    type: Number,
    alias: 'status',
  },

  p: {
    type: String,
    alias: 'img_name',
  },

  c: {
    type: String,
    alias: 'comment',
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

if (!MessageSchema.options.toObject) MessageSchema.options.toObject = {};
MessageSchema.options.toObject.transform = function (doc, ret, options) {
  return {
    _id: ret._id,
    senderName: ret.n,
    taskId: ret.i,
    taskTitle: ret.tt,
    status: ret.u,
    imgName: ret.p,
    comment: ret.c,
    create_at: ret.t,
    seen: ret.s,
  };
}

module.exports = MessageSchema
