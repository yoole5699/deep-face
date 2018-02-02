import React, { Fragment } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import SearchInput from 'components/common/SearchInput';

const { Item } = Menu;

const HeaderNav = withRouter(({ location }) => (
  <Fragment>
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={[location.pathname]}
      style={{ lineHeight: '64px' }}
    >
      <Item key="/"><Link to="/">任务广场</Link></Item>
      <Item key="/task-center"><Link to="/task-center">资源管理</Link></Item>
      <Item key="/person-center"><Link to="/person-center">个人中心</Link></Item>
    </Menu>
    <SearchInput />
  </Fragment>
))


export default HeaderNav;
