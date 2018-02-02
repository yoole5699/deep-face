import React from 'react';
import { Layout } from 'antd';
import HeaderNav from './public/HeaderNav';
import {
  TaskSteps,
  AntithesesSider,
  EditingCard,
} from './taskspace';

const { Header, Sider, Content } = Layout;

const TaskSpace = (props) => (
  <Layout>
    <Header>
      <HeaderNav />
    </Header>
    <TaskSteps />
    <Layout>
      <Content style={{ marginRight: '20px' }}>
        <EditingCard {...props} />
      </Content>
      <Sider width={240}><AntithesesSider /></Sider>
    </Layout>
  </Layout>
)

export default TaskSpace;
