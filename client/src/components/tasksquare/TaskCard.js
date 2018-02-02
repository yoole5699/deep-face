import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Card, Button, Tooltip } from 'antd';
import { EllipsisTextBase } from '../common';
import { transferDateToString } from 'utils';

const Avatar = styled.img`
  width: 100px;
  height: 120px;
`;

const EllipsisText = EllipsisTextBase.extend`
  width: 200px;
`

const Description = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 85px;
  font-size: 12px;
`;

const TaskCard = ({
  title,
  _id,
  imgFolderPath,
  desc,
  imgArray,
  money,
  expireTime,
  progress,
  unFulfilledImgNum,
}) => (
  <Card
    hoverable
    actions={[
      <span>报酬：{money}元/张</span>,
      <Button type="primary" size="small">
        <Link to={`/task/${_id}?type=profile`}>
          {unFulfilledImgNum === imgArray.length ? '开始任务' : '继续任务'}
        </Link>
      </Button>
    ]}
  >
    <Card.Meta
      avatar={<Avatar alt={`${title}-封面`} src={`/${imgFolderPath}/${imgArray[0]}`} />}
      title={<Link to={`/task/${_id}?type=intro`}>{title}</Link>}
      description={(
        <Description>
          <Tooltip
            placement="bottomLeft"
            title={desc}>
            <EllipsisText>{desc}</EllipsisText>
          </Tooltip>
          图片数量: {imgArray.length}
          <br />
          截止日期：{transferDateToString(expireTime)}
        </Description>
      )}
    />
  </Card>
)

export default TaskCard;
