import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Alert, notification } from 'antd';
import {
  Main,
  Title,
  Avatar,
  AvatarArea,
  Point,
} from './layout';
import TipArea from './TipArea';
import Result from './Result';
import { STEPS, antithesesPointPos } from 'utils/const';
import Reference from 'resource/image/reference.jpeg';

const AntithesesSider = ({ labelStore, drawStore }) => {
  const {
    task = { kind: { t: '1' } },
    current,
    currentRect,
    labelData,
    draggingPointIndex,
    error,
  } = labelStore;
  const store = task.kind.t === '1' ? labelStore : drawStore;
  const { nextHandler, tempSaveHandler } = store;

  const tempSave = () => {
    tempSaveHandler().then(() => {
      if (!labelStore.error) {
        notification.success({
          message: '暂存成功',
          description: '下次可以从当前进度开始标注啦',
        });
      }
    })
  };

  return (
    <Main>
      {
        current === 3
          ? <Result labelStore={labelStore} />
          : <Fragment>
              <Title>
                {task.kind.t === "1" && `人脸${STEPS[current].title}`}
                {task.kind.t === "2" && '确定画布大小'}
              </Title>
              <AvatarArea>
                <Avatar src={Reference} alt="对照图" />
                {
                  task.kind.t === "1" && current === 1
                    && antithesesPointPos.map((item, index) => (
                         <Point
                           key={index}
                           top={item.t}
                           left={item.l}
                           isActiving={draggingPointIndex === index || ( draggingPointIndex === -1 && index === labelData[currentRect].p.length )}
                           isActived={labelData[currentRect].p.length > index}
                           content={index + 1}
                         />
                       ))
                }
              </AvatarArea>
              <TipArea
                labelStore={labelStore}
                drawStore={drawStore}
              />
              { error && <Alert message={error} type="error" /> }
              <Button
                type="primary"
                onClick={nextHandler}
                style={{ marginTop: 15, marginBottom: 10, width: '100%' }}
              >{current === 2 ? '完成标注' : '下一步'}</Button>
              {
                (labelData.length > 0 || store.hasLabeled)
                  && <Button
                       onClick={tempSave}
                       style={{ marginTop: 15, marginBottom: 10, width: '100%' }}
                       children="暂存"
                     />
              }
            </Fragment>
      }
    </Main>
  )
}

export default inject('labelStore', 'drawStore')(observer(AntithesesSider));
