import * as React from "react";
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import {Layout, Button, Carousel, message} from 'antd';
import {requestUrl, request} from '../../request'
import Cookies from 'js-cookie';
import { connect } from "react-redux";
import $ from  'jquery'

require('./detail.scss');

const { Content } = Layout;
interface Props {
  isLogin?: boolean;
  showLogin?: () => void;
}

interface classify {
  catId: string;
  catName: string;
}
interface carouselData {
  imgUrl?: Array<string>;
  videoUrl?: string;
}
interface descriptionData {
  exhibitorName: string;
  productName: string;
  productDesc: string;
  galleryLink: string;
  threeDLink: string;
  exhibitorLogo: string;
  carouselData: carouselData;
}
interface State {
  exhibitorId: string;
  layoutId: string;
  name: string;
  logoUrl: string;
  exhibitorName: string;
  galleryLink: string;
  classifyData: Array<classify>;
  currentIndex: number;
  detailIndex: number;
  carouselData: Array<carouselData>;
  descriptionData: Array<descriptionData>;
  threeDLink: string;
  carouselItemHeightf: number;
  showElem: string;
  showElemClose: string;
  showChatButton: string;
  chatUrl: string;
  isDisplayBoolean: boolean;
  ischatDisplayBoolean: boolean;
}

export class _HomePage extends React.Component<Props, State> {
  carouselRef: any;
  carouselItemRef: any;
  constructor(props: any){
    super(props);
    this.state={
      name: '',
      exhibitorId: '',
      layoutId: '',
      logoUrl: '',
      exhibitorName: '',
      galleryLink: '',
      classifyData: [],
      carouselData: [],
      descriptionData: [],
      currentIndex: 0,
      detailIndex: 0,
      threeDLink: '',
      carouselItemHeightf: 0,
      showElem: "",
      showElemClose: "",
      showChatButton: "none",
      chatUrl: "",
      isDisplayBoolean: false,
      ischatDisplayBoolean: true
    }
    this.carouselItemRef= React.createRef();
  }

  componentDidMount(){
    this.checkIsLogin().then(() => {
      this.getExhibitorId();
    })
    const _this = this;
    window.onresize = function(){
      _this.getCarouselItemHeightf();
    };
  }

  componentDidUpdate(preProps: Props, state: any){
    // console.log(preProps, this.props)
    if(!(preProps?.isLogin === this.props?.isLogin)){
      this.getExhibitorId();
    }
  }

  checkIsLogin = ():Promise<boolean> => {
    const {exhibitorId, layoutId} = this.state;
    const isDisplay = this.getQueryString('isDisplay') || "false";
    console.info("isDisplay:" + isDisplay);
    if(!!Cookies.get('userName')){
      
      return Promise.resolve(true)
      
    }else if(isDisplay == 'true'){
      this.setState({
        showChatButton: "none",
        isDisplayBoolean: true,
        ischatDisplayBoolean: false,
        
      });
      return Promise.resolve(true)
    }else{
      const showLogin = this?.props?.showLogin;
      showLogin && showLogin();
      return Promise.reject(false)
    }
    // const params = {

    // }
    // return request(requestUrl.isLoginUrl, params).then((data) => {
    //   if(data.code === 200){
    //     return Promise.resolve(true)
    //   }else{
    //     const showLogin = this?.props?.showLogin;
    //     showLogin && showLogin();
    //     Cookies.set('userName', '');
    //     return Promise.reject(false)
    //   }
    // })
  }


  getClaasify = () => {
    const {exhibitorId, layoutId} = this.state;
    const _this = this;
    const params = {
      layoutId:layoutId,
      id:exhibitorId,
    }
    const url = requestUrl.getCategoryByExhibitorId + "?lang=" + Cookies.get("lang")
    request( url, params).then((data) => {
      if(data.code === 200){
        const newData = data?.data?.map((el:any) => {
          return {
            catName: el?.category,
            catId: el?.id,
          }
        })
        _this.setState({
          classifyData: newData
        },() => {
          _this.getDetail()
        });
      }else{
        message.error(data.message);
      }
    })
  }

  saveCustomerLog = () => {
    const {exhibitorId, layoutId} = this.state;
    const userName = Cookies.get("userName");
    request(requestUrl.saveCustomerLogUrl, {exhibitorId:exhibitorId,userName:userName,layoutId:layoutId}).then(data => {
      if(data.code === 200){
      }else{
        // message.error(data.message);
      }
    })

  }

  initImageUrl = (imgUrl: string) => {
    var upLoadShowUrl= "https://exhibitionplatform.oss-cn-hongkong.aliyuncs.com/";
    const imgData = imgUrl.split(';').map(el => {
      return `${upLoadShowUrl}${el}`
    });
    return imgData
  }

  getDetail = () => {
    const {exhibitorId, currentIndex, classifyData} = this.state;
    const catId = classifyData?.[currentIndex].catId || '';
    const _this = this;
    const params = {
      exhibitorId:exhibitorId,
      catId:catId,
    }
    request(requestUrl.listByCatIdAndExhibitorId, params).then(data => {
      if(data.code === 200){
        var upLoadShowUrl= "https://exhibitionplatform.oss-cn-hongkong.aliyuncs.com/";


        // data?.data?.forEach((el: any) => {
        //   carouselData.imgUrl = this.initImageUrl(el?.imgUrl);
        //   carouselData.videoUrl = el?.videoUrl ? `${upLoadShowUrl}${el?.videoUrl}` : '';
        // });
        const descriptionData = data?.data?.map((el:any) => {
          const carouselData: carouselData = {};
          carouselData.imgUrl = this.initImageUrl(el?.imgUrl);
          carouselData.videoUrl = el?.videoUrl ? `${upLoadShowUrl}${el?.videoUrl}` : '';
          return {
            exhibitorName: el?.exhibitorName,
            productName: el?.productName,
            productDesc: el?.productDesc,
            galleryLink: el?.galleryLink,
            threeDLink: el?.galleryLink,
            exhibitorLogo: `${upLoadShowUrl}${el?.logo}`,
            carouselData: carouselData
          }
        })
        _this.setState({
          descriptionData: descriptionData
        },() => {
          _this.getCarouselItemHeightf()
        });
      }else{
        message.error(data.message);
      }
    })
  }

  getExhibitorId = () => {
    const exhibitorId = this.getQueryString('exhibitorId') || '';
    const layoutId = this.getQueryString('layoutId') || '';
  
    this.setState({
      exhibitorId: exhibitorId,
      layoutId: layoutId,
    },() => {
      if(!exhibitorId || !layoutId) return false;
      this.getClaasify()
      this.saveCustomerLog();
      this.linkCustomService();
      var host = "https://" + window.location.host;
      const href  = host + "/vm/pages/front/im/mainNew.html?exhibitorId=" +  exhibitorId;
      this.setState({
        chatUrl: href,
      })
    });
  }

  imgFullScreen = () => {
    $(".resource-con").css({"width":"100%",
    "position":"absolute",
    "z-index": "1",
    "padding": 0,
    "left": 0,
    "background": "black",
    "top": 0,
    "margin": 0});

    $(".imgFullScreeButton").css({
      "position": "absolute",
      "top": 0,
      "display":"none"
    })
    $(".imgFullScreeButtonExit").css({
      "position": "absolute",
      "top": 0,
      "display":"block"
    })
  }

  imgFullScreenExit = () => {
    $(".resource-con").css({"width":"50%",
    "text-align": "left",
     "position":"inherit",
    "margin-left": "6%",
    "background":"inherit"
  });

    $(".imgFullScreeButtonExit").css({
      "position": "absolute",
      "top": 0,
      "display":"none"
    })
    $(".imgFullScreeButton").css({
      "position": "absolute",
      "top": 0,
      "display":"block"
    })
  }
 

  getCarouselItem = (url: string, isVedio =false) => {
    if(!isVedio){
      // return (<img alt={el?.productName} src={el?.imgUrl}/>)
      const urls = url || ''
      let messages: any = localStorage.getItem('messages') || '{}';
      messages = JSON.parse(messages);
      return (
        <Layout>
          <button className="imgFullScreeButton" onClick={() => {this.imgFullScreen()}} >{messages.fullScreen}</button>
          <button className="imgFullScreeButtonExit" onClick={() => {this.imgFullScreenExit()}} >{messages.exitFullScreen}</button>
          <div className="c-img" style={{backgroundImage:`url(${urls})`}}></div>
          
        </Layout>
     
      )
    }else{
      return (<div className="c-img"><video controls className="video-player" webkit-playsinline="" x-webkit-airplay="allow" preload="auto" src={url}/></div>)
    }
  }

  getQueryString(key: string): string {
    const hash = window.location.hash;
    const query: Array<string> = hash?.split('?')?.[1]?.split('&');
    let queryObject: {[key: string]: any} = {};
    if(!query) return '';
    query.forEach(el => {
      const params = el.split('=');
      const key = params[0];
      queryObject[key] = params[1];
    })
    const values = queryObject[key] || '';
    return values as string;
  }

  toggleDetail = (isLeft = false) => {
    const {detailIndex, descriptionData} = this.state;
    const length = descriptionData.length - 1;
    let newIndex;
    if(isLeft){
      newIndex = detailIndex - 1;
    }else{
      newIndex = detailIndex + 1;
    }
    newIndex = newIndex < 0 ? length : newIndex;
    newIndex = newIndex > length ? 0 : newIndex;
    this.setState({
      detailIndex: newIndex
    });
  }

  onBtnCLick = (index: number) => {
    const {currentIndex} = this.state;
    if(currentIndex === index)return false;
    this.setState({currentIndex: index},()=>{
      this.getDetail()
    });
  }

  downloadPdfBtn = () => {
    var host = "https://" + window.location.host;
    const href  = host + "/product/download?id=" + this.state.exhibitorId;
    window.open(href)
  }

  goTo3D = () => {
    window.location.href  = this.state.galleryLink;
  }

  linkCustomService = () => {
    const {exhibitorId} = this.state;
    const userName = Cookies.get("userName");
    var host = "https://" + window.location.host;
    if(!userName) return false;

    const params = {
      userName:Cookies.get("userName"),
      exhibitorId:exhibitorId,
    }
    request(requestUrl.linkCustomServiceUrl, params).then(data => {
      if (data != null) {
        Cookies.set("kefuUid",data.data);
        // const href  = host + "/vm/pages/front/im/main.html?exhibitorId=" +  exhibitorId;
        // window.open(href);
      }
    });
  }

  toggleChat = () => {
    this.setState({
      showElem: this.state.showElem==""?"none":"",
      showElemClose: this.state.showElemClose==""?"none":"",
      
      showChatButton: this.state.showChatButton==""?"none":""
    });
  }

  closeChat = () => {
    this.setState({
      showChatButton: this.state.showChatButton==""?"none":"",
      showElemClose: this.state.showElemClose==""?"none":"",
      showElem: this.state.showElem==""?"none":"",
    });
  }

  toggleChatMore = () => {
    alert("toggleMore");
  }


  toOpendThreeDLink = (link: string) => {
    window.open(link)
  }

  getCarouselItemHeightf = () => {
    const height = this.carouselItemRef?.current?.clientHeight || 0;
    this.setState({
      carouselItemHeightf: height
    });
  }

  getCarouselItems = () => {
    const {descriptionData, detailIndex} = this.state;
    const item = [];
    const detailData = descriptionData?.[detailIndex]?.carouselData
    const videoUrl = detailData?.videoUrl;
    if(videoUrl){
      const itemEmlement = (
        <div key={videoUrl} className="carousel-items" ref={this.carouselItemRef}>
          <div >
            <div>{this.getCarouselItem(videoUrl, true)}</div>
            <h3 className="resource-introduce">{descriptionData?.[detailIndex]?.productName}</h3>
          </div>
        </div>
      );
      item.push(itemEmlement)
    }
    if(detailData?.imgUrl){
      detailData.imgUrl.forEach((el, index) => {
        const itemEmlement = (
          <div key={index} className="carousel-items" ref={this.carouselItemRef}>
            <div >
              <div>{this.getCarouselItem(el, false)}</div>
              <h3 className="resource-introduce">{descriptionData?.[detailIndex]?.productName}</h3>
            </div>
          </div>
        );
        item.push(itemEmlement)
      })
    }
   
    return item;
  }

  render() {
      const {classifyData, currentIndex, descriptionData, detailIndex, carouselItemHeightf} = this.state;
      let messages: any = localStorage.getItem('messages') || '{}';

      const detailData = descriptionData?.[detailIndex];
      const threeDLink = detailData?.threeDLink;

      messages = JSON.parse(messages);

      return <div className="detail-page conten-p-l conten-p-r">
        {!!Cookies.get('userName') && <Layout>
          <div className="detail-title">
            <div className="icon-detail">
              <img src={detailData?.exhibitorLogo} alt=""/>
            </div>
            <span></span>
            <h1>{detailData?.exhibitorName}</h1>
          </div>

          <Content className="detail-con">
            <Layout>
              <div className="text-align-l button-group-con">
                {classifyData.map((el, index) => {
                  return (
                  <Button
                    key={index}
                    className={currentIndex === index ? 'active' : ''}
                    onClick={() => {this.onBtnCLick(index)}}
                  >
                    {el.catName}
                  </Button>)
                })}
              </div>
              <Content>
                <div className="d-flex product-introduce">
                  <div className="product-int flex-grow-1" style={{height: `${carouselItemHeightf}px`}}>
                    <div className="product_name text-align-l" >
                      {detailData?.productName}
                    </div>
                    <div className="text-align-l product-desc" style={{height: `${carouselItemHeightf - 85}px`}} dangerouslySetInnerHTML={{__html: detailData?.productDesc}} ></div>
                    <div className="toggle-btn-con text-align-l d-flex">
                      <div className="text-align-l d-inline-block flex-grow-1 btn-con">
                        <Button icon={<LeftOutlined />} onClick={()=>{this.toggleDetail(true)}}></Button>
                        <Button className="right-btn" icon={<RightOutlined />} onClick={()=>{this.toggleDetail(false)}}></Button>
                      </div>
                      <div className="j-link-con">
                        { threeDLink && <Button onClick={() =>{this.toOpendThreeDLink(threeDLink)}}>{messages?.threeDLink}</Button>}
                        <Button onClick={this.downloadPdfBtn}>{messages?.download}</Button>
                        <div className="kefu" style={{display:"none"}} onClick={this.linkCustomService} title={messages.service}></div>
                      </div>
                    </div>
                  </div>
                  <div className="resource-con  d-flex">
                    <Button onClick={() => {this?.carouselRef?.slick?.slickPrev()}} icon={<LeftOutlined />}></Button>
                    <div>
                      <Carousel className="flex-grow-1 carousel-con" ref={(ref) => {this.carouselRef = ref}}>
                        {this.getCarouselItems()}
                      </Carousel>
                      <div></div>
                    </div>
                    <Button className="right-btn" onClick={() => {this?.carouselRef?.slick?.slickNext()}} icon={<RightOutlined />}></Button>
                  </div>
                </div>
              </Content>
            </Layout>

          </Content>
        </Layout>}
       
        {!Cookies.get('userName') && this.state.isDisplayBoolean && <Layout>
          <div className="detail-title">
            <div className="icon-detail">
              <img src={detailData?.exhibitorLogo} alt=""/>
            </div>
            <span></span>
            <h1>{detailData?.exhibitorName}</h1>
          </div>

          <Content className="detail-con">
            <Layout>
              <div className="text-align-l button-group-con">
                {classifyData.map((el, index) => {
                  return (
                  <Button
                    key={index}
                    className={currentIndex === index ? 'active' : ''}
                    onClick={() => {this.onBtnCLick(index)}}
                  >
                    {el.catName}
                  </Button>)
                })}
              </div>
              <Content>
                <div className="d-flex product-introduce">
                  <div className="product-int flex-grow-1" style={{height: `${carouselItemHeightf}px`}}>
                    <div className="product_name text-align-l" >
                      {detailData?.productName}
                    </div>
                    <div className="text-align-l product-desc" style={{height: `${carouselItemHeightf - 85}px`}} dangerouslySetInnerHTML={{__html: detailData?.productDesc}} ></div>
                    <div className="toggle-btn-con text-align-l d-flex">
                      <div className="text-align-l d-inline-block flex-grow-1 btn-con">
                        <Button icon={<LeftOutlined />} onClick={()=>{this.toggleDetail(true)}}></Button>
                        <Button className="right-btn" icon={<RightOutlined />} onClick={()=>{this.toggleDetail(false)}}></Button>
                      </div>
                      <div className="j-link-con">
                        { threeDLink && <Button onClick={() =>{this.toOpendThreeDLink(threeDLink)}}>{messages?.threeDLink}</Button>}
                        <Button onClick={this.downloadPdfBtn}>{messages?.download}</Button>
                        <div className="kefu" style={{display:"none"}} onClick={this.linkCustomService} title={messages.service}></div>
                      </div>
                    </div>
                  </div>
                  <div className="resource-con  d-flex">
                    <Button onClick={() => {this?.carouselRef?.slick?.slickPrev()}} icon={<LeftOutlined />}></Button>
                    <div>
                      <Carousel className="flex-grow-1 carousel-con" ref={(ref) => {this.carouselRef = ref}}>
                        {this.getCarouselItems()}
                      </Carousel>
                      <div></div>
                    </div>
                    <Button className="right-btn" onClick={() => {this?.carouselRef?.slick?.slickNext()}} icon={<RightOutlined />}></Button>
                  </div>
                </div>
              </Content>
            </Layout>

          </Content>
        </Layout>}
        
        {this.state.ischatDisplayBoolean &&
        <Layout>
            <span className="closeChat"  style={{display:this.state.showElemClose}} onClick={this.closeChat}>{messages?.close}</span>
            <div  className="chatContentDiv" style={{display:this.state.showElem}}>
                    <iframe id="chatIframe" scrolling="no"  style={{border:0,width:"600px",height:"410px",}}  src={this.state.chatUrl}></iframe>
            </div>
            <div className="kefuchatDiv"  style={{display:this.state.showChatButton}}>
              <span className="kefuchat" onClick={this.toggleChat}>{messages?.kefuChat}</span>
             
            </div>
        </Layout>}

      </div>;
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    showLogin: () => dispatch({
      type: "ShowLogin",
      isShow: true
    })
  }
}

const mapStateToProps = (state: Props) => {
  return {
    isLogin: state.isLogin
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(_HomePage)