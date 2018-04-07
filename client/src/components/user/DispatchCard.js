import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import {
  Avatar,
  Meta,
  EllipsisText,
  TaskListCardLayout as Layout,
  Count,
  CountArea,
  CountOutArea,
} from './CardLayout';
import { TASK_STATUS } from 'utils/const';

const DispatchCard = ({
  imgFolderPath,
  imgArray,
  labels,
  title,
  desc,
  money,
  expireTime,
  _id,
}) => {
  let waitingReviewNum = 0;
  let unstartNum = 0;
  labels.forEach(item => {
    item.status === TASK_STATUS.WAITING_REVIEW && waitingReviewNum++;
    item.status === TASK_STATUS.UN_START && unstartNum++;
  })

  return (
    <Layout>
      <Avatar src={`/${imgFolderPath}/${labels[0].name}`} alt="封面"/>
      <Meta>
        <h4>{title}</h4>
        <EllipsisText desc={desc} />
        图片数量: {labels.length}
        <br />
        报酬：{money}元/张
        <br />
        截止日期：{new Date(expireTime).toLocaleDateString()}
      </Meta>
      <CountOutArea>
        <CountArea>
          <Count
            label="待审批"
            value={waitingReviewNum}
          />
          <Count
            label="未开始"
            value={unstartNum}
          />
        </CountArea>
        <Button type="primary" size="large">
          <Link to={`/task/${_id}?type=review`}>查看任务</Link>
        </Button>
      </CountOutArea>
    </Layout>
  )
}

export default DispatchCard;
