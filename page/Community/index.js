// page/My/My.js
const app = getApp();
import {
  myData
} from "../../api/Community"


Page({
  /**
   * 页面的初始数据
   */
  data: {
    isExclusiveRobot: 0, //1是有专属机器人 0是没有 
    showstatus: 0,
    teacherWxCode: '',
    UserData: {},
    userinfostr:{}
  },
 /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    let that = this;
    that.setData({
      userinfostr:wx.getStorageSync('userinfostr')
    })
    console.log(that.data.userinfostr)
  },
  onShow() {

    this.setData({
      isExclusiveRobot: app.globalData.isExclusiveRobot
    })
    this.getUserCenter();
  },
  
  //获取用户中心数据
  getUserCenter() {
    myData({
      memberId:wx.getStorageSync('memberId')
    }).then(res => {
      this.setData({
        UserData: res.data
      })
    })
  },
  nextPage(e) {
    console.log(e);
    let {
      ourl = ''
    } = e.currentTarget.dataset

    wx.navigateTo({
      url: ourl,
    });
   
  },
  handleGuanjia() {
    //小悦管家点击事件
    let content = this.data.UserData.zdSteward;
    wx.showModal({
      title: '导师微信号',
      content: content,
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if (result.confirm) {
          wx.setClipboardData({
            data: content,
            success(res) {
              wx.getClipboardData({
                success(res) {}
              })
            },
            complete(res) {}
          })
        }
      },
    });
  },
 
  handleCopyCode(e) {
    //复制悦淘号点击事件
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success(res) {
        wx.getClipboardData({
          success(res) {}
        })
      },
      complete(res) {}
    })
  }

});