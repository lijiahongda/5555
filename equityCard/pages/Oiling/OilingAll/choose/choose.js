// equityCard/pages/Oiling/OilingAll/choose/choose.js
import {
  getGzbGasDetail
} from "../../../../../api/cps"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    attr: {},
    goods: {},
    info: {},
    price: {},
    attrIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    console.log(options, 'opt')
    that.setData({
      id: options.id,
      name: options.name,
      type: options.type,
      listid: options.listid
    })
    // return
    that.getDetail(options.id, options.name, options.type)
  },
  getDetail(id, name, type, refresh) {
    let that = this
    getGzbGasDetail({
      id: id,
      name: name, //title
      phone: wx.getStorageSync('userinfostr').mobile,
      type: type //
    }).then(res => {
      that.setData({
        attr: res.data.attr,
        goods: res.data.goods,
        info: res.data.info,
        price: res.data.price,
      })
      if (refresh != 1) {
        that.setData({
          shopAct: res.data.goods[0],
          attrpAct: res.data.attr.qiyou[0],
          toolAct: res.data.attr.qiyou[0].tool[0]
        })
      }
    })
  },
  // 选择商品
  // chooseShop(e){
  //   let index = 
  // },
  // 选中油号
  chooseAttr(e) {
    let that = this
    that.setData({
      attrIndex: e.currentTarget.dataset.index,
      attrpAct: e.currentTarget.dataset.item,
    })
    that.getDetail(that.data.id, that.data.attrpAct.name, that.data.type, 1)
  },
  // 选中抢号
  chooseTool(e) {
    let that = this
    that.setData({
      toolAct: e.currentTarget.dataset.item
    })
    console.log(that.data.id, '00', that.data.toolAct, '1111', that.data.shopAct, '2222', that.data.attrpAct)
    that.getDetail(that.data.id, that.data.attrpAct.name, that.data.type, 1)
  },
  // 点击导航
  map(e) {
    let that = this
    console.log(that.data.info, 'infot')
    wx.getLocation({ //获取当前经纬度
      type: 'wgs84', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息  
      success: function (res) {
        wx.openLocation({ //​使用微信内置地图查看位置。
          latitude: Number(that.data.info.lat), //要去的纬度-地址
          longitude: Number(that.data.info.lng), //要去的经度-地址
          name: that.data.info.address,
          address: that.data.info.address
        })
      }
    })
  },
  // 确认
  btn() {
    let that = this
    console.log(that.data.id, '001', that.data.toolAct, '1111', that.data.shopAct, '2222', that.data.attrpAct)
    let listid = that.data.listid
    let goods_id = that.data.shopAct.id
    let price = JSON.stringify(that.data.price)
    let zname = that.data.info.name
    let attrs = JSON.stringify(that.data.attrpAct)
    let gun_id = that.data.toolAct.id

    let url = '/equityCard/pages/Oiling/OilingAll/amount/amount'
    let urlVal = '?listid=' + listid + '&id=' + that.data.id + '&name=' + that.data.attrpAct.name + '&type=' + that.data.type + '&price=' + price + '&zname=' + zname + '&goods_id=' + goods_id + '&attrs=' + attrs + '&gun_id=' + gun_id
    console.log(urlVal)
    wx.navigateTo({
      url: url + urlVal,
    })
  },
})