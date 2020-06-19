import * as React from "react";
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import {Layout, Button, Carousel, message} from 'antd';
import {requestUrl, request} from '../../request'
import Cookies from 'js-cookie';
import { connect } from "react-redux";

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
  imgUrl?: string;
  videoUrl?: string;
  productName: string;
}
interface descriptionData {
  exhibitorName: string;
  productName: string;
  productDesc: string;
  galleryLink: string;
  threeDLink: string;
  exhibitorLogo: string;
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
    }
    this.carouselItemRef= React.createRef();
  }

  componentDidMount(){
    this.checkIsLogin().then(() => {
      this.getExhibitorId();
    })
    const _this = this;
    window.onresize = function(){
      _this.getExhibitorId();
    };
  }

  componentDidUpdate(preProps: Props, state: any){
    // console.log(preProps, this.props)
    if(!(preProps?.isLogin === this.props?.isLogin)){
      this.getExhibitorId();
    }
  }

  checkIsLogin = ():Promise<boolean> => {
    if(!!Cookies.get('userName')){
      return Promise.resolve(true)
    }else{
      const showLogin = this?.props?.showLogin;
      showLogin && showLogin();
      return Promise.reject(false)
    }
  }

  getClaasify = () => {
    const {exhibitorId, layoutId} = this.state;
    const _this = this;
    const params = {
      layoutId:layoutId,
      id:exhibitorId,
    }
    request( requestUrl.getCategoryByExhibitorId, params).then((data) => {
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
    const {exhibitorId} = this.state;
    request(requestUrl.saveCustomerLogUrl, {exhibitorId:exhibitorId}).then(data => {
      if(data.code === 200){
      }else{
        message.error(data.message);
      }
    })

  }

  getDetail = () => {
    const {exhibitorId, currentIndex, classifyData} = this.state;
    const catId = classifyData?.[currentIndex] || '';
    const _this = this;
    const params = {
      exhibitorId:exhibitorId,
      catId:catId,
    }
    request(requestUrl.listByCatIdAndExhibitorId, params).then(data => {
      if(data.code === 200){
        var upLoadShowUrl= "https://exhibitionplatform.oss-cn-hongkong.aliyuncs.com/";
        const carouselData: Array<carouselData> = [];

        data?.data?.forEach((el: any) => {
          if(el?.imgUrl){
            carouselData.push({
              imgUrl: `${upLoadShowUrl}${el?.imgUrl}`,
              productName: el?.productName
            })
          }
          if(el?.videoUrl){
            carouselData.push({
              videoUrl: `${upLoadShowUrl}${el?.videoUrl}`,
              // videoUrl: `http://pgc.qcdn.xiaodutv.com/1425596334_265493638_20200616081039.mp4?Cache-Control%3Dmax-age-8640000%26responseExpires%3DThu%2C_24_Sep_2020_08%3A11%3A10_GMT=&xcode=1d20d8470d650f5a4e469b84a48fec4ea1be0f25c587e7b7&time=1592414787&_=1592329910176`,
              productName: el?.productName
            })
          }
        });
        const descriptionData = data?.data?.map((el:any) => {
          return {
            exhibitorName: el?.exhibitorName,
            productName: el?.productName,
            productDesc: el?.productDesc,
            galleryLink: el?.galleryLink,
            threeDLink: el?.galleryLink,
            exhibitorLogo: `${upLoadShowUrl}${el?.logo}`,
          }
        })
        _this.setState({
          carouselData: carouselData,
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
      layoutId: layoutId
    },() => {
      if(!exhibitorId || !layoutId) return false;
      this.getClaasify()
      this.saveCustomerLog();
    });
  }

  getCarouselItem = (el: any) => {
    if(el?.imgUrl){
      // return (<img alt={el?.productName} src={el?.imgUrl}/>)
      const url = el?.imgUrl || ''
      return (<div className="c-img" style={{backgroundImage:`url(${url})`}}></div>)
    }else if(el?.videoUrl){
      return (<div className="c-img"><video controls className="video-player" webkit-playsinline="" x-webkit-airplay="allow" preload="auto" src={el.videoUrl}/></div>)
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
      this?.carouselRef?.slick?.slickPrev()
    }else{
      newIndex = detailIndex + 1;
      this?.carouselRef?.slick?.slickNext()
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
    this.setState(
      {currentIndex: index
    },()=>{
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
        const href  = host + "/vm/pages/front/im/main.html?exhibitorId=" +  exhibitorId;
        window.open(href);
      }
    });
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

  render() {
      const {classifyData, currentIndex, carouselData, descriptionData, detailIndex, carouselItemHeightf} = this.state;
      const threeDLink = descriptionData?.[detailIndex]?.threeDLink;
      let messages: any = localStorage.getItem('messages') || '{}';
      messages = JSON.parse(messages);

      return <div className="detail-page conten-p-l conten-p-r">
        {!!Cookies.get('userName') && <Layout>
          <div className="detail-title">
            <div className="icon-detail">
              <img src={descriptionData?.[detailIndex]?.exhibitorLogo} alt=""/>
            </div>
            <span></span>
            <h1>{descriptionData?.[detailIndex]?.exhibitorName}</h1>
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
                      {descriptionData?.[detailIndex]?.productName}
                    </div>
                    <div className="text-align-l product-desc" style={{height: `${carouselItemHeightf - 85}px`}} dangerouslySetInnerHTML={{__html: descriptionData?.[detailIndex]?.productDesc}} ></div>
                    <div className="toggle-btn-con text-align-l d-flex">
                      <div className="text-align-l d-inline-block flex-grow-1 btn-con">
                        <Button icon={<LeftOutlined />} onClick={()=>{this.toggleDetail(true)}}></Button>
                        <Button className="right-btn" icon={<RightOutlined />} onClick={()=>{this.toggleDetail(false)}}></Button>
                      </div>
                      <div className="j-link-con">
                        { threeDLink && <Button onClick={() =>{this.toOpendThreeDLink(threeDLink)}}>{messages?.threeDLink}</Button>}
                        <Button onClick={this.downloadPdfBtn}>{messages?.download}</Button>
                        <div className="kefu" onClick={this.linkCustomService} ></div>
                      </div>
                    </div>
                  </div>
                  <div className="resource-con  d-flex">
                    <Button onClick={() => {this.toggleDetail(true)}} icon={<LeftOutlined />}></Button>
                    <div>
                      <Carousel className="flex-grow-1 carousel-con" ref={(ref) => {this.carouselRef = ref}}>
                        {carouselData?.map((el: any, index: number)=>{
                          return (
                            <div key={index} className="carousel-items" ref={this.carouselItemRef}>
                              <div >
                                <div>{this.getCarouselItem(el)}</div>
                                <h3 className="resource-introduce">{el?.productName}</h3>
                              </div>
                            </div>
                          )
                        })}
                      </Carousel>
                      <div></div>
                    </div>
                    <Button className="right-btn" onClick={() => {this.toggleDetail(false)}} icon={<RightOutlined />}></Button>
                  </div>
                </div>
              </Content>
            </Layout>

          </Content>
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