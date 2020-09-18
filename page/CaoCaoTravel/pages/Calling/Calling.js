import {
  post,
  get
} from '../../../../utils/caocao.js'
var minute, second; //时 分 秒
minute = second = 0; //初始化
var millisecond = 0; //毫秒
var int;
var timeSoket;
// var socketTime;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cancelTips:false,//叫到车之后取消
    Drivercancelled:false,//用户在没有叫到车时候点击取消
    ifWaiting:true,//正在叫车
    isCancellationSuccess:false,
    waitingride:false,//等待接驾
    status:1,
    couponMoney:0
  },
  gohome:function(){
    wx.redirectTo({
      url: '/page/CaoCaoTravel/pages/CaoCaoTravel'
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    if (that.data.ifWaiting == 'false') {
      // that.judge()
      // that.socket(that.data.order_sn)
      that.detail()
    }
  },
  // 详情
  detail(){
    let that = this
    post('/travel/v1/order/detail', {
      order_sn: that.data.ordersn
    }, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        that.setData({
          dataContent: res.data.data,
          status: res.data.data.basicOrderVO.status
        })

        wx.setNavigationBarTitle({
          title: that.data.status == 3 ? '行驶中' : that.data.status == 12 ? '司机已到达' : (that.data.status == 5 || that.data.status == 8) ? '行程结束' : ''
        })
      } else {
        wx.showToast({
          title: res.data.msg || "",
          icon: 'none',
          duration: 2000
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    let that = this
    that.setData({
      ordersn: options.order_sn,
      cardImg: options.cardImg,
      time: options.time,
      start_name: options.start_name,
      end_name: options.end_name,
      ifWaiting: options.ifWaiting
    })
    
    if (!options.time){
      let date = new Date(); //当前日期
      let month = date.getMonth() + 1; //当前月份
      let day = date.getDate(); //当前日期
      let hours = date.getHours(); //当前小时
      let m = date.getMinutes(); //当前分
      that.setData({
        time: month + '月' + day + '日 ' + hours + ':' + m
      })
    }
    
    that.start()

    wx.getSystemInfo({
      success(res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      }
    })
    
    that.socket(options.order_sn)
    that.getCoupon()
    
    console.log(options, 'optiiii')
  },
  // 检测是否可以下单
  judge: function () {
    let that = this
    post('/travel/v1/order/check', {}, (res) => {
      if (res.data.code == 1002) {
        
        that.setData({
          dataContent: res.data.data,
          status: res.data.data.basicOrderVO.status
        })

        wx.setNavigationBarTitle({
          title: that.data.status == 3 ? '行驶中' : that.data.status == 12 ? '司机已到达' : (that.data.status == 5 || that.data.status == 8) ? '行程结束' : ''
        })
        // that.setData({
        //   status: 5,
        // })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 1)

  },
  socket: function (ordersn) {
    let that = this

    that.WebSocketInit(ordersn)
      wx.onSocketError(function () {
    })
    wx.onSocketMessage(function (data_) {
      console.log(data_)
      that.socketOperation(data_)
    })

  },
  WebSocketInit: function (ordersn) {
    let that = this
    wx.connectSocket({
      url: 'wss://other-api.yuelvhui.com/websocket',
      data: ordersn,
      method: 'GET',
      success: function (res) {
      },
      fail: function (res) {
      }
    })

    wx.onSocketOpen(function () {
      that.sendSocketMessage(ordersn)
      // 每分钟调用一次socket 保证不断
      timeSoket = setInterval(function(){
        that.sendSocketMessage(ordersn)
      },30000)
    })
  },
  sendSocketMessage: function (ordersn){
    let that =this
    wx.sendSocketMessage({
      data: ordersn,
      success: function (res) {
        
      },
      fail: function (res) {
      }
    });

    wx.onSocketMessage(function (data) {
      if (JSON.parse(data.data).data.code == 400) {
        wx.onSocketClose(function (res) {
          that.sendSocketMessage(ordersn)
        })
      } else {
        that.setData({
          dataContent: JSON.parse(data.data).data,
          status: JSON.parse(data.data).data.basicOrderVO.status
        })

        wx.setNavigationBarTitle({
          title: that.data.status == 3 ? '行驶中' : that.data.status == 12 ? '司机已到达' : (that.data.status == 5 || that.data.status == 8) ? '行程结束' : ''
        })

      }
      // 订单状态：0待呼叫;    5订单待支付; 6订单已评价; 7订单已支付，待评价; 8行程结束，计费结束; 9开始服务; ; 11订单改派中（预约单才有）; 12司机已到达; 
    })
  },

  // 判断是否有优惠券
  getCoupon:function(){
    let that= this
    post('/travel/v1/order/checkCoupon', {}, (res) => {
      if (res.data.code == 200) {
        that.setData({
          couponMoney: res.data.data.money
        })
      } else {
        wx.showToast({
          title: res.data.msg || "",
          icon: 'none',
          duration: 2000
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 1)
  },

 
  // 等待接驾时候取消
  operationcancel:function(){
    let that = this
    that.setData({
      cancelTips:true,
      waitingride:false
    })
  },
  // 没叫到车用户取消订单
  DriverNomore:function(){
    let that = this
    post('/travel/v1/cancelOrder', {
      order_sn: that.data.ordersn,
      cancel_code: 1
    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          isCancellationSuccess: true,
          Drivercancelled: false
        })
      } else {
        wx.showToast({
          title: res.data.msg || "",
          icon: 'none',
          duration: 2000
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 1)
  },
  
  // 叫到车用户确认取消订单
  nocancel:function(){
    let that = this
    that.setData({
      waitingride:true,
      cancelTips:false
    })
  },
  // 叫到车后用户确认取消
  surecancel:function(){
    wx.redirectTo({
      url: '/page/CaoCaoTravel/pages/ReasonsCancellation/ReasonsCancellation?ordersn=' + this.data.ordersn
    })
  },
  // 打电话
  call:function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile
    })
  },
  // 叫车中取消订单
  waitingCancel:function(){
    let that = this
    that.setData({
      Drivercancelled:true,
      ifWaiting:false
    })
  },
  // 继续等待
  DriverRecall:function(){
    let that = this
    that.setData({
      ifWaiting:true,
      Drivercancelled:false
    })
    that.start()
  },
  
  // 立即支付
  evaluate:function(){
    let that = this
    post('/travel/v1/order/pay', {
      orderSn: that.data.dataContent.basicOrderVO.extOrderId,
      payType: 240,
      paySource:1
    }, (res) => {
      if (res.data.code == 200) {
        wx.requestPayment({
          'timeStamp': res.data.pay.getwayBody.timeStamp,
          'nonceStr': res.data.pay.getwayBody.nonceStr,
          'package': res.data.pay.getwayBody.package,
          'signType': 'MD5',
          'paySign': res.data.pay.getwayBody.paySign,
          'success': function (res) {
            wx.showToast({
              title: '支付成功！',
              icon: 'success',
              duration: 2000,
              success:function(){
                setTimeout(function(){
                  wx.navigateTo({
                    url: '/page/CaoCaoTravel/pages/evaluate/evaluate?ordersn=' + res.data.ordersn
                  })
                },2000)
              }
            })
          },
          'fail': function (res) {
            wx.showToast({
              title: res.data.msg || "",
              icon: 'success',
              duration: 2000
            })
          }
        });
        
      } else {
        wx.showToast({
          title: res.data.msg || "",
          icon: 'none',
          duration: 2000
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 1)
  },
  start: function() //开始
  {
    int = setInterval(this.timer, 50);
  },
  stop: function() //暂停
  {
    clearInterval(int);
  },
  timer: function() //计时
  {
    let that = this

    millisecond = millisecond + 50;
    if (millisecond >= 1000) {
      millisecond = 0;
      second = second + 1;
    }
    if (second >= 60) {
      second = 0;
      minute = minute + 1;
    }
    that.setData({
      second: second,
      minute: minute
    })
  },
  cancelOrder:function(){
    let that = this 
    that.stop()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.cancelOrder()
  }
})