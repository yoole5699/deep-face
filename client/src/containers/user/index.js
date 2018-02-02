import React from 'react';
import { inject, observer } from 'mobx-react';
import TaskList from './TaskList'
import {
  Main,
  Count,
  CountArea,
  ShortDivider,
  LongDivider,
  Total,
  StrongLable,
} from 'components/user/Layout';

const PersonalCenter = ({ userStore }) => (
  <Main>
    <CountArea>
      <Count label="任务次数" value={userStore.currentUser.taskTotalNum || 0} />
      <ShortDivider />
      <Count label="标注图片" value={userStore.currentUser.labelImgNum || 0} />
      <ShortDivider />
      <Count label="获得报酬" value={userStore.currentUser.converedMoneyTotal || 0} />
      <LongDivider />
      <Total value={userStore.currentUser.UnconveredMoneyTotal || 0} />
    </CountArea>
    <StrongLable>进行中的任务</StrongLable>
    <TaskList type="pending" />
    <StrongLable>已完成的任务</StrongLable>
    <TaskList type="fulfilled" />
  </Main>
)

export default inject('userStore')(observer(PersonalCenter));
