// page/HotelOther/pages/keyWordView/keyWordView.js
const app = getApp()
import {
  BusinessCircle,
  Business
} from '../../../api/hotel';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moreImage: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-20/22/yuelvhui0V1VXMnmgl1587391661.png',
    isShow: false,
    removeRepetition: [],
    searchImage: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-17/22/yuelvhui2BVkWmYIx31587133991.png', //搜索
  },
  navi: function () {
    wx.navigateBack()
  },
  // 选择历史商圈
  SelectHistoricalRecord: function (e) {
    let { item } = e.currentTarget.dataset
    // 修改首页
    app.globalData.gnaddress = item.keyWord
    wx.setStorageSync('city', item.gnCity)
    wx.navigateBack()
  },
  // 修改商圈历史
  UpBusinessHistory: function (city) {
    let BusinessHistory = wx.getStorageSync('BusinessHistory') ? wx.getStorageSync('BusinessHistory') : []
    let removeRepetition = function (city, self) {
      var cityArr = BusinessHistory;
      for (let key in cityArr) {
        if (cityArr[key] == city) {
          return false;
        }
      }
      return true;
    };
    for (var H of BusinessHistory) {
      if (H.keyWord == city) {
        return
      }
      if (city.indexOf(H.keyWord) > -1) {
        return
      }
    }
    if (BusinessHistory.length < 10) {
      BusinessHistory.push({ gnCity: wx.getStorageSync('city'), keyWord: city })
    } else {
      if (removeRepetition(city, self)) {
        BusinessHistory.unshift(city);
        BusinessHistory.splice(10, 1);
      }
    }
    wx.setStorageSync('BusinessHistory', BusinessHistory)
  },
  // 点击商圈
  showData: function (e) {
    let { item } = e.currentTarget.dataset
    // 修改首页
    app.globalData.gnaddress = item.title
    this.UpBusinessHistory(item.title)
    wx.navigateBack()

  },
  // 更多
  more: function (e) {
    let { item, ismore } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/hotel/pages/searchMore/searchMore?navigatorUrl=' + '/hotel/pages/keyWordView/keyWordView' + '&more=' + JSON.stringify(item) + '&ismore=' + ismore
    })
  },
  // 商圈列表
  Business: function () {
    Business(wx.getStorageSync('city')).then(res => {
      console.log(res)
      this.setData({
        BusinessList: res.data
      })
    })
  },
  // 搜索结果
  getCityList: function (keyword) {
    let {
      checkInDate,
      checkOutDate
    } = wx.getStorageSync("ROOM_SOURCE_DATE");
    let data={
      keyword:keyword,
      cityName:wx.getStorageSync('city'),
      lat:wx.getStorageSync('latitude'),
      lng:wx.getStorageSync('longitude'),
      arrivalDate:wx.getStorageSync('key'),
      arrivalDate:checkInDate,
      departureDate:checkOutDate
    }
    BusinessCircle(data).then(res => {
      console.log(res)
      this.setData({
        citylist: res.data,
      })
    })
  },
  //搜索
  bindblur: function (e) {
    this.getCityList(e.detail.value)
      this.setData({
        isShow: true,
        marginTop: this.data.navTop + 80 + 'rpx'
      })
    if(e.detail.value==''){
      this.setData({
        isShow:false
      })

    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    // 胶囊位计算
    app.navTop(function (res) {
      that.setData({
        navTop: res.navTop
      })
    });
    that.setData({
      navigatorUrl: options.navigatorUrl,
      BusinessHistory: wx.getStorageSync('BusinessHistory')
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      keyWord: app.globalData.gnaddress ? app.globalData.gnaddress : '区域/位置/酒店名'
    })
    this.Business()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})