const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    more: [],
    uid: '',
    token: '',
    stairKey: 0,
  },
  navi:function(){
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
  TradingArea: function (e) {
    let title = e.currentTarget.dataset.title;
    app.globalData.gnaddress = title
    this.UpBusinessHistory(title)
    const wxCurrPage = getCurrentPages(); //获取当前页面的页面栈
    const wxPrevPage = wxCurrPage[wxCurrPage.length - 2]; //获取上级页面的page对象
    if (wxPrevPage) {
      wxPrevPage.setData({
        page: 1,
      })
      wx.navigateBack({
        delta: 2
      })
    }
  },
  onUnload: function () {

  },
  onLoad: function (options) {
    let that = this;
    that.setData({
      ismore: options.ismore,
      more: JSON.parse(options.more),
      navigatorUrl: options.navigatorUrl
    })
    console.log(options.ismore)
    // let secondViewCell = this.data.more[0].subInfo;
    // 胶囊位计算
    app.navTop(function (res) {
      that.setData({
        navTop: res.navTop
      })
    });
    this.setData({
      // secondViewCell: secondViewCell
    })
  },

  //一级
  clickstairCell: function (e) {
    let stairId = e.currentTarget.dataset.id;
    let secondViewCell = this.data.more[stairId].subInfo;
    let types = e.currentTarget.dataset.types;
    this.setData({
      stairKey: stairId,
      secondViewCell: secondViewCell
    })
  },
  //行政区二级
  clickSecondCell: function (e) {
    let secondKey = e.currentTarget.dataset.index;
    let types = e.currentTarget.dataset.types;
    let title = e.currentTarget.dataset.title
    let isSecond = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    isSecond[types] = secondKey;
    this.setData({
      secondKey: secondKey,
      tabbarKey: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      conditionViewKey: 'none',
      isSecond: isSecond,
      page: 1
    })
    const wxCurrPage = getCurrentPages(); //获取当前页面的页面栈
    const wxPrevPage = wxCurrPage[wxCurrPage.length - 2]; //获取上级页面的page对象
    wx.setStorageSync('searchText', title);
    // wx.setStorageSync('lat', '');
    // wx.setStorageSync('lng', '');
    if (wxPrevPage) {
      wxPrevPage.setData({
        page: 1,
      })
      wx.navigateBack({
        delta: 2
      })
    }
  },
  onShow: function () {

  },

})