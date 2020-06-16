import * as React from "react";
import Cookies from 'js-cookie';
import { Menu, Popover, message, Modal} from 'antd';
import { CaretDownOutlined, UserOutlined, LogoutOutlined, UsergroupAddOutlined} from '@ant-design/icons';
import Login from '../login/login';
import Register from '../login/register';
import {Post, requestUrl}  from '../../request';

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
  openPop: boolean;
  userName: string;
  loginUrl: string;
  pdfUrl: string;
  exhibitionDesc: string;
  detail: {[key:string]: any};
}

export default class Header extends React.Component<Props, State> {
  regRef: any;
  logRef: any;

  constructor(props: any){
    super(props);
    this.state={
      menuKey: MenuType.Menu1,
      isLogin: false,
      openPop: false,
      userName: '',
      loginUrl: '',
      pdfUrl: '',
      exhibitionDesc: '',
      detail: {},
    }
  }

  componentDidMount(){
    this.isLogin();
    this.getHeaderUrl();
  }

  handleClick = (e: any) => {
    // this.setState({
    //   menuKey: e.key,
    // });
  };

  showLogin = () => {
    this.logRef.toggleLoginPop(true);
  }

  showRegister = () => {
    this.regRef.toggleLoginPop(true);
  }

  isLogin = () => {
    const userName = Cookies.get('userName') || '';
    const isLogin = !!userName;
    this.setState({
      isLogin: isLogin,
      userName: userName
    });
  }

  renderMenu = () => {
    return (<Menu mode="horizontal" onClick={this.handleClick} selectedKeys={[this.state.menuKey]}>
      <Menu.Item key={MenuType.Menu1} >
        展会现场
      </Menu.Item>
      <Menu.Item onClick={() => {this.togglePop(true)}}>
        展会简介
      </Menu.Item>
      <Menu.Item >
        <a href={this.state.pdfUrl} target="_blank">电子会刊</a>
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
        <span>{this.state?.userName}</span>
        <div  onClick={this.logOut}>
          退出登录
          <LogoutOutlined />
        </div>
      </div>
    )
  }

  logOut = () => {
    Cookies.set('userName', '');
    this.logRef.toggleLoginPop(true);
    this.isLogin()
  }

  getHeaderUrl = () => {
    const _this = this;
    Post(
      requestUrl.boothLayoutUrl,
      {id: 15},
      function(data: any){
        if (data.code === 200) {

          const upLoadShowUrl= "https://exhibitionplatform.oss-cn-hongkong.aliyuncs.com/";

          const layoutId=data.data.layoutId;
          var sponsorUrl = data.data.sponsorUrl;
          $("#wordpress").html('<strong>主办方链接</strong> ' + sponsorUrl);

          const logoUrl = `${upLoadShowUrl}${data.data.logo}` || '';
          const exhibitionDesc = data.data.exhibitionDesc || '';
          _this.setState({
            loginUrl: logoUrl,
            pdfUrl: `${upLoadShowUrl}${data.data.pdfUrl}` || '',
            exhibitionDesc:  exhibitionDesc,
          });
          localStorage.setItem('layoutId', layoutId);
          localStorage.setItem('loginUrl', logoUrl);
          localStorage.setItem('exhibitionDesc', exhibitionDesc);
          _this.getSynopsis(layoutId);
        } else {
          message.error(data.message)
        }
    });
  }

  getSynopsis = (layoutId = '15') => {
    const _this = this;
    Post(
      requestUrl.detail,
      {id: layoutId},
      function(data: any){
        if (data.code === 200) {
          _this.setState({
            detail: data.data
          });
        } else {
          message.error(data.message)
        }
    });
  }

  renderModal = () => {
    const {detail} = this.state;
    return (
      <div className="login-con">
        <Modal
          title={detail?.exhibitionDesc}
          okText=""
          visible={this.state.openPop}
          mask={true}
          className="login_reg_m"
          onCancel={() => {this.togglePop(false)}}
        >
          <div className="exhibitionDesc_con" dangerouslySetInnerHTML={{__html: detail?.exhibitionProfile}}></div>
        </Modal>
      </div>
    )
  }

  togglePop = (isOpen = false) => {
    this.setState({
      openPop: isOpen
    });
  }

  render() {
    const { loginUrl, exhibitionDesc, pdfUrl } = this.state;
    return <div className="he-header conten-p-l conten-p-r">
      <div className="d-flex">
        <div className="d-flex h-100 header-title-con">
          <div className="float-l d-flex">
            <a className="icon-con flex-grow-1" href="javascript:;">
              <img src={loginUrl} alt=""/>
            </a>
            <div>
              <h1>{exhibitionDesc}</h1>
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
      {this.renderModal()}
    </div>;
  }
}