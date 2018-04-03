import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import {
  Avatar,
  Meta,
  EllipsisText,
  TaskListCardLayout as Layout,
  Count,
  CountArea,
  CountOutArea,
} from '../CardLayout';
import FullButton from 'components/common/FullButton';
import Table from './Table';
import agent from 'utils/agent';

class OriginCard extends React.Component {
  state = {
    loading: false,
    tasks: [],
    actived: false
  };

  fetchTaskDetail = () => {
    this.setState({
      loading: true
    }, () => {
      agent.MyTask.oneAllSub(this.props._id)
        .then(({ data }) => {
          this.setState({
            loading: false,
            actived: true,
            tasks: data
          });
        })
    });
  }

  hideTable = () => {
    this.setState({
      actived: false
    });
  }

  handleDelete = (_id, e) => {
    this.setState({
      tasks: this.state.tasks.filter(item => item._id !== _id)
    });
  }

  render() {
    const {
      pendingTaskNum = 0,
      fulfilledTaskNum = 0,
      allTaskNum = 0,
      imgFolderPath,
      imgArray,
      title,
      desc,
      _id,
    } = this.props;

    return (
      <Layout>
        <Avatar src={`/${imgFolderPath}/${imgArray[0]}`} alt="封面"/>
        <Meta>
          <h4>{title}</h4>
          <EllipsisText desc={desc} />
          图片数量: {imgArray.length}
          <br />
          <Button size="large" style={{ alignSelf: 'center' }}>
            <Link to={`/task/${_id}?type=dispatch`}>分发任务</Link>
          </Button>
        </Meta>
        <CountOutArea>
          <CountArea>
            <Count
              label="领取度"
              value={`${pendingTaskNum}/${allTaskNum}`}
            />
            <Count
              label="完成度"
              value={`${fulfilledTaskNum}/${allTaskNum}`}
            />
          </CountArea>
          <div>
            {
              this.state.actived
                ? <Button
                    shape="circle"
                    icon="up"
                    size="large"
                    style={{ marginLeft: 130 }}
                    onClick={this.hideTable}
                  />
                : <FullButton
                    type="primary"
                    size="large"
                    disabled={allTaskNum === 0}
                    loading={this.state.loading}
                    onClick={this.fetchTaskDetail}
                  >
                    查看任务
                  </FullButton>
            }
          </div>
        </CountOutArea>
        {
          this.state.actived
          && <Table
               dataSource={this.state.tasks}
               deleteRow={this.handleDelete}
             />
        }
      </Layout>
    )
  }
}

export default OriginCard;
