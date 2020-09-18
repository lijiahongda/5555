// page/Yuemall/pages/IntegralMallBalancd/IntegralMallBalancd.js
import {
  get,
  post,
} from '../../../utils/api';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    amountNumber: 1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.orderDetail(options.id)
  },
  orderDetail:function(id){
    let that = this
    get('/mall/integral/order/orderDetail/'+id, {}, (res) => {
      if (res.data.code == 200) {
        console.log(res)
        that.setData({
          areaInfo: res.data.data.areaInfo,
          item: res.data.data.item
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4)
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

  }
})