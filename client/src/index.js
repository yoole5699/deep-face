import React from 'react';
import ReactDOM from 'react-dom';
import promiseFinally from 'promise.prototype.finally';
import App from './containers/App';
import 'index.css';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router } from 'react-router-dom';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';

import reviewStore from './stores/reviewStore';
import labelStore from './stores/labelStore';
import taskStore from './stores/taskStore';
import commonStore from './stores/commonStore';
import userStore from './stores/userStore';
import authStore from './stores/authStore';

const stores = {
  reviewStore,
  labelStore,
  taskStore,
  commonStore,
  userStore,
  authStore,
};

// For easier debugging
window._____APP_STATE_____ = stores;

promiseFinally.shim();
useStrict(true);

ReactDOM.render(
  <Provider {...stores}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
