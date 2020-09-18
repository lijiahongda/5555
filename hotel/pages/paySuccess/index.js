import {
  cardCreateDetail
} from '../../../api/personal'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    states:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    
    console.log(options,'paysuccess')
    that.setData({
      lastprice:options.lastprice,
      cardId:options.cardId
    })
    if(options.coupon==1){
      console.log('0000')
      that.getCoupon()
    }else{
      console.log('1111')
      that.setData({
        states:0
      })
    }
  },
  goHome:function(){
    wx.switchTab({
      url:"/pages/home/index"
    })
  },
  orderForm:function(){
    wx.switchTab({
      url: '/my/pages/myOrder/index',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 购买联名卡成功后
  getCoupon(){
    let that = this
    let data = {
      memberId: wx.getStorageSync('memberId'),
      dealerId: wx.getStorageSync('dealerId'),
      customerId: wx.getStorageSync('customerId'),
      cardId:that.data.cardId
    }
    cardCreateDetail(data).then(res => {
      console.log(res, '会员卡返值1111')
      that.setData({
        coupons:res.data.coupons
      })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  }
})