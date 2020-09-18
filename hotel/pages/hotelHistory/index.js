// hotel/pages/hotelHistory/index.js
import {
  wxRequest
} from "../../../utils/request"
import {byMemberId} from "../../../api/Homeapi"
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyHotel: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHistoryHotel()
  },
  getHistoryHotel() {
    let that = this
    let memberId = wx.getStorageSync('memberId')

    // console.log(typeof memberId)
    byMemberId({
      memberId:memberId
    }).then(res => {
      console.log(res)
      that.setData({
        historyHotel: res.data.dealers
      })
    }).catch(err => {
      console.log(err)
    })
  },
  to_history(e) {
    console.log(e)
    console.log(e.currentTarget.dataset.dealerid, "历史")
    wx.setStorageSync('dealerId', e.currentTarget.dataset.dealerid)
    wx.redirectTo({
      url: '/hotel/pages/index?dealerId=' + e.currentTarget.dataset.dealerid
    })
    // this.getCustomerId()
    app.getCustomerIds()
  },
  
  // getCustomerId() {
  //   let that = this
  //   let params = {
  //     dealerId: wx.getStorageSync("dealerId"),
  //     openId: wx.getStorageSync('openId'),
  //     loginLogDto: {}
  //   };
  //   wxRequest({
  //     method: "post",
  //     url: "/api/customer/login/wechat",
  //     data: params,
  //     contentType: "application/json;charset=UTF-8"
  //   }).then(res => {
  //     console.log(res.response.data.customerId, "酒店首页登录")
  //     wx.setStorageSync('customerId', res.response.data.customerId)
  //   }).catch(err => {
  //     console.log(err)
  //   })
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getHistoryHotel()
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

  /**
   * 用户点击右上角分享
   */
  
})