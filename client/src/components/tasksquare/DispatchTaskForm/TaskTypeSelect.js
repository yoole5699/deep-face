import React from 'react';
import { Select, Input } from 'antd';
import styled from 'styled-components';
const Option = Select.Option;

const Layout = styled.div`
  display: flex;
  justify-content: space-between;
`;

class TaskTypeSelect extends React.Component {
  handleSelect = (value, instance) => {
    this.props.onChange({
      n: this.props.value.n,
      t: value
    });
  }

  changePointNum = (e) => {
    const number = parseInt(e.target.value || 0, 10);
    if (isNaN(number)) {
      return;
    }

    this.props.onChange({
      n: number,
      t: "1"
    });
  }

  render() {
    const { value } = this.props;
    const selectBefore = (
      <Select
        value={value.t}
        optionFilterProp="children"
        onSelect={this.handleSelect}
        >
        <Option value="1">标点</Option>
        <Option value="2">画图</Option>
      </Select>
    );

    return (
      <Layout>
        <Input
          value={value.n}
          addonBefore={selectBefore}
          placeholder="请输入要标注的点的数量"
          onChange={this.changePointNum}
          disabled={value.t === "2"}
        />
      </Layout>
    )
  }
}

export default TaskTypeSelect;
