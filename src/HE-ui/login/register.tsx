import * as React from "react";
import {Post}  from '../../request';
import { message, Modal, Form, Input, Button } from 'antd';
import Cookies from 'js-cookie';
interface Props {}
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

export default class Register extends React.Component<Props, State> {
  constructor(props: any){
    super(props);
    this.state={
      openPop: false
    }
  }

  componentDidMount(){}

  onFinish = (values: {[key: string]: any}) => {
    const _this = this;
    const loginUrl = '/EmailRegister/';
    Post(
      loginUrl,
      values,
      function(data: any){
        message.info('注册成功');
        Cookies.set('userSession', data)
        _this.toggleLoginPop(false)
      }
    )
  };

  onFinishFailed = (errorInfo : any) => {
    console.log('Failed:', errorInfo);
  };

  toggleLoginPop = (isOpen = false) => {
    this.setState({
      openPop: isOpen
    });
  }

  toLogin = () => {
    this.toggleLoginPop(false);
    window.headerRef.showLogin();
  }

  render() {
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
            <span className="reg-text">注册</span>
            <span>云展平台</span>
          </div>
          <Form
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
          >
            <Form.Item
              label="用户名"
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input placeholder="请输入用户名"/>
            </Form.Item>

            <Form.Item
              label="邮箱"
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input  placeholder="请输入邮箱"/>
            </Form.Item>

            <Form.Item
              label="电话"
              name="phone"
              rules={[{ required: true, message: 'Please input your phone!' }]}
            >
              <Input type="number" placeholder="请输入电话" />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input  placeholder="请输入密码" />
            </Form.Item>

            <Form.Item
              label="确认密码"
              name="confirmPassword"
              rules={[{ required: true, message: 'Please confirm your password!' }]}
            >
              <Input  placeholder="请确认密码码" />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password placeholder="请确认密码码" />
            </Form.Item>

            <Form.Item {...tailLayout}>
              <div className="d-flex to-reg-con">
                <div className="flex-grow-1">
                  已有账号？
                  <span onClick={this.toLogin}>登录</span>
                </div>
                <Button type="primary" htmlType="submit">
                  注册
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
   </div>
  }
}