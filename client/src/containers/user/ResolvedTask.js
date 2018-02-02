import React from 'react';
import { inject, observer } from 'mobx-react';
import { List, Spin, Button } from 'antd';
import TaskListCard from 'components/user/TaskListCard';

class FulfilledTaskList extends React.Component {
  componentDidMount() {
    this.props.taskStore.loadTaskList('fulfilled');
  }

  render() {
    const {
      isFulfilledLoading,
      fulfilledTaskList,
      loadFulfilledTaskList,
      hasFulfilledTaskUnfetch,
    } = this.props.taskStore;

    const loadMore = hasFulfilledTaskUnfetch ? (
      <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
        {isFulfilledLoading && <Spin />}
        {!isFulfilledLoading && <Button onClick={loadFulfilledTaskList}>加载更多</Button>}
      </div>
    ) : null;

    return (
      <List
        loading={isFulfilledLoading && fulfilledTaskList.length === 0}
        loadMore={loadMore}
        locale={{ emptyText: <h4>您的任务列表空空如也~</h4>}}
        dataSource={fulfilledTaskList}
        renderItem={(item) => (
          <TaskListCard
            {...item}
            type="fulfilled"
            key={item._id}
          />
        )}
      />
    )
  }
}

export default inject('taskStore')(observer(FulfilledTaskList));
