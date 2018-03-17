import React, { Fragment } from 'react';
import { Spin } from 'antd';
import { inject, observer } from 'mobx-react';
import { Main } from 'components/user/Layout';
import { ReviewSpace, ButtonArea, ReviewResult } from 'components/review';

class ReviewCard extends React.Component {
  componentDidMount() {
    const { reviewStore } = this.props;
    if (reviewStore.imgArray.length === 0) {
      reviewStore.setImgArray(JSON.parse(window.localStorage.getItem('reviewImgArray')));
    }
    const { match } = this.props;
    const { _id } = match.params;
    this.getCurrentImgArrayWithSize().then((imgArray) => {
      reviewStore.setImgArray(imgArray);
      reviewStore.loadTask(_id, 'dispatch');
    });
  }

  getCurrentImgArrayWithSize = () => {
    const { imgArray } = this.props.reviewStore;
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

  render() {
    const { reviewStore, match: { params: { _id } }, history, imgPos } = this.props;
    const {
      task,
      imgArray,
      isLoading,
      zoomInImgScale,
      zoomOutImgScale,
    } = reviewStore;
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
            {
              imgPos === imgArray.length
                ? (<ReviewResult reviewStore={reviewStore} _id={_id} history={history} />)
                : isTaskReady
                    && (
                         <Fragment>
                           <ReviewSpace
                             imgPos={imgPos}
                             reviewStore={reviewStore}
                           />
                           <ButtonArea
                             zoomInHandler={zoomInImgScale}
                             zoomOutHandler={zoomOutImgScale}
                           />
                         </Fragment>
                       )
            }
        </Main>
      </Spin>
    )
  }
}


export default inject('reviewStore')(observer(ReviewCard));
