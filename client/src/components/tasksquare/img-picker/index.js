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

const statusColorMap = ['transparent', '#269abc', '#eea236', '#ac2925', '#4cae4c'];
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


class ImgPicker extends React.Component {

  componentWillMount() {
    this.props.store.resetStore();
  }

  render() {
    const { imgArray, imgFolderPath, imgArrayStatus, store } = this.props;

    return (
      <Fragment>
        <Checkbox
          dataSource={imgArray.map(item => `/${imgFolderPath}/${item}`)}
          indeterminate={store.imgArray.length !== imgArray.length && store.imgArray.length > 0}
          checked={store.imgArray.length === imgArray.length}
          onChange={store.checkAllImg}
        >全选</Checkbox>
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
