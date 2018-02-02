import React from 'react';
import { observer, inject } from 'mobx-react';
import { Input } from 'antd';

const { Search } = Input;
const style = {
  position: 'absolute',
  top: 12,
  right: 280,
  width: 200,
};

const SearchInput = inject('commonStore')(observer(({ commonStore: { searchTask } }) => (
  <Search
    size="large"
    placeholder="请输入要搜索的任务名"
    onSearch={searchTask}
    style={style}
  />
)))

export default SearchInput;
