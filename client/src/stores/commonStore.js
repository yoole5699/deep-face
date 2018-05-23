import { extendObservable, action, reaction } from 'mobx';
import agent from 'utils/agent';
import taskStore from './taskStore';

class CommonStore {

  constructor() {
    extendObservable(this, {
       token: window.localStorage.getItem('jwt'),

       // 任务广场的任务列表
       offset: 0,
       pubTasks: [],
       isLoading: false,
       hasTaskUnfetch: true,

    });

    reaction(
      () => this.token,
      token => {
        if (token) {
          window.localStorage.setItem('jwt', token);
        } else {
          window.localStorage.removeItem('jwt');
        }
      }
    );
  }

  reset = action(() => {
    this.pubTasks.clear();
    this.offset = 0;
    this.hasTaskUnfetch = false;
  })

  setToken = action((token) => {
    this.token = token;
  })

  asyncAction = action((func) => {
    this.isLoading = true;
    func.finally(action(() => { this.isLoading = false; }));
  })

  loadPubTasks = action(() => {
    this.asyncAction(
      agent.Common.all(this.offset, 10)
        .then(action(({ data }) => {
          this.pubTasks = this.pubTasks.concat(data);
          this.offset += data.length;
          this.hasTaskUnfetch = data.length === 10;
        }))
    )
  })

  searchTaskList = action((keyword) => {
    this.reset();
    this.asyncAction(
      agent.Common.search(keyword)
        .then(action(({ data }) => {
          this.pubTasks.concat(data);
        }))
    );
  })

  uploadTask = action((formData) => {
    return agent.Common.upload(formData)
      .then(action(({ data }) => {
        taskStore.origin_task.set(data._id, data);
        return data;
      }));
  })
}

export default new CommonStore();
