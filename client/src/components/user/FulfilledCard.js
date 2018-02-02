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

const FulfilledCard = (({
  imgFolderPath,
  imgArray,
  title,
  desc,
  imgNum,
  money,
  expireTime,
  finishedStatus,
  parentTaskId
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
      <h4>完成时间</h4>
      <Status>{finishedStatus}</Status>
      <Button type="primary" size="large">
        <Link to={`/task/${parentTaskId}`}>查看任务</Link>
      </Button>
    </Action>
  </Layout>
))

export default FulfilledCard;
