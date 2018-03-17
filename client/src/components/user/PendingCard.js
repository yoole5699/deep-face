import React from 'react';
import { Link } from 'react-router-dom';
import { Tooltip, Button } from 'antd';
import {
  Avatar,
  Meta,
  Action,
  Status,
  TaskListCardLayout as Layout,
} from './CardLayout';
import { TASK_STATUS } from 'utils/const';

const PendingCard = (({
  imgFolderPath,
  imgArray,
  imgArrayStatus,
  title,
  desc,
  imgNum,
  money,
  expireTime,
  _id
}) => (
  <Layout>
    <Avatar src={`/${imgFolderPath}/${imgArray[0]}`} alt="封面"/>
    <Meta>
      <h4>{title}</h4>
      <div>
        <Tooltip title={desc}>{desc}</Tooltip>
        <br />
        图片数量: {imgNum}
        <br />
        报酬：{money}元/张
        <br />
        截止日期：{new Date(expireTime).toLocaleDateString()}
      </div>
    </Meta>
    <Action>
      <h4>标注进度</h4>
      <Status>{Math.round((imgArray.length - imgArrayStatus.filter(item => item.status === TASK_STATUS.PASS).length) / imgArray.length * 100) + '%'}</Status>
      <Button type="primary" size="large">
        <Link to={`/task/${_id}?type=profile`}>继续任务</Link>
      </Button>
    </Action>
  </Layout>
))

export default PendingCard;
