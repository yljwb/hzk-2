import React from 'react'
import './index.scss'
const BMap = window.BMap
class My extends React.Component {
  componentDidMount() {
    // {lng: 121.61887341233741, lat: 31.040603951746952}
    var map = new BMap.Map('container')
    var point = new BMap.Point(121.61895125119062, 31.040452304898167)
    // map.centerAndZoom(point, 15)
    map.centerAndZoom(point, 18)
    var marker = new BMap.Marker(point) // 创建标注
    map.addOverlay(marker) // 将标注添加到地图
  }

  render() {
    return (
      <div className="map">
        <div id="container" />
      </div>
    )
  }
}

export default My
