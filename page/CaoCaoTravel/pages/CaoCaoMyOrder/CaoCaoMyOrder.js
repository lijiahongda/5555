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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.initData()
  },
  detail: function(e) {
    let that = this
    let {
      status,
      order
    } = e.currentTarget.dataset
    if (status == 20 || status == 21 || status == 26 || status == 27 || status == 4 || status == 6 || status == 7) {
      wx.navigateTo({
        url: '/page/CaoCaoTravel/pages/evaluate/evaluate?ordersn=' + order +'&isselectStars='+'false'
      })
    } else if (status == 0 || status == 2 || status == 3 || status == 5 || status == 8 || status == 9 || status == 10 || status == 11) {
      wx.navigateTo({
        url: '/page/CaoCaoTravel/pages/Calling/Calling?order_sn=' + order
      })
    }
  },
  initData: function() {
    let that = this
    post('/travel/v1/order/list', {}, (res) => {
      console.log(res)
      if (res.statusCode == 200) {
        that.setData({
          list: res.data.data
        })
      } else {
        wx.showToast({
          title: res.data.msg || "",
          icon: 'none',
          duration: 2000
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  detailOrder: function() {
    wx.navigateTo({
      url: '/page/CaoCaoTravel/pages/evaluate/evaluate'
    })
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