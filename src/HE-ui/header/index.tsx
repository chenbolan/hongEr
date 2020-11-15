import * as React from "react";
import Cookies from 'js-cookie';
import { Menu, Popover, message, Modal} from 'antd';
import { CaretDownOutlined, UserOutlined, LogoutOutlined, UsergroupAddOutlined} from '@ant-design/icons';
import Login from '../login/login';
import Register from '../login/register';
import {requestUrl, request}  from '../../request';
import { connect } from "react-redux";

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
  showLogin?: (isShow: boolean) => void;
}

interface ExtProps {

}
interface State {
  menuKey: MenuType;
  isLogin: boolean;
  openPop: boolean;
  userName: string;
  loginUrl: string;
  pdfUrl: string;
  exhibitionDesc: string;
  exhibitionTitle: string;
  detail: {[key:string]: any};
  lanuage: string;
  isShowLogin: boolean;
}

export class _Header extends React.Component<Props, State> {
  regRef: any;
  logRef: any;

  getLocaleLaunguage(){
    var language = "en_US";
    var jsSrc =(navigator.language).toLowerCase();
    console.info("locale launguage: " + jsSrc);
  
    if(jsSrc == "zh-cn"){
      language = "zh_CN"
    }else if(jsSrc == "en_us"){
      language = "en_US"
    }else if(jsSrc == "ja_jp"){
      language = "ja_JP"
    }else if (jsSrc == "ru_ru"){
      language = "ru_RU"
    }
    return language;
  }
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
      exhibitionTitle: '',
      detail: {},
      lanuage: this.props.messages.chinese,
      isShowLogin: false
    }
  }

  componentDidMount(){
    this.isLogin();
    this.getHeaderUrl();
    const locale = Cookies.get('lang') || this.getLocaleLaunguage();
    if(Cookies.get('lang')==undefined){
      Cookies.set("lang", this.getLocaleLaunguage());
    }

    this.setState({
      lanuage: locale
    });
  }

  getlanuage = (locale: string) => {
    const { messages } = this.props;
    let lanuage = '';
    switch(locale){
      case "zh_CN":
        lanuage = messages.chinese
        break;
      case "en_US":
        lanuage = messages.english
        break;
      case "ja_JP":
        lanuage = messages.japan
        break;
      case "ru_RU":
        lanuage = messages.russion
        break;
    }
    return lanuage;
  }
  handleClick = (e: any) => {
    // this.setState({
    //   menuKey: e.key,
    // });
  };

  showLogin = () => {
    this.toggleLoginPop(true);
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
    const {detail} = this.state;
    const {messages} = this.props;
    return (<Menu mode="horizontal" onClick={this.handleClick} selectedKeys={[this.state.menuKey]}>
      <Menu.Item onClick={this.toIndex}>
      {detail?.homeTitle}
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
        <li onClick={() => {this.changeLanusge('zh_CN')}}>{messages.chinese}</li>
        <li onClick={() => {this.changeLanusge('en_US')}}>{messages.english}</li>
        <li onClick={() => {this.changeLanusge('ja_JP')}}>{messages.japan}</li>
        <li onClick={() => {this.changeLanusge('ru_RU')}}>{messages.russion}</li>
      </ul>
    )
  }

  changeLanusge = (locale: string) => {
    this.setState({
      lanuage: locale
    });
    this.props.changeLanusge(locale);

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
    this.toggleLoginPop(true)
    this.isLogin()
  }

  getHeaderUrl = () => {
    const _this = this;
    const host = "https://" + window.location.host;
    if(Cookies.get('lang')==undefined){
      Cookies.set("lang",this.getLocaleLaunguage());
    }
    const url = requestUrl.boothLayoutUrlHeader + "?lang=" + Cookies.get("lang")
    request(url, {domainUrl: host}).then((data) => {
      if (data.code === 200) {

        const upLoadShowUrl= "https://exhibitionplatform.oss-cn-hongkong.aliyuncs.com/";

        const layoutId=data.data.layoutId;
        // var sponsorUrl = data.data.sponsorUrl;
        // $("#wordpress").html('<strong>主办方链接</strong> ' + sponsorUrl);

        const logoUrl = `${upLoadShowUrl}${data.data.logo}` || '';
        const exhibitionDesc = data.data.exhibitionDesc || '';
        const exhibitionTitle = data.data.exhibitionTitle || '';
        _this.setState({
          loginUrl: logoUrl,
          pdfUrl: `${upLoadShowUrl}${data.data.pdfUrl}` || '',
          exhibitionDesc:  exhibitionDesc,
          exhibitionTitle: exhibitionTitle,
        });
        localStorage.setItem('layoutId', layoutId);
        localStorage.setItem('loginUrl', logoUrl);
        localStorage.setItem('exhibitionDesc', exhibitionDesc);
        localStorage.setItem('exhibitionTitle', exhibitionTitle);
        _this.getSynopsis(layoutId);
        document.title = exhibitionDesc;
      } else {
        message.error(data.message)
      }
    })

  }

  getSynopsis = (layoutId = '15') => {
    const _this = this;
    request(requestUrl.detail, {id: layoutId}).then((data) => {
      if (data.code === 200) {
        _this.setState({
          detail: data.data
        });
        Cookies.set("svgUrl",data.data.svgUrl);
      } else {
        message.error(data.message)
      }
    })
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
          centered={true}
          width={'80%'}
          onCancel={() => {this.togglePop(false)}}
        >
          <div className="exhibitionDesc_con" style={{height: `${window.screen.height*0.6}px`}} dangerouslySetInnerHTML={{__html: detail?.exhibitionProfile}}></div>
        </Modal>
      </div>
    )
  }

  togglePop = (isOpen = false) => {
    this.setState({
      openPop: isOpen
    });
  }

  toggleLoginPop = (isShow: boolean) => {
    const showLogin = this?.props?.showLogin;
    showLogin && showLogin(isShow)
  }

  toIndex = () => {
    window.location.replace("#/")
  }

  render() {
    
    const { messages } = this.props;
    const { loginUrl, exhibitionDesc, lanuage, exhibitionTitle } = this.state;
    return <div className="he-header conten-p-l conten-p-r">
      <div className="d-flex">
        <div className="d-flex h-100 header-title-con">
          <div className="float-l d-flex">
            <div className="icon-con flex-grow-1" onClick={this.toIndex}>
              <img src={loginUrl} alt=""/>
            </div>
            <div>
              <h1>{exhibitionDesc}</h1>
              <h2>{exhibitionTitle}</h2>
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
                  {this.getlanuage(lanuage)}
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
              {!this.state.isLogin && <UsergroupAddOutlined onClick={() => {this.toggleLoginPop(true)}}/>}
            </div>
          </div>
        </div>

      </div>

      <Login messages={messages} showRegister={this.showRegister} checkIsLogin={this.isLogin}/>
      <Register ref={(ref) => {this.regRef = ref}} showLogin={this.showLogin} messages={messages}/>
      {this.renderModal()}
    </div>;
  }
}

const mapStateToProps = (state: ExtProps) => {
  return {}
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    showLogin: (isShow: boolean) => dispatch({
      type: "ShowLogin",
      isShow: isShow
    })
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(_Header)