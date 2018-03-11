const router = require('koa-router')();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
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

router.get('/label', async ctx => {
  const { img_path, img_name, task_id, } = ctx.query;

  const labelItem = await Label.findByName(task_id, img_name);
  let labelData = labelItem && labelItem.data;

  if (!labelData) {
    const labelFileName = img_name.substring(0, img_name.lastIndexOf('.'));
    const labelFilePath = path.join(__dirname, `../../public/${img_path}/${labelFileName}.json`);
    if (fs.existsSync(labelFilePath)) {
      // labelData = fs.readFileSync(labelFilePath, 'UTF-8');
      labelData = require(labelFilePath);
    }
  }

  ctx.body = {
    code: 200,
    data: {
      currentWidth: labelItem && labelItem.current_width || 500,
      dataSet: labelData || [],
    },
  }
})

router.get('/:_id', async ctx => {
  const { _id } = ctx.params;
  let task = {};
  let fulfilledImgArray = [];
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
    task = await SubTask.findById(_id).populate({ path: 'p' });
    fulfilledImgArray = await Label.findBySubTaskId(task.id);
  }

  ctx.body = {
    code: 200,
    data: {
      ...task.toObject(),
      fulfilledImgArray,
    },
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
  await subTaskItem.save();

  ctx.body = {
    code: 200,
    success: true,
  };
})

async function updateTaskItem(taskId) {
  let taskItem = await SubTask.findOne({ _id: taskId });
  taskItem.un_fulfilled_img_num--;

  await taskItem.save();
}

router.put('/label', async ctx => {
  const label = ctx.request.body;
  await Label.updateLabelItem(label);
  label.status === RESOLVED && await updateTaskItem(label.task_id);
  if (label.message) {
    await User.addMessage(label.user_name, label.message);
  }

  ctx.body = {
    code: 200,
    success: true,
  }
})

module.exports = router
