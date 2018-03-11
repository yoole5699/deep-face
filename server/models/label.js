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
  t: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    alias: 'task_id',
    ref: 'SubTask',
  },

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

  // 1:开始但未完成, 2:完成但待审核, 3: 审核未通过, 4: 审核通过
  s: {
    type: Number,
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
  const label = await this.find({
    t: taskId,
    s: { $in: [ WAITING, RESOLVED ]}
  });

  return label.map(item => item.img_name);
}

LabelSchema.statics.updateLabelItem = async function(body) {
  await this.findOneAndUpdate(
    { t: body.task_id, n: body.img_name },
    {
      t: body.task_id,
      n: body.img_name,
      w: body.current_width || 500,
      d: body.data,
      s: body.status
    },
    { upsert: true }
  );
};

if (!LabelSchema.options.toObject) LabelSchema.options.toObject = {};
LabelSchema.options.toObject.transform = function (doc, ret, options) {
  return {
    _id: ret._id,
    data: {
      currentWidth: ret.current_width,
      dataSet: ret.data
    },
  }
}

const Label = mongoose.model('Label', LabelSchema)

module.exports = Label
