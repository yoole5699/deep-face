exports.getSuffixName = function (fileName) {
  let nameList = fileName.split('.');
  return nameList[nameList.length - 1];
};
