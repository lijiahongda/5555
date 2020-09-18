// pages/home/index.js
import {
  wxRequest
} from "../../utils/req"
import {
  authCheck,
} from "../../api/cps"
import {
  iconList
} from "../../api/Homeapi"
var Moment = require("../../utils/moment")
const app = getApp()
Page({
  data: {
    carouselImgs: [],
    gnCity: '北京', //国内默认城市,
    iconList: [],
    priceText: '价格',
    starRateName: '星级',
    checkInDate: '', //入住时间
    checkOutDate: '', //离店时间
    backBg: ''
  },
  getShareData() {
    //获取分享信息接口
    let that = this;
    wxRequest({
      method: 'get',
      url: "/api/weixin/share/personCenterInfo",
      data: {
        memberId: wx.getStorageSync("memberId")
      }
    }).then(res => {
      console.log("分享信息", res);
      that.setData({
        shareData: res,
      })
    }).catch(err => {
      console.log(err)
      wx.showToast({
        title: '网络异常,请稍后重试',
        icon: 'none'
      });
    })


  },
  // 当前位置
  locationBindtap: function () {
    let that = this
    console.log('-----')
    app.getjw(true, function (e) {
      console.log(e, app.globalData.gnaddress)
      that.setData({
        gnAddressN: app.globalData.gnaddress,
        isDelAddress: true,
        gnCity: wx.getStorageSync('city')
      })
    });
  },
  // 关键词筛选
  keyWordView: function () {
    wx.navigateTo({
      url: '/hotel/pages/keyWordView/keyWordView?navigatorUrl=' + '/page/Hotel/Hotel'
    })
  },
  // 选择星级价格
  SelectPriceStar: function () {
    this.selectComponent("#PriceStar")._onOption(app.globalData.starList, app.globalData.price)
    this.setData({
      showModalStatus: true
    })
  },
  // 星级价格回调
  PriceStarFun: function (e) {
    console.log(e)
    this.setData({
      priceText: e.detail.priceText,
      lowRate: e.detail.lowRate,
      highRate: e.detail.highRate,
      starRate: e.detail.starRate,
      starRateName: e.detail.starRateName
    })
  },
  // 选择日历的回调
  onLoadFun: function (e) {
    this.setData({
      checkInDate: e.detail.checkInDate,
      checkOutDate: e.detail.checkOutDate,
      nights: e.detail.nights,
      Inweek: e.detail.Inweek,
      Ouweek: e.detail.Ouweek
    })
  },
  // 选择时间
  selectTime: function () {
    console.log('8888')
    this.setData({
      isSelectTime: true
    })
  },
  // 清空选择地址
  delAddress: function () {
    console.log(wx.getStorageSync('city'))
    this.setData({
      // gnAddress: '搜索' + wx.getStorageSync('gnCity') + '全城',
      gnAddress: '关键字/位置/品名/酒店名',
      isDelAddress: false,
    })
    app.globalData.gnaddress = '关键字/位置/品名/酒店名'
  },
  // 选择城市
  selectCity: function () {
    wx.navigateTo({
      url: '/hotel/pages/selectCity/selectCity?navigatorUrl=' + '/page/Hotel/Hotel'
    })
  },
  // 获取首页的icon
  geticonList() {
    iconList({}).then(res => {
      console.log(res, 'iconList')
      this.setData({
        hotelList: res.data.hotel,
        lifeList: res.data.life,
        carouselImgs: res.data.banner,
        backBg: res.data.banner[0].color
      })
    })
  },
  swiperChange: function (e) {
    console.log(e)
    this.setData({
      backBg: this.data.carouselImgs[e.detail.current].color
    })
  },
  // 本地生活跳转
  lifetap(e) {
    let item = e.currentTarget.dataset.item
    if (item.id == 10) {
      // 外卖红包
      let data = {
        mid: wx.getStorageSync('memberId')
        // mid:'309140000016'
      }
      authCheck(data).then(res => {
        console.log(res, '444444')
        if (res.code == 200) {
          if (res.data.auth == 1) {
            wx.navigateTo({
              url: '/equityCard/pages/ELM/ELM',
            })
          } else {

            wx.navigateTo({
              url: '/my/pages/h5/h5',
            })
          }
        } else if (res.data.code == 400) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })

        }
      })
    } else if (item.id == 11) {
      // 话费充值
      wx.navigateTo({
        url: '/page/Recharge/phonerecharge/detail/index',
      })
    } else if (item.id == 12) {
      // 视频充值
      wx.navigateTo({
        url: '/page/Recharge/videorecharge/index/index',
      })
    } else if (item.id == 13) {
      // 加油充值
      wx.navigateTo({
        url: '/equityCard/pages/Oiling/OilingAll/Strategy/Strategy',
      })
    }
  },
  // 酒店小icon跳转
  hotelList(e) {
    console.log(e)
    let item = e.currentTarget.dataset.item
    if (item.id == 1) {
      // 酒店直签  酒店列表

    } else if (item.id == 2) {
      // 领券中心  新页面

    } else if (item.id == 3) {
      // 免费旅游  
      wx.navigateTo({
        url: '/my/pages/integral/integral',
      })
    } else if (item.id == 4) {
      // 白拿商品
      wx.navigateTo({
        url: '/equityCard/pages/baina/whiteWith/whiteWith',
      })
    }
  },
  onLoad: function (options) {
    this.geticonList()
  },
  onShow: function () {


    let that = this;

    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let options = currentPage.options;
    console.log(options)
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

    if (wx.getStorageSync('CheckTime')) { //如果有缓存是时间就默认用缓存的
      this.setData({
        checkInDate: wx.getStorageSync('CheckTime'),
        checkOutDate: wx.getStorageSync('leaveTime')
      })
    } else { //设置默认时间
      var checkInDate = Moment(new Date()).format('YYYY-MM-DD');
      var checkOutDate = Moment(new Date()).add(1, 'day').format('YYYY-MM-DD');
      this.setData({
        checkInDate: checkInDate.substr(5, checkInDate.length),
        checkOutDate: checkOutDate.substr(5, checkOutDate.length)
      })
      wx.setStorage({
        key: 'ROOM_SOURCE_DATE',
        data: {
          checkInDate: checkInDate,
          checkOutDate: checkOutDate
        }
      });

    }
    // 获取几晚的缓存
    if (wx.getStorageSync('nights')) {
      this.setData({
        nights: wx.getStorageSync('nights')
      })
    }

    console.log(options, '这里是分享信息')
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    if (options.inviteCode) {
      wx.setStorageSync('inviteCode', options.inviteCode);
    }
    if (options.dealerId) {
      wx.setStorageSync('dealerId', options.dealerId);
    }
    that.setData({
      dealerId: wx.getStorageSync('dealerId'),
      gnCity: wx.getStorageSync('city')
    })
    if (wx.getStorageSync('memberId')) {
      that.getShareData();
    }

    wx.getSystemInfo({
      success: function (res) {
        let model = res.model.substr(0, 8)
        if (model == "iPhone X") {
          that.setData({
            top_location: true
          })
        }
      }
    })



  },
  onShareAppMessage: function () {
    let that = this;
    return {
      title: that.data.shareData.text,
      imageUrl: that.data.shareData.image,
      path: "/pages/home/index?dealerId=" + wx.getStorageSync('dealerId') + "&inviteCode=" + wx.getStorageSync('mYinviteCode'),
    }
  }
})