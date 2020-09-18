const app = getApp()
import {
  checkHotel,
  hotelPhoneVerify,
  hotelPhoneCheckCode
} from '../../../api/hotel'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Return: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-30/20/yuelvhuidjEjRAEqX01588248683.png',
    del: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-30/20/yuelvhui3Ptw9eiM2R1588248772.png',
    form: {
      mid: wx.getStorageSync('memberId'),
      invitationCode: '107632001' //直订默认邀请码
    },
    type: '',
    innertext: '获取验证码',
    innertime: 60,
    codeStatus:0
  },
  // 返回
  navigatorUrl: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.data.form.hotelName = options.hotelName
    that.data.form.hotelMobile = options.hotelMobile
    that.data.form.hotelAddress = options.hotelAddress
    that.setData({
      form: that.data.form,
      type: options.type
    })
  },
  // 获取验证码
  getCodeNumber() {
    let that = this
    if(that.data.form.userPhone==undefined||that.data.form.userPhone==''){
      wx.showToast({
        title: '请填写手机号',
        icon:'none'
      })
      return
    }
    hotelPhoneVerify({
      mobile: that.data.form.userPhone
    }).then(res => {
      console.log(res, '验证码发送状态')
      wx.showToast({
        title: res.msg,
        icon: 'none',
      })
      var inter = setInterval(function () {
        this.setData({
          innertext: this.data.innertime + 's后重发',
          innertime: this.data.innertime - 1,
          codeStatus:1
        });
        if (this.data.innertime < 0) {
          clearInterval(inter)
          this.setData({
            innertext: '获取验证码',
            innertime: 60,
            codeStatus:0
          });
        }
      }.bind(this), 1000);
    })
  },
  // 酒店名称
  hotelName: function (e) {
    let that = this
    that.data.form.hotelName = e.detail.value
    that.setData({
      form: that.data.form
    })
  },
  // 座机
  hotelMobile: function (e) {
    let that = this
    that.data.form.hotelMobile = e.detail.value
    that.setData({
      form: that.data.form
    })
  },
  // 地址
  hotelAddress: function (e) {
    let that = this
    that.data.form.hotelAddress = e.detail.value
    that.setData({
      form: that.data.form
    })
  },
  // 联系人
  hotelUser: function (e) {
    let that = this
    that.data.form.hotelUser = e.detail.value
    that.setData({
      form: that.data.form
    })
  },
  // 联系人手机号
  userPhone: function (e) {
    let that = this
    if(e.detail.value.length>11){
      wx.showToast({
        title: '请输入正确的手机号',
        icon:'none'
      })
      return
    }
    that.data.form.userPhone = e.detail.value
    that.setData({
      form: that.data.form
    })
  },
  // 验证码
  userCode: function (e) {
    let that = this
    that.data.form.userCode = e.detail.value
    that.setData({
      form: that.data.form
    })
  },
  // 邀请码
  userNumber: function (e) {
    let that = this
    that.data.form.invitationCode = e.detail.value
    that.setData({
      form: that.data.form
    })
  },
  // 邮箱
  userEmail: function (e) {
    let that = this
    that.data.form.userEmail = e.detail.value
    that.setData({
      form: that.data.form
    })
  },
  // 职位
  userPosition: function (e) {
    let that = this
    that.data.form.userPosition = e.detail.value
    that.setData({
      form: that.data.form
    })
  },
  // 营业执照
  licenseNumber: function (e) {
    let that = this
    that.data.form.licenseNumber = e.detail.value
    that.setData({
      form: that.data.form
    })
  },


  // 保存
  btn: function () {
    let that = this
    hotelPhoneCheckCode({
      mobile: that.data.form.userPhone,
      code: that.data.form.userCode
    }).then(res => {
      if (res.code == 200) {
        checkHotel(that.data.form).then(res => {
          console.log(res)
          if (res.code == 200) {
            wx.showToast({
              title: res.msg,
              icon: 'none'
            })
            setTimeout(function () {
              //要延时执行的代码
              wx.navigateBack({
                delta: 1,
              })
            }, 1500) //延迟时间
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none'
            })
          }
        })
      }

    })

  }

})