const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
  i: {
    type: String,
    required: true,
    unique: true,
    alias: 'initialtor_name',
  },

  t: {
    type: String,
    required: true,
    alias: 'title',
  },

  d: {
    type: String,
    alias: 'desc',
  },

  u: {
    type: String,
    alias: 'upload_file',
  },

  p: {
    type: String,
    alias: 'img_path',
  },

  a: {
    type: [],
    alias: 'img_array',
  },
})

TaskSchema.statics.findAllIdByUserName = async function(userName) {
  const dataList = await this.find()
    .where('i').eq(userName)
    .select('_id');

  return dataList.map(data => data._id);
}

TaskSchema.statics.findByUserName = async function(userName, offset, number){
  const dataList = await this.find({ i: userName }).skip(offset).limit(number);

  return dataList.map(data => data.toObject());
}

TaskSchema.statics.deleteByIdAndName = async function (_id, userName) {
  await this.deleteOne({ _id, i: userName });
}

if (!TaskSchema.options.toObject) TaskSchema.options.toObject = {};
TaskSchema.options.toObject.transform = function (doc, ret, options) {
  return {
    _id: ret._id,
    initialtorName: ret.i,
    title: ret.t,
    desc: ret.d,
    imgFolderPath: ret.p,
    imgArray: ret.a
  }
}

const Task = mongoose.model('Task', TaskSchema)

module.exports = Task
