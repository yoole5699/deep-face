import React from 'react';
import { inject, observer } from 'mobx-react';

class AuthRedirect extends React.Component {
  componentDidMount() {
    if (!this.props.userStore.currentUser) {
      this.props.userStore.pullUser();
    }
  }

  render() {
    return null;
  }
}

export default inject('userStore')(observer(AuthRedirect));
