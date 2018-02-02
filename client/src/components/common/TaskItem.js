import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Icon } from 'antd';
import { transferDateToString } from 'utils';

const Layout = styled.div`
  position: relative;
  margin-bottom: 20px;
  height: 75px;
`;

const Mask = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;

  background-color: rgb(87, 87, 87);
  line-height: 75px;
  opacity: ${({ show }) => show ? 0.91: 0};
  transition: all linear .2s;
`;

class TaskItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
    }
  }

  showMask = () => {
    this.setState({
      hover: true
    });
  }

  hideMask = () => {
    this.setState({
      hover: false
    });
  }

  render() {
    const { title, finishedStatus, expireTime } = this.props;
    const { hover } = this.state;

    return (
      <Layout>
        <Mask
          show={hover}
          onMouseEnter={this.showMask}
          onMouseLeave={this.hideMask}
        >
          <Link to="{parentTaskId}">继续任务 -></Link>
        </Mask>
        <Icon type="check-circle-o" style={{ color: 'white', fontSize: 30, marginRight: 20 }}/>
        <div style={{ flexGrow: 1, textAlign: 'left', display: 'inline-block' }}>
          <h3 style={{ color: 'white' }}>{title}</h3>
          <div style={{ color: 'rgb(187, 187, 187)'}}>任务进度:{finishedStatus}</div>
          <div style={{ color: 'rgb(187, 187, 187)'}}>截止时间:{transferDateToString(expireTime)}</div>
        </div>
      </Layout>
    )
  }
}

export default TaskItem;
