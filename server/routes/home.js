const router = require('koa-router')();
const path = require('path');
const User = require('../models/user');
const Task = require('../models/task');
const SubTask = require('../models/subtask');
const Label = require('../models/label');
const {
  UN_START,
  PENDING,
  WAITING,
  REJECTED,
  RESOLVED,
} = require('../utils/const');

router.get('tasks', async ctx => {
  const { offset, number } = ctx.request.query;
  const { name } = ctx.state.user;

  const taskList = await SubTask.findAllAvailable(name, parseInt(offset) || 0, parseInt(number) || 5);

  ctx.body = {
    code: 200,
    data: taskList,
  }
})

router.get('mytasks', async ctx => {
  const { offset, number, type } = ctx.request.query;
  const { name } = ctx.state.user;

  let taskList = [];
  const convertedOffset = parseInt(offset) || 0;
  const convertedNumber = parseInt(number) || 5;
  if (type === 'origin') {
    taskList = await Task.findByUserName(name, convertedOffset, convertedNumber);

    for (let i = 0; i < taskList.length; i++) {
      const _id = taskList[i]._id;
      const imgNum = taskList[i].imgArray.length;
      const allSubTask = await SubTask.getAllTask(_id);
      let pendingTaskNum = 0;
      let fulfilledTaskNum = 0;
      for (let j = 0; j < allSubTask.length; j++) {
        allSubTask[j].label.every(item => item.status === RESOLVED) && fulfilledTaskNum++;
        allSubTask[j].label.some(item => item.status !== UN_START) && pendingTaskNum++;
      }
      taskList[i].allTaskNum = allSubTask.length;
      taskList[i].pendingTaskNum = pendingTaskNum;
      taskList[i].fulfilledTaskNum = fulfilledTaskNum;
    }
  } else {
    if (type === 'dispatch') {
      taskList = await SubTask.findMyDispatch(name, convertedOffset, convertedNumber);
    } else {
      taskList = await SubTask.findMyOwn(name, type || 'pending', convertedOffset, convertedNumber);
    }
  }

  ctx.body = {
    code: 200,
    data: taskList,
  }
})

router.get('search', async ctx => {
  const { keyword } = ctx.request.query;
  const { name } = ctx.state.user;

  const taskList = await SubTask.find({ t: keyword, s: { $in: ['all', name] } });

  ctx.body = {
    code: 200,
    data: taskList.toObject(),
  }
})

router.get('label/file', async ctx => {
  const { file_path, task_id } = ctx.query;
  const { name } = ctx.state.user;
  const isValid = await SubTask.findOne({ _id: task_id, s: { $in: [ '全部', name ] } });
  let data = {};

  if (isValid) {
    const labelFilePath = path.join(__dirname, '../../public', file_path);
    console.log(labelFilePath, '---labelFilePath---');
    data = require(labelFilePath);
  }

  ctx.body = {
    data,
    code: 200,
  }
})

router.get('users', async ctx => {
  const { keyword } = ctx.request.query;
  const userList = await User.findByKeyword(keyword);

  ctx.body = {
    code: 200,
    data: userList,
  }
})

module.exports = router
