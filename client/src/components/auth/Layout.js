import React from 'react';
import styled from 'styled-components';
import { Card } from 'antd';
import LogoPNG from 'resource/image/Logo.png';

const Logo = styled.img.attrs({
  src: LogoPNG,
  alt: 'Deep Face'
})`
  margin: auto;

  width: 162px;
`;

const Layout = styled(Card).attrs({
  cover: (<Logo />),
  bordered: false,
})`
  position: absolute;
  top: 150px;
  right: 100px;

  width: 338px;
  min-height: 450px;

  background-color: rgb(64, 64, 64);
`;

export default Layout;
