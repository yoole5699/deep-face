import React from 'react';
import ReactDOM from 'react-dom';
import promiseFinally from 'promise.prototype.finally';
import App from './containers/App';
import 'index.css';
import registerServiceWorker from './registerServiceWorker';
import createBrowserHistory from 'history/createBrowserHistory';
import { Router } from 'react-router-dom';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';

import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import reviewStore from './stores/reviewStore';
import labelStore from './stores/labelStore';
import drawStore from './stores/drawStore';
import taskStore from './stores/taskStore';
import commonStore from './stores/commonStore';
import userStore from './stores/userStore';
import authStore from './stores/authStore';

const browserHistory = createBrowserHistory();
const routingStore = new RouterStore();

const stores = {
  reviewStore,
  drawStore,
  labelStore,
  taskStore,
  commonStore,
  userStore,
  authStore,
  routing: routingStore,
};

const history = syncHistoryWithStore(browserHistory, routingStore);

// For easier debugging
window._____APP_STATE_____ = stores;

promiseFinally.shim();
useStrict(true);

ReactDOM.render(
  <Provider {...stores}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
