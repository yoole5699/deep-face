import React from 'react';
import { TwitterPicker } from 'react-color';
import { inject, observer } from 'mobx-react';
import { Button, InputNumber, Radio, Icon } from 'antd';
import styled from 'styled-components';

const Group = Button.Group;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

const Layout = styled.div`
  margin-top: 10px;

  display: flex;
  justify-content: space-between;
`;

const RightLayout = styled.div`
  width: 227px;
`;

const LargeButton = styled(Button)`
  width: 60px;
`;

const DrawBoardButtonArea = ({
  labelStore: {
    current
  },
  drawStore: {
    labelData,
    changeStorkeStyle,
    changeLineWidth,
    changeDrawType,
    resetLabelData,
    zoomInImgScale,
    zoomOutImgScale
  }
}) => (
  <Layout>
    <TwitterPicker
      color="#fff"
      onChangeComplete={changeStorkeStyle}
    />
    <RightLayout>
      <div style={{ display: 'inline-block' }}>
        线宽：
        <InputNumber
          min={0}
          max={100}
          step={0.1}
          size="large"
          defaultValue={2}
          onChange={changeLineWidth}
        />
      </div>
      <RadioGroup
        size="large"
        disabled={current !== 1}
        defaultValue="pencil"
        onChange={changeDrawType}
      >
        <RadioButton value="pencil"><Icon type="edit" /></RadioButton>
        <RadioButton value="eraser"><Icon type="delete" /></RadioButton>
      </RadioGroup>
      <Group style={{ marginTop: 16 }}>
        <LargeButton size="large" icon="reload" onClick={resetLabelData} />
        <LargeButton
          size="large"
          icon="shrink"
          disabled={current !== 0 || (labelData && !!labelData.w)}
          onClick={zoomInImgScale}
        />
        <LargeButton
          size="large"
          icon="arrows-alt"
          disabled={current !== 0 || (labelData && !!labelData.w)}
          onClick={zoomOutImgScale}
        />
      </Group>
    </RightLayout>
  </Layout>
);

export default inject('drawStore', 'labelStore')(observer(DrawBoardButtonArea));
