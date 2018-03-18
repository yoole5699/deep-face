import React from 'react';
import { Layout } from 'antd';
import HeaderNav from './public/HeaderNav';
import {
  TaskSteps,
  AntithesesSider,
  ReviewCard,
} from './review';
import BadgeAvatar from '../components/common/Avatar';
import { getImgPos } from 'utils/index';

const { Header, Sider, Content } = Layout;

const ReviewTask = (props) => {
  const imgPos = getImgPos();

  return (
    <Layout>
      <Header>
        <HeaderNav><BadgeAvatar /></HeaderNav>
      </Header>
      <TaskSteps {...props} />
      <Layout>
        <Content style={{ marginRight: '20px' }}>
          <ReviewCard {...props} imgPos={imgPos} />
        </Content>
        <Sider width={240}><AntithesesSider history={props.history} /></Sider>
      </Layout>
    </Layout>
  )
}

export default ReviewTask;
