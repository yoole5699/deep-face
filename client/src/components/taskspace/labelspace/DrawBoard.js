import React from 'react';
import { inject, observer } from 'mobx-react';
import { Main, LabelImg } from './layout';

class DrawBoard extends React.Component {

  componentDidMount() {
    const { labelStore, drawStore } = this.props;
    labelStore.loadLabel(drawStore).then(() => {
      this.container.scrollTo(385, 450);
      if (this.canvas.getContext) {
        drawStore.setContext(this.canvas.getContext('2d'));
      }
    });
  }

  render() {
    const { labelStore, drawStore, imgPos } = this.props;
    const { imgArray} = labelStore;
    const {
      currentWidth,
      mouseDownHandler,
      mouseMoveHandler,
      finishDrawHandler,
    } = drawStore;
    const imgInfo = imgArray[imgPos];

    return (
      <Main innerRef={target => this.container = target}>
        <LabelImg
          style={{
            width: `${currentWidth}px`,
            background: `url('${imgInfo.src}') no-repeat`,
            backgroundSize: `${currentWidth}px`,
          }}
        >
          <canvas
            ref={target => this.canvas = target}
            width={currentWidth}
            height={parseInt(imgInfo.h * currentWidth / imgInfo.w, 10)}
            onMouseDown={mouseDownHandler}
            onMouseMove={mouseMoveHandler}
            onMouseUp={finishDrawHandler}
            onMouseOut={finishDrawHandler}
          >
            您的浏览器不支持canvas！
            <a href="https://browsehappy.com/">快来升级您的浏览器吧</a>
          </canvas>
        </LabelImg>
      </Main>
    )
  }
}

export default inject('labelStore', 'drawStore')(observer(DrawBoard));
