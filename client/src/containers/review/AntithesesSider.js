import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Input, notification } from 'antd';
import {
  Main,
  Title,
  Avatar,
  AvatarArea,
  Point,
} from 'containers/taskspace/AntithesesSider/layout';
import { antithesesPointPos } from 'utils/const';
import Reference from 'resource/image/reference.jpeg';
import { TASK_STATUS } from 'utils/const';

const AntithesesSider = ({ reviewStore, history, imgPos }) => {
  const {
    currentRect,
    comment,
    setComment,
    imgArray,
    task
  } = reviewStore;

  const isReviewOver = imgArray.length === imgPos + 1;
  const updateHandler = (status) => {
    return () => {
      reviewStore.updateHandler(status).then(() => {
        if (!reviewStore.error) {
          history.push(isReviewOver ? `/task/${task._id}?type=review`:  `/task/${task._id}/review?imgPos=${imgPos + 1}`);
          notification.success({ message: '审核成功', description: `已向${reviewStore.task.specifiedExecutor}发送审核信息` });
          !isReviewOver && reviewStore.loadLabel();
        } else {
          notification.error({ message: '审核失败', description: reviewStore.error });
        }
      })
    }
  };

  return (
    <Main>
      <Fragment>
        <Title>对照图</Title>
        <AvatarArea>
          <Avatar src={Reference} alt="对照图" />
          {
            antithesesPointPos.map((item, index) => (
               <Point
                 key={index}
                 top={item.t}
                 left={item.l}
                 isActived
                 content={index + 1}
               />
             ))
          }
        </AvatarArea>
        <Input.TextArea
          rows={4}
          value={comment}
          onChange={setComment}
          placeholder="请填写通过或拒绝的理由，非必填"
        />
        <Button
          type="primary"
          onClick={updateHandler(TASK_STATUS.PASS)}
          style={{ marginTop: 15, marginBottom: 10, width: '100%' }}
        >通过</Button>
        <Button
          type="danger"
          onClick={updateHandler(TASK_STATUS.REJECTED)}
          style={{ marginTop: 15, marginBottom: 10, width: '100%',  }}
        >拒绝</Button>
      </Fragment>
    </Main>
  )
}

export default inject('reviewStore')(observer(AntithesesSider));
