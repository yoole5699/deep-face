import React from 'react';
import { inject, observer } from 'mobx-react';
import { List, Spin, Button } from 'antd';
import TaskCard from 'components/user/TaskCard';

class TaskList extends React.Component {
  componentDidMount() {
    this.loadTaskList();
  }

  loadTaskList = () => {
    const { taskStore, type } = this.props;
    taskStore.loadTaskList(type);
  }

  render() {
    const { taskStore, type } = this.props;

    const {
      [`is_${type}_loding`]: isLoading,
      [`${type}_task_list`]: taskList,
      [`has_${type}_task_unfetch`]: hasTaskUnfetch,
    } = taskStore;

    const loadMore = hasTaskUnfetch ? (
      <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
        {isLoading && <Spin />}
        {!isLoading && <Button onClick={this.loadTaskList}>加载更多</Button>}
      </div>
    ) : null;

    return (
      <List
        loading={isLoading && taskList.length === 0}
        loadMore={loadMore}
        locale={{ emptyText: <h4>您的任务列表空空如也~</h4>}}
        dataSource={taskList}
        renderItem={(item) => {
          const Module = TaskCard(type);

          return (
            <Module
              {...item}
              key={item._id}
            />
          )
        }}
      />
    )
  }
}

export default inject('taskStore')(observer(TaskList));
