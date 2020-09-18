// equityCard/pages/TrainTickets/vehicleSelect/vehicleSelect.js
// import {
//   stationsQuery,
//   stationsQueryStop
// } from '../../../../api/train.js';
import request from '../../../../utils/util'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverSuit: app.serverTrain(),
    aa: {
      "bg_color": "linear-gradient(0deg,rgba(252,68,71,1) 0%,rgba(247,48,55,1) 100%)",
      "color": "#fff",
      "flag": 1,
      "name": "北京",
      "nameImg": 'https://image.yuelvhui.com/pubfile/2019/11/24/line_1574587154_74175.png',
      "name2": '哈尔滨',
      "nameImgW": '35rpx',
      "nameImgH": '28rpx',
      "nameMg": '0 20rpx'
    },
    list: [],
    moreStatus: false,
    isHaveMore: true,
    page: 1,
    pageSize: 10,
    endCity: '',
    date: '',
    fromCity: "",
    toCity: "",
    loadingHidden: false
  },

  initData: function(date) {
    let that = this
    let data = {}
    data = {
      From: that.data.fromCity,
      To: that.data.toCity,
      TrainNo: '',
      DepartDate: date,
      page: 1,
      pageSize: that.data.pageSize
    }
    console.log(data)
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    request._post(this.data.serverSuit +'/train/stations/query',data,res=>{
      console.log(res)
      if (res.data.code == 200) {
        wx.hideLoading()
        let seats = res.data.data.filter(item => {
          item.moreStatus = false
          that.setData({
            trainList: res.data.data,
            loadingHidden: false
          })
        })
        if (res.data.data == '') {
          that.setData({
            trainList: []
          })
        }
        that.setData({
          loadingHidden: false
        })
      } else if (res.data.code == 400) {
        wx.showToast({
          title: res.data.msg,
          icon: "none"
        });
      }
    })


    // stationsQuery(data).then(res=>{
      
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    let that = this
    let changeType = app.globalData.changeType
    if (options.params) {
      let aa = that.data.aa
      let params = JSON.parse(options.params)
      console.log(params)

      aa.name = options.startCity
      aa.name2 = options.endCity

      that.setData({
        aa: that.data.aa,
        date: params.date.date,
        selectedDay: params.date,
        params: params,
        fromCity: options.startCity,
        toCity: options.endCity
      })
      console.log(that.data)
    } else if (changeType) {
      let aa = that.data.aa
      let params = app.globalData.params
      console.log(params)

      aa.name = app.globalData.startCity
      aa.name2 = app.globalData.endCity + "(改签)"
      that.setData({
        aa: that.data.aa,
        date: params.date.date,
        selectedDay: params.date,
        params: params,
        fromCity: app.globalData.startCity,
        toCity: app.globalData.endCity
      })
    }

    // that.initData(that.data.date)
    console.log(that.data.aa, 'sss')
  },
  mores: function(e) {
    let that = this
    that.setData({
      loadingHidden: true
    })
    console.log(e)
    console.log(that.data.trainList[e.currentTarget.dataset.index].moreStatus)
    that.data.trainList[e.currentTarget.dataset.index].moreStatus = !that.data.trainList[e.currentTarget.dataset.index].moreStatus
    for (var i = 0; i < that.data.trainList.length; i++) {
      if (i != e.currentTarget.dataset.index) {
        that.data.trainList[i].moreStatus = false
      }
    }
    that.setData({
      trainList: that.data.trainList
    })
    if (that.data.trainList[e.currentTarget.dataset.index].moreStatus = true) {
      let trainNo = e.currentTarget.dataset.traino
      console.log(trainNo)
      let data = {
        TrainNo: trainNo,
        DepartDate: that.data.date
      }
      request._post(this.data.serverSuit +'/train/stations/queryStop',data,res=>{
        if (res.data.code == 200) {
          console.log(res)
          that.setData({
            stopStation: res.data.data,
            loadingHidden: false
          })
        } else if (res.data.code == 400) {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          });
        }
      })
      // stationsQueryStop(data).then(res => {
        
      // })
      // post('/train/stations/queryStop', data, (res) => {
      // }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 5);
    }

  },
  // 选择日期
  datechoose() {
    var params = this.data.params
    console.log(params)
    wx.navigateTo({
      url: '/equityCard/pages/TrainTickets/calendar/index?params=' + JSON.stringify(params)
    })
  },
  // 进入确认订单
  ordersub: function(e) {
    if (wx.getStorageSync('memberId')) {
      console.log('已绑定')

      let that = this
      console.log(e)
      
      app.globalData.trainNo = e.currentTarget.dataset.traino
      app.globalData.startCity = e.currentTarget.dataset.startcity
      app.globalData.endCity = e.currentTarget.dataset.endcity
      app.globalData.params = {
        date: that.data.selectedDay
      }
      console.log(app.globalData.params)
      wx.navigateTo({
        url: '/equityCard/pages/TrainTickets/SubmitOrder/index'
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }
  },
  // 前一天
  delday() {
    let that = this
    let delday = that.data.selectedDay.date
    var d = new Date(delday);
    console.log(d)
    let selectedDay = d.setTime(d.getTime() - 24 * 60 * 60 * 1000);
    console.log(selectedDay)
    var datedel = new Date(selectedDay); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = datedel.getFullYear();
    let M = datedel.getMonth() + 1;
    let D = datedel.getDate();
    var days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    let monday = days[datedel.getDay()]
    console.log(monday)
    // h = date.getHours() + ':';
    // m = date.getMinutes() + ':';
    // s = date.getSeconds();
    let date = {
      date: Y + "-" + (M < 10 ? "0" + M : M) + "-" + (D < 10 ? "0" + D : D),
      year: Y,
      month: M < 10 ? ("0" + M) : M,
      day: D < 10 ? ("0" + D) : D,
      monday: monday
    }
    let params = {
      date
    }
    that.setData({
      selectedDay: date,
      date: date.date,
      params,
    })
    console.log(date)
    that.initData(that.data.selectedDay.date)
  },
  // 后一天
  addday() {
    let that = this
    let delday = that.data.selectedDay.date
    var d = new Date(delday);
    console.log(d)
    let selectedDay = d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
    console.log(selectedDay)
    var datedel = new Date(selectedDay); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = datedel.getFullYear();
    let M = datedel.getMonth() + 1;
    let D = datedel.getDate();
    var days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    let monday = days[datedel.getDay()]
    // h = date.getHours() + ':';
    // m = date.getMinutes() + ':';
    // s = date.getSeconds();
    let date = {
      date: Y + "-" + (M < 10 ? "0" + M : M) + "-" + (D < 10 ? "0" + D : D),
      year: Y,
      month: M < 10 ? ("0" + M) : M,
      day: D < 10 ? ("0" + D) : D,
      monday: monday
    }
    let params = {
      date
    }
    that.setData({
      selectedDay: date,
      date: date.date,
      params,
    })
    console.log(date)
    that.initData(that.data.selectedDay.date)
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
    this.initData(this.data.selectedDay.date)
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
    let that = this,
      data = {
        From: that.data.startCity,
        To: that.data.endCity,
        DepartDate: that.data.date,
        TrainNo: '',
        page: that.data.page,
        pageSize: that.data.pageSize
      }
    that.data.page += 1
    request._post(this.data.serverSuit +'/train/stations/query',data,res=>{
      if (res.data.code == 200) {
        let seats = res.data.data.filter(item => {
          item.moreStatus = false
          that.setData({
            trainList: that.data.data.trainList.concat(res.data.data)
          })
        })
      } else {
        wx.showToast({
          title: '没有更多了！',
          icon: 'none'
        })
      }
    })
    // stationsQuery().then(res => {
      
    // })
    // post('/train/stations/query', data, (res) => {

    // }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 5)



  },
})