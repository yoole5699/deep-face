const mongoose = require('mongoose')
const LabelSchema = require('./label')
const {
  UN_START,
  PENDING,
  WAITING,
  REJECTED,
  RESOLVED,
} = require('../utils/const');

const SubTaskSchema = new mongoose.Schema({
  t: {
    type: String,
    required: true,
    alias: 'title',
  },

  d: {
    type: String,
    alias: 'desc',
  },

  k: {
    type: {
      n: Number,
      t: String,
    },
    alias: 'kind',
  },

  s: {
    type: String,
    alias: 'specified_executor',
  },

  m: {
    type: Number,
    required: true,
    alias: 'money',
  },

  e: {
    type: Date,
    alias: 'expire_time',
  },

  p: {
    type: mongoose.Schema.Types.ObjectId,
    alias: 'parent',
    ref: 'Task',
  },

  l: {
    // type: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Label'
    //   }
    // ],
    type: [ LabelSchema ],
    alias: 'labels',
  }
})

SubTaskSchema.statics.findAllAvailable = async function(userName, offset, number) {
  const dataList = await this.find()
    .where('s').in(['全部', userName])
    .where('l.s').ne(4)
    .populate('p', 'p')
    .skip(offset)
    .limit(number);

  return dataList.map(item => item.toObject());
}

SubTaskSchema.statics.findOneAllSub = async function(_id) {
  const dataList = await this.find({ p: _id }).populate('p');

  return dataList.map(item => item.toObject());
}

SubTaskSchema.statics.findMyDispatch = async function (pIdList, offset, number) {
  const dataList = await this.find()
    .where('p').in(pIdList)
    .populate('p')
    .skip(offset)
    .limit(number);

  return dataList.map(item => item.toObject());
}

SubTaskSchema.statics.findMyOwn = async function(
  userName,
  taskType,
  offset,
  number
) {
  const compareOperation = taskType === 'pending' ? '$ne' : '$eq';
  const dataList = await this.find({ s: userName, 'l.s': { [compareOperation]: RESOLVED } })
    .populate('p', 'p')
    .skip(offset)
    .limit(number);

  return dataList.map(item => item.toObject());
};

SubTaskSchema.statics.getAllTask = async function (parentTaskId) {
  const dataList = await this.find({ p: parentTaskId });

  return dataList;
}

SubTaskSchema.statics.updateLabelItem = async function(body, userName) {
  await this.updateOne(
    { _id: body.task_id, 'l._id': body._id, s: { $in: ['全部', userName] } },
    {
      $set: {
        's': userName,
        'l.$.w': body.current_width || 500,
        'l.$.d': body.data,
        'l.$.s': body.status,
        'l.$.u': Date.now(),
      },
    }
  )
}

SubTaskSchema.statics.updateLabelItemStatus = async function(body) {
  await this.updateOne(
    { _id: body.task_id, 'l._id': body._id },
    {
      $set: {
        'l.$.s': body.status,
        'l.$.u': Date.now(),
      },
    }
  )
}

SubTaskSchema.statics.deleteByIdAndName = async function (_id, userName) {
  // { n: , ok: }
  let rawRes = await this.deleteOne({ _id, s: userName });
  if (rawRes.n === 0) {
    const task = await this.findOne({ _id }).populate('p');
    rawRes = task.initialtorName === userName ? await this.deleteOne({ _id }) : rawRes;
  }

  return rawRes;
}

if (!SubTaskSchema.options.toObject) SubTaskSchema.options.toObject = {};
SubTaskSchema.options.toObject.transform = function (doc, ret, options) {
  return {
    _id: ret._id,
    initialtorName: ret.p.initialtorName,
    imgFolderPath: ret.p.imgFolderPath,
    title: ret.t,
    desc: ret.d,
    kind: ret.k,
    money: ret.m,
    expireTime: ret.e,
    specifiedExecutor: ret.s,
    labels: ret.l
  }
}

const SubTask = mongoose.model('SubTask', SubTaskSchema);

module.exports = SubTask
