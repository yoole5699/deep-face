import React from 'react';
import moment from 'moment';
import { Form, Button, Input, DatePicker, InputNumber, notification } from 'antd';
import UserSelect from '../common/UserSelect';

const FormItem = Form.Item;
const { TextArea } = Input;

const DispatchTaskForm = ({ form, history, _id, title, desc, imgArray, taskStore: { dispatchTask } }) => {
  const { getFieldDecorator } = form;
  const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    form.validateFields((err, formData) => {
      if (!err) {
        console.log('Received formData of form: ', formData);
        dispatchTask({
          ...formData,
          parent: _id,
          expire_time: formData['expire_time'].valueOf(),
          un_fulfilled_img_num: imgArray.length,
        }).then(({ success }) => {
          if (success) {
            notification['success']({
              message: '任务发布成功',
              description: '可以在系统中通过任务名进行搜索.',
            });
            history.push('/task-center');
          }
        });
      }
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h1>分发任务</h1>
      <h3>{title}(图片数量{imgArray.length})</h3>
      <p>{desc}</p>
      <FormItem
        {...formItemLayout}
        label="任务标题"
      >
        {
          getFieldDecorator('title', {
            validateTrigger: 'onBlur',
            rules: [
              { required: true, message: '任务标题为必填项' },
              { whitespace: true, message: '请不要输入纯空格' },
            ]
          })(
            <Input placeholder="请输入任务标题" />
          )
        }
      </FormItem>

      <FormItem
        {...formItemLayout}
        label="任务描述"
      >
        {getFieldDecorator('desc', {
          validateTrigger: 'onBlur',
          rules: [
            { required: true, message: '任务描述为必填项' },
            { whitespace: true, message: '请不要输入纯空格' },
          ]
        })(
          <TextArea rows={4} placeholder="请输入任务描述" />
        )}
      </FormItem>

      <FormItem
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 5 }}
        label="指定用户"
      >
        {getFieldDecorator('specified_executor', {
          initialValue: '全部'
        })(
          <UserSelect />
        )}
      </FormItem>

      <FormItem
        {...formItemLayout}
        label="任务报酬"
      >
        {
          getFieldDecorator('money', {
            initialValue: 0.1,
            rules: [{ required: true, message: '任务报酬为必填项' }]
          })(
            <InputNumber min={0} max={10} />
          )
        }
        <span className="ant-form-text">元/张</span>
      </FormItem>

      <FormItem
        {...formItemLayout}
        label="截止日期"
      >
        {getFieldDecorator('expire_time', {
          initialValue: moment().add('3', 'month'),
          rules: [{ type: 'object', required: true, message: '请选择截止日期!' }],
        })(
          <DatePicker />
        )}
      </FormItem>

      <FormItem
        wrapperCol={{ span: 8, offset: 8 }}
      >
        <Button
          type="primary"
          size="large"
          htmlType="submit"
          style={{ width: "100%", marginTop: 50 }}
        >分发任务</Button>
      </FormItem>
    </Form>
  )
}

export default Form.create()(DispatchTaskForm);
