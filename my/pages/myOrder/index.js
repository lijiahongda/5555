// my/pages/myOrder/index.js

import {orderIcon} from "../../../api/order"
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
    this.getlist()
  },
  getlist(){
    orderIcon({}).then(res=>{
      console.log(res,'lalalalalla')
      this.setData({
        platformOrder:res.data.platformOrder,
        shoppingMall:res.data.shoppingMall,
        travelOrder:res.data.travelOrder,
        travelService:res.data.travelService
      })
    })
  },
  to_shopOrder(){ 
    if(wx.getStorageSync('memberId')){
      wx.navigateTo({
        url: '/supermarket/shop/orderList/index',
      })
    }
  },
  to_hotelOrder(){
    if(wx.getStorageSync('memberId')){
      wx.navigateTo({
        url: '/hotel/pages/orderList/index',
      })
    }
  },
  to_cardOrder:function(){
    wx.navigateTo({
      url: '/my/pages/blank/index',
    })
  },
  // 商城订单
  goshop(e){
    let item=e.currentTarget.dataset.item
    if(item.id==1){
      wx.navigateTo({
        url: '/my/pages/orderlist/shopOrder/shopOrder?type=shop&title='+item.title+'&goodstype=2',
      })
    }else if(item.id==2){
      wx.navigateTo({
        url: '/my/pages/orderlist/shopOrder/shopOrder?type=shop&title='+item.title+'&goodstype=1',
      })
    }else if(item.id==3){
      wx.navigateTo({
        url: '/my/pages/orderlist/shopOrder/shopOrder?type=shop&title='+item.title+'&goodstype=4',
      })
    }else{
      wx.navigateTo({
        url: '/equityCard/pages/blank/blank',
      })
    }
  },

  // 平台订单
  gohot(e){
    let item=e.currentTarget.dataset.item
    if(item.id==1){
      wx.navigateTo({
        url: '/my/pages/orderlist/sanfangOrder/sanfangOrder?type=JD&title='+item.title,
      })
    }else if(item.id==2){
      wx.navigateTo({
        url: '/my/pages/orderlist/sanfangOrder/sanfangOrder?type=elm&title='+item.title,
      })
    }else{
      wx.navigateTo({
        url: '/equityCard/pages/blank/blank',
      })
    }
  },

  // 出行订单
  gotravel(e){
    let item=e.currentTarget.dataset.item
    if(item.id==1){
      wx.navigateTo({
        url: '/my/pages/orderlist/shopOrder/shopOrder?type=hotel&title='+item.title,
      })
    }else if(item.id==5){
      wx.navigateTo({
        url: '/my/pages/orderlist/shopOrder/shopOrder?type=point&title='+item.title,
      })
    }else{
      wx.navigateTo({
        url: '/equityCard/pages/blank/blank',
      })
    }
  },

  // 出行服务
  goseverice(e){
    let item=e.currentTarget.dataset.item
    if(item.id==1){
      wx.navigateTo({
        url: '/my/pages/orderlist/sanfangOrder/sanfangOrder?type=addoil&title='+item.title,
      })
    }if(item.id==6){
      wx.navigateTo({
        url: '/my/pages/blank/index',
      })
    }else{
      wx.navigateTo({
        url: '/equityCard/pages/blank/blank',
      })
    }
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

  /**
   * 用户点击右上角分享
   */

})