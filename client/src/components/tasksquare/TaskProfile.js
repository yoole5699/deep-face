import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { Divider, Button } from 'antd';
import { ButtonArea } from './Layout';
import { Meta } from 'components/user/CardLayout';
import ImgPicker, { ImgListBlock } from './img-picker';
import { TASK_STATUS } from 'utils/const';
const BUTTON_TEXT = {
  'intro': '选取图片进行标注',
  'profile': '开始标注',
  'review': '开始审核'
};

const TaskProfile = ({
  type,

  _id,
  title,
  desc,
  imgFolderPath,
  labels,
  money,
  expireTime,
  initialtorName,
  specifiedExecutor,

  history,

  labelStore,
  reviewStore,

  userStore: { currentUser }
}) => {
  const jumpTo = () => {
    switch (type) {
      case 'intro':
        return history.push(`/task/${_id}?type=profile`);

      case 'profile':
        return history.push(`/task/${_id}/label?imgPos=0`);

      case 'review':
        return history.push(`/task/${_id}/review?imgPos=0`)

      default:
        return null
    }
  }
  const isAllImgPassed = labels.every(item => item.status === TASK_STATUS.PASS);
  let disabled = true;
  if (type === 'review') {
    disabled = reviewStore.imgArray.length === 0 || initialtorName !== currentUser.userName;
  } else {
    disabled = isAllImgPassed || (specifiedExecutor !== currentUser.userName && specifiedExecutor !== '全部');
    if (type === 'profile') {
      disabled = labelStore.imgArray.length === 0;
    }
  }

  return (
    <Fragment>
      <Meta type="profile">
        <h2>{title}</h2>
        {desc}
        图片数量: {labels.length}
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
              dataSource={labels.map(item => `/${imgFolderPath}/${item.name}`)}
            />
          )
          : (
              <ImgPicker
                imgFolderPath={imgFolderPath}
                dataSource={labels}
                store={type === 'profile' ? labelStore : reviewStore}
              />
            )
      }
      <ButtonArea>
        <Button
          onClick={jumpTo}
          disabled={disabled}
          size="large"
          type="primary"
        >
          {BUTTON_TEXT[type]}
        </Button>
        <Button size="large" onClick={() => { history.push('/') }}>
          返回首页
        </Button>
      </ButtonArea>
    </Fragment>
  )
}

export default inject('labelStore', 'userStore', 'reviewStore')(observer(TaskProfile));
