import React from 'react';
import { Button } from 'antd';
import styled from 'styled-components';

const Group = Button.Group;

const Layout = styled.div`
  margin-top: 10px;

  display: flex;
  flex-direction: row-reverse;
`;

const LargeButton = styled(Button)`
  width: 60px;
`;

const ButtonArea = ({
  resetHandler,
  undoHandler,
  zoomInHandler,
  zoomOutHandler
}) => (
  <Layout>
    <Group>
      <LargeButton size="large" icon="shrink" onClick={zoomInHandler} />
      <LargeButton size="large" icon="arrows-alt" onClick={zoomOutHandler} />
    </Group>
  </Layout>
);

export default ButtonArea;
