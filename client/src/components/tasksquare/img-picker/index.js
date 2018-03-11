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

const Avatar = PureAvatar.withComponent(Checkbox).extend`
  background-image: ${(props) => `url(${props.src})`};
  background-repeat: round;
`;

const WaitingAvatar = Avatar.extend`
  border: 1px solid rgb(139, 195, 74);
`;

const RightText = styled.div`
  margin-top: 10px;
  color: rgb(187, 187, 187);
  text-align: right;
`;

class ImgPicker extends React.Component {

  componentWillUnMount() {
    this.props.labelStore.resetStore();
  }

  render() {
    const { imgArray, imgFolderPath, fulfilledImgArray, labelStore } = this.props;

    return (
      <Fragment>
        <Checkbox
          dataSource={imgArray}
          indeterminate={labelStore.imgArray.length !== imgArray.length && labelStore.imgArray.length > 0}
          checked={labelStore.imgArray.length === imgArray.length}
          onChange={labelStore.checkAllImg}
        >全选</Checkbox>
        <Layout>
            {
              imgArray.map((item, index) => {
                const Com = fulfilledImgArray.includes(item) ? WaitingAvatar : Avatar;
                const imgFullpath = `/${imgFolderPath}/${item}`;

                return (
                  <Com
                    key={index}
                    src={imgFullpath}
                    checked={labelStore.imgArray.includes(imgFullpath)}
                    onChange={labelStore.checkImg}
                  />
                )
              })
            }
        </Layout>
        <RightText>选中： {labelStore.imgArray.length}/{imgArray.length}</RightText>
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
