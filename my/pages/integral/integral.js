// my/pages/integral/integral.js
import {
  pointList
} from "../../../api/cps.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
    isHaveMore: true,
    authorizationStatus: false,
    travel: [{}, {}, {}, {}]
  },
  // 商品列表  
  retypeData: function () {
    let that = this
    wx.showLoading()
    pointList({
      memberId: wx.getStorageSync('memberId')
    }).then(res => {
      console.log(res, '积分商城列表')
      this.setData({
        travel: res.data.list,
        userPoint: res.data.userPoint
      })
      wx.hideLoading()
    }, 3)
  },
  details: function (e) {
    console.log(e)
    // return
    wx.navigateTo({
      url: '/my/pages/IntegralMallDatail/IntegralMallDatail?id=' + e.currentTarget.dataset.goodsid + '&parentTypeId=' + '&skuid=' + e.currentTarget.dataset.skuid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.retypeData()
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

  },

})