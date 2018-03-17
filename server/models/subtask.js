const mongoose = require('mongoose')

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
})

SubTaskSchema.statics.findAllAvailable = async function(userName, offset, number){
  const dataList = await this.find({ s: { $in: ['全部', userName], }, u: { $ne: 0 } })
    .populate('p')
    .skip(offset)
    .limit(number);

  return dataList.map(item => item.toObject());
}

SubTaskSchema.statics.findMyDispatch = async function (userName, offset, number) {
  const dataList = await this.find()
    .populate({ path: 'p', match: { i: userName } })
    .skip(offset)
    .limit(number);

  return dataList.map(item => item.toObject());
}

SubTaskSchema.statics.findMyOwn = async function(
  userName,
  unFulfilledImgNum,
  offset,
  number
) {
  const compareOperation = unFulfilledImgNum === 'pending' ? '$ne' : '$eq';
  const dataList = await this.find({
    s: userName,
    u: { [compareOperation]: 0 }
  })
    .populate('p')
    .skip(offset)
    .limit(number);

  return dataList.map(item => item.toObject());
};


// SubTaskSchema.statics.getPendingTaskNum = async function (parentTaskId, imgNum) {
//   const num = await this.count({ p: parentTaskId, u: { $gt: 0 } });
//
//   return num;
// }
//
// SubTaskSchema.statics.getFulfilledTaskNum = async function (parentTaskId) {
//   const num = await this.count({ p: parentTaskId, u: 0 });
//
//   return num;
// }

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
    imgArray: ret.p.imgArray,
    title: ret.t,
    desc: ret.d,
    money: ret.m,
    expireTime: ret.e,
    specifiedExecutor: ret.s
  }
}

const SubTask = mongoose.model('SubTask', SubTaskSchema);

module.exports = SubTask
