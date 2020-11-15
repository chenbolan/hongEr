import * as React from "react";
import {requestUrl, request}  from '../../request';
import Cookies from 'js-cookie';
import { message, Modal, Form, Input, Button, Checkbox } from 'antd';
import { connect } from "react-redux";

interface Props {
  messages: any;
  showRegister: () => void;
  checkIsLogin: () => void;
}
interface ExtProps {
  isLogin: boolean;
  isShow: boolean;
  toggleLoginPop?: (isShow?: boolean) => void;
  changeLoginStatus?: (isLogin?: boolean) => void;
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

export class _Login extends React.Component<Props & ExtProps, State> {
  constructor(props: any){
    super(props);
    this.state={
      openPop: false
    }
  }

  componentDidMount(){}
  componentDidUpdate(preProps: any){
    console.log(preProps, this.props)
  }
  onFinish = (values: {[key: string]: any}) => {
    const _this = this;
    const host = "https://" + window.location.host;
    const tmploginUrl = requestUrl.loginUrl + "?lang=" + Cookies.get("lang")
    request(tmploginUrl, values).then((data: any) => {
      if(data.code === 200){
        message.success(_this.props.messages.loginSuccess);
        Cookies.set('userName', data?.data?.username)
        _this.toggleLoginPop(false);
        _this.props.checkIsLogin();
        const changeLoginStatus = _this?.props?.changeLoginStatus
        changeLoginStatus && changeLoginStatus(true);
      }else{
        message.error(data.message);
      }
    });
  };


  toReg = () => {
    this.toggleLoginPop(false);
    this.props.showRegister();
  }
  forgetPassword = () => {
    var host = "https://" + window.location.host;
    const href  = host + "/vm/pages/front/forgetPassword.html";
    window.open(href,"_blank")
  }

  onFinishFailed = (errorInfo : any) => {
    console.log('Failed:', errorInfo);
  };

  toggleLoginPop = (isOpen = false) => {
    const toggleLoginPop = this?.props?.toggleLoginPop
    toggleLoginPop && toggleLoginPop(isOpen);
  }

  render() {
    const {messages} = this.props;
    return <div className="login-con">
      <Modal
        title=""
        okText=""
        visible={this.props.isShow}
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
            <Input type="password"  placeholder={messages.remind2} />
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
              <Button type="primary" className="forgetPassword" onClick={this.forgetPassword}>
              {messages.forgetPassword}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
   </div>
  }
}
const mapStateToProps = (state: ExtProps) => {
  return {
    isLogin: state.isLogin,
    isShow: state.isShow || false
  }
}
const mapDispatchToProps = (dispatch: any) => {
  return {
    changeLoginStatus: (isLogin: boolean) => dispatch({
      type: "LOGIN",
      isLogin: isLogin
    }),
    toggleLoginPop: (isShow: boolean) => dispatch({
      type: "ShowLogin",
      isShow: isShow
    })
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(_Login)