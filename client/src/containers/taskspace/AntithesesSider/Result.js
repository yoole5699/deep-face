import React, { Fragment } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { Title } from './layout';
import { EllipsisTextBase } from 'components/common';

const ImgName = EllipsisTextBase.extend`
  padding: 20px;
  color: rgb(187, 187, 187);
  text-align: center;
`;

const Avatar = styled.img`
  width: 180px;
  height: 200px;
  border: 2px solid white;
`;

const Intro = styled.p`
  margin-top: 100px;
  line-height: 1.8;
  text-align: center;
`;

const Result = ({ labelStore: { imgArray, imgPos, task, } }) => {
  const hasLabeledImgNum = imgPos + 1;
  const unFinishedImgNum = imgArray.length - hasLabeledImgNum;
  const hasImgUnLabeled = unFinishedImgNum > 0;
  const nextImgPath = imgArray[imgPos + 1].src;
  const nextImgName = nextImgPath.substr(task.imgFolderPath.length + 2);

  const intro = (
    <Intro>
      目前已完成<strong>{hasLabeledImgNum}</strong>张图<br/>
      剩余<strong>{unFinishedImgNum}</strong>张未完成<br/>
      任务共有<strong>{imgArray.length}</strong>张图片
    </Intro>
  )

  if (hasImgUnLabeled) {
    return (
      <Fragment>
        <Title>下一张图片</Title>
        <ImgName title={nextImgName}>{nextImgName}</ImgName>
        <Avatar src={nextImgPath} alt="你的网络太差啦" />
        {intro}
      </Fragment>
    )
  }

  return (
    <Fragment>
      <Title>全部标注完成啦</Title>
      {intro}
    </Fragment>
  )
}

export default observer(Result);
