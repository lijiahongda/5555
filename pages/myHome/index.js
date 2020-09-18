// pages/home/index.js
import {
  wxRequest
} from "../../utils/req"
const app = getApp()
Page({
  data: {
    top_location: false,
    x: 0,
    y: '420rpx'
  },
  getShareData() {
    //获取分享信息接口
    let that = this;
    wxRequest({
      method: 'get',
      url: "/api/weixin/share/personCenterInfo",
      data: {
        memberId: wx.getStorageSync("memberId")
      }
    }).then(res => {
      that.setData({
        shareData: res,
      })
    }).catch(err => {
      wx.showToast({
        title: '网络异常,请稍后重试',
        icon: 'none'
      });
    })
  },
  transmit() {
    console.log("转发事件")
  },
  onLoad: function (options) {
    console.log(options,'我的页面openti')
    if (options.inviteCode) {
      wx.setStorageSync('inviteCode', options.inviteCode);
    }
    if (options.dealerId) {
      wx.setStorageSync('dealerId', options.dealerId);
    }
    this.setData({
      dealerId: wx.getStorageSync('dealerId')
    })
    if (wx.getStorageSync('memberId')) {
      this.getShareData()
    }

    let that = this
    wx.getSystemInfo({
      success: function (res) {
        let model = res.model.substr(0, 8)
        if (model == "iPhone X") {
          that.setData({
            top_location: true
          })
        }
      }
    })
    
    wx.setStorageSync('dealerId', options.dealerId)
  },
  onShow: function () {
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let options = currentPage.options;
    
    if (JSON.stringify(options) == "{}") {

    } else {
      if (!wx.getStorageSync('memberId')) {
        if (app.globalData.isStrongLogin == 1) {
          wx.navigateTo({
            url: '/pages/login/index'
          })
        }
      }
    }
  },
  onShareAppMessage: function () {
    let that = this;
    return {
      title: that.data.shareData.text,
      imageUrl: that.data.shareData.image,
      path: "/pages/home/index?dealerId=" + wx.getStorageSync('dealerId') + "&inviteCode=" + wx.getStorageSync('mYinviteCode'),
    }
  }
})