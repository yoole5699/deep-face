import { extendObservable, action, when } from 'mobx';
import agent from 'utils/agent';
import io from 'socket.io-client';

class UserStore {

  constructor() {
    extendObservable(this, {
      currentUser: undefined,
      loadingUser: false,
      updatingUser: false,
      updatingUserErrors: undefined,

      currentPage: 0,
    });

    when(
      () => !!this.currentUser,
      () => {
        const ins = io('http://localhost:3002');

        ins.on('news', function (data) {
          console.log(data);
          // 发送事件到服务端
          // socket.emit('my other event', { my: 'data' });
        });

        ins.on('connection', (socket) => {
          console.log('a user client connected');
          socket.on('disconnect', function(){
            console.log('user client disconnected');
          });
        })
      }
    )
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

  resetCurrentPage = action(() => {
    this.currentPage = 0;
  })

  setCurrentPage = action(() => {
    this.currentPage++;

    const unSeenMessageIds = this.currentUser.comments
      .slice((this.currentPage - 1) * 10, this.currentPage * 10)
      .filter(item => !item.seen)
      .map(item => item._id);
    if (unSeenMessageIds.length !== 0) this.setMessageSeen(unSeenMessageIds);
  })

  setMessageSeen = action((messageArray) => {
    agent.User.messageSeen(messageArray);
  })

  deleteMessage = action((messageID) => {
    this.currentUser.comments = this.currentUser.comments.filter(item => item._id !== messageID);
    return agent.User.deleteMessage(messageID)
      .catch(action(err => {
        this.pullUser();
        throw err;
      }));
  })

  forgetUser = action(() => {
    this.currentUser = undefined;
  })

}

export default new UserStore();
