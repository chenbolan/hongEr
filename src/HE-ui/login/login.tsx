import * as React from "react";
import {Post, requestUrl}  from '../../request';
import Cookies from 'js-cookie';
import { message, Modal, Form, Input, Button, Checkbox } from 'antd';
interface Props {
  messages: any
}
interface State {
  openPop: boolean;
}
const layout = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
};
const tailLayout = {
  wrapperCol: { offset: 0, span: 24 },
};

export default class Login extends React.Component<Props, State> {
  constructor(props: any){
    super(props);
    this.state={
      openPop: false
    }
  }

  componentDidMount(){

  }

  onFinish = (values: {[key: string]: any}) => {
    const _this = this;
    Post(
      requestUrl.loginUrl,
      values,
      function(data: any){
        if(data.code === 200){
          message.success(_this.props.messages.loginSuccess);
          Cookies.set('userName', data?.data?.username)
          _this.toggleLoginPop(false);
          window.headerRef.isLogin();
        }else{
          message.error(data.message);
        }
      }
    )
  };

  toReg = () => {
    this.toggleLoginPop(false);
    window.headerRef.showRegister();
  }

  onFinishFailed = (errorInfo : any) => {
    console.log('Failed:', errorInfo);
  };

  toggleLoginPop = (isOpen = false) => {
    this.setState({
      openPop: isOpen
    });
  }

  render() {
    const {messages} = this.props;
    return <div className="login-con">
      <Modal
        title=""
        okText=""
        visible={this.state.openPop}
        mask={true}
        className="login_reg_m"
        onCancel={() => {this.toggleLoginPop(false)}}
      >
        <div className="reg-title">
          <span>{messages.title}</span>
        </div>
        <Form
          {...layout}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <Form.Item
            label={messages.name}
            name="username"
            rules={[{ required: true, message: messages.remind1 }]}
          >
            <Input placeholder={messages.remind1}/>
          </Form.Item>

          <Form.Item
            label={messages.passworld}
            name="password"
            rules={[{ required: true, message: messages.remind2 }]}
          >
            <Input type="password"  placeholder={messages.remind1} />
          </Form.Item>

          {/* <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item> */}

          <Form.Item {...tailLayout} name="remember" valuePropName="checked">
            <Checkbox>{messages.remember}</Checkbox>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <div className="d-flex to-reg-con">
              <div className="flex-grow-1">
                {messages.noAccount}
                <span  onClick={this.toReg}>{messages.register}</span>
              </div>
              <Button type="primary" htmlType="submit">
                {messages.login}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
   </div>
  }
}