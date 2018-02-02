import React from 'react';
import TaskProfile from 'components/tasksquare/TaskProfile';
import DispatchTaskForm from 'components/tasksquare/DispatchTaskForm';
import { inject, observer } from 'mobx-react';
import { Spin } from 'antd';
import {
  Main,
} from 'components/user/Layout';

class TaskDetail extends React.Component {
  componentDidMount() {
    const { _id, taskStore, fetchTaskType } = this.props;
    taskStore.loadTask(_id, fetchTaskType);
  }

  render() {
    const { _id, taskStore, fetchTaskType } = this.props;
    const dataSource = taskStore.getTask(_id, fetchTaskType);
    const TaskDeatilComponent = fetchTaskType === 'origin' ? DispatchTaskForm : TaskProfile;

    return (
      <Spin size="large" spinning={taskStore[`is_${fetchTaskType}_loading`]}>
        <Main>
          {
            dataSource
              && <TaskDeatilComponent
                   {...dataSource}
                   {...this.props}
                 />
          }
        </Main>
      </Spin>
    )
  }
}


export default inject('taskStore')(observer(TaskDetail));
