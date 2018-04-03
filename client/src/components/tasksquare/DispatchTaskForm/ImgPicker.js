import React, { Fragment } from 'react';
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

  width: 93px;
  height: 100px;
  background-image: ${(props) => `url(${props.src})`};
  background-repeat: round;

  .ant-checkbox {
    left: 76px;
    top: 71px;
  }
`;

const RightText = styled.div`
  margin-top: 10px;
  color: rgb(187, 187, 187);
  text-align: right;
`;

class ImgPicker extends React.Component {
  checkAllImg = (event) => {
    const { imgArray, onChange } = this.props;
    if (event.target.checked) {
      onChange(imgArray);
    } else {
      onChange([]);
    }
  }

  checkOneImg = (event) => {
    const { value, onChange } = this.props;
    if (event.target.checked) {
      onChange(value.concat(event.target.name));
    } else {
      onChange(value.filter(item => item !== event.target.name));
    }
  }

  render() {
    const { value, imgArray, imgFolderPath } = this.props;

    return (
      <Fragment>
        <Checkbox
          dataSource={imgArray.map(item => `/${imgFolderPath}/${item}`)}
          indeterminate={imgArray.length !== value.length && value.length > 0}
          checked={imgArray.length === value.length}
          onChange={this.checkAllImg}
          >全选</Checkbox>
        <Layout>
            {
              imgArray.map((item, index) => {
                const imgFullpath = `/${imgFolderPath}/${item}`;

                return (
                  <Avatar
                    key={item}
                    src={imgFullpath}
                    name={item}
                    checked={value.includes(item)}
                    onChange={this.checkOneImg}
                  />
                )
              })
            }
        </Layout>
        <RightText>选中： {value.length}/{imgArray.length}</RightText>
      </Fragment>
    )
  }
}

export default ImgPicker;
