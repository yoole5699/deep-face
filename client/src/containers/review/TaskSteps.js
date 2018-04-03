import React from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

const Main = styled.div`
  margin: 30px 0;
  display: flex;
`;

const Avatar = styled.img`
  margin-right: 10px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const TaskSteps = ({ reviewStore, history, imgPos }) => {

  return (
     <Main current={imgPos}>
       {reviewStore.imgArray.map((item, index) => (
         <Avatar
           key={index}
           src={item.src}
           style={{ border: `1px ${imgPos >= index ? 'solid' : 'dashed'} #1890ff` }}
         />
       ))}
     </Main>
  )
}

export default inject('reviewStore')(observer(TaskSteps));
