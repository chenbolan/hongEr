import * as React from "react";
import Cookies from 'js-cookie';
import { Menu, Popover} from 'antd';
import { CaretDownOutlined, UserOutlined, LogoutOutlined, UsergroupAddOutlined} from '@ant-design/icons';
import Login from '../login/login';
import Register from '../login/register';

require('./header.scss')
enum MenuType {
  Menu1 = "MENU1",
  Menu2 = "MENU2",
  Menu3 = "MENU3",
}
interface Props {}
interface State {
  menuKey: MenuType;
  isLogin: boolean;
}

export default class Header extends React.Component<Props, State> {
  regRef: any;
  logRef: any;

  constructor(props: any){
    super(props);
    this.state={
      menuKey: MenuType.Menu1,
      isLogin: false
    }
  }

  handleClick = (e: any) => {
    this.setState({
      menuKey: e.key,
    });
  };

  showLogin = () => {
    this.logRef.toggleLoginPop(true);
  }

  showRegister = () => {
    this.regRef.toggleLoginPop(true);
  }

  isLogin = () => {
    const session = Cookies.get('userSession');
    const isLogin = !!session;
    this.setState({
      isLogin: isLogin
    });
  }

  renderMenu = () => {
    return (<Menu mode="horizontal" onClick={this.handleClick} selectedKeys={[this.state.menuKey]}>
      <Menu.Item key={MenuType.Menu1} >
        展会现场
      </Menu.Item>
      <Menu.Item key={MenuType.Menu2}>
        展会刊例
      </Menu.Item>
      <Menu.Item key={MenuType.Menu3}>
        电子会刊
      </Menu.Item>
    </Menu>)
  }

  getPopperContent = () => {
    return (
      <ul className="lanuage-list" style={{}}>
        <li>中文</li>
        <li>英文</li>
        <li>意大利文</li>
      </ul>
    )
  }

  getLoginContent = () => {
    return (
      <div className="user-msg-con" style={{}}>
        <span>用户名</span>
        <div  onClick={this.logOut}>
          退出登录
          <LogoutOutlined />
        </div>
      </div>
    )
  }

  logOut = () => {
    Cookies.set('userSession', '');
    this.logRef.toggleLoginPop(true)
  }

  render() {
      return <div className="he-header conten-p-l conten-p-r">
        <div className="d-flex">
          <div className="d-flex h-100 header-title-con">
            <div className="float-l d-flex">
              <a className="icon-con flex-grow-1" href="#"> </a>
              <div>
                <h1>鸿尔展览主办的全球性塑胶展会</h1>
                <h2>Global plastic exhibition sponsored by honger Exhibition</h2>
              </div>
            </div>
          </div>

          <div className=" flex-grow-1">
            <div className="float-r d-flex">
              <div className="flex-grow-1 menu-con">
                {this.renderMenu()}
              </div>

              <div className="language-con">
                <Popover content={this.getPopperContent()} title="" trigger="click">
                  <div>
                    中文
                    <CaretDownOutlined/>
                  </div>
                </Popover>
              </div>

              <div className="login-con">
                {this.state.isLogin && <Popover content={this.getLoginContent()} title="" trigger="click">
                  <div>
                    <UserOutlined/>
                  </div>
                </Popover>}
                {!this.state.isLogin && <UsergroupAddOutlined onClick={() => {this.logRef.toggleLoginPop(true)}}/>}
              </div>
            </div>
          </div>

        </div>

        <Login ref={(ref) => {this.logRef = ref}}/>
        <Register ref={(ref) => {this.regRef = ref}}/>
      </div>;
  }
}