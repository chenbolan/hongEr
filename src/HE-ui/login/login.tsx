import * as React from "react";
import {Post}  from '../../request';
import Cookies from 'js-cookie';
import { message, Modal, Form, Input, Button, Checkbox } from 'antd';
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
    const loginUrl = '/EmailRegister/';
    Post(
      loginUrl,
      values,
      function(data: any){
        message.info('登陆成功');
        Cookies.set('userSession', data)
        _this.toggleLoginPop(false);
        window.headerRef.isLogin();
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
              label="密码"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input  placeholder="请输入密码" />
            </Form.Item>

            {/* <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password />
            </Form.Item> */}

            <Form.Item {...tailLayout} name="remember" valuePropName="checked">
              <Checkbox>记住密码</Checkbox>
            </Form.Item>

            <Form.Item {...tailLayout}>
              <div className="d-flex to-reg-con">
                <div className="flex-grow-1">
                  没有账号？
                  <span  onClick={this.toReg}>注册</span>
                </div>
                <Button type="primary" htmlType="submit">
                  登录
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
   </div>
  }
}