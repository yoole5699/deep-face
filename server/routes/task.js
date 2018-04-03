const router = require('koa-router')();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const User = require('../models/user')
const Task = require('../models/task');
const SubTask = require('../models/subtask');
const Label = require('../models/label');
const uploadFile = require('../utils/upload');
const {
  UN_START,
  PENDING,
  WAITING,
  REJECTED,
  RESOLVED,
} = require('../utils/const');

// router.get('/label', async ctx => {
//   const { img_path, img_name, task_id, } = ctx.query;
//
//   const labelItem = await Label.findByName(task_id, img_name);
//   let labelData = labelItem && labelItem.data;
//
//   if (!labelData) {
//     const labelFileName = img_name.substring(0, img_name.lastIndexOf('.'));
//     const labelFilePath = path.join(__dirname, `../../public/${img_path}/${labelFileName}.json`);
//     if (fs.existsSync(labelFilePath)) {
//       // labelData = fs.readFileSync(labelFilePath, 'UTF-8');
//       labelData = require(labelFilePath);
//     }
//   }
//
//   ctx.body = {
//     code: 200,
//     data: {
//       currentWidth: labelItem && labelItem.current_width || 500,
//       dataSet: labelData || [],
//     },
//   }
// })

router.get('/:_id', async ctx => {
  const { _id } = ctx.params;
  let task = {};
  let imgArrayStatus = [];
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    ctx.body = {
      code: 200,
      data: task,
    }
  }

  const { type } = ctx.query;
  if (type === 'origin') {
    task = await Task.findById(_id);
  } else {
    task = await SubTask.findById(_id).populate('p l');
  }

  ctx.body = {
    code: 200,
    data: task,
  }
})

router.get('/:_id/sub', async ctx => {
  const { _id } = ctx.params;
  let tasks = [];
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    ctx.body = {
      code: 200,
      data: tasks,
    }
  }

  tasks = await SubTask.findOneAllSub(_id);
  ctx.body = {
    code: 200,
    data: tasks
  }
})

router.post('/', async ctx => {
  let task = await uploadFile(ctx);
  let taskItem;

  if (task) {
    taskItem = new Task(task);
    await taskItem.save();
  }

  ctx.body = {
    code: 200,
    data: taskItem.toObject(),
  };
});

router.post('/sub', async ctx => {
  const data = ctx.request.body;
  let subTaskItem = new SubTask(data);
  const rawResult = await Label.insertMany(data.label, { rawResult: true});
  if (rawResult.insertedCount > 0) {
    subTaskItem.label = rawResult.ops;
    await subTaskItem.save();
    ctx.body = {
      code: 200,
      success: true,
    };
  }
})

async function updateTaskItem(taskId, userName) {
  let taskItem = await SubTask.findOne({ _id: taskId });
  if (taskItem.specified_executor !== userName && taskItem.specified_executor === '全部') {
    taskItem.specified_executor = userName;
    await taskItem.save();
  }
}

router.put('/label', async ctx => {
  const { name } = ctx.state.user;
  const label = ctx.request.body;

  await Label.updateLabelItem(label);
  await updateTaskItem(label.task_id, name);

  ctx.body = {
    code: 200,
    success: true,
  }
})

router.post('/label/status', async ctx => {
  const { name } = ctx.state.user;
  const { task_id, title, img_name, comment, status } = ctx.request.body;
  const subTask = await SubTask.findById(task_id).populate('p');
  const subTaskObj = subTask.toObject();

  if (subTaskObj.initialtorName !== name) {
    ctx.body = {
      code: 403,
      message: '你无权进行审核操作'
    }
  } else {
    await Label.updateLabelItemStatus(ctx.request.body);
    await User.addMessage(subTaskObj.specified_executor, { comment, title, img_name, status, senderName: name, taskId: task_id, });

    ctx.body = {
      code: 200,
      success: true
    };
  }
});


module.exports = router
