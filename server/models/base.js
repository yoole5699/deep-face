const jwt = require('jsonwebtoken')
const config = require('../config')

//生成token
function signToken(user){
  const token = jwt.sign({
    id: user._id,
    name: user.user_name,
    secret: user.app_secret
  }, config.jwt_secret, { expiresIn: 86400 })
  return token
}

//检查并更新token
async function checkToken(ctx, User, isGetUserInfo){
  const token = ctx.state.user // 获取jwt
  if (token) {
    const user = await User.checkToken(token)
    if (user) {
      if (isGetUserInfo) {
        return user
      } else {
        return this.signToken(user)
      }
    } else {
      ctx.throw(501, 'token信息异常')
    }
  } else {
    ctx.throw(404, 'token丢失')
  }
}

module.exports = {
  signToken : signToken,
  checkToken: checkToken
}
