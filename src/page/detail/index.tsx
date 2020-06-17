import * as React from "react";
import { LeftOutlined, RightOutlined,RedditOutlined } from '@ant-design/icons';
import {Layout, Button, Carousel, message} from 'antd';
import * as queryString from 'query-string';
import {Post, requestUrl, frontBaseUrl} from '../../request'
import Cookies from 'js-cookie';

require('./detail.scss');

const { Content } = Layout;
interface Props {}

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
}
interface State {
  exhibitorId: string;
  layoutId: string;
  name: string;
  logoUrl: string;
  exhibitorName: string;
  classifyData: Array<classify>;
  currentIndex: number;
  detailIndex: number;
  carouselData: Array<carouselData>;
  descriptionData: Array<descriptionData>;

}

export default class HomePage extends React.Component<Props, State> {
  carouselRef: any
  constructor(props: any){
    super(props);
    this.state={
      name: '',
      exhibitorId: '',
      layoutId: '',
      logoUrl: '',
      exhibitorName: '',
      classifyData: [],
      carouselData: [],
      descriptionData: [],
      currentIndex: 0,
      detailIndex: 0,
    }
  }

  componentDidMount(){
    this.checkIsLogin().then(() => {
      this.getExhibitorId();
    })
  }

  checkIsLogin = ():Promise<boolean> => {
    if(!!Cookies.get('userName')){
      return Promise.resolve(true)
    }else{
      window.headerRef.showLogin();
      return Promise.reject(false)
    }
  }

  getClaasify = () => {
    const {exhibitorId, layoutId} = this.state;
    const _this = this;
    Post(
      requestUrl.getCategoryByExhibitorId,
      {
        layoutId:layoutId,
        id:exhibitorId,
      },
      function(data: any){
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
      }
    )
  }

  getDetail = () => {
    const {exhibitorId, currentIndex, classifyData} = this.state;
    const catId = classifyData?.[currentIndex] || '';
    const _this = this;
    Post(
      requestUrl.listByCatIdAndExhibitorId,
      {
        exhibitorId:exhibitorId,
        catId:catId,
      },
      function(data: any){
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
            }
          })
          _this.setState({
            carouselData: carouselData,
            descriptionData: descriptionData
          });
        }else{
          message.error(data.message);
        }
      }
    )
  }

  getExhibitorId = () => {
    const exhibitorId = this.getQueryString('exhibitorId') || '';
    const layoutId = this.getQueryString('layoutId') || '';
    this.setState({
      exhibitorId: exhibitorId,
      layoutId: layoutId
    },() => {
      this.getClaasify()
    });
  }

  getCarouselItem = (el: any) => {
    if(el?.imgUrl){
      return (<img alt={el?.productName} src={el?.imgUrl}/>)
    }else if(el?.videoUrl){
      return (<video controls className="video-player" webkit-playsinline="" x-webkit-airplay="allow" preload="auto" src={el.videoUrl}/>)
    }
  }

  getQueryString(key: string): string {
    const queryObject = queryString.parse(window.location.search);
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
    this.setState(
      {currentIndex: index
    },()=>{
      this.getDetail()
    });
  }

  downloadPdfBtn = () => {
    window.location.href  = frontBaseUrl + "/product/download?id=" + this.state.exhibitorId;
  }

  linkCustomService = () => {
    const {exhibitorId, layoutId} = this.state;
    const _this = this;
    Post(
      requestUrl.linkCustomServiceUrl,
      {
        userName:Cookies.get("userName"),
        exhibitorId:exhibitorId,
      },
      function(data: any){
        if (data != null) {
          window.location.href  = frontBaseUrl + "/vm/pages/front/im/main.html?exhibitorId=" +  exhibitorId;
        }
      }
    )
  }

  render() {
      const logoUrl = localStorage.getItem('loginUrl') || '';
      const logexhibitionDescoUrl = localStorage.getItem('exhibitionDesc') || '';
      const {classifyData, currentIndex, carouselData, descriptionData, detailIndex} = this.state;
      return <div className="detail-page conten-p-l conten-p-r">
        {!!Cookies.get('userName') && <Layout>
          <div className="detail-title">
            <div className="icon-detail">
              <img src={logoUrl} alt=""/>
            </div>
            <span></span>
            <h1>{logexhibitionDescoUrl}</h1>
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
                  <div className="product-int flex-grow-1">
                    <div className="product_name text-align-l">
                      {descriptionData?.[detailIndex]?.productName}
                    </div>
                    <div className="text-align-l product-desc" dangerouslySetInnerHTML={{__html: descriptionData?.[detailIndex]?.productDesc}} ></div>
                    <div className="toggle-btn-con text-align-l d-flex">
                      <div className="text-align-l d-inline-block flex-grow-1">
                        <Button icon={<LeftOutlined />} onClick={()=>{this.toggleDetail(true)}}></Button>
                        <Button className="right-btn" icon={<RightOutlined />} onClick={()=>{this.toggleDetail(false)}}></Button>
                      </div>
                      <div className="j-link-con">
                        <Button >3D展厅链接</Button>
                        <Button onClick={this.downloadPdfBtn}>下载技术手册</Button>
                        <Button type="primary" onClick={this.linkCustomService} icon={<RedditOutlined />}></Button>
                      </div>
                    </div>
                  </div>
                  <div className="resource-con  d-flex">
                    <Button onClick={() => {this?.carouselRef?.slick?.slickPrev()}} icon={<LeftOutlined />}></Button>
                    <div>
                      <Carousel className="flex-grow-1 carousel-con" ref={(ref) => {this.carouselRef = ref}}>
                        {carouselData?.map((el: any, index: number)=>{
                          return (
                            <div key={index} className="carousel-items">
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
                    <Button className="right-btn" onClick={() => {this?.carouselRef?.slick?.slickNext()}} icon={<RightOutlined />}></Button>
                  </div>
                </div>
              </Content>
            </Layout>

          </Content>
        </Layout>}
      </div>;
  }
}