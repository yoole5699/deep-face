import React from 'react';
import { inject, observer } from 'mobx-react';
import { List } from 'antd';
import TaskCard from 'components/tasksquare/TaskCard';
import LoadMore from 'components/tasksquare/LoadMore';
import BlankList from 'components/tasksquare/BlankList';

class TaskList extends React.Component {
  componentDidMount() {
    this.props.commonStore.reset();
    this.props.commonStore.loadPubTasks();
  }

  componentWillUnmount() {
    this.props.commonStore.reset();
  }

  render() {
    const { pubTasks, isLoading, hasTaskUnfetch } = this.props.commonStore;

    return (
      <List
        grid={{ column: 2 }}
        loading={isLoading}
        loadMore={hasTaskUnfetch && <LoadMore />}
        locale={{ emptyText: <BlankList /> }}
        dataSource={pubTasks}
        renderItem={item => (
          <List.Item key={item.id}>
            <TaskCard {...item} />
          </List.Item>
          )
        }
      />
    )
  }
}

export default inject('commonStore')(observer(TaskList));
