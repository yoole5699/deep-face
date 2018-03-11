import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Divider, Button } from 'antd';
import { ButtonArea } from './Layout';
import { Meta } from 'components/user/CardLayout';
import ImgPicker, { ImgListBlock } from './img-picker';

const TaskProfile = ({
  type,

  _id,
  title,
  desc,
  imgFolderPath,
  imgArray,
  unFulfilledImgNum,
  fulfilledImgArray,
  money,
  expireTime,
  specifiedExecutor,

  labelStore,
  userStore: { currentUser }
}) => (
  <Fragment>
    <Meta type="profile">
      <h2>{title}</h2>
      {desc}
      图片数量: {imgArray.length}
      <br />
      报酬：{money}元/张
      <br />
      截止日期：{new Date(expireTime).toLocaleDateString()}
    </Meta>
    <Divider />
    {
      type === 'profile'
        ? (
            <ImgPicker
              imgArray={imgArray}
              imgFolderPath={imgFolderPath}
              fulfilledImgArray={fulfilledImgArray || []}
              labelStore={labelStore}
            />
          )
        : (
            <ImgListBlock
              dataSource={imgArray.map(item => `/${imgFolderPath}/${item}`)}
            />
          )
    }
    <ButtonArea>
      {
        type === 'profile'
          ? (
              <Button
                disabled={unFulfilledImgNum === 0 || labelStore.imgArray.length === 0 || (specifiedExecutor !== currentUser.userName && specifiedExecutor !== '全部')}
                size="large"
                type="primary"
              >
                <Link to={`/task/${_id}/label?imgPos=0`}>开始标注</Link>
              </Button>
            )
          : (
              <Button
                size="large"
                type="primary"
                disabled={
                  specifiedExecutor !== currentUser.userName && specifiedExecutor === '全部'
                }
              >
                <Link to={`/task/${_id}?type=profile`}>选取图片进行标注</Link>
              </Button>
            )
      }
      <Button size="large">
        <Link to="/">返回首页</Link>
      </Button>
    </ButtonArea>
  </Fragment>
)

export default inject('labelStore', 'userStore')(observer(TaskProfile));
