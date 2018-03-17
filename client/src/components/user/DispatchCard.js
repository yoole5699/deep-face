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
  imgArrayStatus,
  title,
  desc,
  money,
  expireTime,
  _id,
}) => {
  return (
    <Layout>
      <Avatar src={`/${imgFolderPath}/${imgArray[0]}`} alt="封面"/>
      <Meta>
        <h4>{title}</h4>
        <EllipsisText desc={desc} />
        图片数量: {imgArray.length}
        <br />
        报酬：{money}元/张
        <br />
        截止日期：{new Date(expireTime).toLocaleDateString()}
      </Meta>
      <CountOutArea>
        <CountArea>
          <Count
            label="待审批"
            value={`${imgArrayStatus.filter(item => item.status === TASK_STATUS.WAITING_REVIEW).length}`}
          />
          <Count
            label="未开始"
            value={`${imgArray.length - imgArrayStatus.length}`}
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
