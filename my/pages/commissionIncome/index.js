
import {
  totalCommission,
  orderStatus
} from "../../../api/Homeapi"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    right_img: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-07-02/14/yuelvhui4StN3XtHVn1593670192.png',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.particulars()
  },
  particulars: function () {
    var that = this;
    let params = {
      memberId: wx.getStorageSync("memberId")
    }
    totalCommission(params).then(res => {
      console.log(res, '我的钱包列表')

      that.setData({
        total: res.data.total,
        itemList: res.data.list
      })
      orderStatus(params).then(res => {
        console.log(res, '佣金分类列表')
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].memberId = ''
          res.data[i].tradeAmount = ''
        }
        that.setData({
          list: res.data
        })
        that.exhibition()
        console.log(that.data.list)
      })
    })




  },
  exhibition: function () {
    var that = this;
    var list = that.data.list;
    var itemList = that.data.itemList;
    for (var i = 0; i < itemList.length; i++) {
      // console.log(itemList[i].orderTypeStr)
      for (var k = 0; k < list.length; k++) {
        // console.log(list[k].name)
        if (itemList[i].orderTypeStr == list[k].name) {
          console.log(itemList[i])
          list[k].memberId = itemList[i].memberId
          list[k].tradeAmount = itemList[i].tradeAmount
        }
      }
    }
    that.setData({
      list: list
    })
    console.log(that.data.list)

  },

  //返回
  fanhui() {
    wx.navigateBack({
      delta: 1
    })
  },
  // 提现
  deposit: function (e) {
    wx.showToast({
      title: '请下载直订APP提现',
      icon: 'none'
    })
  },
  goJump: function (e) {
    console.log(e.currentTarget.dataset.id)
    console.log(e.currentTarget.dataset.trade)
    if (!e.currentTarget.dataset.trade) {
      wx.showToast({
        title: '暂无收益',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: '/my/pages/myCommission/index?id=' + e.currentTarget.dataset.id,
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