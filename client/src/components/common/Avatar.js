import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Badge, Dropdown, Menu, Modal } from 'antd';
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

const LgAvatarLayout = Avatar.extend`
  width: 130px;
  height: 130px;
  cursor: pointer;
  opacity: ${({ actived }) => actived ? 0.7 : 1};
`;

class LgAvatar extends React.Component {
  state = {
    actived: false,
    modalVisible: false
  }

  mounseEnterHandler = () => {
    this.setState({
      actived: true
    });
  }

  mouseLeaveHandler = () => {
    this.setState({
      actived: false
    });
  }

  toggleModal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible
    });
  }

  render() {
    return (
      <div
        onMouseEnter={this.mounseEnterHandler}
        onMouseLeave={this.mouseLeaveHandler}
        onClick={this.toggleModal}
      >
        <LgAvatarLayout
          alt="头像"
          src={HEAD}
          actived={this.state.actived}
        />
        <Modal
          title="编辑个人信息"
          style={{ overflow: 'hidden' }}
          visible={this.state.modalVisible}
          onOk={this.toggleModal}
          onCancel={this.toggleModal}
        >
          <p>some contents...</p>
          <p>some contents...</p>
          <p>some contents...</p>
        </Modal>
      </div>
    )
  }
}

const menu = (
  <Menu>
    <Menu.Item>
      <Link to="/person-center">个人成就</Link>
    </Menu.Item>
    <Menu.Item>
      <Link to="/message-list">我的主页</Link>
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
