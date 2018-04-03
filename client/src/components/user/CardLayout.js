import React from 'react';
import styled from 'styled-components';
import { Tooltip } from 'antd';
import { EllipsisTextBase } from '../common';
const TaskListCardLayout = styled.div`
  padding: 20px 35px;
  margin-bottom: 10px;

  display: flex;
  flex-wrap: wrap;
  border: 1px solid rgb(245, 245, 245);

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
    border-color: rgba(0, 0, 0, 0.09);
  }
`;

const Avatar = styled.img`
  margin-right: 20px;

  width: 100px;
  height: 125px;
`;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Meta = Layout.extend`
  flex-grow: 1;

  line-height: ${props => props.type === 'profile' ? 2 : 1.5};
  color: rgb(143, 142, 148);
`;

const Action = styled.div`
  text-align: right;
`

const Status = styled.div`
  color: rgb(139, 195, 74);
  font-size: 36px;
`;

const Text = EllipsisTextBase.extend`
  width: 245px;
`;

const EllipsisText = ({ desc }) => (
  <Tooltip
    placement="bottom"
    title={desc}
  >
    <Text>{desc}</Text>
  </Tooltip>
)

const CountLabel = styled.h4`
  color: rgb(152, 154, 158);
`;

const CountValue = styled.div`
  font-size: 28px;
  color: rgb(255, 61, 0);
`;

const CountLayout = styled.div`
  text-align: center;
  flex-grow: 1;
`;

const Count = ({ value, label }) => (
  <CountLayout>
    <CountValue>{value}</CountValue>
    <CountLabel>{label}</CountLabel>
  </CountLayout>
)

const CountArea = styled.div`
  display: flex;
  width: 170px;
`;

export {
  TaskListCardLayout,
  Avatar,
  Layout as CountOutArea,
  Meta,
  EllipsisText,
  Action,
  Status,
  Count,
  CountArea,
}
