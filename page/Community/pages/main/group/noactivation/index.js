// page/community/pages/main/group/noactivation/index.js
import {
  noActivationRoomById,
  activationShareXcx
} from '../../../../../../api/Community'
const app =  getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: ['1', '1', '2', '4'],
    lists: [1, 2, 3, 4, 5, 6, 7, 8, 9, 1],
    eject: 0, //是否弹出分享，0-不弹出1-弹出
    ERM: true,
    text: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
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
      }else{
        that.setData({
          room_id: options.room_id
        })
      this.getData()

      }
    }
  },
  // 打开商品列表
  commodities() {
    wx.navigateTo({
      url: '/page/community/pages/main/commodities/index',
    })
  },
  getData: function () {
    let that = this
    console.log(wx.getStorageSync('uid'), '88888888888888888')
    noActivationRoomById({
      room_id: that.data.room_id,
      uid: wx.getStorageSync('uid'),
    }).then(res => {
      if (res.code == 200) {
        console.log(res.data.eject, '-00000000000======', wx.getStorageSync('uid'), '99999999')
        that.setData({
          userInfo: res.data.userInfo,
          actiNum: res.data.actiNum,
          notActiNum: res.data.notActiNum,
          qrCode: res.data.qrCode,
          goodsData: res.data.goodsData,
          haveActivation: res.data.haveActivation,
          groupType: res.data.groupType,
          eject: res.data.eject,
        })

        console.log(res)
        that.getShare(res.data.userInfo.uid)
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  getShare: function (uid) {
    let that = this
    activationShareXcx({
      mid: uid,
      room_id: that.data.room_id,
    }).then(res => {
      if (res.code == 200) {
        that.setData({
          title: res.title,
          desc: res.desc,
          showImg: res.showImg
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  close() {
    let that = this
    console.log(that.data.groupType, '1111111111111111111111')
    if (that.data.groupType == 1) {
      console.log('88888888888,现在的groupType是', that.data.groupType)
      that.setData({
        eject: 0
      })
    } else if (that.data.groupType == 2) {
      console.log('999999999999,十个人了，现在的groupType是', that.data.groupType)
      that.setData({
        eject: 0
      })
      wx.navigateTo({
        url: '/page/community/pages/main/commodities/index',
      })
    }

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let that = this
    return {
      title: that.data.title,
      imageUrl: that.data.showImg,
      path: "page/community/pages/main/group/noactivation/index" + "?reCode=" + wx.getStorageSync('selfReCode') + "&room_id=" + that.data.room_id
    }
  }
})