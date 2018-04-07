import React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { List, Button, Icon } from 'antd';
import { Main } from 'components/user/Layout';
import { TASK_STATUS } from 'utils/const';

class MessageList extends React.Component {
  componentWillUnmount() {
    this.props.userStore.resetCurrentPage();
  }

  componentDidMount() {
    // TODO服务端主动信息推送
    const { pullUser, setCurrentPage } = this.props.userStore;
    pullUser().then(() => {
      setCurrentPage();
    });
  }

  render() {
    const { userStore } = this.props;
    const currentShowNum = userStore.currentPage * 10;
    const loadMore = currentShowNum < userStore.currentUser.comments.length ? (
      <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
        <Button onClick={userStore.setCurrentPage}>加载更多</Button>
      </div>
    ) : null;

    return (
      <Main>
        <List
          loading={userStore.loadingUser}
          locale={{ emptyText: <h4>您暂未收到任何消息~</h4>}}
          dataSource={userStore.currentUser.comments.slice(0, currentShowNum)}
          loadMore={loadMore}
          renderItem={item => (
            <List.Item
              actions={[
                <Link to={`/task/${item.taskId}?type=profile`}>查看任务</Link>,
                <a onClick={userStore.deleteMessage.bind(this, item._id)}>删除</a>]}
            >
              <List.Item.Meta
                avatar={(item.status === TASK_STATUS['PASS'] && <Icon style={{ color: '#4cae4c', fontSize: 69 }} type="check" />) ||(
                item.status === TASK_STATUS['REJECTED'] && <Icon style={{ color: 'red', fontSize: 69 }} type="close" />)}
                title={`${item.taskTitle} - ${item.imgName}`}
                description={`${item.senderName} ${new Date(item.create_at).toLocaleString()}`}
              />
              <div>
                {item.comment}
              </div>
            </List.Item>
          )}
        />
      </Main>
    )
  }
}

export default inject('userStore')(observer(MessageList));
