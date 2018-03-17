import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { Icon, Button } from 'antd';
import { getImgPos } from 'utils/index';

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

const ReviewResult = ({ reviewStore: { nextHandler, imgArray }, _id, history }) => {
  const imgPos = getImgPos();
  const isReviewOver = imgArray.length === imgPos + 1;
  const jumpClickHandler = () => {
    nextHandler();
    history.push(isReviewOver ? `/task/${_id}?type=detail` : `/task/${_id}/review?imgPos=${imgPos + 1}`);
  }

  return (
    <Main>
      <Text>提交成功<StyledIcon type="check" /></Text>
      <div>
        <StyledButton type="primary">
          <Link to={`/task/${_id}?type=profile`}>回到图片列表</Link>
        </StyledButton>
        <StyledButton onClick={jumpClickHandler}>
          {isReviewOver ? '查看任务完成情况' : '标注下一张'}
        </StyledButton>
      </div>
    </Main>
  )
}

export default observer(ReviewResult);
