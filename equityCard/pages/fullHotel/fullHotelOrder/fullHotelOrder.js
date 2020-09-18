// page/HotelOther/pages/BookIng/BookIng.js
const app = getApp()
var Moment = require("../../../../utils/moment.js");
import {
  createHotelOrder,
  booking,
  Hotelpay
} from '../../../../api/hotel';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nights: 1,
    backReturn: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-21/00/yuelvhuiqjRzxgXOTK1587399992.png',
    TypeImage: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-23/03/yuelvhuiHzyd9E1sYi1587582384.png',
    jian: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-23/03/yuelvhuiNQ3vvJZEA51587582784.png',
    jia: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-23/03/yuelvhuiazc1gYW2041587583004.png',
    retain: [ //房间保留至数组
      '17:30:00',
      '18:00:00',
      '18:30:00',
      '19:00:00',
      '19:30:00',
      '20:00:00',
      '20:30:00',
      '21:00:00',
      '21:30:00',
      '22:00:00',
      '22:30:00',
      '22:00:00',
      '22:30:00',
      '23:00:00',
      '23:30:00',
      '23:59:00'
    ],
    arriveTime: '17:30:00',
    retainIndex: 0, //房间保留至
    CheckedIn: [],
    customers: [],
    phone: '',
    couponAmount: 0
  },
  // 优惠券回调
  couponFun: function (e) {
    this.setData({
      price: this.data.price - e.detail,
      couponAmount: e.detail,
    })
    // console.log(200 - e.detail)
  },
  // 打开优惠券
  coupon: function () {
    console.log('888888')
    this.setData({
      isCoupon: true
    })
  },
  // 明细
  Discount: function () {
    this.setData({
      isShow: true
    })
  },
  // 关闭明细
  ClosePopup: function (e) {
    console.log(e)
    this.setData({
      isShow: e.detail
    })
  },
  // 入住人姓名
  CheckedName: function (e) {
    // let that = this
    // let {
    //   index
    // } = e.currentTarget.dataset
    // that.data.customers[index] = {
    //   link_man: e.detail.value
    // }
    this.setData({
      link_man: e.detail.value
    })
  },
  // 入住人手机号
  phone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  idCard:function(e){
    this.setData({
      idCard: e.detail.value
    })
  },
  // 房间保留至
  bindPickerChangeRetain: function (e) {
    this.setData({
      retainIndex: e.detail.value,
      arriveTime: this.data.retain[e.detail.value],
    })
  },
  // 减房间数
  jian: function () {
    console.log('2222')
    let num = Number(this.data.roomNum)

    if (num == 1) {
      wx.showToast({
        title: '至少选择一间房',
        icon: 'none'
      })
    } else {
      num = num - 1
      this.setData({
        roomNum: num,
        price: (this.data.oriPrice * num * this.data.nights) - this.data.couponAmount
      })
    }
    let CheckedIn = []
    if (num) {
      for (var r = 0; r < num; r++) {
        CheckedIn.push(r)
      }
      console.log(CheckedIn)
      this.setData({
        CheckedIn: CheckedIn
      })
      console.log(this.data.CheckedIn)
    }
  },
  // 加房间数
  jia: function () {
    console.log('22223333')
    let num = Number(this.data.roomNum)
    num = num + 1
    console.log(num)
    this.setData({
      roomNum: num,
      price: (this.data.oriPrice * num * this.data.nights)- this.data.couponAmount
    })
    let CheckedIn = []
    if (num) {
      console.log('555')
      for (var r = 0; r < num; r++) {
        CheckedIn.push(r)
      }
      this.setData({
        CheckedIn: CheckedIn
      })
      console.log(this.data.CheckedIn)
    }
  },
  // 房间数输入
  roomNumInput: function (e) {
    console.log(this.data.oriPrice * this.data.roomNum * this.data.nights)
    this.setData({
      roomNum: e.detail.value,
      price: (this.data.oriPrice * this.data.roomNum * this.data.nights) - this.data.couponAmount
    })
  },
  // 返回
  navigatorUrl: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  // 支付
  Hotelpay: function (orderNo, totalAmount) {
    let data = {
      orderNo: orderNo,
      payChannel: 'ORIGINAL',
      tradeType: "WX_JSAPI",
      openID: wx.getStorageSync('openId')
    }
    Hotelpay(data).then(res => {
      console.log(res)
      wx.requestPayment({
        'timeStamp': res.data.getwayBody.timeStamp,
        'nonceStr': res.data.getwayBody.nonceStr,
        'package': res.data.getwayBody.package,
        'signType': 'MD5',
        'paySign': res.data.getwayBody.paySign,
        'success': function (res) {
          wx.hideLoading()
          wx.showToast({
            title: '支付成功',
            icon: 'none'
          })
          console.log(res)
          wx.redirectTo({
            url: '/hotel/pages/paySuccess/index?lastprice='+totalAmount
          });  
        },
        'fail': function (res) {
          console.log(res)
          // wx.navigateTo({
          //   url: '/page/MyOther/pages/orderDetail/orderDetail?type='+2
          // })
          wx.redirectTo({
            url: "/hotel/pages/payFail/index"
          });
           
        },
        'complete': function (res) {
          console.log(res)
        }
      })
    })
  },
  // 立即预定
  BookNow: function () {
    this.createOrder()
  },
  // 预定订单
  booking: function () {
    let data
    if(this.data.oldSourceType){
      console.log('ppppppppppppp')
      data = {
        hotelId: wx.getStorageSync('dealerId'), //酒店id
        roomTypeId: this.data.roomTypeId, //房型类型id
        ratePlanId: this.data.rpId, //rpid
        arrivalDate: this.data.checkInDate, //入住时间
        departureDate: this.data.checkOutDate, //离店时间
        sourceType: this.data.sourceType, //来源类型
        rpType:0,
        mid:wx.getStorageSync('memberId'),
        roomId:0
      }
      console.log(data)

    }else{
      console.log('111111111')
      data = {
        // hotelId: this.data.id, //酒店id
        // roomTypeId: this.data.roomTypeId, //房型类型id
        // ratePlanId: this.data.rpId, //rpid
        // arrivalDate: this.data.checkInDate, //入住时间
        // departureDate: this.data.checkOutDate, //离店时间
        // sourceType: this.data.sourceType, //来源类型
        // roomId: this.data.roomId, //房间id
        // source: 0
        hotelId: wx.getStorageSync('dealerId'), //酒店id
        roomTypeId: this.data.roomTypeId, //房型类型id
        ratePlanId: this.data.rpId, //rpid
        arrivalDate: this.data.checkInDate, //入住时间
        departureDate: this.data.checkOutDate, //离店时间
        sourceType: this.data.sourceType, //来源类型
        rpType:0,
        mid:wx.getStorageSync('memberId'),
        roomId:this.data.roomId
      }
      console.log(data)

    }
    console.log(data,'0000000000')

    booking(data).then(res => {
      this.setData({
        price: (res.data.ratePlan[0].plans[0].orgVipPrice * this.data.roomNum * this.data.nights) - this.data.couponAmount,
        oriPrice: res.data.ratePlan[0].plans[0].orgVipPrice,
        sourceTypeN:res.data.ratePlan[0].plans[0].sourceType
        // rules:res.data.ratePlan[0].availality.rules[0]
      })

      console.log(this.data.price)
    })
  },
  // 创建订单
  createOrder: function () {
    let coumters={
      link_man:this.data.link_man,
      link_tel:this.data.phone
    }
    this.data.customers.push(coumters)
    this.setData({
      customers:this.data.customers
    })
    console.log(this.data,'努力努力努力努力')
    if (this.data.customers == '') {
      wx.showToast({
        title: '请填写入住人',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '努力下单中。。。',
    })
    let data = {
      // "supplierType": this.data.sourceTypeN,
      "hotelId": wx.getStorageSync('dealerId'), //酒店id
      "roomId": this.data.roomId,   //房间id
      "roomTypeId": this.data.roomTypeId, //房型类型id
      "ratePlanId": this.data.rpId,
      "roomNum": this.data.roomNum, //房间数
      "arrivalDate": this.data.checkInDate, //入住时间
      "departureDate": this.data.checkOutDate, //离店时间
      "arriveTime": this.data.arriveTime, //房间保留至
      "customers": this.data.customers, //入住人信息
      "mid": wx.getStorageSync('memberId'),
      // "mobile": this.data.phone,
      rpType:0,//是否会员价购买
      sourceType:this.data.sourceType,//三方渠道标识 0艺龙1捷旅2携程7美团99PMS
      idCard:this.data.idCard
    }
    createHotelOrder(data).then(res => {
      console.log(res)
      if (res.code == 200) {
        this.Hotelpay(res.data.orderSn, this.data.price)
        this.setData({
          orderNo: res.data.orderSn
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        // setTimeout(() => {
        //   wx.navigateBack({
        //     delta: 1,
        //   })
        // }, 2000);
        
      }

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    // 胶囊位计算
    app.navTop(function (res) {
      that.setData({
        navTop: res.navTop
      })
    });
    if (wx.getStorageSync('CheckTime')) { //如果有缓存是时间就默认用缓存的
      var checkInDate = wx.getStorageSync('ROOM_SOURCE_DATE').checkInDate;
      var checkOutDate = wx.getStorageSync('ROOM_SOURCE_DATE').checkOutDate;
      this.setData({
        CheckTime: wx.getStorageSync('CheckTime'),
        outTime: wx.getStorageSync('leaveTime'),
        checkInDate: checkInDate,
        checkOutDate: checkOutDate
      })
    } else { //设置默认时间
      var checkInDate = Moment(new Date()).format('YYYY-MM-DD');
      var checkOutDate = Moment(new Date()).add(1, 'day').format('YYYY-MM-DD');
      console.log(checkInDate, checkOutDate)
      this.setData({
        CheckTime: checkInDate.substr(5, checkInDate.length),
        outTime: checkOutDate.substr(5, checkOutDate.length),
        checkInDate: checkInDate,
        checkOutDate: checkOutDate
      })
      wx.setStorage({
        key: 'ROOM_SOURCE_DATE',
        data: {
          checkInDate: checkInDate,
          checkOutDate: checkOutDate
        }
      });
    }
    that.setData({
      id: options.id,
      roomTypeId: options.roomTypeId, //房型类型id
      rpId: options.rpId, //rpid
      sourceType: options.sourceType, //来源类型
      roomId: options.roomId, //房间id
      roomNum: options.roomNum //房间数
    })
    if(options.oldSourceType){
      that.setData({
        oldSourceType:options.oldSourceType
      })
    }
    if (options.roomNum) {
      for (var r = 0; r < options.roomNum; r++) {
        that.data.CheckedIn.push(r)
      }
      that.setData({
        CheckedIn: that.data.CheckedIn
      })
    }
    that.booking()
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
    this.setData({
      nights: wx.getStorageSync('nights') ? wx.getStorageSync('nights') : 1
    })
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

  }
})