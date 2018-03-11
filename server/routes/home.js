const router = require('koa-router')();
const User = require('../models/user');
const Task = require('../models/task');
const SubTask = require('../models/subtask');

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

  let tasklist = [];
  const convertedOffset = parseInt(offset) || 0;
  const convertedNumber = parseInt(number) || 5;
  if (type === 'origin') {
    taskList = await Task.findByUserName(name, convertedOffset, convertedNumber);
    for (var i = 0; i < taskList.length; i++) {
      const _id = taskList[i]._id;
      const imgNum = taskList[i].imgArray.length;
      console.log(taskList[i], '---taskList[i]---');
      taskList[i].pendingTaskNum = await SubTask.getPendingTaskNum(_id, imgNum);
      taskList[i].fulfilledTaskNum = await SubTask.getFulfilledTaskNum(_id);
      taskList[i].allTaskNum = await SubTask.getAllTaskNum(_id);
    }
  } else if (type === 'dispatch') {
    taskList = await SubTask.findMyDispatch(name, convertedOffset, convertedNumber);
  } else {
    taskList = await SubTask.findMyOwn(name, type || 'pending', convertedOffset, convertedNumber);
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

router.get('users', async ctx => {
  const { keyword } = ctx.request.query;
  const userList = await User.findByKeyword(keyword);

  ctx.body = {
    code: 200,
    data: userList,
  }
})

module.exports = router
