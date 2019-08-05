import React from 'react'
import { NavBar } from 'antd-mobile'
import './index.scss'
import axios from 'axios'

class City extends React.Component {
  state = {
    cityList: []
  }
  // 处理数据
  formatData(list) {
    const cityObj = {}
    list.forEach(item => {
      const key = item.short.slice(0, 1)
      if (key in cityObj) {
        cityObj[key].push(item)
      } else {
        cityObj[key] = [item]
      }
    })
    const shortList = Object.keys(cityObj).sort()
    console.log(shortList)
    console.log(cityObj)
    return {
      cityObj,
      shortList
    }
  }
  async getCityList() {
    const {
      data: { body }
    } = await axios.get('http://localhost:8080/area/city?level=1')
    const { cityObj, shortList } = this.formatData(body)
    // 获取热门城市
    const hotRes = await axios.get('http://localhost:8080/area/hot')
    console.log(hotRes.data.body)
    // 添加热门城市
    cityObj.hot = hotRes.data.body
    shortList.unshift('hot')
    // 添加当前城市
    shortList.unshift('#')
    cityObj['#'] = ['当前城市']
    console.log(cityObj)
    console.log(shortList)
  }
  componentDidMount() {
    this.getCityList()
  }
  render() {
    return (
      <div>
        <NavBar
          mode="light"
          icon={<i className="iconfont icon-back" />}
          onLeftClick={() => this.props.history.go(-1)}
        >
          城市列表
        </NavBar>
      </div>
    )
  }
}

export default City
