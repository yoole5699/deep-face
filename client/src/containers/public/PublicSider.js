import React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import HEAD from '../../resource/image/avatar.png';
import { MdAvatar, LgAvatar, Divider, TaskItem } from 'components/common';
import { Row, Col, List, Button } from 'antd';

class PublicSider extends React.Component {
  componentDidMount() {
    if (!this.props.userStore.currentUser) {
      this.props.userStore.pullUser();
    }
  }

  render() {
    const { userName, desc = '软件学院·好孩子', tasks } = this.props.userStore.currentUser || {};
    const { location } = this.props;

    if (location.pathname === '/person-center') {
      return (
        <div style={{ padding: '44px 20px 0', textAlign: 'center' }}>
          <LgAvatar large src={HEAD} alt="头像" />
          <h2 style={{ color: 'white', fontSize: 28, marginTop: 20 }}>{userName}</h2>
          <div style={{ color: 'rgb(152, 154, 158)' }}>{desc}</div>
            <Button
              size="large"
              style={{ marginTop: 60, width: 170 }}
            >
              <Link to="/task?type=create">发布任务</Link>
            </Button>
        </div>
      )
    }

    return (
      <div style={{ padding: '44px 20px 0'}}>
        <Row>
          <Col span={8}><MdAvatar src={HEAD} alt="头像" /></Col>
          <Col span={16} style={{ textAlign: 'center' }}>
            <h2 style={{ color: 'white' }}>{userName}</h2>
            <div style={{ color: 'rgb(152, 154, 158)' }}>{desc}</div>
          </Col>
        </Row>
        <Divider />
        <List
          locale={{ emptyText: <h4 style={{ color: 'white' }}>您的任务列表空空如也~</h4>}}
          dataSource={tasks}
          renderItem={item => (
              <TaskItem {...item} key={item.title}/>
          )}
        />
      </div>
    )
  }
}

export default inject('userStore')(observer(PublicSider));
