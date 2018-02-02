const { inspect } = require('util');
const path = require('path');
const os = require('os');
const fs = require('fs');
const Busboy = require('busboy');
const yauzl = require('yauzl');
const { Transform } = require("stream");
const { getSuffixName } = require('./index');
const destZipFolderPath = path.join(__dirname, '../../public/zip');

function mkdirsSync(dirName) {
  // 路径dirName是否存在文件
  if (fs.existsSync(dirName)) {
    return true;
  } else {
    // 路径dirName的父级目录是否存在
    if (mkdirsSync(path.dirname(dirName))) {
      fs.mkdirSync(dirName)
      return true;
    }
  }
}

function uploadFile(ctx) {
  let req = ctx.req;
  let res = ctx.res;
  let busboy = new Busboy({ headers: req.headers });

  return new Promise((resolve, reject) => {
    console.log('文件上传中...');
    let task = {};
    let errCenter = {
      code: 400,
      message: '未知原因操作失败'
    };

    busboy.on('file', function (fieldName, file, fileName, encoding, mimetype) {
      const now = new Date();
      const nowISOString = now.toISOString();
      let imgSaveTo = path.join(__dirname, `../../public/${nowISOString}`);
      const suffix = getSuffixName(fileName);

      if (suffix !== 'zip') {
          errCenter.message = '请确保上传文件是zip类型的压缩文件';
          reject(errCenter);
      }

      let destPath = path.join(destZipFolderPath, `${nowISOString}-${fileName}`);

      // 文件保存到指定路径
      file.pipe(fs.createWriteStream(destPath));
      mkdirsSync(imgSaveTo);

      // 文件写入事件结束
      file.on('end', function () {
        console.log('文件上传成功!');

        let imgArray = [];

        yauzl.open(destPath, { lazyEntries: true }, function(err, zipfile) {
          if (err) throw err;

          zipfile.on('close', function () {
            console.log('---解压成功---');

            task.initialtor_name = ctx.state.user.name;
            task.upload_file = fileName;
            task.img_path = nowISOString;
            task.img_array = imgArray;
            resolve(task);
          });

          zipfile.on('error', function () {
            console.log('---解压失败---');
            errCenter.message = '解压失败';

            reject(errCenter);
          });

          zipfile.readEntry();
          zipfile.on('entry', function (entry) {
            zipfile.openReadStream(entry, function (err, readStream) {
              if (err) throw err;

              if (/\/$/.test(entry.fileName)) {
                errCenter.message = '压缩文件中不能包含文件夹!';
                zipfile.close();

                reject(errCenter);
              }

              // imgArray.push(`/public/${nowISOString}/${entry.fileName}`);
              imgArray.push(entry.fileName);

              const filter = new Transform();
              filter._transform= function (chunk, encoding, cb) {
                cb(null, chunk);
              };

              filter._flush = function (cb) {
                cb();
                zipfile.readEntry();
              };

              const writeStream = fs.createWriteStream(path.join(imgSaveTo, entry.fileName));
              readStream.pipe(filter).pipe(writeStream);
            })
          })
        });
      })
    })

    busboy.on('field', function (fieldname,  val, fieldnameTruncated, valTruncated, encoding, mimetype) {
      // console.log(`表单字段数据 [${filename}]: value: ${inspect(val)}` );
      task[fieldname] = val;
    })

    busboy.on('error', function (err) {
      console.log('文件上传出错');
      errCenter.message = '文件上传出错';

      reject(errCenter);
    })

    req.pipe(busboy);
  })

}

module.exports = uploadFile;
