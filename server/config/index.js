module.exports = {
  port: '8000',
  jwt_secret: 'deep-face_yoole5699',
  secret_key: 'deep-face_yoole5699',
  mongodb: 'mongodb://localhost/test',
  getErr: function(e) {
    switch(e.code){
      case 11000:
        e.message = '用户名已经存在！';
        break;
      default:
        break;
    }

    return {
      code: e.code,
      message: e.message || '服务器错误'
    }
  }
}
