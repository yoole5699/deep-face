import React from 'react';
import { observer } from 'mobx-react';
import { Main, LabelImg, PointWithNum } from '../taskspace/labelspace/layout';

class ReviewSpace extends React.Component {

  componentDidMount() {
    const { reviewStore } = this.props;
    reviewStore.loadLabel().then(() => {
      this.container.scrollTo(385, 450);
      if (this.canvas && this.canvas.getContext) {
        const { labelData = { w: 450, h: 450 } } = reviewStore;
        this.canvas.height = labelData.h;
        this.canvas.width = labelData.w;

        // 开始画图
        if (labelData.array) {
          const imageData = new ImageData(new Uint8ClampedArray(labelData.array), labelData.w, labelData.h);
          const ctx = this.canvas.getContext('2d');
          ctx.putImageData(imageData, 0, 0);
        }
      }
    });
  }

  renderPointList = (data, { current, draggingPointIndex }) => (
    data.map((item, index) => (
      <PointWithNum
        key={index}
        content={index + 1}
        style={{
          left: `${item.x - 6}px`,
          top: `${item.y - 6}px`,
          opacity: `${item.s === 1 ? 1 : 0.5}`,
          backgroundColor: '#BBBBBB',
        }}
      />
    ))
  )

  renderLabelData = (reviewStore) => {
    if (reviewStore.task.kind.t === "1") {
      return (
        reviewStore.labelData.map(({ p = [], ...rect }, index) => (
          [
            <div
              key={index}
              style={{
                position: 'absolute',
                transition: 'all .3s ease-out',
                left: `${rect.x}px`,
                top: `${rect.y}px`,
                width: `${rect.w}px`,
                height: `${rect.h}px`,
                border: '4px solid #E51C23',
              }}
            />,
            this.renderPointList(p, reviewStore)
          ]
        ))
      )
    }

    return (
      <canvas ref={target => this.canvas = target} style={{ width: reviewStore.currentWidth, transition: 'all .3s linear' }}>
        您的浏览器不支持canvas！
        <a href="https://browsehappy.com/">快来升级您的浏览器吧</a>
      </canvas>
    )
  }

  render() {
    const { reviewStore, imgPos } = this.props;
    const {
      imgArray,
      currentWidth
    } = reviewStore;

    return (
      <Main innerRef={target => this.container = target}>
        <LabelImg
          style={{
            width: `${currentWidth}px`,
            background: `url('${imgArray[imgPos].src}') no-repeat`,
            backgroundSize: `${currentWidth}px`,
          }}
        >
          {this.renderLabelData(reviewStore)}
        </LabelImg>
      </Main>
    )
  }
}

export default observer(ReviewSpace);
