import React from 'react';
import {Route, Redirect, Switch} from 'react-router-dom';
import './App.css';
import './login-reg.scss';
import HomePage from './page/homePage';
import Detail from './page/detail';
import en from './translation/en';
import cn from './translation/cn';
import fr from './translation/fr';
import it from './translation//it';

import {HongErHeader} from './HE-ui';
import { Layout } from 'antd';
const { Header, Footer, Content } = Layout;

declare global {
  interface Window {
    headerRef: any;
  }
}

const messages: any = {
  en: en,
  cn: cn,
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
      locale: 'cn'
    }
  }


  changeLanusge = (locale = 'cn'): void => {
    this.setState({
      locale: locale
    });
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

