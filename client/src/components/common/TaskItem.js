import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Icon } from 'antd';
import { transferDateToString } from 'utils';
import { TASK_STATUS } from 'utils/const';

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
  text-align: center;
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
    const { title,  expireTime, _id, labels } = this.props;
    const { hover } = this.state;

    return (
      <Layout>
        <Mask
          show={hover}
          onMouseEnter={this.showMask}
          onMouseLeave={this.hideMask}
        >
          <Link to={`/task/${_id}?type=profile`} style={{ color: '#fff', fontSize: 24 }}>继续任务 >></Link>
        </Mask>
        <Icon type="check-circle-o" style={{ color: 'white', fontSize: 30, marginRight: 20, verticalAlign: 'top' }}/>
        <div style={{ flexGrow: 1, textAlign: 'left', display: 'inline-block' }}>
          <h3 style={{ color: 'white' }}>{title}</h3>
          <div style={{ color: 'rgb(187, 187, 187)'}}>任务进度:{labels.filter(item => item.status === TASK_STATUS.PASS || item.status === TASK_STATUS.WAITING_REVIEW).length + '/' + labels.length}</div>
          <div style={{ color: 'rgb(187, 187, 187)'}}>截止时间:{transferDateToString(expireTime)}</div>
        </div>
      </Layout>
    )
  }
}

export default TaskItem;
