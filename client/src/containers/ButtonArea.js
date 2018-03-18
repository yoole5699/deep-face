import React from 'react';
import { Button } from 'antd';
import styled from 'styled-components';

const Group = Button.Group;

const Layout = styled.div`
  margin-top: 10px;

  display: flex;
  justify-content: space-between;
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
      <LargeButton size="large" icon="reload" onClick={resetHandler} />
      <LargeButton size="large" icon="close" onClick={undoHandler} />
    </Group>
    <Group>
      <LargeButton size="large" icon="shrink" onClick={zoomInHandler} />
      <LargeButton size="large" icon="arrows-alt" onClick={zoomOutHandler} />
    </Group>
  </Layout>
);

export default ButtonArea;
