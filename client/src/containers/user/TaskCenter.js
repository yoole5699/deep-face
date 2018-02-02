import React from 'react';
import { inject, observer } from 'mobx-react';
import TaskList from './TaskList';
import {
  Main,
  StrongLable,
} from 'components/user/Layout';

const TaskCenter = ({ userStore }) => (
  <Main>
    <StrongLable>我创建的任务</StrongLable>
    <TaskList type="origin" />
    <StrongLable>我发布的任务</StrongLable>
    <TaskList type="dispatch" />
  </Main>
)

export default inject('userStore')(observer(TaskCenter));
