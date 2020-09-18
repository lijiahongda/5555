// page/MyOther/pages/orderDetail/orderDetail.js
const app = getApp()
// import {
//   Hotelpay
// } from '../../../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    backReturn: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-21/00/yuelvhuiqjRzxgXOTK1587399992.png',
    paySuccess: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-30/21/yuelvhuiewpkYrHW601588252833.png',
    roow: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-30/21/yuelvhui1dQ2q0b9iG1588253620.png',
    wx: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-30/22/yuelvhuihlrQKmRRc51588255961.png',
    fial: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-05-08/14/yuelvhuiOoRcrjMePp1588918856.png'
  },
  onUnload:function(){
    wx.navigateBack()
  },
  // 支付
  Hotelpay: function () {
    let that = this
    wx.showToast({
      title: '努力下单中',
      icon:'none'
    })
    let data = {
      orderNo: this.data.orderNo,
      payChannel: 'ORIGINAL',
      tradeType: "WX_JSAPI",
      openID: wx.getStorageSync('openid')
    }
    // Hotelpay(data).then(res => {
    //   console.log(res)
    //   wx.requestPayment({
    //     'timeStamp': res.list.getwayBody.timeStamp,
    //     'nonceStr': res.list.getwayBody.nonceStr,
    //     'package': res.list.getwayBody.package,
    //     'signType': 'MD5',
    //     'paySign': res.list.getwayBody.paySign,
    //     'success': function (res) {
    //       wx.hideLoading()
    //       wx.showToast({
    //         title: '支付成功',
    //         icon: 'none'
    //       })
    //       that.setData({
    //         type:1
    //       })
    //       console.log(that.data.type,'========')
    //     },
    //     'fail': function (res) {
    //       console.log(res)
    //       that.setData({
    //         type:2
    //       })
    //     },
    //     'complete': function (res) {
    //       console.log(res)
    //     }
    //   })
    // })
  },
  goHome: function () {
    wx.switchTab({
      url: '/page/Home/Home'
    })
  },
  navigatorUrl: function () {
    wx.navigateBack({
      delta: 2
    })
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
      type: options.type,
      orderNo: options.orderNo,
      totalAmount: options.totalAmount
    })
    console.log(options)
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