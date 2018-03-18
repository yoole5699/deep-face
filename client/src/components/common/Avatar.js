import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Badge, Dropdown, Menu } from 'antd';
import { inject, observer } from 'mobx-react';
import HEAD from '../../resource/image/avatar.png';
import { logout } from '../../utils/agent';

const Avatar = styled.img`
  border-radius: 50%;
`

const SmAvatar = Avatar.extend`
  width: 40px;
  height: 40px;
`

const MdAvatar = Avatar.extend`
  width: 60px;
  height: 60px;
`

const LgAvatar = Avatar.extend`
  width: 130px;
  height: 130px;
`

const menu = (
  <Menu>
    <Menu.Item>
      <Link to="/person-center">个人中心</Link>
    </Menu.Item>
    <Menu.Item>
      <Link to="/message-list">消息列表</Link>
    </Menu.Item>
    <Menu.Item>
      <a onClick={logout}>登出</a>
    </Menu.Item>
  </Menu>
);

const BadgeAvatar = inject('userStore')(
  observer(({ userStore: { currentUser } }) => (
    <Dropdown overlay={menu} placement="bottomCenter">
      <Badge count={currentUser.comments.length}>
        <SmAvatar src={HEAD} alt="头像" />
      </Badge>
    </Dropdown>
  ))
);


export {
  SmAvatar,
  MdAvatar,
  LgAvatar,
};

export default BadgeAvatar;
