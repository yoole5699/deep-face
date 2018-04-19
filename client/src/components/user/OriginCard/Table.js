import React from 'react';
import styled from 'styled-components';
import { Tag, Popconfirm } from 'antd';
import { TASK_KIND } from 'utils/const';
import { countImgStatus } from 'utils';

const TableLayout = styled.div`
  margin-top: 20px;
  width: 100%;
`;

const RowLayout = styled.div`
  display: flex;
  line-height: 30px;
`;

const TdCell = styled.div`
  flex: 1 0 20%;
  text-align: center;
`;

const HeadRow = styled(RowLayout)`
  color: #fff;
  background-color: #383838;
`;

const CompletedRow = styled(RowLayout)`
  background-color: #F2F2F2;
`;

const PendingRow = styled(RowLayout)`
  background-color: #FFF8F2;
`;

const THead = () => (
  <HeadRow>
    <TdCell>任务名</TdCell>
    <TdCell>任务类型</TdCell>
    <TdCell>领取人</TdCell>
    <TdCell>任务状态</TdCell>
    <TdCell>操作</TdCell>
  </HeadRow>
)

const TRow = ({
  data: {
    _id,
    title,
    specifiedExecutor,
    labels = [],
    kind,
  },
  style,
  deleteRow
}) => {
  const countResult = countImgStatus(labels);
  const isTaskCompleted = countResult[4] === labels.length;
  let Row = isTaskCompleted ? CompletedRow : PendingRow;

  return (
    <Row key={_id} style={style}>
      <TdCell>{title}</TdCell>
      <TdCell>{TASK_KIND[(kind && kind.t) || '1']}</TdCell>
      <TdCell>
        {specifiedExecutor === '全部' ? '暂无' : specifiedExecutor}
      </TdCell>
      <TdCell>{isTaskCompleted ? '已完成' : '未完成'}</TdCell>
      <TdCell>
        <Popconfirm
          title="Are you sure delete this task?"
          onConfirm={deleteRow.bind(null, _id)}
          okText="是的"
          cancelText="不了"
        >
          <Tag color="#E2060E">删除</Tag>
        </Popconfirm>
      </TdCell>
    </Row>
  );
};


export {
  TableLayout,
  THead,
  TRow,
}
