import React from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import { Icon } from 'antd';
import { transferDateToString, countImgStatus } from 'utils';
import { TASK_STATUS } from 'utils/const';

const Layout = styled.div`
  padding: 10px;
  color: #fff;
`;

const TaskDescribtion = ({ taskStore, _id, }) => {
  const dataSource = taskStore.getTask(_id, 'dispatch');

  if (dataSource) {
    const { title, desc, money, expireTime, label } = dataSource;
    const countResult = countImgStatus(label);

    return (
      <Layout>
        <Icon type="check-circle-o" style={{ fontSize: 20, marginRight: 10 }}/>
        <span style={{ fontSize: 20 }}>{title}</span>
        <div style={{ marginTop: 20, color: 'rgb(187, 187, 187)' }}>
          <div style={{ marginBottom: 20 }}>
            {desc}
            <br />
            {`报酬: ${money} 元/张`}
          </div>
          <div>
            {`任务进度: ${label.filter(item => item.status === TASK_STATUS.PASS || item.status === TASK_STATUS.WAITING_REVIEW).length} / ${label.length}`}
            <br />
            {`未开始图片数: ${countResult[0]}`}
            <br />
            {`已暂存图片数: ${countResult[1]}`}
            <br />
            {`待审批图片数: ${countResult[2]}`}
            <br />
            {`被驳回图片数: ${countResult[3]}`}
            <br />
            {`已通过图片数: ${countResult[4]}`}
            <br />
            {`截止时间: ${transferDateToString(expireTime)}`}
          </div>
        </div>
      </Layout>
    )
  }

  return null;
}

export default inject('taskStore')(observer(TaskDescribtion));
