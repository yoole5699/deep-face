import React from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Button, Upload, Icon, Input } from 'antd';
import { Main } from 'components/user/Layout';
const FormItem = Form.Item;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};

class CreateTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: []
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let formData = new FormData();
        Object.keys(values).forEach(item => formData.append(item, values[item]));

        const { uploadTask } = this.props.commonStore;
        uploadTask(formData).then(( data ) => {
          data && this.props.history.push(`/task/${data._id}?type=dispatch`)
        });
      }
    });
  }

  beforeUpload = (file, fileList) => {
    this.setState({
      fileList
    });

    return false;
  }

  normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList[0];
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Main>
        <Form onSubmit={this.handleSubmit}>
          <h1>创建新任务</h1>

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
            {...formItemLayout}
            label="任务文件"
          >
            {getFieldDecorator('upload_file', {
              getValueFromEvent: this.normFile,
              rules: [
                { required: true, message: '请选择要上传的任务文件！！！' }
              ]
            })(
              <Upload
                name="upload_file"
                beforeUpload={this.beforeUpload}
                accept=".zip"
                fileList={this.state.fileList}
              >
                <Button>
                  <Icon type="upload" /> 请点击此处上传zip类型的压缩文件
                </Button>

              </Upload>
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
            >创建任务</Button>
          </FormItem>
        </Form>
      </Main>
    );
  }
}

export default inject('commonStore')(observer(Form.create()(CreateTask)));
