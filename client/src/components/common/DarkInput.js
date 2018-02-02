import React from 'react';
import styled from 'styled-components';
import { Input } from 'antd';

const DarkInput = styled(Input).attrs({
  prefixCls: '',
})`
  font-family: "Helvetica Neue For Number", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
  margin: 0;
  padding: 0;
  list-style: none;
  position: relative;
  display: inline-block;
  padding: 4px 11px;
  width: 100%;
  height: 32px;
  font-size: 14px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.65);
  background-color: #171717;
  background-image: none;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  transition: all .3s;
  
  color: #FFF;
  background-color: #171717;
  border-color: #171717;
`;

export default DarkInput;