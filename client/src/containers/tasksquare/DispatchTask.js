import React from 'react';
import { Spin } from 'antd';
import { inject, observer } from 'mobx-react';
import DispatchTaskForm from 'components/tasksquare/DispatchTaskForm';
import { Main } from 'components/user/Layout';

class DispatchTask extends React.Component {
  componentDidMount() {
    const { _id, taskStore } = this.props;
    taskStore.loadTask(_id, 'origin');
  }

  render() {
    const { _id, taskStore, history } = this.props;
    const dataSource = taskStore.getTask(_id, 'origin');

    return (
      <Spin size="large" spinning={taskStore.is_origin_loading}>
        <Main>
          {
            dataSource
              && <DispatchTaskForm
                   {...dataSource}
                   history={history}
                   dispatchTask={taskStore.dispatchTask}
                 />
          }
        </Main>
      </Spin>
    )
  }
}

export default inject('taskStore')(observer(DispatchTask));
