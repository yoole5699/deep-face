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

const DispatchCard = ({
  unStartImgNum = 0, // TODO
  unFulfilledImgNum,
  imgFolderPath,
  imgArray,
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
            value={`${unStartImgNum}`}
          />
          <Count
            label="未开始"
            value={`${unFulfilledImgNum}`}
          />
        </CountArea>
        <Button type="primary" size="large">
          <Link to={`/task/${_id}?type=profile`}>查看任务</Link>
        </Button>
      </CountOutArea>
    </Layout>
  )
}

export default DispatchCard;
