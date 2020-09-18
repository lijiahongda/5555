// page/weijiafuPayCeshi/weijiafuPayCeshi.js
import {
  payTest
} from '../../api/hotel.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   wx.setStorageSync('jd', '微嘉付')
    if(wx.getStorageSync("memberId")){

    }else{
      wx.navigateTo({
        url: '/pages/login/index'
      })
    }
    
  },
  goPay:function(){
    payTest(
      {
        openId: wx.getStorageSync('openId'),
        returnUrl: 'http://www.zhiding365.com'
      }
    ).then(res => {
      console.log(res)
      wx.requestPayment({
        'timeStamp': res.data.getwayBody.timeStamp,
        'nonceStr': res.data.getwayBody.nonceStr,
        'package': res.data.getwayBody.package,
        'signType': res.data.getwayBody.signType,
        'paySign': res.data.getwayBody.paySign,
        'success': function (res) {
          wx.hideLoading()
          wx.showToast({
            title: '支付成功',
            icon: 'none'
          })
        },
        'fail': function (res) {
          console.log(res)
          wx.showToast({
            title: '支付失败',
            icon: 'none'
          })

        },
        'complete': function (res) {
          console.log(res)
        }
      })
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