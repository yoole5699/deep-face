const mongoose = require('mongoose')
const LabelSchema = require('./label')

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
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Label'
      }
    ],
    alias: 'label',
  }
})

SubTaskSchema.statics.findAllAvailable = async function(userName, offset, number) {
  const dataList = await this.find({ s: { $in: ['全部', userName], }, 'l.s': { $ne: 4 } })
    .populate('p', 'p')
    .populate('l')
    .skip(offset)
    .limit(number);

  return dataList.map(item => item.toObject());
}

SubTaskSchema.statics.findOneAllSub = async function(_id) {
  const dataList = await this.find({ p: _id }).populate('p l');

  return dataList.map(item => item.toObject());
}

SubTaskSchema.statics.findMyDispatch = async function (userName, offset, number) {
  const dataList = await this.find()
    .populate({ path: 'p', match: { i: userName } })
    .populate('l')
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
  const dataList = await this.find({
    s: userName,
    'l.s': { [compareOperation]: 4 }
  })
    .populate('p', 'p')
    .populate('l')
    .skip(offset)
    .limit(number);

  return dataList.map(item => item.toObject());
};

SubTaskSchema.statics.getAllTask = async function (parentTaskId) {
  const dataList = await this.find({ p: parentTaskId });

  return dataList;
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
    label: ret.l
  }
}

const SubTask = mongoose.model('SubTask', SubTaskSchema);

module.exports = SubTask
