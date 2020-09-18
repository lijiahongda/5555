// import Util from '../../../../utils/util.js';
// import {
//   xcxLogin,
//   authSend,
//   SignNow,
//   getPerson
// } from '../../../../api/api.js'

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isWxLogin: true, //是否是手机号验证码登录
    countdown: 60, // 验证码倒计时
    mobile: '', //手机号
    title: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-05-22/22/yuelvhuie7mD4gzUcd1590157731.png',//标题
    bgsmall:'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-06-21/20/yuelvhuiZ5eYwHhcHC1592744155.png',
    bgBag:'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-06-21/20/yuelvhuiYRpPG5nv731592743981.png',
    isauthorization:false,
    logo_url:'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-05-24/10/yuelvhuiR93e8FNSAD1590287952.png'
  },

  // 获取输入的手机号
  phone: function (e) {
    let that = this;
    that.setData({
      mobile: e.detail.value
    })
  },
  // 倒计时
  getCode: function () {
    if (this.data.countdown != 60) {
      return;
    }
    let _this = this;
    let temp = setInterval(function () { // 倒计时
      _this.setData({
        countdown: _this.data.countdown - 1
      })
      if (_this.data.countdown == 1) {
        _this.setData({
          countdown: 60
        })
        clearInterval(temp);
      }

    }, 1000)
  },
  // 获取验证码
  allow: function () {
    let that = this;
    if (that.data.mobile == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
    } else {
      authSend({
        mobile: that.data.mobile
      }).then(res => {
        that.getCode();
      })
    }
  },
  // 短信验证码登录方式
  codeLogin: function () {
    this.setData({
      isWxLogin: false
    })
  },
  onLoad: function (e) {
    let that = this
    // 获取屏幕高度
    let Modeliphonex = 'iPhone X'
    let ModeliphonePro = 'iPhone Pro'
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        })
        console.log(res.model)
        if (res.model.indexOf(Modeliphonex) > -1 || res.model.indexOf(ModeliphonePro) > -1) {
          console.log('---')
          that.setData({
            isFill: true
          })
        }
      }
    })

    // if(e){
      console.log(e,'参数')
    // }


  },
  noLogin: function () {
    let that = this;
    console.log(that.data.codeNumber,'that.data.codeNumber')
    if(!that.data.codeNumber){
      wx.navigateBack()
    }else{
      if(that.data.share.includes('active')){
        wx.switchTab({
          url: '/page/Home/Home',
        })
      }else{
          wx.navigateBack() 
      }      
    }
  },
  // 验证码值
  Vscode: function (e) {
    this.setData({
      verifyCode: e.detail.value
    })
  },
  // 手机号验证码立即登录
  SignNow: function (e) {
    let that = this
    console.log({
      mobile: that.data.mobile,
      verifyCode: that.data.verifyCode,
      inviteCode:that.data.codeNumber ? that.data.codeNumber : '', //邀请码
      loginType:1
    })
    SignNow({
      mobile: that.data.mobile,
      verifyCode: that.data.verifyCode,
      inviteCode:that.data.codeNumber ? that.data.codeNumber : '', //邀请码
      loginType:1
    }).then(res => {
      console.log(res)
      if(res.code == 200){
        // 用户id
        wx.setStorage({
          key: 'memberId',
          data: res.data.memberId,
        })
        // 用户token
        wx.setStorage({
          key: 'token',
          data: res.data.token,
        })
        // 用户昵称
        wx.setStorage({
          key: 'nickName',
          data: res.data.nickName,
        })
        // 用户头像
        wx.setStorage({
          key: 'headImgUrl',
          data: res.data.headImgUrl,
        })
        // 邀请码
        wx.setStorage({
          key: 'inviteCode',
          data: res.data.inviteCode,
        })
        if(res.data.headImgUrl == ''){
          that.setData({
            isauthorization:true
          })
        }else{
          setTimeout(function () {
            if(!that.data.codeNumber){
              wx.navigateBack()
            }else{
              if(that.data.share.includes('active')){
                wx.switchTab({
                  url: '/page/Home/Home',
                })
              }else{
                wx.navigateBack()
              } 
            }

          }, 1000)
        }
      }else{
        wx.showToast({
          title: res.msg,
          icon:'none'
        })
      }

      
    })
  },
  // 微信登录注册
  LoginImmediately: function (e) {
    let that =this;
    console.log({
      "codeNumber": this.data.codeNumber ? this.data.codeNumber : '', //邀请码
      "encryptedData": e.detail.encryptedData,
      "iv": e.detail.iv,
      "sessionKey": wx.getStorageSync('sessionKey'),
      "openId": wx.getStorageSync('openid')
    })
    xcxLogin({
      "codeNumber": this.data.codeNumber ? this.data.codeNumber : '', //邀请码
      "encryptedData": e.detail.encryptedData,
      "iv": e.detail.iv,
      "sessionKey": wx.getStorageSync('sessionKey'),
      "openId": wx.getStorageSync('openid')
    }).then(res => {
      console.log(res)
      wx.setStorage({ //用户ID
        key: "memberId",
        data: res.data.memberId
      });
      wx.setStorage({ //用户token
        key: "token",
        data: res.data.token
      });
      // 用户头像
      wx.setStorage({
        key: 'headImgUrl',
        data: res.data.headImgUrl,
      })
      // 用户昵称
      wx.setStorage({
        key: 'nickName',
        data: res.data.nickName,
      })
      wx.setStorage({ //用户自己的邀请码
        key: "inviteCode",
        data: res.data.inviteCode
      })
      if (res.data.headImgUrl == '') {
        this.setData({
          isauthorization: true
        })
      }else{
        setTimeout(function () {
          if(!that.data.codeNumber){
            wx.navigateBack()
          }else{
            if(that.data.share.includes('active')){
              wx.switchTab({
                url: '/page/Home/Home',
              })
            }else{
              wx.navigateBack()
            } 
          }
        }, 1000)
      }
      

    })
  },
  // 获取用户信息
  getPerson: function (e) {
    var that = this;
    getPerson({
      "encryptedData": e.detail.encryptedData,
      "iv": e.detail.iv,
      "sessionKey": wx.getStorageSync('sessionKey'),
      "memberId": wx.getStorageSync('memberId')
    }).then(res => {
      console.log(res)
      if(res.code == 200){
        // 用户头像
      wx.setStorage({
        key: 'headImgUrl',
        data: res.data.headImgUrl,
      })
      // 用户昵称
      wx.setStorage({
        key: 'nickName',
        data: res.data.nickName,
      })
      }
      this.setData({
        isauthorization:false
      })
      setTimeout(function () {
        if(!that.data.codeNumber){
          wx.navigateBack()
        }else{
          if(that.data.share.includes('active')){
            wx.switchTab({
              url: '/page/Home/Home',
            })
          }else{
            wx.navigateBack()
          } 
        }
      }, 1000)
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      codeNumber:wx.getStorageSync('shareCode')
    })
    
    this.setData({
      share:wx.getStorageSync('share')
    })
    console.log(wx.getStorageSync('shareCode'),'邀请码啊  啊啊啊啊啊啊啊啊',this.data.codeNumber)
  }
})