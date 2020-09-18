// hotel/pages/hotelErrorMsg/hotelErrorMsg.js
import {feedback} from '../../../api/hotel'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotelName:'',
    hotelAddress:'',
    hotelPhone:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      hotelAddress:options.hotelAddress,
      hotelName:options.hotelName,
      hotelPhone:options.hotelPhone
    })
  },
  bindTextAreaBlur: function(e) {
    console.log(e.detail.value)
    this.setData({
      content:e.detail.value
    })
  },
  sure(){
    let data={
      mid:wx.getStorageSync('memberId'),//用户ID
      hotelId:wx.getStorageSync('dealerId'),//酒店id
      hotelName:this.data.hotelName,//酒店名称
      hotelAddress:this.data.hotelAddress,//酒店地址
      content:this.data.content,//反馈内容
      type:0,//问题类型0酒店信息有误1酒店已停业2酒店装修中
  }
  feedback(data).then(res=>{
    console.log(res,'llll')
    if(res.code==200){
      wx.showToast({
        title: '提交成功',
        icon:'none'
      })
      setTimeout(()=>{
        wx.navigateBack({
          delta: 1
        })
      },1000)
      
    }
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