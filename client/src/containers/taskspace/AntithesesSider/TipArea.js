import React, { Fragment } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { getImgPos } from 'utils/index';

const Main = styled.div`
  line-height: 1.8;

  &::-webkit-scrollbar-thumb {
    background-color: rgb(152, 154, 158);
  }
`;

const TopArea = styled.div`
  margin-bottom: 30px;
  height: 125px;
  overflow: auto;
`;

const RectAvatar = styled.div`
  margin-top: 10px;
  margin-right: 17px;
  display: inline-block;
  width: 42px;
  height: 42px;
  border: 1px solid #fff;
`;

const Rule = observer(
  ({
    labelData,
    currentRect,
    changeCurrentRect,
    imgArray,
    currentWidth
  }) => {
    const currentPointIndex =
      (labelData[currentRect] && labelData[currentRect].p.length + 1) || 0;
    const pointTip =
      currentPointIndex === 29
        ? `第${currentRect + 1}个框已标注完成`
        : `当前标记到第${currentPointIndex}个点`;
    const imgPos = getImgPos();

    return (
      <Main>
        <TopArea>
          标点规则:<br />
          1号点位于左边；<br />
          2号点位于左上边；<br />
          3号点位于左下边；<br />
          4号点位于中间；<br />
          5号点位于中上边；<br />
          6号点位于中下边；<br />
        </TopArea>
        {pointTip}
        <br />
        {labelData.map((item, index) => (
          <RectAvatar
            key={index}
            onClick={e => changeCurrentRect(index)}
            style={{
              background: `url('${imgArray[imgPos].src}') no-repeat`,
              backgroundPosition: `-${42 * item.x / item.w}px -${42 *
                item.y /
                item.w}px`,
              backgroundSize: `${42 * currentWidth / item.w}px`
            }}
          />
        ))}
      </Main>
    );
  }
);

const Tip = ({ resetLabelData }) => (
  <Main>
    <TopArea>
      <p>检查并且确认：</p>
      检查标记的点和框，确认无误后点击完成，提交这一次标记。
    </TopArea>
    如果对结果不满意，您可以<a onClick={resetLabelData}>重新标注</a>这张图。
  </Main>
);

const DrawTip = ({ resetLabelData }) => (
  <Main>
    <TopArea>
      <p>检查并且确认：</p>
      检查标记的区域，确认无误后点击完成，提交这一次标记。
    </TopArea>
    如果对结果不满意，您可以<a onClick={resetLabelData}>重新标注</a>这张图。
  </Main>
);

const TipArea = ({
  labelStore: {
    task = { kind: { t: "1" } },
    labelData,
    imgArray,
    currentWidth,
    current,
    currentRect,
    changeCurrentRect,
    resetLabelData
  },
  drawStore,
}) => {
  const imgPos = getImgPos();

  if (task.kind.t === "1") {
    return (
      <Fragment>
        {current === 0 && '左上方为起点,右下方为终点'}
        {current === 1 && (
          <Rule
            labelData={labelData}
            imgArray={imgArray}
            imgPos={imgPos}
            currentWidth={currentWidth}
            currentRect={currentRect}
            changeCurrentRect={changeCurrentRect}
          />
        )}
        {current === 2 && <Tip resetLabelData={resetLabelData} />}
      </Fragment>
    )
  }

  return (
    <Fragment>
      {current === 0 && '请在工作区下方选择要对画布进行的转换，第一步之后无法再放大缩小画布'}
      {current === 1 && (
        <Main>
          <TopArea>
            {task.desc}
          </TopArea>
        </Main>
      )}
      {current === 2 && <DrawTip resetLabelData={drawStore.resetLabelData} />}
    </Fragment>
  )
};

export default observer(TipArea);
