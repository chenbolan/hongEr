import * as React from "react";
import Cookies from 'js-cookie';
import './homePage.scss'
import {requestUrl, request}  from '../../request';
import { message } from 'antd';
interface Props {}
interface State {
  isHome: boolean;
}

export default class HomePage extends React.Component<Props, State> {
  constructor(props: any){
    super(props);
    this.state={
      isHome: false
    }
  }

  componentDidMount(){
    this.initMap();
  }

  initMap = () => {
    const host = "https://" + window.location.host;
    const url = requestUrl.boothLayoutUrl + "?lang=" + Cookies.get("lang")
    request(url, {domainUrl: host}).then((data: any) => {
      if (data.code === 200) {
        let layoutId, upLoadShowUrl;
        layoutId=data.data.layoutId;
        var exhibitionDesc = data.data.exhibitionDesc;
        var sponsorUrl = data.data.sponsorUrl;
        $("#wordpress").html('<strong>主办方链接</strong> ' + sponsorUrl);
        $("#titleDesc").html(exhibitionDesc);
        $("#zhanhuiLogo").attr("src",upLoadShowUrl + data.data.logo);
        $("#pdfUrl").val(upLoadShowUrl + data.data.pdfUrl);
        var dataStr = JSON.parse(data.data.mapJson);
        const windows:any = window;
        windows?.init(dataStr);
      } else {
        message.error(data.message)
      }
    })
  }

  render() {
      return <div className="home-page conten-p-r conten-p-l">
        <div className="main">
          <section id="map-section" className="inner over" style={{"paddingBottom": "0px"}}>
            <div className="map-container">
                <div id="mapplic"></div>
            </div>
          </section>
        </div>
      </div>;
  }
}