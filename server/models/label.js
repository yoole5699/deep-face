const mongoose = require('mongoose');
const { Schema } = mongoose;
const {
  UN_START,
  PENDING,
  WAITING,
  REJECTED,
  RESOLVED,
} = require('../utils/const');

const LabelSchema = new Schema({
  // t: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   required: true,
  //   alias: 'task_id',
  //   ref: 'SubTask',
  // },

  n: {
    type: String,
    required: true,
    alias: 'img_name',
  },

  // 标注图标注时的宽度
  w: {
    type: Number,
    default: 500,
    alias: 'current_width',
  },

  // 标注数据为[{x,y,1:{x,y,},canvas},type]
  d: {
    type: Schema.Types.Mixed,
    alias: 'data',
  },

  // 0: 未开始, 1:开始但未完成, 2:完成但待审核, 3: 审核未通过, 4: 审核通过
  s: {
    type: Number,
    default: 0,
    alias: 'status',
  }
})

LabelSchema.statics.findByName = async function(taskId, imgName){
  const label = await this.findOne({
    t: taskId,
    n: imgName,
  })

  return label;
}

LabelSchema.statics.findBySubTaskId = async function(taskId) {
  const label = await this.find({ t: taskId });

  return label.map(item => ({
    name: item.img_name,
    status: item.status
  }));
}

// LabelSchema.statics.getFulfilledImgNum = async function (taskId) {
//   const num = await this.count({ t: taskId, s: RESOLVED });
//
//   return num;
// }
//
// LabelSchema.statics.getFulfilledImgArray = async function (taskId) {
//   const dataList = await this.find({ t: taskId, s: RESOLVED });
//
//   return dataList.map(item => item.img_name);
// }
//
// LabelSchema.statics.getWaitingImgNum = async function (taskId) {
//   const num = await this.count({ t: taskId, s: WAITING });
//
//   return num;
// }
//
// LabelSchema.statics.getWaitingImgArray = async function (taskId) {
//   const dataList = await this.find({ t: taskId, s: WAITING });
//
//   return dataList.map(item => item.img_name);
// }
//
// LabelSchema.statics.getPendingImgNum = async function (taskId) {
//   const num = await this.count({ t: taskId, s: PENDING });
//
//   return num;
// }
//
// LabelSchema.statics.getPendingImgArray = async function (taskId) {
//   const dataList = await this.find({ t: taskId, s: PENDING });
//
//   return dataList.map(item => item.img_name);
// }

LabelSchema.statics.updateLabelItem = async function(body) {
  await this.findOneAndUpdate(
    { _id: body._id },
    {
      w: body.current_width || 500,
      d: body.data,
      s: body.status
    }
  );
};

LabelSchema.statics.updateLabelItemStatus = async function(body) {
  await this.findOneAndUpdate(
    { t: body.task_id, n: body.img_name },
    {
      s: body.status
    }
  );
};

if (!LabelSchema.options.toObject) LabelSchema.options.toObject = {};
LabelSchema.options.toObject.transform = function (doc, ret, options) {
  return {
    _id: ret._id,
    data: {
      currentWidth: ret.w,
      dataSet: ret.d
    },
    name: ret.n,
    status: ret.s
  }
}

const Label = mongoose.model('Label', LabelSchema)

module.exports = Label
