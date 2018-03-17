import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Divider, Button } from 'antd';
import { ButtonArea } from './Layout';
import { Meta } from 'components/user/CardLayout';
import ImgPicker, { ImgListBlock } from './img-picker';
import { TASK_STATUS } from 'utils/const';

const TaskProfile = ({
  type,

  _id,
  title,
  desc,
  imgFolderPath,
  imgArray,
  imgArrayStatus,
  money,
  expireTime,
  initialtorName,
  specifiedExecutor,

  labelStore,
  reviewStore,

  userStore: { currentUser }
}) => {
  const renderLink = () => {
      switch (type) {
        case 'intro':
          return (<Link to={`/task/${_id}?type=profile`}>选取图片进行标注</Link>)

        case 'profile':
          return (<Link to={`/task/${_id}/label?imgPos=0`}>开始标注</Link>)

        case 'review':
          return (<Link to={`/task/${_id}/review?imgPos=0`}>开始审核</Link>)

        default:
          return null
      }
  };
  const isAllImgPassed = imgArrayStatus.every(item => item.status === TASK_STATUS.PASS) && imgArrayStatus.length === imgArray.length;

  return (
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
        type === 'intro'
          ? (
            <ImgListBlock
              dataSource={imgArray.map(item => `/${imgFolderPath}/${item}`)}
            />
          )
          : (
              <ImgPicker
                imgArray={imgArray}
                imgFolderPath={imgFolderPath}
                imgArrayStatus={imgArrayStatus || []}
                store={type === 'profile' ? labelStore : reviewStore}
              />
            )
      }
      <ButtonArea>
        <Button
          disabled={
            (type === 'review' && (reviewStore.imgArray.length === 0 || initialtorName !== currentUser.userName)) ||
            (type === 'profile' && labelStore.imgArray.length === 0) ||
            (type !== 'review' && (isAllImgPassed || specifiedExecutor !== currentUser.userName && specifiedExecutor !== '全部'))
          }
          size="large"
          type="primary"
        >
          {renderLink()}
        </Button>
        <Button size="large">
          <Link to="/">返回首页</Link>
        </Button>
      </ButtonArea>
    </Fragment>
  )
}

export default inject('labelStore', 'userStore', 'reviewStore')(observer(TaskProfile));
