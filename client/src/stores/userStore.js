import { extendObservable, action } from 'mobx';
import agent from 'utils/agent';

class UserStore {

  constructor() {
    extendObservable(this, {
      currentUser: undefined,
      loadingUser: false,
      updatingUser: false,
      updatingUserErrors: undefined,
    });
  }

  pullUser = action(() => {
    this.loadingUser = true;
    return agent.Auth.current()
      .then(action(({ data }) => { this.currentUser = data; }))
      .finally(action(() => { this.loadingUser = false; }))
  })

  updateUser = action((newUser) => {
    this.updatingUser = true;
    return agent.Auth.save(newUser)
      .then(action(({ user }) => { this.currentUser = user; }))
      .finally(action(() => { this.updatingUser = false; }))
  })

  forgetUser = action(() => {
    this.currentUser = undefined;
  })

}

export default new UserStore();
