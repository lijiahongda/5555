
import {
  post,
  get,
  retrunScene,
  relations,
} from '../../../utils/caocao.js'
var dateTimePicker = require('../../../utils/dateTimePicker.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    travel: [{
        name: '现在',
        id: 1
      },
      {
        name: '预约',
        id: 2
      }
    ],
    curTab: 1,
    types: [{
        name: '新能源',
        id: 2,
        img: 'https://image.yuelvhui.com/pubfile/2019/11/22/line_1574361957_61368.png'
      },
      {
        name: '舒适型',
        id: 3,
        img:'https://image.yuelvhui.com/pubfile/2019/11/22/line_1574361896_52202.png'
      },
      {
        name: '豪华型',
        id: 4,
        img:'https://image.yuelvhui.com/pubfile/2019/11/22/line_1574361998_36589.png'
      },
      {
        name: '七座商务',
        id: 5,
        img: 'https://image.yuelvhui.com/pubfile/2019/11/22/line_1574361977_55966.png'
      },
    ],
    currentTab: 2,
    dateTime1: null,
    dateTimeArr: null,
    column: 0,
    index1: 0, //日期
    index2: 0, //小时
    index3: 0, //分
    isVehicle:false,
    Destination:'您要去哪儿',
    car_type:2,
    city_code:'010',
    order_type:1,
    cardImgIndex:1,
    departure_time: '',
    nextTime: '',
    isSign:true,
    isVip: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj2 = dateTimePicker.travelDateTimePicker()
    console.log(obj2, 'pbj');
    that.setData({
      dateTimeArr: obj2.dateTimeArr,
      dateYear: obj2.dateYear
    });
    that.timeFormat()

    that.Notice()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this

    if (wx.getStorageSync('uid')) {
      //已经登陆
      console.log('已经登陆了')
      that.setData({
        isSign: false
      })
      // 非会员
      if(wx.getStorageSync('cardType') > 0){
        that.setData({
          isVip: false
        })
      }
    }else{

    }

    that.setData({
      currentLocation: wx.getStorageSync('currentLocation'),//当前定位
      lat: wx.getStorageSync('lat'),//当前定位经度
      lng: wx.getStorageSync('lng'),//当前定位维度
      Destination: that.data.Destination,//目的地
      DesLocation: that.data.DesLocation,//目的地经纬度
      DesLocationStar: that.data.DesLocationStar,//出发地坐标
    })

    that.judge()//检测是否可以下单
    that.getCityCode()//获取城市编码
    that.getCouponId()//获取优惠券
    if (that.data.Destination != '您要去哪儿') {
      that.estimatePriceWithDetail()//预估价格
    }
  },
  // 检测是否可以下单
  judge:function(){
    let that = this
    post('/travel/v1/order/check', {}, (res) => {
      if (res.data.code == 200) {
        
      } else if (res.data.code == 1001 ) {
        that.setData({
          order_sn: res.data.data.order_sn,
          isVehicle: false,
        })
        wx.showToast({
          title: res.data.msg || '',
          icon: 'none',
          duration: 2000,
          success: function () {
            setTimeout(function () {
              wx.navigateTo({
                url: '/page/CaoCaoTravel/pages/Calling/Calling?order_sn=' + res.data.data.order_sn + '&cardImg=' + that.data.types[that.data.cardImgIndex].img + '&time=' + that.data.nextTime + '&start_name=' + that.data.currentLocation + '&end_name=' + that.data.Destination
              })
            }, 2000)
          }
        })
      } else if (res.data.code == 1002) {
        that.setData({
          order_sn: res.data.data.order_sn,
          isVehicle: false
        })
        wx.showToast({
          title: res.data.msg || '',
          icon: 'none',
          duration: 2000,
          success: function () {
            setTimeout(function () {
              wx.navigateTo({
                url: '/page/CaoCaoTravel/pages/Calling/Calling?order_sn=' + res.data.data.order_sn + '&cardImg=' + that.data.types[that.data.cardImgIndex].img + '&time=' + that.data.nextTime + '&start_name=' + that.data.currentLocation + '&end_name=' + that.data.Destination +'&ifWaiting=false'
              })
            }, 2000)
          }
        })
      }else {
        wx.showToast({
          title: res.data.msg || '',
          icon: 'none',
          duration: 2000
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 1)

  },
  
  // 车费预估
  FareEstimate:function(){
    wx.navigateTo({
      url: '/page/CaoCaoTravel/pages/FareEstimate/FareEstimate?content=' + JSON.stringify(this.data.cardInfor)
    })
  },
  // 手机号验证码  未登录跳转登录
  VerificationCode: function () {
    wx.navigateTo({
      url: '/page/Yuemall/pages/VerificationCode/VerificationCode'
    })
  },
  // 跳转大礼包
  gift(){
    wx.switchTab({
      url: '/page/EliteCard/EliteCard',
    })
  },

  // 切换汽车类型
  swichNav: function(e) {
    let that = this
    let cur = e.target.dataset.active;
    let item = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.index
    if (that.data.currentTab == cur) {
      return false;
    } else {
      that.setData({
        currentTab: cur,
        car_type:item.id,
        cardImgIndex: index
      })
    }
    that.estimatePriceWithDetail()
  },
  // 修改地点
  SearchPlace: function(e) {
    let that = this
    let {type} = e.currentTarget.dataset
    wx.navigateTo({
      url: '/page/CaoCaoTravel/pages/SearchPlace/SearchPlace?type=' + type + '&Destination=' + that.data.Destination + '&currentLocation=' + that.data.currentLocation
    })
  },
  // 切换预约时间
  swictab: function(e) {
    let that = this
    let {
      id
    } = e.currentTarget.dataset
    that.setData({
      curTab: id,
      order_type:e.currentTarget.dataset.item.id
    })
    if (that.data.Destination != '您要去哪儿') {
      that.estimatePriceWithDetail()
    }
  },
  
  // 获取城市编码
  getCityCode:function(){
    let that = this
    post('/travel/v1/queryCity', {
      lng: that.data.lng,
      lat: that.data.lat
    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          city_code: res.data.data.city_code
        })
        wx.setStorageSync('cityCode', res.data.data.city_code)
      } else {
        wx.showToast({
          title: res.data.msg || '',
          icon: 'none',
          duration: 2000
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 1)
  },
  Notice:function(){
    let that = this
    post('/travel/getMsg', {}, (res) => {
      if (res.data.code == 200) {
       console.log(res)
       that.setData({
         Notice:res.data.data
       })
      } else {
        wx.showToast({
          title: res.data.msg || '',
          icon: 'none',
          duration: 2000
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 1)
  },
  // 获取优惠券
  getCouponId: function () {
    let that = this
    post('/coupon/travel-index', {}, (res) => {
      if (res.data.code == 200) {
        console.log(res)
        if (res.data.data.mechanismId != ''){
          console.log(res.data.data.mechanismId)
          console.log(3333333)
          that.selectComponent("#couponPopup")._onOption(res.data.data.mechanismId)
        }
      } else {
        
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 1)
  },
  // 日期选择后
  changeDateTime1(e) {
    let that = this
    this.setData({
      dateTime1: e.detail.value
    });
    if (that.data.Destination != '您要去哪儿'){
      that.estimatePriceWithDetail()
    }
  },
  changeDateTimeColumn(e) {
    let that = this
    switch (e.detail.column) {
      case 0:
        if (e.detail.value != 0) {
          that.data.dateTimeArr[1] = dateTimePicker.getTime(1);
          that.data.dateTimeArr[2] = dateTimePicker.getTime(2);
        } else {
          that.data.dateTimeArr[1] = dateTimePicker.getCurrentTime(1);
          that.data.dateTimeArr[2] = dateTimePicker.getCurrentTime(2);
        }
        that.setData({
          index1: e.detail.value,
          dateTimeArr: that.data.dateTimeArr
        })
        break
      case 1:
        if (e.detail.value != 0 && that.data.index1 == 0) {
          that.data.dateTimeArr[2] = dateTimePicker.getTime(2);
        } else if (that.data.index1 == 0) {
          that.data.dateTimeArr[2] = dateTimePicker.getCurrentTime(2);
        }
        that.setData({
          index2: e.detail.value,
          dateTimeArr: that.data.dateTimeArr
        })

        break
      case 2:
        that.setData({
          index3: e.detail.value
        })
        break
    }
  },

  // 组装时间格式  yyyy-MM-dd HH:mm:ss
  timeFormat:function(){
    let month, day, hours, m
    let that = this
    month = that.data.dateTimeArr[0][that.data.index1].slice(0, that.data.dateTimeArr[0][that.data.index1].indexOf('月'))
    day = that.data.dateTimeArr[0][that.data.index1].slice(that.data.dateTimeArr[0][that.data.index1].indexOf('月') + 1, that.data.dateTimeArr[0][that.data.index1].indexOf('日'))
    hours = that.data.dateTimeArr[1][that.data.index2].slice(0, 2)
    m = that.data.dateTimeArr[2][that.data.index3].slice(0, 2)
    that.setData({
      departure_time: that.data.dateYear + '-' + month + '-' + day + ' ' + hours + ':' + m + ':' + '00',
      nextTime:  month + '月' + day + '日 ' + hours + ':' + m
    })
  },
 
  // 预估价格
  estimatePriceWithDetail:function(){
    let that = this
    let obj = {
      car_type: that.data.car_type,//服务车型：2 新能源；3 舒适型；4 豪华型；5 商务型
      city_code: that.data.city_code,//城市编码
      order_type: that.data.order_type,//订单类型 1实时单； 2预约订单；3接机单；4送机单；5日租；6半日租
      mid:wx.getStorageSync('uid'),
      start_name: that.data.currentLocation,//出发点名称(最多16个字)
      end_name: that.data.Destination,//目的地名称(最多16个字)
    }
    if (that.data.DesLocationStar) {
      obj.from_lng = that.data.DesLocationStar.split(",")[0],
      obj.from_lat = that.data.DesLocationStar.split(",")[1]
    } else {
      obj.from_lng = that.data.lng,
      obj.from_lat = that.data.lat
    }
    if (that.data.DesLocation){
      obj.to_lng = that.data.DesLocation.split(",")[0]
      obj.to_lat = that.data.DesLocation.split(",")[1]
    }
    // 预约
    that.timeFormat()
    if (that.data.order_type==2){
      obj.departure_time = that.data.departure_time
    }
    console.log(obj)
    // return
    post('/travel/v1/estimatePriceWithDetail', obj, (res) => {
      if (res.data.code == 200) {
        that.setData({
          cardInfor:res.data.data,
          //折扣
          Discount: (res.data.data.price / res.data.data.originPrice).toFixed(1)
        })
      } else if (res.data.code == 1001 || res.data.code == 1002) {
        that.setData({
          order_sn: res.data.data.order_sn,
          isVehicle:false
        })
        wx.showToast({
          title: res.data.msg || '',
          icon: 'none',
          duration: 2000,
          success:function(){
            setTimeout(function(){
              wx.navigateTo({
                url: '/page/CaoCaoTravel/pages/Calling/Calling?order_sn=' + res.data.data.order_sn + '&cardImg=' + that.data.types[that.data.cardImgIndex].img + '&time=' + that.data.nextTime + '&start_name=' + that.data.currentLocation + '&end_name=' + that.data.Destination
              })
            },2000)
          }
        })
      }
      else{
        wx.showToast({
          title: res.data.msg || '',
          icon: 'none',
          duration: 2000
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'),1)
  },
  // 呼叫专车
  Calling: function () {
    let that = this
    let obj ={
      to_lng: that.data.DesLocation.split(",")[0],
      to_lat: that.data.DesLocation.split(",")[1],
      car_type: that.data.car_type,//服务车型：2 新能源；3 舒适型；4 豪华型；5 商务型
      city_code: that.data.city_code,//城市编码
      order_type: that.data.order_type,//订单类型 1实时单； 2预约订单；3接机单；4送机单；5日租；6半日租
      mid: wx.getStorageSync('uid'),
      start_name: that.data.currentLocation,//出发点名称(最多16个字)
      end_name: that.data.Destination,//目的地名称(最多16个字)
      caller_phone: wx.getStorageSync('mobile'),//	必填	乘车人手机号
      order_sn: that.data.cardInfor.orderSn,//	必填	内部订单号
      order_lng: that.data.lng,//	必填	下单地经度
      order_lat: that.data.lat,//	必填	下单地纬度
    }
    if (that.data.DesLocationStar){
      obj.from_lng = that.data.DesLocationStar.split(",")[0],
      obj.from_lat = that.data.DesLocationStar.split(",")[1]
    }else{
      obj.from_lng = that.data.lng,
      obj.from_lat = that.data.lat
    }
    // 预约
    that.timeFormat()
    if (that.data.order_type == 2) {
      obj.departure_time = that.data.departure_time
    }
    console.log(obj)
    post('/travel/v1/orderCar', obj, (res) => {
      if (res.data.code == 200) {
        wx.navigateTo({
          url: '/page/CaoCaoTravel/pages/Calling/Calling?order_sn=' + res.data.data.order_sn + '&cardImg=' + that.data.types[that.data.cardImgIndex].img + '&time=' + that.data.nextTime + '&start_name=' + that.data.currentLocation + '&end_name=' + that.data.Destination
        })
      }
      else {
        wx.showToast({
          title: res.data.msg || '',
          icon: 'none',
          duration: 2000
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 1)
  }
})