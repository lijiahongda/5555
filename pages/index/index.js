import {
  hotelHome,
  jdHomeEliteGoodsList,
  homePageInfo,
  collectSave,
  collectCancel
} from '../../api/hotel'
import {
  retrunScene,
  getCardCode
} from "../../utils/public"


let app = getApp()
Page({
  data: {
    current: 0,
    shareData: {},
    dealerId: wx.getStorageSync("dealerId"),
    detailTop: {}, //酒店首页
    screllList: {}, //秒杀列表
    shoucang:false,//酒店收藏
    levelId:wx.getStorageSync('levelId')
  },

  // 去设施详情页面
  to_facilityDetail() {
    wx.navigateTo({
      url: '/hotel/pages/facilityDetail/index',
    })
  },
  // 获取酒店首页
  getHotelHome() {
    let that = this;
    hotelHome({
      dealerId: wx.getStorageSync("dealerId"), //酒店id
      lat: wx.getStorageSync("latitude"),
      lng: wx.getStorageSync("longitude"),
    }).then(res => {
      console.log(res, '返值信息')
      that.setData({
        detailTop: res.data,
        shoucang: res.data.collectFlag,
      })
      wx.setStorageSync('dealerName', res.data.dealerName)
      that.startTimer(res.data.endTime - res.data.startTime)
    }).catch(err => {

    })
  },
  // 秒杀列表
  getSeckillList() {
    console.log('111111')
    jdHomeEliteGoodsList({
      eliteId: 33, //频道ID,传值33
      page: 1,
      pageSize: 10
    }).then(res => {
      this.setData({
        screllList: res.data[0].goodsInfo
      })
      console.log(this.data.screllList, '3333')
    }).catch(err => {

    })
  },

  // 点击显示地理位置
  getLocation() {
    let that = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        wx.openLocation({ //​使用微信内置地图查看位置。
          latitude: that.data.detailTop.lat, //要去的纬度-地址
          longitude: that.data.detailTop.lng, //要去的经度-地址
          name: that.data.detailTop.dealerName,
          address: that.data.detailTop.address
        })
      }
    })
  },
  //收藏
  sh_C() {
    console.log('收藏')
    console.log('shouc')
    let that = this;
    let dealerId = wx.getStorageSync('dealerId')
    collectSave({
      dealerId: dealerId //酒店id
    }).then(res => {
      that.setData({
        shoucang: true
      })
    }).catch(err => {
      console.log("错误信息", err);

    })
  },
  //取消收藏
  qx_C() {
    console.log('取消收藏')
    let that = this;
    let dealerId = wx.getStorageSync('dealerId')
    collectCancel({
      dealerIds: dealerId //酒店id
    }).then(res => {
      that.setData({
        shoucang: false
      })
    }).catch(err => {
      console.log("错误信息", err);

    })
  },
  // 开通联名卡
  goCard() {
    wx.navigateTo({
      url: '/my/pages/vipcard/index?dealerId=' + wx.getStorageSync("dealerId")
    });
  },
  // 跳转京东详情
  jdDetail(e) {
    wx.navigateTo({
      url: '/supermarket/mall/jdDetail/index?goods_id=' + e.currentTarget.dataset.goods_id
    })
  },
  // 京东商城
  jdHome(e) {
    wx.navigateTo({
      url: '/supermarket/mall/commodityList/index'
    })
  },
  // 酒店预订
  gohotel() {
    wx.navigateTo({
      url: '/hotel/pages/index?dealerId=' + wx.getStorageSync("dealerId"),
    })
  },

  // 到顶部的高度
  setNavSize: function () {
    var that = this,
      sysinfo = wx.getSystemInfoSync(),
      statusHeight = sysinfo.statusBarHeight,
      isiOS = sysinfo.system.indexOf('iOS') > -1,
      navHeight;
    if (!isiOS) {
      navHeight = 48;
    } else {
      navHeight = 44;
    }
    that.setData({
      status: statusHeight,
      navHeight: navHeight
    })
  },
  onShow() {
    let that = this;

    // 到顶部的高度
    that.setNavSize()



    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let options = currentPage.options;
    console.log(options, "分享参数")
    if (options.scene != null) {
      retrunScene(options.scene, function (sceneObj) {
        console.log(sceneObj, 'sceneObj')

        wx.setStorageSync('dealerId', sceneObj.dealerId)
        getCardCode(sceneObj.R).then(res => {
          console.log(res, '这里是酒店详情')

        })

      });
    } else {
      if (options.inviteCode) {
        wx.setStorageSync('inviteCode', options.inviteCode);
      }
      if (options.dealerId) {
        wx.setStorageSync('dealerId', options.dealerId);
      }
    }

    that.setData({
      dealerId: wx.getStorageSync('dealerId'),
      levelId: wx.getStorageSync('levelId'),
      iconType:''
    })
    if (!wx.getStorageSync('memberId')) {
      wx.navigateTo({
        url: '/pages/login/index'
      })
      console.log("没登录l")

    } else {
      that.getHotelHome();
      that.getSeckillList()
      app.getCustomerIds();
    }
    that.getShareData();

  },
  swiperChange: function (e) {
    var that = this;
    if (e.detail.source == 'touch') {
      that.setData({
        current: e.detail.current
      })
    }
  },


  // 分享
  onShareAppMessage: function () {
    return {
      title: this.data.shareData.paperwork,
      path: "/pages/index/index?dealerId=" + wx.getStorageSync('dealerId') + "&inviteCode=" + wx.getStorageSync('mYinviteCode'),
      imageUrl: this.data.shareData.imgUrl
    }
  },
  onLoad: function (options) {


  },
  // 转发文案图片
  getShareData() {
    let data = {
      dealerId: wx.getStorageSync("dealerId")
    }
    homePageInfo(data).then(res => {
      this.setData({
        shareData: res.data
      })
    })
  },


})