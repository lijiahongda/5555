// my/pages/orderlist/sanfangOrder/sanfangOrder.js
import {
  fuelOrder,
  elmOrderList,
  jdRebate
} from "../../../../api/order"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchObj: {
      curPage: 1,
      memberId: "",
      pageSize: 10
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.title
    })
    console.log(options)
    this.setData({
      type: options.type
    })
    if (options.type == 'JD') {
      this.getlist()
    } else if (options.type == 'addoil') {
      this.getoilList()
    } else if (options.type == 'elm') {
      this.getelmlist()
    }
  },
  // 饿了么订单列表
  getelmlist() {
    let that = this
    elmOrderList({
      page: that.data.searchObj.curPage,
      orderStatus: 0,
      mid: wx.getStorageSync('memberId'),
      // mid:'309480010071',
      pageSize: 10,
      channelId: 9
    }).then(res => {
      console.log(res, '饿了么订单列表')
      let orderList = ''
      if (that.data.searchObj.curPage == 1) {
        orderList = res.data
      } else {
        orderList = orderList.concat(res.data);
        if (res.data.length == 0) {
          wx.showToast({
            title: '没有更多了',
            icon: 'none'
          })
        }
      }
      this.setData({
        orderList: orderList,
      })
    })
  },
  clond(e) {
    wx.setClipboardData({
      //准备复制的数据
      data: e.currentTarget.dataset.ordersn,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    })
  },
  getlist() {
    let that = this
    jdRebate({
      page: that.data.searchObj.curPage,
      cents_status: -1,
      mid:wx.getStorageSync('memberId'),
      // mid: '309480010071',
      pageSize: 10,
      channelId: 9
    }).then(res => {
      console.log(res, 'resresres')
      let orderList = ''
      if (that.data.searchObj.curPage == 1) {
        orderList = res.data
      } else {
        orderList = orderList.concat(res.data);
        if (res.data.length == 0) {
          wx.showToast({
            title: '没有更多了',
            icon: 'none'
          })
        }
      }
      
      this.setData({
        orderList: orderList
      })
    })
  },
  getoilList() {
    let that = this
    fuelOrder({
      payStauts: 0,
      page: that.data.searchObj.curPage
    }).then(res => {
      console.log(res, 'resresres')
      let orderList = ''
      if (that.data.searchObj.curPage == 1) {
        orderList = res.data.list;
      } else {
        orderList = orderList.concat(res.data.list);
        if (res.data.list.length == 0) {
          wx.showToast({
            title: '没有更多了',
            icon:'none'
          })
        }
      }
      
      this.setData({
        orderList: orderList
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
    let page = this.data.searchObj.curPage;
    page++;
    let _key = "searchObj.curPage"
    this.setData({
      [_key]: page
    })
    if (options.type == 'JD') {
      this.getlist()

    } else if (options.type == 'addoil') {
      this.getoilList()
    }
  },

  /**
   * 用户点击右上角分享
   */

})