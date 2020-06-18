import React from 'react';
import {Route, Redirect, Switch} from 'react-router-dom';
import './App.css';
import './login-reg.scss';
import HomePage from './page/homePage';
import Detail from './page/detail';
import en_US from './translation/en_US';
import zh_CN from './translation/zh_CN';
import fr from './translation/fr';
import it from './translation//it';
import Cookies from 'js-cookie';
import {HongErHeader} from './HE-ui';
import { Layout, message } from 'antd';
const { Header, Footer, Content } = Layout;

declare global {
  interface Window {
    headerRef: any;
  }
}

const messages: any = {
  "en_US": en_US,
  "zh_CN": zh_CN,
  fr: fr,
  it: it,
}
interface State {
  locale: string
}
export default class App extends React.Component<{}, State>{
  constructor(props: any){
    super(props);
    this.state = {
      locale: 'zh_CN'
    }
  }

  componentDidMount(){
    const locale = Cookies.get('lang') || 'zh_CN';
    this.setState({
      locale: locale
    });
    localStorage.setItem('messages', JSON.stringify(messages[locale]))
  }

  changeLanusge = (locale = 'zh_CN'): void => {
    this.setState({
      locale: locale
    });
    Cookies.set("lang",locale);
    localStorage.setItem('messages', JSON.stringify(messages[locale]))
  }

  render() {
    const {locale} = this.state;
    return (
      <Layout className="App">
        <Header>
          <HongErHeader
            messages={messages[locale]}
            changeLanusge={this.changeLanusge}
            ref={(ref: any) => {window.headerRef = ref}}/>
        </Header>
        <Content>
          <Switch>
            <Route exact path='/' component={HomePage}/>
            <Route path='/Detail' component={Detail}/>
            <Redirect to='/' />
          </Switch>
        </Content>
        <Footer>
          <footer>
            <p>{messages[locale].footer}</p>
          </footer>
        </Footer>
      </Layout>
    )
  }
}

