import React from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route, Redirect } from 'react-router';
import { Layout } from 'antd';
import {
  HeaderNav,
  PublicSider,
} from './public';
import {
  TaskList,
  TaskDetail,
  CreateTask,
} from './tasksquare';
import TaskCenter from './user/TaskCenter';
import UserInfo from './user';
import MessageList from './MessageList';

const { Header, Sider, Content } = Layout;

const PublicPage = ({ location, userStore }) => (
  <Layout>
    <Layout style={{ marginRight: '20px' }}>
      <Header>
        <HeaderNav />
      </Header>
      <Content style={{ marginTop: '20px' }}>
        <Switch>
          <Route
            exact
            path="/"
            render={({ location, history, match }) => (
              <TaskList />
            )}
          />
          <Route
            exact
            path="/task-center"
            render={({ location, history, match }) => (
              <TaskCenter />
            )}
          />
          <Route
            exact
            path="/person-center"
            render={({ location, history, match }) => (
              <UserInfo />
            )}
          />
          <Route
            exact
            path="/task"
            component={({ location, history }) => {
              if (location.search.indexOf('type=create') !== -1) {
                return <CreateTask history={history} />
              }

              return <Redirect to="/" />
            }}
          />
          <Route
            exact
            path="/task/:_id"
            render={({ location, history, match }) => {
              const type = location.search.split('=')[1];
              const _id = match.params._id;

              let fetchTaskType;
              switch (type) {
                // 任务介绍、任务图片选择、任务审批、任务详情（标注页面）、分发任务配置
                case 'intro':
                case 'review':
                case 'profile': fetchTaskType = 'dispatch'; break;
                case 'dispatch': fetchTaskType = 'origin'; break;
                default: return <Redirect to="/" />
              }

              return (
                <TaskDetail
                  _id={_id}
                  type={type}
                  history={history}
                  fetchTaskType={fetchTaskType}
                />
              )
            }}
          />
          <Route
            exact
            path="/message-list"
            component={MessageList}
          />
          <Route
  					component={() => (
  						<Redirect to="/404" />
  					)}
  				/>
        </Switch>
      </Content>
    </Layout>
    <Sider width={240}>
      <PublicSider location={location} />
    </Sider>
  </Layout>
)

export default inject('userStore')(observer(PublicPage));
