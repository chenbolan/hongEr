import React from 'react';
import {Route, Redirect, Switch} from 'react-router-dom';

import './App.css';
import './login-reg.scss';
import HomePage from './page/homePage';
import Detail from './page/detail';

import {HongErHeader} from './HE-ui';
import {Layout} from 'antd'
const { Header, Footer, Content } = Layout;

declare global {
  interface Window {
    headerRef: any;
  }
}


function App() {
  return (
    <Layout className="App">
      <Header>
        <HongErHeader ref={(ref) => {window.headerRef = ref}}/>
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
        <p>技术支持：北京汇展信息技术有限公司    ICP备：88888</p>
      </footer>
      </Footer>
    </Layout>
  );
}

export default App;
