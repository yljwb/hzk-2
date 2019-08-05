import React from 'react'
import { Carousel, Flex, Grid } from 'antd-mobile'
import axios from 'axios'
import { Link } from 'react-router-dom'
import a1 from 'assets/images/nav-1.png'
import a2 from 'assets/images/nav-2.png'
import a3 from 'assets/images/nav-3.png'
import a4 from 'assets/images/nav-4.png'
import './index.scss'

const itemList = [
  { title: '整租', path: '/home/house', src: a1 },
  { title: '合租', path: '/home/house', src: a2 },
  { title: '地图找房', path: '/map', src: a3 },
  { title: '去出租', path: '/NotFound', src: a4 }
]
class Index extends React.Component {
  state = {
    swipers: [],
    imgHeight: 212,
    isLoaded: false,
    // 租房小组
    grops: [],
    // 最新咨询
    messages: [],
    // 城市名称
    cityName: ''
  }

  // 获取轮播图的数据
  async getSwipers() {
    const res = await axios.get('http://localhost:8080/home/swiper')
    console.log(res.data.body)
    const { status, body } = res.data
    if (status === 200) {
      this.setState({
        swipers: body,
        isLoaded: true
      })
    }
  }

  // 获取租房小组的数据
  async getGroups() {
    const { data } = await axios.get('http://localhost:8080/home/groups', {
      params: {
        area: 'AREA|88cff55c-aaa4-e2e0'
      }
    })
    console.log(data.body)
    this.setState({
      grops: data.body
    })
  }
  // 获取最新咨询
  async getMessages() {
    const { data } = await axios.get('http://localhost:8080/home/news', {
      params: {
        area: 'AREA|88cff55c-aaa4-e2e0'
      }
    })
    console.log(data.body)
    this.setState({
      messages: data.body
    })
  }
  // 渲染轮播图
  renderSwiper() {
    return (
      <Carousel autoplay infinite>
        {this.state.swipers.map(item => (
          <a
            key={item}
            href="http://www.alipay.com"
            style={{
              display: 'inline-block',
              width: '100%',
              height: this.state.imgHeight
            }}
          >
            <img
              src={`http://localhost:8080${item.imgSrc}`}
              alt=""
              style={{ width: '100%', verticalAlign: 'top' }}
              onLoad={() => {
                // fire window resize event to change height
                window.dispatchEvent(new Event('resize'))
                this.setState({ imgHeight: 'auto' })
              }}
            />
          </a>
        ))}
      </Carousel>
    )
  }

  // 渲染导航
  renderNav() {
    return (
      <Flex>
        {itemList.map(item => (
          <Flex.Item key={item.title}>
            <Link to={item.path}>
              <img src={item.src} alt="" />
              <p>{item.title}</p>
            </Link>
          </Flex.Item>
        ))}
      </Flex>
    )
  }

  //渲染最新咨询
  renderMeaasge() {
    return (
      <div className="message">
        <h3 className="group-title">最新资讯</h3>
        {this.state.messages.map(item => (
          <div className="news-item" key={item.id}>
            <div className="imgwrap">
              <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
            </div>
            <Flex className="content" direction="column" justify="between">
              <h3 className="title">{item.title}</h3>
              <Flex className="info" justify="between">
                <span>{item.date}</span>
                <span>{item.from}</span>
              </Flex>
            </Flex>
          </div>
        ))}
      </div>
    )
  }

  renderSearch() {
    return (
      <Flex className="search-box">
        <Flex className="search-from">
          <div
            className="location"
            onClick={() => {
              this.props.history.push('city')
            }}
          >
            <span className="name">{this.state.cityName}</span>
            <i className="iconfont icon-arrow"> </i>
          </div>
          <div
            className="search-input"
            onClick={() => {
              this.props.history.push('NotFound')
            }}
          >
            <i className="iconfont icon-seach" />
            <span className="text">请输入小区地址</span>
          </div>
        </Flex>
        <i
          className="iconfont icon-map"
          onClick={() => {
            this.props.history.push('/map')
          }}
        />
      </Flex>
    )
  }

  componentDidMount() {
    this.getSwipers()
    this.getGroups()
    this.getMessages()
    // 获取当前城市
    var myCity = new window.BMap.LocalCity()
    myCity.get(async result => {
      const name = result.name
      console.log(name)
      const {
        data: { body, status }
      } = await axios.get('http://localhost:8080/area/info', {
        params: {
          name
        }
      })
      if (status === 200) {
        localStorage.setItem('current_city', body)
      }
      this.setState({
        cityName: body.label
      })
    })
  }

  render() {
    if (!this.state.isLoaded) {
      return null
    }
    return (
      <div className="index">
        {/* 轮播图 */}
        <div className="swiper">
          {/* 搜索框 */}
          {this.renderSearch()}
          {this.renderSwiper()}
        </div>
        {/* 导航 */}
        <div className="nav">{this.renderNav()}</div>
        {/* 租房小组 */}
        <div className="gruop">
          {/* 标题 */}
          <div className="gruop-title">
            租房小组
            <span className="more">更多</span>
          </div>
          {/* 内容 */}
          <div className="content">
            {/* 九宫格 */}
            <div>
              <Grid
                data={this.state.grops}
                activeStyle
                columnNum={2}
                hasLine={false}
                square={false}
                renderItem={item => (
                  <Flex className="groud-item" justify="around">
                    <div className="desc">
                      <p>{item.title}</p>
                      <span className="info">{item.desc}</span>
                    </div>
                    <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
                  </Flex>
                )}
              />
            </div>
          </div>
        </div>
        {/* 咨询 */}
        {this.renderMeaasge()}
      </div>
    )
  }
}

export default Index
