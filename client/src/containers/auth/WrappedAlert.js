import React from 'react';
import { inject, observer } from 'mobx-react';
import { Alert } from 'antd';
import styled from 'styled-components';

const AnimatedAlert = styled(Alert)`
  opacity: ${({ message }) => message ? 1 : 0};
  transition: all .5s ease;  
  margin-bottom: 32px !important;
`;

const WrappedAlert = inject('authStore')(observer(({ authStore }) => (
  <AnimatedAlert
    type="error"
    message={authStore.errors}
    closable
  />
)));

export default WrappedAlert;