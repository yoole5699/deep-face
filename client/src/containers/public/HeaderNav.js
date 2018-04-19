import React from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Menu, Row, Col } from 'antd';
import SearchInput from 'components/common/SearchInput';

const { Item } = Menu;

const HeaderNav = withRouter(({ location, children }) => (
  <Row style={{ position: 'static' }}>
    <Col span={22}>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        style={{ lineHeight: '64px' }}
      >
        <Item key="/"><Link to="/">任务广场</Link></Item>
        <Item key="/task-center"><Link to="/task-center">资源管理</Link></Item>
        <Item key="/person-center"><Link to="/person-center">个人成就</Link></Item>
        <Item key="/message-list"><Link to="/message-list">我的主页</Link></Item>
      </Menu>
    </Col>
    <SearchInput />
    <Col span={2}>{children}</Col>
  </Row>
))


export default HeaderNav;
