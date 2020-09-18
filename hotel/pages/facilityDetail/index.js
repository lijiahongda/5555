import { wxRequest } from "../../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dealerId: wx.getStorageSync('dealerId'),
    roomData: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRoomBanner()
  },
  getRoomBanner() {
    let that = this;
    wxRequest({
      method: "post",
      url: "/api/hotel/room?dealerId=" + that.data.dealerId
    }).then(res => {
      console.log("房间数据", res);
      let bannerImg = JSON.parse(res.images);
      that.setData({
        bannerImg,
        roomData: res,
        // fxImg:bannerImg[2].imgUrl
      })
      // let data = res.docs;
      // data.forEach((val,index)=>{

      //   self.getMallDetail(val.productId);
      // })


    }).catch(err => {
      console.log("请求失败", err);

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