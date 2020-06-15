import * as React from "react";
import { LeftOutlined, RightOutlined,RedditOutlined } from '@ant-design/icons';
import {Layout, Button, Carousel} from 'antd'
const { Content } = Layout;

require('./detail.scss');
const detail = require('../../data/detail/detail.json');

const p1 = detail.luoGan
interface Props {}
interface State {}

const Text = ['螺栓', '螺杆']
export default class HomePage extends React.Component<Props, State> {
  carouselRef: any
  constructor(props: any){
    super(props);
    this.state={
      name: ''
    }
  }

  getCarouselItem = (el: any) => {
    if(el?.imageUrl){
      return (<img alt={el.introduce} src={el.imageUrl}/>)
    }else if(el?.VedioUrl){
      return (<video controls className="video-player" webkit-playsinline="" x-webkit-airplay="allow" preload="auto" src={el.VedioUrl}/>)
    }
  }

  render() {
      return <div className="detail-page conten-p-l conten-p-r">
        <Layout>
          <div className="detail-title">
            <a href="http://www.baidu.com" className="icon-detail"> </a>
            <span></span>
            <h1>北京鸿尔国际展览</h1>
          </div>

          <Content className="detail-con">
            <Layout>
              <div className="text-align-l button-group-con">
                {Text.map((el, index) => {
                  return (<Button key={index}>{el}</Button>)
                })}
              </div>
              <Content>
                <div className="d-flex product-introduce">
                  <div className="product-int">
                    <div className="product_name text-align-l">
                      {p1.title}
                    </div>
                    <div className="text-align-l" dangerouslySetInnerHTML={{__html: p1.detail}} ></div>
                    <div className="toggle-btn-con text-align-l d-flex">
                      <div className="text-align-l d-inline-block flex-grow-1">
                        <Button icon={<LeftOutlined />}></Button>
                        <Button className="right-btn" icon={<RightOutlined />}></Button>
                      </div>
                      <div className="j-link-con">
                        <Button>3D展厅链接</Button>
                        <Button>下载技术手册</Button>
                        <Button type="primary" onClick={() => {}} icon={<RedditOutlined />}></Button>
                      </div>
                    </div>
                  </div>
                  <div className="resource-con  d-flex">
                    <Button onClick={() => {this?.carouselRef?.slick?.slickPrev()}} icon={<LeftOutlined />}></Button>
                    <div>
                      <Carousel className="flex-grow-1 carousel-con" ref={(ref) => {this.carouselRef = ref}}>
                        {p1.resource.map((el: any, index: number)=>{
                          return (
                            <div>
                             {this.getCarouselItem(el)}
                             <h3 className="resource-introduce">{el.introduce}</h3>
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
        </Layout>
      </div>;
  }
}