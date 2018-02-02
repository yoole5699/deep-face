import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Card } from 'antd';

const Grid = styled(Card.Grid)`
  height: 200px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  background-color: #F2F4F5;
`;

const WhiteBall = styled.div`
  height: 50px;
  width: 50px;

  background-color: white;
  border-radius: 50%;
`;

const LoadMore = () => (
  <Fragment>
    <Grid>
      <WhiteBall />
      <WhiteBall />
      <WhiteBall />
    </Grid>
  </Fragment>
)

export default LoadMore;
