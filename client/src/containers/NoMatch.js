import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
// import NoMatchPNG from 'resource/image/NoMatch.png';

const Layout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;

  padding-bottom: 40vh;

  font-size: 28px;
`;

const MarginLink = styled(Link)`
  margin-left: 1em;
`;

const NoMatch = () => (
  <Layout>
    <h1>404</h1>
    <p>Not Found</p>
    <p>你迷路啦<MarginLink to="/">返回首页</MarginLink></p>
  </Layout>
);

export default NoMatch;