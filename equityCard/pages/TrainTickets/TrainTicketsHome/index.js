// equityCard/pages/TrainTickets/TrainTicketsHome/index.js

// import {
//   banner,
//   queryTips
// } from '../../../../api/train.js';


var app = getApp()
import request from '../../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverSuit: app.serverTrain(),
    banner: ['https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2019-12-12/11/yuelvhuiM5anCNr1xO1576122287.jpg'],
    startCity:  '北京',
    endCity:'上海',
    cityType:0,
    selectedDay:'',
    showtotal: false,
    showModal:false,
    subName: "今天"
  },
  // 重置app.globalData的内容
  resverapp(){
    app.globalData={
      historyCity: '',
      change: {
        startCity: '',
        endCity: '',
        trainNo: '',
        params: {}
      },
      changeType: false,
      /*=======以下参数需要你在改签过程中记录========== */
      //改签需要的参数,目前我写的是默认值,请动态直接覆盖 changeTicket 对象就可以
      changeTicket: {
        depStation: "", //出发站
        arrStation: "", //到达站
        depDate: "",//出发日期
        trainNo: "", //车次号
        contactName: "", //联系人姓名
        contactTel: "", //联系人电话
        passengerNumber: "", //乘客数量
        isInsurance: "", //是否购买保险 目前没有保险 所以写死为 0
        chooseSeats: "",//在线选座
        passengerId: [], // 乘客id 有几个乘客 就有几个ID
        seatType: "", //座位类型
        price: "", //价格
      },
      /*=========以上参数需要你在改签过程中记录============= */
      refererOrderNo: ""
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    // that.resverapp()
    if(options.startCity){
      that.setData({
        startCity:options.startCity,
        endCity:options.endCity
      })
    }
    console.log(that.data.startCity)
    that.getToDay()
    that.getbanner()
    that.timetan()
  },
  devCity:function(){
    let that=this
    that.setData({
      cityType:0
    })
    console.log(that.data.cityType)
    wx.navigateTo({
      url: '/equityCard/pages/TrainTickets/selectCity/index?cityType='+that.data.cityType,
    })
  },
  getbanner(){
    request._post(this.data.serverSuit +'/train/banner','',res=>{
      console.log(res)
      if (res.data.code === 200) {
        console.log(res)
        this.setData({
          banner: res.data.data
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
    // banner({}).then(res=>{
      
    // })
    // post('/tripTrain/banner', {}, (res) => {
    //   console.log(res)
      
    // }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 6)
  },
  arrCity: function () {
    let that = this
    that.setData({
      cityType: 1
    })
    console.log(that.data.cityType)
    wx.navigateTo({
      url: '/equityCard/pages/TrainTickets/selectCity/index?cityType=' + that.data.cityType,
    })
  },
  // 切换城市
  replace:function(){
    let that = this
    let startCity = that.data.startCity
    let endCity = that.data.endCity
    let c = ''
    
    c = startCity
    startCity = endCity
    endCity = c

    that.setData({
      startCity: startCity,
      endCity: endCity,
    })
  },
  timetan(){
    request._post(this.data.serverSuit +'/train/queryTips','',res=>{
      console.log(res)
      if (res.data.code == 200) {
        this.setData({
          showModal: true,
          tiptime: res.data.data
        })
      } else {
        this.setData({
          showModal: false
        })
      }
    })
    // queryTips({}).then(res=>{
      
    // })
    // post('/tripTrain/queryTips',{},(res)=>{
      
    // }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 6)
  },
  // 查询车票
  queryTicket: function () {
    let that = this
    wx.setStorage({
      key: 'hisstartcity',
      data: that.data.startCity,
    })
    wx.setStorage({
      key: 'hisendcity',
      data: that.data.endCity,
    })
    that.setData({
      historyCity: wx.getStorageSync('hisstartcity') + '-' + wx.getStorageSync('hisendcity')
    })
    let date = this.data.selectedDay
    let params = {
      date: this.data.selectedDay
    }
    wx.navigateTo({
      url: '/equityCard/pages/TrainTickets/vehicleSelect/vehicleSelect?params=' + JSON.stringify(params)+'&startCity='+that.data.startCity+'&endCity='+that.data.endCity
    })
  },
  // 日历选择
  date:function(){
    let date = this.data.selectedDay
    let params = {
      date,
    }
    wx.navigateTo({
      url: '/equityCard/pages/TrainTickets/calendar/index?params='+JSON.stringify(params)
    })
  },
  getToDay() {
    let that=this
    let myDate = new Date()
    let year = myDate.getFullYear()
    let month = myDate.getMonth() + 1
    let day = myDate.getDate()
    
    var days = ["周日","周一", "周二", "周三", "周四", "周五", "周六"];
    let monday = days[myDate.getDay()]
    console.log(monday)
    let selectedDay = {
      date: year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day),
      year,
      month: month < 10 ? ("0" + month) : month,
      day: day < 10 ? ("0" + day) : day,
      monday:monday
    }
    this.setData({ selectedDay, subName: "今天" })
  },
  // 清空历史记录
  clearHistory:function(){
    this.setData({
      historyCity: ''
    })
  },
  quxiao(){
    this.setData({
      showModal:false
    })
  },
  queding() {
    this.setData({
      showModal: false
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 查询历史记录
  subhistory(){
    let params = {
      date: this.data.selectedDay
    }
    wx.navigateTo({
      url: '/equityCard/pages/TrainTickets/vehicleSelect/vehicleSelect?params=' + JSON.stringify(params) + '&startCity=' + wx.getStorageSync('hisstartcity') + '&endCity=' + wx.getStorageSync('hisendcity')
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      startCity: wx.getStorageSync('devCity') ? wx.getStorageSync('devCity') : this.data.startCity,
      endCity: wx.getStorageSync('arrCity') ? wx.getStorageSync('arrCity') : this.data.endCity,
      // dates:data
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