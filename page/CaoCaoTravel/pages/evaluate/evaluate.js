var app = getApp();
import {
  post,
  get
} from '../../../../utils/caocao.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    packstars: [true, true, true, true, true],
    redImage: 'https://image.yuelvhui.com/pubfile/2019/11/19/line_1574164043_77471.png',
    GrayImage: 'https://image.yuelvhui.com/pubfile/2019/11/19/line_1574164086_52885.png',
    TextArea:'',
    isselectStars:true
  }, 
  // 编辑文字
  bindTextAreaBlur: function(e) {
    console.log(e)
    this.setData({
      TextArea: e.detail.value
    })
    
  },
  Submission:function(){
    let that = this
    let packstars = []
    if (that.data.TextArea == ''){
      wx.showToast({
        title: '请输入评价内容',
        icon:''
      })
    }
    for (let p of that.data.packstars) {
      if (p) {
        packstars.push(p)
      }
    }
    console.log(that.data.TextArea)
    post('/travel/v1/getEvaluateOrder', {
      order_sn: that.data.ordersn,
      score: packstars.length,
      content: that.data.TextArea
    }, (res) => {
      console.log(res)
      that.setData({
        packstars: that.data.packstars,
        isselectStars: false
      })
      if (res.data.code == 200) {
        that.setData({
          packstars: that.data.packstars,
          isselectStars: false
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  packstars: function(e) {
    let that = this;
    let id = e.currentTarget.dataset.id
    if (id == 1) {
      that.setData({
        packstars: [true, false, false, false, false]
      })
    } else if (id == 2) {
      that.setData({
        packstars: [true, true, false, false, false]
      })
    } else if (id == 3) {
      that.setData({
        packstars: [true, true, true, false, false]
      })
    } else if (id == 4) {
      that.setData({
        packstars: [true, true, true, true, false]
      })
    } else if (id == 5) {
      that.setData({
        packstars: [true, true, true, true, true]
      })
    }
  },
  call:function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  initData: function (ordersn) {
    let that = this
    post('/travel/v1/order/detail', {
      order_sn:ordersn
    }, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        if (res.data.data.basicOrderVO.status == 7){
          that.setData({
            isselectStars: true
          })
        } else if (res.data.data.basicOrderVO.status == 6){
          that.setData({
            isselectStars: false
          })
        }
        that.setData({
          status: res.data.data.basicOrderVO.status,
          basicOrderVO: res.data.data.basicOrderVO,
          driverInfoVo: res.data.data.driverInfoVo,
          orderFeeVo: res.data.data.orderFeeVo,
          TextArea: res.data.data.comment.content,
        })
        if (res.data.data.comment.level == 1) {
          that.setData({
            packstars: [true, false, false, false, false]
          })
        } else if (res.data.data.comment.level == 2) {
          that.setData({
            packstars: [true, true, false, false, false]
          })
        } else if (res.data.data.comment.level == 3) {
          that.setData({
            packstars: [true, true, true, false, false]
          })
        } else if (res.data.data.comment.level == 4) {
          that.setData({
            packstars: [true, true, true, true, false]
          })
        } else if (res.data.data.comment.level == 5) {
          that.setData({
            packstars: [true, true, true, true, true]
          })
        }
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
     let that = this
     console.log(options)
     that.setData({
       ordersn:options.ordersn,
       isselectStars: options.isselectStars == 'false'?false:true
     })
    that.initData(options.ordersn)
  },
  // 打电话
  call: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  }
})