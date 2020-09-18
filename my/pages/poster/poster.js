// page/other/pages/poster/poster.js
import {
  get,
  post
} from '../../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    downloadUrl: '',
    isShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    console.log(options, 'optionsoptions')
      that.setData({
        goodid: options.goodsId,
        skuid: options.skuid ? options.skuid:'',
        url: options.url,
        live_id: options.live_id,
        live_channel: options.live_channel
      })
      this.getlist(options.url)
  },

  getlist(url) {
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    console.log(that.data,'llllllll')
    let obj={}
     obj = {
       mid:wx.getStorageSync('memberId'),
       inviteCode:wx.getStorageSync('mYinviteCode')
    }
    
    
    post(url, obj, (res) => {
      if (res.data.code == 200) {
          that.setData({
            downloadUrl: res.data.data.img,
            isShow: true
          })
        wx.hideLoading()
      }
    })
  },
  // download: function(id, url, type) { // 生成海报
  //   console.log(id, url, type, 'id, url,type')
  //   let that = this;
  //   wx.showLoading({
  //     title: '加载中',
  //   })
  //   var obj = {}

  //   if (type == 'adult') {
  //     obj = {
  //       'mid': id, //ID
  //       // 'main_user': id, //ID
  //       code_type: 'web'
  //     }
  //   } else if (type == 'cash' || type == 'home') {
  //     obj = {
  //       'mid': wx.getStorageSync('uid'), //登录人MID
  //     }
  //   } else if (type == 'curriculum') {
  //     obj = {
  //       'mid': wx.getStorageSync('uid'), //登录人MID
  //       'id': id, //ID
  //     }
  //   } else if (type == 'other') {
  //     obj = {
  //       'mid': wx.getStorageSync('uid'), //登录人MID
  //       'main_user': id, //ID
  //       'code_type': 'web'
  //     }
  //   }else if(type='zhibo'){
  //     obj={
  //       mid: wx.getStorageSync('uid'),
  //       id: id,
  //       from_type: 2
  //     }
  //   }  else {
  //     obj = {
  //       'mid': wx.getStorageSync('uid'), //登录人MID
  //       'pk': id, //ID
  //       code_type: 'web'
  //     }
  //   }
  //   post(url, obj, (res) => {
  //     if (res.data.code == 200) {
  //       console.log(res,'09090909')
  //       if (type == 'curriculum') {
  //         that.setData({
  //           downloadUrl: res.data.data.img,
  //           isShow: true
  //         })
  //       } else if (type == 'home') {
  //         that.setData({
  //           downloadUrl: res.data.data.cover,
  //           isShow: true
  //         })
  //       } else if(type=='zhibo'){
  //         that.setData({
  //           downloadUrl: res.data.img,
  //           isShow: true
  //         })
  //       }else {
  //         that.setData({
  //           downloadUrl: res.data.img,
  //           isShow: true
  //         })
  //       }
  //       wx.hideLoading()
  //     }
  //   }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 3)
  // },


  savePic: function() {

    wx.downloadFile({
      url: this.data.downloadUrl,
      success: function(res) {
        console.log(res, '____--')
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function(resNew) {
            console.log(resNew, '=====')
            wx.showToast({
              title: '保存成功',
              icon: 'none',
              duration: 2000
            })
          },
          fail: function(resNew) {
            console.log(resNew, '这里是失败')
            wx.showToast({
              title: '保存失败',
              icon: 'none',
              duration: 2000
            })
            if (resNew.errMsg == "saveImageToPhotosAlbum:fail auth deny") {
              wx.openSetting({
                success(settingdata) {
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                  } else {
                    console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                  }
                }
              })
            }
          }
        })
      },
      fail: function(res) {
        wx.showToast({
          title: res.errMsg,
          icon: 'succes',
          duration: 1000,
          mask: true
        })
      }
    })
  }
})