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
  labels,
  title,
  desc,
  money,
  expireTime,
  _id
}) => (
  <Layout>
    <Avatar src={`/${imgFolderPath}/${labels[0].name}`} alt="封面"/>
    <Meta>
      <h4>{title}</h4>
      <div>
        <Tooltip title={desc}>{desc}</Tooltip>
        <br />
        图片数量: {labels.length}
        <br />
        报酬：{money}元/张
        <br />
        截止日期：{new Date(expireTime).toLocaleDateString()}
      </div>
    </Meta>
    <Action>
      <h4>完成时间</h4>
      <Status>{new Date(labels.reduce((prev, cur) => Math.max(Date.parse(cur.lastUpdateAt), prev), 0)).toLocaleDateString()}</Status>
      <Button type="primary" size="large">
        <Link to={`/task/${_id}?type=profile`}>查看任务</Link>
      </Button>
    </Action>
  </Layout>
))

export default FulfilledCard;
