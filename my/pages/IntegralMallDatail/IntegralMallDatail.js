import {
  get,
  post,
} from '../../../utils/api';
import {
  pointDetail,
  pointExchange
} from "../../../api/cps"
var WxParse = require('../../../wxParse/wxParse.js');
var previewOnshow; // 解决图片预览 出发onshow
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showlog: false,
    name: '',
    mobile: ''
  },
  // 加载数据
  getOrderList: function () {
    wx.showLoading({
      title: '加载中',
    });
    let that = this;
    pointDetail({
      memberId: wx.getStorageSync('memberId'),
      lineId: that.data.id
    }).then(res => {
      console.log(res, '积分商城的详情')
      wx.hideLoading()
      this.setData({
        detailDocs: res.data.detailDocs,
        stockDocs: res.data.stockDocs,
        selectId: res.data.stockDocs[0].id,
        content: res.data.detailDocs.content,
        sell_adult_price: res.data.stockDocs[0].sell_adult_price,
        product_id: res.data.stockDocs[0].product_id,
        linepoint: res.data.linePoint,
        point: res.data.point,
        sell_date: res.data.stockDocs[0].trip_date
      })
      WxParse.wxParse('article', 'html', res.data.detailDocs.content, this, 5);
    })

  },
  exchange: function () {
    if(this.data.point<this.data.linepoint){
      wx.showToast({
        title: '您的悦豆不足',
        icon: 'none'
      })
      return
    }
    this.setData({
      showlog: true
    })
  },
  cansle() {
    this.setData({
      showlog: false
    })
  },
  buy() {
    if (this.data.name == '') {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return
    }
    if (this.data.mobile == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return
    }
    let data = {
      memberId: wx.getStorageSync('memberId'),
      lineId: this.data.id,
      phone: this.data.mobile,
      tradeDate: this.data.sell_date,
      contact: this.data.name
    }
    pointExchange(data).then(res => {
      console.log(res, 'lllll')
      this.setData({
        showlog: false
      })
      wx.showToast({
        title: res.message
      })
      if(res.code==200){
      setTimeout(()=>{
          wx.navigateBack({
            delta: 1,
          })
      },2000)
    }
    })
  },
  // 图片点击事件
  imgYu: function (e) {
    var src = e.currentTarget.dataset.src; //获取data-src
    var imgList = e.currentTarget.dataset.list; //获取data-list
    //图片预览
    previewOnshow = true; //解决图片预览出发onshow
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },

  // 轮播 点击事件
  bindChange: function (e) {
    this.setData({
      current: e.detail.current
    })
  },
  // 线路规格
  lineSpecifications(e) {
    this.setData({
      selectId: e.currentTarget.dataset.id,
      sell_adult_price: e.currentTarget.dataset.price,
      sell_date: e.currentTarget.dataset.date
    })
  },
  // 姓名
  name: function (e) {
    console.log(e)
    this.setData({
      name: e.detail.value
    })
  },
  // 手机号
  mobile: function (e) {
    console.log(e)
    this.setData({
      mobile: e.detail.value
    })
  },
  onLoad: function (options) {
    console.log(options)
    let that = this
    let Modeliphonex = 'iPhone X'
    let ModeliphonePro = 'iPhone Pro'
    console.log(options, 'option')
    that.setData({
      id: options.id,
      islines: options.islines
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        })
        console.log(res.model)
        if (res.model.indexOf(Modeliphonex) > -1 || res.model.indexOf(ModeliphonePro) > -1) {
          console.log('---')
          that.setData({
            isFill: true
          })
        }
      }
    })
    console.log(options.id)
    that.getOrderList()
  },








})