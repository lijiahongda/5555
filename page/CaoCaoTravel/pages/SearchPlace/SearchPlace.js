var app = getApp();
import {
  post,
  get
} from '../../../../utils/caocao.js'

Page({

  /**
   * 页面的初始数据
   */
  data: { 

  },
  // 检索
  retrieval: function(e) {
    let that = this
    wx.showLoading()
    if (e.detail.value != ''){
      post('/travel/searchPoi', {
        keyword: e.detail.value
      }, (res) => {
        if (res.data.code == 200) {
          that.setData({
            list: res.data.data
          })
          wx.hideLoading()
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 5)
    }
  },
  // 取消
  cancel: function() {
    let that = this
    const wxCurrPage = getCurrentPages(); //获取当前页面的页面栈
    const wxPrevPage = wxCurrPage[wxCurrPage.length - 2]; //获取上级页面的page对象
    if (wxPrevPage) {
      if (that.data.type == 'end') {
        wxPrevPage.setData({
          isVehicle: true,
          Destination: that.data.Destination, //目的地名称
        })
      } else {
        wx.setStorageSync('currentLocation', that.data.currentLocation)
      }
      wx.navigateBack()
    }
  },
  // 城市选择
  CityChoice: function() {
    wx.navigateTo({
      url: '/page/CaoCaoTravel/pages/CityChoice/CityChoice'
    })
  },
  // 选择地址
  selectAddress: function(e) {
    let that = this
    let {
      name, location
    } = e.currentTarget.dataset.item
    let caoHistory = app.globalData.caoHistory
    if (!(name.match(/^[ ]+$/))) {//是否为空
      let isContaine = false //是否存入依据
      for (var v of caoHistory) { //循环历史记录
        if (name == v.name) { //如果相等不存
          isContaine = true
        }
      }
      if (!isContaine) {
        caoHistory.unshift({ //头部添加
          name: name,
          location: location
        })
        if (caoHistory.length == 10) { //大于10条尾部删除
          caoHistory.pop()
        }
      }
      that.setData({
        caoHistory: caoHistory
      })
    }
    
    const wxCurrPage = getCurrentPages(); //获取当前页面的页面栈
    const wxPrevPage = wxCurrPage[wxCurrPage.length - 2]; //获取上级页面的page对象
    console.log('s]-----', e.currentTarget.dataset.item)
// return
    if (wxPrevPage) {
      if (that.data.type == 'end') {
        wxPrevPage.setData({
          isVehicle: true,
          Destination: name, //目的地名称
          DesLocation: location //目的地经纬
        })
      } else {
        wx.setStorageSync('currentLocation', name)
        wxPrevPage.setData({
          DesLocationStar:location //出发地经纬
        })
      }
      wx.navigateBack()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    console.log(options, 'opt')
    that.setData({
      type: options.type,
      Destination: options.Destination, //目的地
      currentLocation: options.currentLocation, //出发地
      hotelDepartCity: wx.getStorageSync('hotelDepartCity')
    })
    console.log(options.type)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      caoHistory: app.globalData.caoHistory
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  }
})