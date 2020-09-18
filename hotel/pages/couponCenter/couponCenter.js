// hotel/pages/couponCenter/couponCenter.js
import {receiveList} from '../../../api/hotel'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // 优惠券列表
couponList(){
  let data={
    page:1,
    pageSize:10
  }
  receiveList(data).then(res=>{
    console.log(res,'resresres')
    this.setData({
      couponList:res.data
    })
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.couponList()
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