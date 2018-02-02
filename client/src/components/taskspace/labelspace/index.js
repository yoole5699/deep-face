import React from 'react';
import { observer } from 'mobx-react';
import { Main, LabelImg, OperationLayer, Point } from './layout';

class LabelSpace extends React.Component {

  componentDidMount() {
    this.props.labelStore.loadLabel();
  }

  renderPointList = (data, { current, draggingPointIndex }) => (
    data.map((item, index) => (
      <Point
        key={index}
        style={{
          left: `${item.x - 6}px`,
          top: `${item.y - 6}px`,
          backgroundColor: `${
            current !== 2
              ? draggingPointIndex === index
                ? 'blue'
                : '#BBBBBB'
              : '#FF9800'}`,
        }}
      />
    ))
  )

  renderLabelData = (labelStore) => (
    labelStore.labelData.map(({ p = [], ...rect }, index) => (
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
            border: `4px solid ${
              labelStore.current === 2 || labelStore.currentRect === index
                ? '#E51C23'
                : '#663F42'}`,
          }}
        />,
        this.renderPointList(p, labelStore)
      ]
    ))
  )

  render() {
    const { labelStore } = this.props;
    const {
      mouseDownHandler,
      mouseMoveHandler,
      mouseUpHandler,
      imgPos,
      imgArray,
      currentWidth
    } = labelStore;

    return (
      <Main>
        <LabelImg
          style={{
            width: `${currentWidth}px`,
            background: `url('${imgArray[imgPos].src}') no-repeat`,
            backgroundSize: `${currentWidth}px`,
          }}
        >
          {this.renderLabelData(labelStore)}
          <OperationLayer
            onMouseDown={mouseDownHandler}
            onMouseMove={mouseMoveHandler}
            onMouseUp={mouseUpHandler}
          />
        </LabelImg>
      </Main>
    )
  }
}

export default observer(LabelSpace);
