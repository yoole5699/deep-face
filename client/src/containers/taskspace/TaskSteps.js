import React from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import { Steps, Icon } from 'antd';
import { STEPS, DRAW_STEPS } from 'utils/const';
const { Step } = Steps;

const WrappedSteps = styled(Steps)`
  margin: 30px 0 !important;
`;

const TaskSteps = ({ labelStore }) => {
  const { task = { kind: { t: '0' } } } = labelStore;
  let steps;
  switch (task.kind.t) {
    case '1':
      steps = STEPS;
      break;

    case '2':
      steps = DRAW_STEPS;
      break;

    default:
      steps = [{ title: '加载中', icon: <Icon type="loading" /> }];
      break;
  }

  return (
    <WrappedSteps current={labelStore.current}>
      {steps.map(item => <Step key={item.title} {...item} />)}
    </WrappedSteps>
  )
}

export default inject('labelStore')(observer(TaskSteps));
