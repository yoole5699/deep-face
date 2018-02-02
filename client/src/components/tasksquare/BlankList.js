import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Row, Col } from 'antd';

const Layout = styled.div`
  text-align: center;
`;

const BlankList = () => (
  <Layout>
    <p>当前没有可进行的任务，你可以选择</p>
    <Row gutter={16}>
      <Col span={6} offset={6}><Link to="/person-center">到我的个人中心看看</Link></Col>
      <Col span={6}><Link to="/task?type=create">发布新任务</Link></Col>
    </Row>
  </Layout>
)

export default BlankList;
