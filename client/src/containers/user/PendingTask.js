import React from 'react';
import { inject, observer } from 'mobx-react';
import { List, Spin, Button } from 'antd';
import TaskListCard from 'components/user/TaskListCard';

class PendingTaskList extends React.Component {
  componentDidMount() {
    this.props.taskStore.loadTaskList('pending');
  }

  render() {
    const {
      isPendingLoading,
      pendingTaskList,
      loadPendingTaskList,
      hasPendingTaskUnfetch,
    } = this.props.taskStore;

    const loadMore = hasPendingTaskUnfetch ? (
      <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
        {isPendingLoading && <Spin />}
        {!isPendingLoading && <Button onClick={loadPendingTaskList}>加载更多</Button>}
      </div>
    ) : null;

    return (
      <List
        loading={isPendingLoading && pendingTaskList.length === 0}
        loadMore={loadMore}
        locale={{ emptyText: <h4>您的任务列表空空如也~</h4>}}
        dataSource={pendingTaskList}
        renderItem={(item) => (
          <TaskListCard
            {...item}
            type="pending"
            key={item._id}
          />
        )}
      />
    )
  }
}

export default inject('taskStore')(observer(PendingTaskList));
