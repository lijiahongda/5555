// supermarket/mall/shopVR/detail.js
import {
  getFICshopDetail,
  createOrder
} from "../../../api/personal";
import {
  retrunScene,
  getCardCode
} from "../../../utils/public"
import {
  hotelHb,
  shopVrShare,
  hotelCardShare
} from '../../../api/hotel'

import {
  parseTime
} from "../../../utils/time" 
var WxParse = require('../../../wxParse/wxParse');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [true, false, false],
    shopDetail: {},
    posterObj:{
      status:0,
      url:""
    },
    fromtype:"ziying",
    shareSelectStatus:0,
    shareData:{},//转发信息
    copyDetail:{},//复制链接
  },

  changeTabs(e) {
    var idx = e.currentTarget.dataset.idx
    var mk = []
    this.data.tabs.forEach((item, index) => {
      index == idx ? mk.push(true) : mk.push(false)
    })
    this.setData({
      tabs: mk
    })
  },

  getDetail(id) { // 获取详情
    if (!id) {
      return
    }
    let data = {
      cardId: id,
      memberId: wx.getStorageSync('memberId'),
      dealerId: wx.getStorageSync('dealerId'),
      customerId: wx.getStorageSync('customerId')
    }
    getFICshopDetail(data).then(res => {
      if (res.code == 200) {
        if (res.data) {
          res.data.coupons = res.data.coupons || []
          res.data.productCardList = res.data.productCardList || []
          res.data.coupons.forEach((item, index) => { // 处理开始时间和结束时间
            item.effecTime = parseTime(item.effecTime, '{y}-{m}-{d}')
            item.dueTime =  parseTime(item.dueTime, '{y}-{m}-{d}')
          })
          res.data.productCardList.forEach((item,index) => {
            item.imageUrl = item.coverImage
            item.productName = item.cardName
            item.price = item.cardPrice * 100
            item.vmShop = true
          })
          res.data.content = res.data.content || ''
          res.data.detail = res.data.detail || ''
          res.data.purchaseInstruction = res.data.purchaseInstruction || ''
          WxParse.wxParse('content1', 'html', res.data.content, this, 5); // 商品内容
          WxParse.wxParse('content2', 'html', res.data.detail, this, 5); // 图文详情
          WxParse.wxParse('content3', 'html', res.data.purchaseInstruction, this, 5); // 购买须知
        }
        this.setData({
          shopDetail: res.data || {},
          "posterObj.url": res.data.breifImage
        })
        // 复制链接
        this.shareCopy(id)
      }
    })
  },

  call(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },

  map(e){
    var lan=Number(e.currentTarget.dataset.lat)
    var lng=Number(e.currentTarget.dataset.lng)
    var address=e.currentTarget.dataset.address
    // 复制代码
    wx.getLocation({//获取当前经纬度
      type: 'wgs84', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息  
      success: function (res) {
        wx.openLocation({//​使用微信内置地图查看位置。
          latitude: lan,//要去的纬度-地址
          longitude: lng,//要去的经度-地址
          name: address,
          address:address
        })
      }
    })
  },

  handleTime(time) {
    time = time / 1000
    var year = new Date(time).getFullYear()
    var month = (new Date(time).getMonth() + 1) > 10 ? new Date(time).getMonth() + 1 : '0' + (new Date(time).getMonth() + 1)
    var day = new Date(time).getDay() > 10 ? new Date(time).getDay() : '0' + new Date(time).getDay()
    return year + '-' + month + '-' + day
  },

  buyAtOnce(){ // 立即购买
    let data = {
      customerId: wx.getStorageSync('customerId'),
      cardPrice: this.data.shopDetail.cardPrice,
      cardName: this.data.shopDetail.cardName,
      dealerId: wx.getStorageSync('dealerId'),
      cardId: this.data.shopDetail.cardId,
      adminId: 0,
      orderAmount: this.data.shopDetail.cardPrice,
      oriAmount: this.data.shopDetail.cardPrice,
      cpsCustomerId: 0,
      memberId: wx.getStorageSync('memberId'),
      sysSource: 'zhiding_app'
    }
    createOrder(data).then(res => {
      console.log(res)
      if(res.code == 200){
        wx.navigateTo({
          url: '/hotel/pages/pay/index?oid=' + res.data.orderNo + "&hid=" + wx.getStorageSync('dealerId') + "&type=5&aid=0&lastprice="+this.data.shopDetail.cardPrice
        })
      }
    })
  },

  handleShowSelect(){
    this.setData({
      shareSelectStatus:1
    })
  },

  handleCloseShareDialog(){
    this.setData({
      shareSelectStatus:0
    })
  },

  handleBox(){
    //隐藏海报和分享的弹窗
    let _key = "posterObj.status"
    this.setData({
      [_key]:0,
      shareSelectStatus:0
    })
  },

  handleShowPosterStatus(){
    this.ajaxHaiBao();
  },

  ajaxHaiBao(){
    //生成海报
    wx.showLoading({
      title: '海报生成中',
      mask: true
    });
    let params = {
      dealerId:wx.getStorageSync('dealerId'),//酒店id
      type:2,//虚拟商品
      mid:wx.getStorageSync("memberId"),
      vipPrice:this.data.shopDetail.cardPrice,
      price:this.data.shopDetail.cardPrice,
      pImg:this.data.shopDetail.coverImage,
      pName:this.data.shopDetail.cardName,
      cardId:this.data.id,
      sharePosterTitle:this.data.shopDetail.sharePosterTitle,
      sharePosterImage:this.data.shopDetail.sharePosterImage,
      communityShareLinkText:this.data.shopDetail.communityShareLinkText,
    }

    hotelHb(params).then (res => {
      this.setData({
        posterObj:{
          status:1,
          url:res.data
        }
      })
      wx.hideLoading();
   })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    
  },
  // 分享内容
  shareDetal:function(id){
    shopVrShare({
      cardId:id,//卡id
      dealerId:wx.getStorageSync('dealerId')
    }).then (res => {
      this.setData({
        shareData:res.data
      })
      wx.hideLoading();
   })
  },
  // 复制链接
  shareCopy(id){
    hotelCardShare({
      cardId:id,//卡id
      delearId:wx.getStorageSync('dealerId'),
      uid:wx.getStorageSync('memberId'),
      dealerName:this.data.shopDetail.dealerName,// 酒店名称
      cardName:this.data.shopDetail.cardName,// 虚拟卡名称
      originalPrice:this.data.shopDetail.originalPrice,// 在售价
      cardPrice:this.data.shopDetail.cardPrice,// 价格
    }).then (res => {
      console.log(res,'zhelisss')
      this.data.copyDetail={
        sale_desc:res.data.sale_desc,
        buy_desc:res.data.buy_desc,
        goods_name:res.data.goods_name,
        panic_link:res.data.panic_link,
      }
      this.setData({
        copyDetail:this.data.copyDetail
      })

      wx.hideLoading();
   })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let options = currentPage.options;

    if (options.scene != null) {
      retrunScene(options.scene, function (sceneObj) {
        console.log(sceneObj,'1111111')
        getCardCode(sceneObj.R).then(res => {
          console.log(res,'getCardCode123')
          that.setData({
            id:res.Q
          })
          that.getDetail(res.Q)
          that.shareDetal(res.Q)
          
        })
      });
    } else {
      wx.setStorageSync('inviteCode', options.reCode)
      that.setData({
        id:options.id
      })
      that.getDetail(options.id)
      that.shareDetal(options.id)
    }
    if (JSON.stringify(options) == "{}") {

    } else {
      if (!wx.getStorageSync('memberId')) {
        if (app.globalData.isStrongLogin == 1) {
          wx.navigateTo({
            url: '/pages/login/index'
          })
        }
      }
    }
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.shareData.shareTitle,
      desc: this.data.shareData.shareDescirbe,
      path: "/supermarket/mall/shopVR/detail?id="+this.data.id+"&reCode=" + wx.getStorageSync('mYinviteCode') + "&dealerId=" + wx.getStorageSync('dealerId'),
      imageUrl: this.data.shareData.shareImage
    }
  },
})