import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd';

const Main = styled.div`
  padding: 30px 35px 55px;
  min-height: 600px;
  background-color: #fff;
`;

const CountLabel = styled.h4`
  color: #101010;
`

const CountValue = styled.div`
  font-size: 48px;
  color: #1890ff;
`

const CountLayout = styled.div`
  flex-grow: 1;
`;

const Count = ({ value, label }) => (
  <CountLayout>
    <CountValue>{value}</CountValue>
    <CountLabel>{label}</CountLabel>
  </CountLayout>
)

const CountArea = styled.div`
  margin-bottom: 30px;

  display: flex;
  align-items: center;

  text-align: center;
`

const ShortDivider = styled.div`
  height: 77px;
  width: 1px;
  background-color: rgb(220, 226, 230);
`;

const LongDivider = styled.div`
  height: 130px;
  width: 1px;
  background-color: rgb(220, 226, 230);
`;

const TotalLayout = styled.div`
  flex-grow: 2;
`;

const TotalValue = styled.span`
  padding-left: 12px;
  color: rgb(255, 152, 0);
`;

const StrongLable = CountLabel.extend`
  height: 72px;
  line-height: 72px;
  font-weight: 700;
`;

const Total = ({ label, value }) => (
  <TotalLayout>
    <StrongLable>当前可兑换积分:<TotalValue>{value}</TotalValue></StrongLable>
    <Button type="primary" size="large" ghost>积分兑换</Button>
  </TotalLayout>
)

export {
  Main,
  CountLabel,
  CountValue,
  Count,
  CountArea,
  ShortDivider,
  LongDivider,
  Total,
  StrongLable,
}
