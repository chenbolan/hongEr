import React from 'react';
import {Route, Redirect, Switch} from 'react-router-dom';
import './App.css';
import './login-reg.scss';
import HomePage from './page/homePage';
import Detail from './page/detail';
import en_US from './translation/en_US';
import zh_CN from './translation/zh_CN';
import ja_JP from './translation/ja_JP';
import ru_RU from './translation/ru_RU';
import Cookies from 'js-cookie';
import {HongErHeader} from './HE-ui';
import { Layout } from 'antd';
const { Header, Footer, Content } = Layout;

const messages: any = {
  "en_US": en_US,
  "zh_CN": zh_CN,
  ja_JP: ja_JP,
  ru_RU: ru_RU,
}
interface State {
  locale: string
}
export default class App extends React.Component<{}, State>{
  constructor(props: any){
    super(props);
    this.state = {
      locale: 'en_US'
    }
  }

  componentDidMount(){
    const locale = Cookies.get('lang') || 'en_US';
    this.setState({
      locale: locale
    });
    localStorage.setItem('messages', JSON.stringify(messages[locale]))
  }

  changeLanusge = (locale = 'en_US'): void => {
    this.setState({
      locale: locale
    });
    Cookies.set("lang",locale);
    localStorage.setItem('messages', JSON.stringify(messages[locale]))
    //刷新页面
    window.location.reload();
  }

  render() {
    const {locale} = this.state;
    return (
      <Layout className="App">
        <Header>
          <HongErHeader
            messages={messages[locale]}
            changeLanusge={this.changeLanusge}
          />
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
            <p>{messages[locale].footer}
        
            </p>

          </footer>
        </Footer>
      </Layout>
    )
  }
}

