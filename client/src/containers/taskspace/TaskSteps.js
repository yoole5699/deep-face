import React from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import { Steps } from 'antd';
import { steps } from 'utils/const';
const { Step } = Steps;

const WrappedSteps = styled(Steps)`
  margin: 30px 0 !important;
`;

const TaskSteps = ({ labelStore: { current } }) => (
   <WrappedSteps current={current}>
     {steps.map(item => <Step key={item.title} title={item.title} />)}
   </WrappedSteps>
)

export default inject('labelStore')(observer(TaskSteps));
