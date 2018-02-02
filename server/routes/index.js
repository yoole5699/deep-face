const router = require('koa-router')();

const home = require('./home');
const user = require('./user');
const task = require('./task');

router.prefix('/api');

router.use('/', home.routes(), home.allowedMethods());
router.use('/user', user.routes(), user.allowedMethods());
router.use('/task', task.routes(), task.allowedMethods());

module.exports = router
