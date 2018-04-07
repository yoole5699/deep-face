import { extendObservable, action, observable, computed } from 'mobx';
import agent from '../utils/agent';

const LIMIT = 5;

export class TaskStore {

  constructor() {
    let data = {};
    ['pending', 'fulfilled', 'origin', 'dispatch'].forEach(item => {
      data[`is_${item}_loading`] = false;
      data[`${item}_offset`] = 0;
      data[`has_${item}_task_unfetch`] = true;
      data[`${item}_task`] = observable.map();
      data[`${item}_task_list`] = computed(function () {
        return this[`${item}_task`].values().slice(0, this[`${item}_offset`]);
      });
    });

    extendObservable(this, data);
  }

  reset() {
    ['pending', 'fulfilled', 'origin', 'dispatch'].forEach(item => {
      this[`is_${item}_loading`] = false;
      this[`${item}_offset`] = 0;
      this[`has_${item}_task_unfetch`] = true;
      this[`${item}_task`].clear();
    })
  }

  getTask(_id, type) {
    return this[`${type}_task`].get(_id);
  }

  asyncAction = action((promise, type) => {
    this[`is_${type}_loading`] = true;
    return promise.finally(action((data) => {
      this[`is_${type}_loading`] = false;
      return data;
    }));
  })

  loadTask = action((_id, type) => {
    return this.asyncAction(
      agent.MyTask.one(_id, type)
        .then(action(({ data }) => {
          this[`${type}_task`].set(_id, data);
        })),
      type
    );
  })

  loadTaskList = action((type, offset) => {
    return this.asyncAction(
      agent.MyTask.all(type, offset === 0 ? 0 : this[`${type}_offset`], LIMIT)
        .then(action(({ data }) => {
          data.forEach((value) => this[`${type}_task`].set(value._id, value));
          this[`${type}_offset`] = offset === 0
            ? data.length
            : this[`${type}_offset`] + data.length;
          this[`has_${type}_task_unfetch`] = data.length === 5;
        })),
      type
    )
  })

  dispatchTask = action((task) => {
    return this.asyncAction(agent.Common.dispatch(task), 'origin');
  })

  deleteTask = action((_id, type) => {
    this[`${type}_task`].delete(_id);
    return agent.MyTask.delOne(_id, type)
      .catch(action(err => {
        this.loadTaskList(type);
        throw err;
      }));
  })

  // @action deleteTask(_id) {
  //   this.tasksRegistry.delete(_id);
  //   return agent.Task.del(_id)
  //     .catch(action(err => { this.loadTasks(); throw err; }));
  // }
}

export default new TaskStore();
