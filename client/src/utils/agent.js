import commonStore from '../stores/commonStore';
import authStore from '../stores/authStore';

import { Modal } from 'antd';

const API_ROOT = '/api';

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response.json();
  }
  console.log(response.statusText, '---response.statusText---');
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

const requestPlain = (url, options) => {
  const DEFAULT_OPTIONS = {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${commonStore.token}`,
    },
    method: 'POST',
  };

  const fetchOptions = { ...DEFAULT_OPTIONS, ...options };
  return fetch(url, fetchOptions)
    .then(checkStatus)
    .then(data => {
      if (data.code === 200) {
        return Promise.resolve(data)
      } else if (data.code === 401) {
        logout();
      }

      return Promise.reject(data);
    })
}

const requests = {
  del: url => requestPlain(`${API_ROOT}${url}`, { method: 'delete' }),
  get: url => requestPlain(`${API_ROOT}${url}`, { method: 'GET' }),
  put: (url, body) => requestPlain(`${API_ROOT}${url}`, { method: 'PUT', body }),
  post: (url, body) => requestPlain(`${API_ROOT}${url}`, body),
};

const Auth = {
  current: () =>
    requests.get('/user/info'),
  login: ({ userName, password }) =>
    requests.post('/user/login', { body: JSON.stringify({ userName, password }) }),
  register: ({ userName, password }) =>
    requests.post('/user/register', { body: JSON.stringify({ userName, password }) }),
  save: user =>
    requests.put('/user', { body: JSON.stringify({ user }) })
};

const User = {
  messageSeen: data => requests.put('/user/message',  JSON.stringify({ data })),
  deleteMessage: _id => requests.del(`/user/message/${_id}`)
}

const MyTask = {
  all: (type, offset, number) => requests.get(`/mytasks?type=${type}&offset=${offset}&number=${number}`),
  one: (_id, type) => requests.get(`/task/${_id}?type=${type}`),
  oneAllSub: (_id) => requests.get(`/task/${_id}/sub`)
}

const Label = {
  one: (task) => requests.get(`/task/label?img_name=${task.imgName}&img_path=${task.imgFolderPath}&task_id=${task._id}`),
  file: (path, _id) => requests.get(`/label/file?file_path=${encodeURIComponent(path)}&task_id=${_id}`),
  update: (data) => requests.put(`/task/label`, JSON.stringify(data)),
  updateStatus: (data) => requests.post(`/task/label/status`, { body: JSON.stringify(data) }),
}

const Common = {
  all: (offset, number) => requests.get(`/tasks?offset=${offset}&number=${number}`),
  search: (keyword) => requests.get(`/search?keyword=${keyword}`),
  upload: (formData) => requests.post(`/task`, { headers: {
    Authorization: `Bearer ${commonStore.token}`,
  }, body: formData }),
  dispatch: (data) => requests.post(`/task/sub`, { body: JSON.stringify(data) }),
  user_list: (keyword) => requests.get(`/users?keyword=${keyword}&limit=10`),
}

export default {
  Auth,
  User,
  MyTask,
  Label,
  Common,
};

export function logout() {
  authStore.logout();
  Modal.warn({
    title: '登录已过期，请重新登录!',
    onOk: () => {
      window.location.href = '/login';
    }
  });
}
