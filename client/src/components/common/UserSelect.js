import React from 'react';
import { Select, Spin } from 'antd';
import debounce from 'lodash.debounce';
import agent from 'utils/agent';
const Option = Select.Option;

class UserSelect extends React.Component {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 800);
  }

  state = {
    data: [],
    value: this.props.value,
    fetching: false,
  }

  fetchUser = (keyword) => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });
    agent.Common.user_list(keyword)
      .then(({ data }) => {
        if (fetchId !== this.lastFetchId) { // for fetch callback order
          return;
        }

        this.setState({
          data: data.map(item => ({ text: item.userName, value: item.userName, })),
          fetching: false
        });
      });
  }

  handleSelect = (value) => {
    console.log(value, '---value---');
    this.setState({
      value,
      data: [],
      fetching: false,
    });
  }

  render() {
    const { fetching, data, value } = this.state;

    return (
      <Select
        mode="combobox"
        value={value}
        placeholder="请输入要指定执行的用户名(任意用户请输入全部)"
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={this.fetchUser}
        onSelect={this.handleSelect}
      >
        {data.map(item => <Option key={item.value}>{item.text}</Option>)}
        <Option key="all">全部</Option>
      </Select>
    )
  }
}

export default UserSelect;
