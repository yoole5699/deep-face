const mongoose = require('mongoose')
const config = require('../config')
const bcrypt = require('bcrypt')
const saltRounds = 10
const crypto = require('crypto')
const MessageSchema = require('./message')

const UserSchema = new mongoose.Schema({
  n: {
    type: String,
    required: true,
    unique: true,
    alias: 'user_name',
  },

  p: {
    type: String,
    required: true,
    alias: 'password',
  },

  a: {
    type: String,
    default: GetHmac(),
    alias: 'app_secret',
  },

  e: {
    type: String,
    alias: 'email',
  },

  m: {
    type: String,
    alias: 'mobile',
  },

  d: {
    type: String,
    alias: 'desc',
  },

  c: {
    type: [ MessageSchema ],
    alias: 'comments',
  },
})

function GetHmac(){
  const hmac = crypto.createHmac('sha256', config.secret_key)
  hmac.update(Date.now().toString())
  return hmac.digest('hex')
}

UserSchema.pre('save', async function(next) {
  try {
    const user = this
    console.log(user.isModified('password'), '---hash---');
    if(!user.isModified('p')) return next()
    const salt = await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(this.password, salt)
    user.password = hash
    return next()
  } catch(e) {
    return next(e)
  }
})

UserSchema.methods.comparePassword = async function(password) {
  const isMatch = await bcrypt.compare(password, this.password)
  return isMatch
}

UserSchema.statics.setMessageSeen = async function(userId, messageIds) {
  // const rawRes = await this.update({ _id: userId }, { $set: { 'c.$[elem].s': true } }, { arrayFilters: [{ 'elem._id': { $in: messageIds }}], multi: true })
  await mongoose.connection.db.command({
    update: 'users',
    updates: [
      {
        q: { '_id': mongoose.Types.ObjectId(userId) },
        u: { $set: { 'c.$[elem].s': true } },
        arrayFilters: [{ 'elem._id': { $in: messageIds.map(mongoose.Types.ObjectId) }}],
      },
    ],
  });
}

UserSchema.statics.deleteMessage = async function(userId, messageId) {
  await this.updateOne({ _id: userId }, { $pull: { c: { _id: messageId } } });
}

UserSchema.statics.addMessage = async function(userName, message) {
  const rawRes = await this.updateOne({ n: userName }, { $push: { c: message }})

  return rawRes;
}


UserSchema.statics.checkToken = async function(token) {
  // TODO:是否需要每次查询后更新app_secret
  // const secret = GetHmac()
  // const user = await this.findOneAndUpdate({ _id: token.id }, { app_secret: secret })
  // if (token.secret == user.app_secret) {
  //   user.app_secret = secret
  const user = await this.findById(token.id);
  if (token.secret === user.app_secret) {
    return user.toObject();
  } else {
    throw new Error('token验证未通过！')
  }
}

UserSchema.statics.findByName = async function(userName){
  const user = await this.findOne({
    n: userName
  })
  return user;
}

UserSchema.statics.findByKeyword = async function (keyword) {
  const userList = await this.find({
    n: { $gte: keyword }
  }).select({ n: 1, _id: 0 });

  return userList.map(item => item.toObject());
}

if (!UserSchema.options.toObject) UserSchema.options.toObject = {};
UserSchema.options.toObject.transform = function (doc, ret, options) {
  return {
    _id: ret._id,
    userName: ret.n,
    desc: ret.d,
    email: ret.e,
    mobile: ret.m,
    comments: ret.c,
  };
}

const User = mongoose.model('User', UserSchema)

module.exports = User
