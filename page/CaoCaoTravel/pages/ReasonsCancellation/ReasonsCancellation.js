import {
  post,
  get
} from '../../../../utils/caocao.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    cur:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.ordersn)
    this.setData({
      ordersn: options.ordersn
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    post('/travel/v1/getCancelReasonList', {}, (res) => {
      if (res.data.code == 200) {
        that.setData({
          list: res.data.data
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'),1)
  },
  // 选择
  Choice:function(e){
    console.log(e.currentTarget.dataset.index)
    let that = this
    let index = e.currentTarget.dataset.index
    let item = e.currentTarget.dataset.item
    that.setData({
      cur:index,
    })
  },
  // 提交
  Submission:function(){
    let that = this
    post('/travel/v1/cancelOrder', {
      order_sn: that.data.ordersn,
      cancel_code: that.data.list[that.data.cur].code
    }, (res) => {
      if (res.data.code == 200) {
        wx.navigateBack({
          delta: 1,
        })
        // that.setData({
        //   list: res.data.data
        // })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 1)
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