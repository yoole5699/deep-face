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

const Avatar = styled(Checkbox)`
  margin: 0 10px 10px 0 !important;

  width: 110px;
  height: 120px;

  background-image: ${(props) => `url(${props.src})`};
  background-repeat: round;
`;

const RightText = styled.div`
  margin-top: 10px;
  color: rgb(187, 187, 187);
  text-align: right;
`;

class ImgPicker extends React.Component {

  componentWillMount() {
    this.props.labelStore.resetStore();
  }

  render() {
    const { dataSource, labelStore } = this.props;

    return (
      <Fragment>
        <Checkbox
          dataSource={dataSource}
          indeterminate={labelStore.imgArray.length !== dataSource.length && labelStore.imgArray.length > 0}
          checked={labelStore.imgArray.length === dataSource.length}
          onChange={labelStore.checkAllImg}
        >全选</Checkbox>
        <Layout>
            {
              dataSource.map((item, index) => (
                <Avatar
                  key={index}
                  src={item}
                  checked={labelStore.imgArray.includes(item)}
                  onChange={labelStore.checkImg}
                />
              ))
            }
        </Layout>
        <RightText>选中： {labelStore.imgArray.length}/{dataSource.length}</RightText>
      </Fragment>
    )
  }
}

const ImgListBlock = ({ dataSource }) => (
  <Layout>
      {
        dataSource.map((item, index) => (
          <Avatar
            key={index}
            src={item}
          />
        ))
      }
  </Layout>
)

export default observer(ImgPicker);
export { ImgListBlock };
