const getCookieObj = () => {
  return (
    document['cookie']
      .split(/;\s+/)
      .reduce((cookieObj, item) => {
        const [ key, value ] = item.split('=');
        cookieObj[key] = value;
        return cookieObj;
      }, {})
  )
}

const getCookieByKey = (key) => {
  return getCookieObj()[key];
}

const setCookieByKey = (key, value, expireSeconds) => {
  const expires = expireSeconds ? new Date(new Date().getTime() + expireSeconds * 1000).toGMTString() : '';
  document['cookie'] = `${key}=${value}; expires=${expires}; path=/`
}

const removeCookieByKey = (key) => {
  const hasPassedTime = new Date(new Date().getTime() - 1).toGMTString();
  document['cookie'] = `${key}=; expires=${hasPassedTime}; path=/`;
}

const firstLetterUpperCase = (item) => item.replace(/^\S/g, (letter) => letter.toUpperCase());

const transferDateToString = (data) => new Date(data).toLocaleDateString();

const getImgPos = () => {
  const reg = /^\?imgPos=([\d]*)/;
  const regRes = reg.exec(window.location.search);
  const imgPos = regRes && regRes[1];

  return parseInt(imgPos, 10) || 0;
}

const countImgStatus = (imgArrayStatus) => {
  let hash = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
  imgArrayStatus.forEach(item => {
    hash[item.status]++;
  });
  return hash;
}

export {
  getCookieObj,
  getCookieByKey,
  setCookieByKey,
  removeCookieByKey,
  firstLetterUpperCase,
  transferDateToString,
  getImgPos,
  countImgStatus
}
