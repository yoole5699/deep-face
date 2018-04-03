import React from 'react';
import { observer } from 'mobx-react';
import { Main, LabelImg, OperationLayer, Point } from './layout';
import { Menu, Dropdown } from 'antd';
const menu = ({ contextMenu: { rectIndex, pointIndex }, labelData, setPointStatus }) => {
  const isVisible = labelData[rectIndex].p[pointIndex].s === 1;

  return (
    <Menu onClick={setPointStatus} style={{ zIndex: 2 }}>
      <Menu.Item key="0" disabled={!isVisible}>{ isVisible ? '设置为不可见' : '当前为不可见' }</Menu.Item>
      <Menu.Item key="1" disabled={isVisible}>{ isVisible ? '当前为可见' : '设置为可见' }</Menu.Item>
    </Menu>
  )
};

class LabelSpace extends React.Component {

  componentDidMount() {
    this.props.labelStore.loadLabel();
    this.container.scrollTo(450, 450);
  }

  renderPointList = (data, { current, draggingPointIndex }) => (
    data.map((item, index) => (
      <Point
        key={index}
        style={{
          left: `${item.x - 6}px`,
          top: `${item.y - 6}px`,
          opacity: `${item.s === 1 ? 1 : 0.5}`,
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

  getPopupContainer = (dom) => {
    return dom;
  }

  render() {
    const { labelStore, imgPos } = this.props;
    const {
      mouseDownHandler,
      mouseMoveHandler,
      mouseUpHandler,
      contextMenuHandler,
      contextMenu,
      imgArray,
      currentWidth,
      labelData,
    } = labelStore;

    return (
      <Main innerRef={target => this.container = target}>
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
            onContextMenu={contextMenuHandler}
          >
          </OperationLayer>
          {
            !!contextMenu && (
              <Dropdown
                visible={true}
                placement="bottomCenter"
                trigger={['contextMenu']}
                overlay={menu.call(null, labelStore)}
                getPopupContainer={this.getPopupContainer}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: `${labelData[contextMenu.rectIndex].p[contextMenu.pointIndex].x - 6}px`,
                      top: `${labelData[contextMenu.rectIndex].p[contextMenu.pointIndex].y - 6}px`,
                      width: 12,
                      height: 12
                    }}
                  >
                  </div>
                </Dropdown>
              )
            }
        </LabelImg>
      </Main>
    )
  }
}

export default observer(LabelSpace);
