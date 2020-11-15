import * as React from "react";
import {requestUrl, request}  from '../../request';
import { message, Modal, Form, Input, Button } from 'antd';
import Cookies from 'js-cookie';
interface Props {
  messages: any;
  showLogin: () => void;
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
    const {messages} = this.props;
    const host = "https://" + window.location.host;
    values.domainUrl=host;
    const url = requestUrl.registerUrl + "?lang=" + Cookies.get("lang")
    request(url, values).then((data: any) => {
      if(data.code == 200){
        message.success(messages.registerSuccess);
        // Cookies.set('userName', values.username);
        _this.toggleLoginPop(false);
        _this.props.showLogin();
      }else{
        message.error(data.message)
      }
    })

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
    this.props.showLogin()
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
            <span className="reg-text">{messages.register}</span>
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
              rules={[{ required: true, message: messages.remind1 },{ pattern:/^[a-zA-Z0-9_]+$/,message:messages.remind6}]}
            >
              <Input  placeholder={messages.remind1}/>
            </Form.Item>

            <Form.Item
              label={messages.email}
              name="email"
              rules={[{ required: true, message: messages.remind3 }]}
            >
              <Input  placeholder={messages.remind3}/>
            </Form.Item>

            <Form.Item
              label={messages.tel}
              name="telePhone"
              rules={[{ required: true, message: messages.remind4 }]}
            >
              <Input type="number" placeholder={messages.remind4} />
            </Form.Item>

            <Form.Item
              label={messages.passworld}
              name="password"
              rules={[{ required: true, message: messages.remind2 }]}
            >
              <Input type="password" placeholder={messages.remind2} />
            </Form.Item>

            <Form.Item
              label={messages.confirmPsw}
              name="password2"
              rules={[{ required: true, message: messages.remind5 }]}
            >
              <Input.Password placeholder={messages.remind5} />
            </Form.Item>

            <Form.Item
              label={messages.companyName}
              name="companyName"
              rules={[{ required: true, message: messages.remind9 }]}
            >
              <Input placeholder={messages.remind9} />
            </Form.Item>
            <Form.Item
              label={messages.country}
              name="country"
              rules={[{ required: true, message: messages.remind7 }]}
            >
              <Input placeholder={messages.remind7} />
            </Form.Item>
            <Form.Item
              label={messages.wantBuyProduct}
              name="wantBuyProduct"
              rules={[{ required: true, message: messages.remind8 }]}
            >
              <Input placeholder={messages.remind8} />
            </Form.Item>

            <Form.Item {...tailLayout}>
              <div className="d-flex to-reg-con">
                <div className="flex-grow-1">
                  {messages.hadAccount}
                  <span onClick={this.toLogin}>{messages.login}</span>
                </div>
                <Button type="primary" htmlType="submit">
                  {messages.register}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
   </div>
  }
}
