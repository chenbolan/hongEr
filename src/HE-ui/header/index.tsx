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
interface Props {
  // intl: IntlShape
  messages: any;
  changeLanusge: (locale: string) => void;
}
interface State {
  menuKey: MenuType;
  isLogin: boolean;
  openPop: boolean;
  userName: string;
  loginUrl: string;
  pdfUrl: string;
  exhibitionDesc: string;
  detail: {[key:string]: any};
  lanuage: string
}

class _Header extends React.Component<Props, State> {
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
      lanuage: this.props.messages.chinese
    }
  }

  componentDidMount(){
    this.isLogin();
    this.getHeaderUrl();
    const { messages } = this.props;
    const locale = Cookies.get('lang') || 'zh-CN';
    let lanuage = '';
    switch(locale){
      case "zh-CN":
        lanuage = messages.chinese
        break;
      case "en_US":
        lanuage = messages.english
        break;
      case "fr":
        lanuage = messages.french
        break;
      case "it":
        lanuage = messages.italian
        break;
    }
    this.setState({
      lanuage: lanuage
    });
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
    const {messages} = this.props;
    return (<Menu mode="horizontal" onClick={this.handleClick} selectedKeys={[this.state.menuKey]}>
      <Menu.Item key={MenuType.Menu1} >
        {messages.menu1}
      </Menu.Item>
      <Menu.Item onClick={() => {this.togglePop(true)}}>
      {messages.menu2}
      </Menu.Item>
      <Menu.Item >
        <a href={this.state.pdfUrl} target="_blank">{messages.menu3}</a>
      </Menu.Item>
    </Menu>)
  }

  getPopperContent = () => {
    const {messages} = this.props;
    return (
      <ul className="lanuage-list" style={{}}>
        <li onClick={() => {this.changeLanusge('zh_CN', messages.chinese)}}>{messages.chinese}</li>
        <li onClick={() => {this.changeLanusge('en_US', messages.english)}}>{messages.english}</li>
        <li onClick={() => {this.changeLanusge('fr', messages.french)}}>{messages.french}</li>
        <li onClick={() => {this.changeLanusge('it', messages.italian)}}>{messages.italian}</li>
      </ul>
    )
  }

  changeLanusge = (locale: string, checked: string) => {
    this.props.changeLanusge(locale);
    this.setState({
      lanuage: checked
    });
  }

  getLoginContent = () => {
    return (
      <div className="user-msg-con" style={{}}>
        <span>{this.state?.userName}</span>
        <div  onClick={this.logOut}>
          {this.props.messages.logOut}
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
    const { messages } = this.props;
    const { loginUrl, exhibitionDesc, lanuage } = this.state;
    return <div className="he-header conten-p-l conten-p-r">
      <div className="d-flex">
        <div className="d-flex h-100 header-title-con">
          <div className="float-l d-flex">
            <div className="icon-con flex-grow-1" >
              <img src={loginUrl} alt=""/>
            </div>
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
                  {lanuage}
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

      <Login ref={(ref) => {this.logRef = ref}} messages={messages}/>
      <Register ref={(ref) => {this.regRef = ref}}  messages={messages}/>
      {this.renderModal()}
    </div>;
  }
}
export default _Header;
// export default injectIntl(_Header)