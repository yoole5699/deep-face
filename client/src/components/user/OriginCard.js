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

const OriginCard = ({
  pendingTaskNum = 0,
  fulfilledTaskNum = 0,
  allTaskNum = 0,
  imgFolderPath,
  imgArray,
  title,
  desc,
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
        <Button type="primary" size="large" style={{ alignSelf: 'center' }}>
          <Link to={`/task/${_id}?type=dispatch`}>分发任务</Link>
        </Button>
      </Meta>
      <CountOutArea>
        <CountArea>
          <Count
            label="领取度"
            value={`${pendingTaskNum}/${allTaskNum}`}
          />
          <Count
            label="完成度"
            value={`${fulfilledTaskNum}/${allTaskNum}`}
          />
        </CountArea>
        <Button type="primary" size="large">查看任务</Button>
      </CountOutArea>
    </Layout>
  )
}

export default OriginCard;
