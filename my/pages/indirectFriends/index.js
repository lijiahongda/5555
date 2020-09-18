// my/pages/indirectFriends/index.js
import {
  subordinate
} from "../../../api/Homeapi"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //tab框
    direct: true,
    indirect: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options.memberId)
    that.setData({
      memberId: options.memberId
    })
    that.apply();
  },
  // 渲染数据
  apply: function (e) {
    let that = this;
    let memberId = that.data.memberId;

    console.log(memberId)
    let params = {
      memberId: memberId,
      dealerId: 0
    }
    subordinate(params).then(res => {
      console.log(res, '朋友圈列表')
      if (res.data) {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].mobile = res.data[i].mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
          if (!res.data[i].headImg) {
            res.data[i].headImg = "https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-07-09/11/yuelvhuiOklOUBNYyn1594265685.png"
          }
        }
        that.setData({
          applyList: res.data
        })
      } else {
        that.setData({
          direct: false,
          indirect: true
        })
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

  },

  /**
   * 用户点击右上角分享
   */

})