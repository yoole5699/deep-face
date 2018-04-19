const router = require('koa-router')();
const User = require('../models/user');
const base = require('../models/base');
const SubTask = require('../models/subtask');
const { UN_START, RESOLVED } = require('../utils/const');

router.post('/login', async ctx => {
  const { userName, password } = ctx.request.body;

  try {
    const user = await User.findByName(userName);
    if (!user) {
      // throw new Error('用户不存在！')
      ctx.throw(423, '用户不存在！')
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      ctx.throw(423, '用户名或密码错误！')
    }
    const token = base.signToken(user);

    ctx.body = {
      code: 200,
      message: '登录成功！',
      token: token
    }
  } catch (err) {
    ctx.throw(err)
  }
})

router.post('/register', async ctx => {
  const { userName, password } = ctx.request.body;

  let user = new User({
    user_name: userName,
    password: password
  })
  let result = await user.save();
  ctx.body = {
    code: 200,
    message: '注册成功！'
  }
})

router.get('/info', async ctx => {
  // TODO:是否需要每次查询后更新app_secret
  // token: base.signToke(user)
  const user = await base.checkToken(ctx, User, true);
  const subTaskList = await SubTask.find({ s: user.userName });
  let labelImgNum = 0;
  let converedMoneyTotal = 0;
  for (let i = 0; i < subTaskList.length; i++) {
    let fulFilledNum = 0;
    for (let j = 0; j < subTaskList[i].labels.length; j++) {
      if (subTaskList[i].labels[j].status > UN_START) {
        labelImgNum += 1;
        if (subTaskList[i].labels[j].status === RESOLVED) {
          fulFilledNum++;
        }
      }
    }
    converedMoneyTotal += fulFilledNum * subTaskList[i].money;
  }
  user.taskTotalNum = subTaskList.length;
  user.labelImgNum = labelImgNum;
  user.converedMoneyTotal = converedMoneyTotal.toFixed(1);

  ctx.body = {
    code: 200,
    message: '获取用户信息成功！',
    data: user,
  };
})

router.put('/info', async ctx => {
  try {
    const user = ctx.request.body;
    await User.updateOne({ name: user.user_name }, user);

    ctx.body = {
      code: 200,
      message: '修改用户信息成功!'
    }
  } catch(err) {
    ctx.throw(err);
  }
})

// router.post('/message', async ctx => {
//   const { receiverName, message } = ctx.request.body;
//
//   try {
//     await User.addMessage(receiverName, message);
//
//     ctx.body = {
//       code: 200,
//       message: '发送成功',
//     }
//   } catch (err) {
//     ctx.throw(err)
//   }
// })

router.put('/message', async ctx => {
  const { data } = ctx.request.body;
  const userId = ctx.state.user.id;
  await User.setMessageSeen(userId, data);

  ctx.body = {
    code: 200,
    message: 'success',
  }
})

router.delete('/message/:_id', async ctx => {
  const { _id } = ctx.params;
  const userId = ctx.state.user.id;
  await User.deleteMessage(userId, _id);

  ctx.body = {
    code: 200,
    message: 'success',
  };
})

module.exports = router
