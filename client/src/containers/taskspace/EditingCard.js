import React, { Fragment } from 'react';
import { Spin } from 'antd';
import { inject, observer } from 'mobx-react';
import { Main } from 'components/user/Layout';
import { LabelSpace, DrawBoard, DrawBoardButtonArea, ButtonArea, LabelResult } from 'components/taskspace';
import { getImgPos } from 'utils/index';

class EditingCard extends React.Component {

  componentDidMount() {
    const { labelStore } = this.props;
    if (labelStore.imgArray.length === 0) {
      labelStore.setImgArray(JSON.parse(window.localStorage.getItem('imgArray')));
    }
    const { match } = this.props;
    const { _id } = match.params;
    this.getCurrentImgArrayWithSize().then((imgArray) => {
      labelStore.setImgArray(imgArray);
      labelStore.loadTask(_id, 'dispatch');
    });
  }

  getCurrentImgArrayWithSize = () => {
    const { imgArray } = this.props.labelStore;
    return Promise.all(
      imgArray.map(async (item) => new Promise((res, rej) => {
        const img = new Image();
        const imgSrc = item.src || item;
        img.onload = function () {
          res({ src: imgSrc, w: img.width, h: img.height });
        }
        img.error = function () {
          rej({ src: imgSrc, w: 0, h: 0 })
        }
        img.src = imgSrc;
      }))
    )
  }

  renderMain = (_id, imgPos, history, isTaskReady, current, task, labelStore) => {
    if (isTaskReady) {
      if (current === 3) {
        return (
          <LabelResult
            labelStore={labelStore}
            _id={_id}
            imgPos={imgPos}
            history={history}
          />
        );
      } else if (task.kind.t === '1') {
        return (
          <Fragment>
            <LabelSpace
              labelStore={labelStore}
              imgPos={imgPos}
            />
            <ButtonArea
              resetHandler={labelStore.resetLabelData}
              undoHandler={labelStore.undoHandler}
              zoomInHandler={labelStore.zoomInImgScale}
              zoomOutHandler={labelStore.zoomOutImgScale}
            />
          </Fragment>
        )
      } else {
        return (
          <Fragment>
            <DrawBoard
              imgPos={imgPos}
            />
            <DrawBoardButtonArea />
          </Fragment>
        )
      }
    }
  }

  render() {
    const { labelStore, match: { params: { _id } }, history } = this.props;
    const {
      task,
      current,
      imgArray,
      isLoading,
    } = labelStore;
    const imgPos = getImgPos();
    const isTaskReady = task && imgArray[imgPos].src;

    return (
      <Spin size="large" spinning={isLoading}>
        <Main>
          <h2>
            {
              isTaskReady
                ? `${task.title}/${imgArray[imgPos].src.split('/')[2]}`
                : '加载中....'
            }
          </h2>
          {this.renderMain(_id, imgPos, history, isTaskReady, current, task, labelStore)}
        </Main>
      </Spin>
    )
  }
}


export default inject('labelStore')(observer(EditingCard));
