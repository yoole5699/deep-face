import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { Icon, Button } from 'antd';

const Main = styled.div`
  width: 66%;
  margin: 105px auto;
  text-align: center;
  transform: scale(1.5);
`;

const Text = styled.p`
  font-size: 36px;
  margin-bottom: 20px;
`;

const StyledIcon = styled(Icon)`
  color: rgb(139, 195, 74);
  font-size: 2em;
  vertical-align: middle;
`;

const StyledButton = styled(Button)`
  margin-right: 20px;
`;

const LabelResult = ({ labelStore: { nextHandler, imgArray, imgPos }, _id }) => (
  <Main>
    <Text>提交成功<StyledIcon type="check" /></Text>
    <div>
      <StyledButton type="primary">
        <Link to={`/task/${_id}?type=profile`}>回到图片列表</Link>
      </StyledButton>
      <StyledButton onClick={nextHandler}>
        {imgArray.length !== imgPos + 1 ? '标注下一张' : '查看任务完成情况'}
      </StyledButton>
    </div>
  </Main>
)

export default observer(LabelResult);
