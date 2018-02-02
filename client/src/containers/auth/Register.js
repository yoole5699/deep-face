import React from 'react';
import { withRouter } from 'react-router';
import { inject, observer } from 'mobx-react';
import { Form, Icon, Input, notification } from 'antd';

import Layout from 'components/auth/Layout';
import Bottom from 'components/auth/Bottom';
import WrappedAlert from './WrappedAlert';
import FullButton from 'components/common/FullButton';
import { userNameRegex, passwordRegex } from 'utils/const';

const RegisterForm = ({ form, authStore, history }) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        authStore.registerAndLogin(values).then(() => {
          if (!authStore.errors) {
            notification.success({
              message: '注册成功',
              description: '登录并初始化中，请稍候.',
            });
            history.push('/');
          }
        });
      }
    });
  }

  const checkConfirm = (rule, value, callback) => {
    if (value && form.getFieldValue('confirmPw')) {
      form.validateFields(['confirmPw'], { force: true });
    }
    callback();
  }

  const checkPassword = (rule, value, callback) => {
    if (value && value !== form.getFieldValue('password')) {
      callback('请确保两次输入的密码一致');
    } else {
      callback();
    }
  }

  const { getFieldDecorator } = form;
  const FormItem = Form.Item;

  return (
    <Form onSubmit={handleSubmit}>
      <FormItem>
        {
          getFieldDecorator('userName', {
            rules: [{
              required: true, message: '请输入您的帐号'
            }, {
              pattern: userNameRegex, message: '请输入6-20个以内的中文或英文字符，可包含数字',
            }],
            validateTrigger: 'onBlur',
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
            rules: [{
              required: true, message: '请输入您的密码'
            }, {
              pattern: passwordRegex, message: '密码必须至少8位且至少包含一位大写字母、小写字母、数字',
            }, {
              validator: checkConfirm
            }],
            validateTrigger: 'onBlur',
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
        {
          getFieldDecorator('confirmPw', {
            rules: [
              { required: true, message: '请再次输入您的密码' },
              { validator: checkPassword }
            ],
            validateTrigger: 'onBlur',
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="确认密码"
            />
          )
        }
      </FormItem>
      <FormItem>
        <FullButton htmlType="submit">免费注册并登录</FullButton>
        <Bottom>
          <Bottom.Link onClick={authStore.reset} to="login">用户登录</Bottom.Link>
        </Bottom>
      </FormItem>
    </Form>
  )
}

const WrappedRegisterForm = inject('authStore')(observer(withRouter(Form.create()(RegisterForm))));

const Register = () => (
  <Layout>
    <WrappedAlert />
    <WrappedRegisterForm />
  </Layout>
)

export default Register;
