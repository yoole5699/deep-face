import { extendObservable, action } from 'mobx';
import agent from 'utils/agent';
import userStore from './userStore';
import commonStore from './commonStore';

class AuthStore {

  constructor() {
    extendObservable(this, {
      inProgress: false,
      errors: undefined,
    })
  }

  login = action((formData) => {
    this.reset();
    return agent.Auth.login(formData)
      .then(({ token }) => commonStore.setToken(token))
      .then(() => userStore.pullUser())
      .catch(this.setError)
      .finally(action(() => { this.inProgress = false; }));
  })

  register = action((formData) => {
    this.reset();
    return agent.Auth.register(formData)
      .catch(this.setError)
      .finally(action(() => { this.inProgress = false; }));
  })

  registerAndLogin = action((formData) => {
    this.reset();
    return agent.Auth.register(formData)
      .then(() => agent.Auth.login(formData))
      .then(({ token }) => commonStore.setToken(token))
      .then(() => userStore.pullUser())
      .catch(this.setError)
      .finally(action(() => { this.inProgress = false; }))
  })

  reset = action(() => {
    this.inProgress = false;
    this.errors = undefined;
  })

  setError = action((err) => {
    this.errors = err.message;
  })

  logout = action(() => {
    commonStore.setToken(undefined);
    userStore.forgetUser();
    return new Promise(res => res());
  })
}

export default new AuthStore();
