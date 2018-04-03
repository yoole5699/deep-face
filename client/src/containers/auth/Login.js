import React from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Icon, Input, notification } from 'antd';

import Layout from 'components/auth/Layout';
import Bottom from 'components/auth/Bottom';
import FullButton from 'components/common/FullButton';
// import DarkInput from 'components/common/DarkInput';
import WrappedAlert from './WrappedAlert';

const LoginForm = ({ form, authStore, history }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    form.validateFields((err, formData) => {
      if (!err) {
        console.log('Received values of form: ', formData);
        authStore.login(formData).then(() => {
          if (!authStore.errors) {
            notification.success({
              message: '登录成功',
              description: '初始化中，请稍候...',
            });
            history.push('/');
          }
        });
      }
    });
  }

  const resetError = () => {
    authStore.setError({ message: '' });
  }

  const { getFieldDecorator } = form;
  const FormItem = Form.Item;

  return (
    <Form onSubmit={handleSubmit}>
      <FormItem>
        {
          getFieldDecorator('userName', {
            rules: [{ required: true, message: '请输入您的帐号' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="帐号"
            />
          )
        }
      </FormItem>
      <FormItem>
        {
          getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入您的密码' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="密码"
            />
          )
        }
      </FormItem>
      <FormItem>
        <FullButton htmlType="submit" loading={authStore.inProgress}>登录</FullButton>
        <Bottom>
          <Bottom.Link to="forget">忘记密码</Bottom.Link>
          <Bottom.Link onClick={resetError} to="register">免费注册</Bottom.Link>
        </Bottom>
      </FormItem>
    </Form>
  );
}

const WrappedLoginForm = inject('authStore')(Form.create()(observer(LoginForm)));

const Login = ({ history }) => (
  <Layout>
    <WrappedAlert />
    <WrappedLoginForm history={history} />
  </Layout>
)

export default Login;
