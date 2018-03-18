import React, { Fragment } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { Checkbox } from 'antd';

const Layout = styled.div`
  padding: 20px 0 20px 20px;
  height: 300px;

  background-color: rgb(245, 245, 245);
  overflow-y: scroll;
`;

const PureAvatar = styled.img`
  margin: 0 10px 10px 0 !important;

  width: 110px;
  height: 120px;
`;

const statusColorMap = ['red', '#269abc', '#eea236', '#ac2925', '#4cae4c'];
const Avatar = PureAvatar.withComponent(Checkbox).extend`
  background-image: ${(props) => `url(${props.src})`};
  background-repeat: round;
  border: 1px solid ${({ status }) => statusColorMap[status]};

  .ant-checkbox {
    left: 85px;
    top: 95px;
  }
`;

const RightText = styled.div`
  margin-top: 10px;
  color: rgb(187, 187, 187);
  text-align: right;
`;

const Tag = styled.div`
  margin-left: 10px;
  width: 30px;
  height: 20px;
  display: inline-block;
  background-color: ${({ color }) => color};
`;

const FlexRow = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

class ImgPicker extends React.Component {

  componentWillMount() {
    this.props.store.resetStore();
  }

  render() {
    const { imgArray, imgFolderPath, imgArrayStatus, store } = this.props;

    return (
      <Fragment>
        <FlexRow>
          <Checkbox
            dataSource={imgArray.map(item => `/${imgFolderPath}/${item}`)}
            indeterminate={store.imgArray.length !== imgArray.length && store.imgArray.length > 0}
            checked={store.imgArray.length === imgArray.length}
            onChange={store.checkAllImg}
            >全选</Checkbox>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Tag color={statusColorMap[0]} />&nbsp;未开始
              <Tag color={statusColorMap[1]} />&nbsp;进行中
              <Tag color={statusColorMap[2]} />&nbsp;待审批
              <Tag color={statusColorMap[3]} />&nbsp;已驳回
              <Tag color={statusColorMap[4]} />&nbsp;已通过
            </div>
        </FlexRow>
        <Layout>
            {
              imgArray.map((item, index) => {
                const imgStatus = (imgArrayStatus.find(data => data.name === item) || { status: 0 }).status;
                const imgFullpath = `/${imgFolderPath}/${item}`;

                return (
                  <Avatar
                    key={index}
                    src={imgFullpath}
                    status={imgStatus}
                    checked={store.imgArray.includes(imgFullpath)}
                    onChange={store.checkImg}
                  />
                )
              })
            }
        </Layout>
        <RightText>选中： {store.imgArray.length}/{imgArray.length}</RightText>
      </Fragment>
    )
  }
}

const ImgListBlock = ({ dataSource }) => (
  <Layout>
      {
        dataSource.map((item, index) => (
          <PureAvatar
            key={index}
            src={item}
          />
        ))
      }
  </Layout>
)

export default observer(ImgPicker);
export { ImgListBlock };
