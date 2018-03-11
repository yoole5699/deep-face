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
import { steps, antithesesPointPos } from 'utils/const';
import Reference from 'resource/image/reference.jpeg';

const AntithesesSider = ({ labelStore }) => {
  const {
    current,
    currentRect,
    labelData,
    draggingPointIndex,
    nextHandler,
    error,
  } = labelStore;

  const tempSave = () => {
    labelStore.tempSaveHandler().then(() => {
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
              <Title>人脸{steps[current].title}</Title>
              <AvatarArea>
                <Avatar src={Reference} alt="对照图" />
                {
                  current === 1
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
              <TipArea labelStore={labelStore} />
              { error && <Alert message={error} type="error" /> }
              <Button
                type="primary"
                onClick={nextHandler}
                style={{ marginTop: 15, marginBottom: 10, width: '100%' }}
              >{current === 2 ? '完成标注' : '下一步'}</Button>
              {
                labelData.length > 0
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

export default inject('labelStore')(observer(AntithesesSider));
