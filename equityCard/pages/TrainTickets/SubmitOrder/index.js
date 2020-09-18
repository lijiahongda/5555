// equityCard/pages/TrainTickets/SubmitOrder/index.js
// import {
//   post,
//   get
// } from '../../../../utils/util.js'
// import {
//   stationsQuery,
//   stationsQueryStop,
//   orderCheckStatus,
//   orderCreate
// } from '../../../../api/train.js';
var app=getApp()
import request from '../../../../utils/util'
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
      "name": "确认订单",
      "nameImg": '',
      "name2": '',
      "nameImgW": '',
      "nameImgH": '',
      "nameMg": ''
    },
    lister:[],
    ids:0,
    sitType:'',
    sitids:'',
    sitname:'',
    show: true,
    loadingHidden:false,
    count:0,
    timer:'',
    zuoweishow:false,
    hour: 0,
    minute: 0,
    second: 0,
    timecount: '00:00:00',
    cost: 0,
    flag: 1,
    endtime: "",
    showloading:false
  },
  start: function () {
    let that = this;
    console.log(1234)
    that.setData({
      hour: 0,
      minute: 0,
      second: 0,
    })
    var init = setInterval(function () {
      that.timers()
    }, 1000);
  },
  timers: function () {
    let that = this;
    that.setData({
      second: that.data.second + 1
    })
    if (that.data.second >= 60) {
      that.setData({
        second: 0,
        minute: that.data.minute + 1
      })
    }
    if (that.data.minute >= 60) {
      that.setData({
        minute: 0,
        hour: that.data.hour + 1
      })
    }
    that.setData({
      timecount: that.data.hour + ":" + that.data.minute + ":" + that.data.second
    })
  },
  getList() {
    let that = this
    that.setData({
      loadingHidden: true
    })
    let data = {
      From:that.data.startCity,
      To: that.data.endCity,
      DepartDate: that.data.date.date,
      TrainNo: that.data.trainNo
    }
    console.log(that.data.startCity, that.data.endCity)
    request._post(this.data.serverSuit +'/train/stations/query',data,res=>{
      if (res.data.code == 200) {
        if (res.data.data[0].Seats[0].SeatName == '二等座') {
          var sitType = 0
        }
        that.setData({
          pessengelist: res.data.data[0],
          sitType: sitType,
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
    // post('/train/stations/query', data, (res) => {
    //   console.log(res)
      
    // }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 5);
  },
  // 删除乘客
  delperson:function(e){
    let that=this
    console.log(e)
    let lister=that.data.lister
    let item=e.currentTarget.dataset.id
    let index=e.currentTarget.dataset.index
    lister.filter(res=>{
     if(res.data.id==item){
       lister.splice(index,1)
     }
    })
    that.setData({
      lister:lister
    })
  },
  // 选择票席
  chooseSit:function(e){
    let that=this
    let sites=e.currentTarget.dataset.name
    if(sites=='二等座'){
      var sitType = 0
      var sitname ='二等座'
      that.setData({
        zuoweishow:true
      })
    } else if (sites == '一等座'){
      var sitType = 1
      var sitname = '一等座'
      that.setData({
        zuoweishow: true
      })
    } else if (sites == '特等座') {
      var sitType = 2
      var sitname = '特等座'
    } else if (sites == '商务座') {
      var sitType = 3
      var sitname = '商务座'
      that.setData({
        zuoweishow: true
      })
    } else if (sites == '无座') {
      var sitType = 4
      var sitname = '无座'
    } else if (sites == '硬座') {
      var sitType = 5
      var sitname = '硬座'
    } else if (sites == '软座') {
      var sitType = 6
      var sitname = '软座'
    } else if (sites == '硬卧') {
      var sitType = 7
      var sitname = '硬卧'
    } else if (sites == '软卧') {
      var sitType = 8
      var sitname = '软卧'
    } else if (sites == '高级软卧') {
      var sitType = 9
      var sitname = '高级软卧'
    } else if (sites == '火车其他座') {
      var sitType = 10
      var sitname = '火车其他座'
    }
    that.setData({
      idx: e.currentTarget.dataset.index,
      sitType:sitType,
      sitname:sitname,
      price:e.currentTarget.dataset.price
    })
    console.log(that.data.sitType)
  },
  // 选择座位
  choosesiter:function(e){
    let that=this
    if(that.data.sitType==0){
      if(e.currentTarget.dataset.sit=='a'){
        var sitids = '2A'
      } else if(e.currentTarget.dataset.sit=='b'){
        var sitids = '2B'
      } else if (e.currentTarget.dataset.sit == 'c') {
        var sitids = '2C'
      } else if (e.currentTarget.dataset.sit == 'd') {
        var sitids = '2D'
      } else if (e.currentTarget.dataset.sit == 'f') {
        var sitids = '2F'
      }
    }else if(that.data.sitType==1){
      if (e.currentTarget.dataset.sit == 'a') {
        var sitids = '1A'
      } else if (e.currentTarget.dataset.sit == 'c') {
        var sitids = '1C'
      } else if (e.currentTarget.dataset.sit == 'd') {
        var sitids = '1D'
      } else if (e.currentTarget.dataset.sit == 'f') {
        var sitids = '1F'
      }
    }else{
      var sitids=''
    }
    that.setData({
      ids:e.currentTarget.dataset.sit,
      sitids:sitids
    })
  },
  // 选择乘客
  chooseper:function(){
    wx.navigateTo({
      url: '/page/TrainTickets/pages/ChoosePassenger/ChoosePassenger',
    })
  },
  setintel(orderSn){
    this.data.count+=1
    this.setData({
      showloading:true,
      count:this.data.count
    })
    console.log(this.data.count)
    let data={
      orderSn:orderSn
    }
    if(this.data.count==4){
      clearInterval(this.data.timer)
    }
    var token=wx.getStorageSync('token')
    var uid=wx.getStorageSync('memberId')

    request._post(this.data.serverSuit +'/train/order/checkStatus',data,res=>{
      if (res.data.code == 200) {
        wx.showToast({
          title: res.data.msg,
          icon: 'success'
        })
        wx.redirectTo({
          url: '/page/TrainTickets/pages/Ordercommit/Ordercommit?orderSn=' + orderSn,
        })
      } else {
        if (this.data.count == 4) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '/page/TrainTickets/pages/TrainOrder/TrainOrder',
            })
          }, 2000)
        }
      }
    })
    // orderCheckStatus(data).then(res=>{
      
    // })
    // post('/tripTrain/order/checkStatus', data, (res) => {
    //   console.log(res)
      
    // }, 1, token, true, uid, 6)
  },
  // 改签获取乘客信息
  getpessenger(){
    let data={
      orderSnSon: "13115755621324404"
    }
    request._post(this.data.serverSuit +'/tripTrain/order/recheduleTicket',data,res=>{
      if (res.data.code == 200) {
        this.setData({
          listpess:res.data.data
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })

    // post('/tripTrain/order/recheduleTicket', data, (res) => {
    //   console.log(res)
      
    // }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 6)
  },

  initdata2(data){
    let that=this
    that.setData({
      showloading:true
    })
    that.start()
    var token=wx.getStorageSync('token')
    var uid=wx.getStorageSync('memberId')

    request._post(this.data.serverSuit +'/train/order/create',data,res=>{
      if (res.data.code == 200) {
        that.setData({
          orderSn: res.data.orderSn
        })
        that.data.timer = setTimeout(() => {
          that.setintel(that.data.orderSn)
        }, 2000)
        if (that.data.count == 4) {
          clearInterval(that.data.timer)
        }
      } else if (res.data.code == 400) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
    // orderCreate(data).then(res=>{
      
    // })
    // post('/tripTrain/order/create', data, (res) => {
    //   console.log(res)
      
    // }, 1, token, true, uid, 6)
  },
  // 提交订单，跳到确认订单也
  submitorder:function(e){
    let that=this
    let infos=e.currentTarget.dataset.info
    let changeType=app.globalData.changeType
    if (that.data.lister==''){
      wx.showToast({
        title: '请选择乘客',
        icon: 'none'
      })
    }else if(that.data.sitType===''){
        wx.showToast({
          title: '座位类型不能为空',
          icon:'none'
        })
    }else{
      if (changeType) {
       var refererOrderNo = app.globalData.refererOrderNo
        var price = that.data.lister.length * that.data.price
        let data = {
          depStation: that.data.startCity,//出发站
          arrStation: that.data.endCity,//到达站
          depDate: that.data.date.date,//出发日期
          trainNo: that.data.trainNo,//车次号
          startTime: that.data.pessengelist.StartTime,
          arrivalTime: that.data.pessengelist.ArriveTime,
          durTime: that.data.pessengelist.DurationMinutes,
          contactName: that.data.listpess.truename,//联系人姓名
          contactTel: that.data.listpess.mobile,//联系人电话
          passengerNumber: that.data.listpess.length,//乘客人数
          isInsurance: 1,//是否有保险
          chooseSeats: [that.data.listpess.id],//选座信息
          passengerId: passengerId,//乘客ID
          seatType: that.data.sitType,//座位类型
          price: price,//价格
          refererOrderNo:refererOrderNo
        }
        that.initdata2(data)
        console.log(data)
      }else{
        var price = that.data.lister.length * that.data.price
        let data = {
          depStation: that.data.startCity,//出发站
          arrStation: that.data.endCity,//到达站
          depDate: that.data.date.date,//出发日期
          trainNo: that.data.trainNo,//车次号
          startTime: that.data.pessengelist.StartTime,
          arrivalTime: that.data.pessengelist.ArriveTime,
          durTime: that.data.pessengelist.DurationMinutes,
          contactName: that.data.lister[0].truename,//联系人姓名
          contactTel: that.data.lister[0].mobile,//联系人电话
          passengerNumber: that.data.lister.length,//乘客人数
          isInsurance: 1,//是否有保险
          chooseSeats: that.data.sitids,//选座信息
          passengerId: that.data.listid,//乘客ID
          seatType: that.data.sitType,//座位类型
          price: price//价格
        }
        that.initdata2(data)
      }
    }
  },
  // 选择日期
  choosedate:function(){
    let params = app.globalData.params
    // wx.navigateTo({
    //   url: '/equityCard/pages/TrainTickets/calendar/index?params=' + JSON.stringify(params)
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    var params = app.globalData.params
    console.log(params)
      that.setData({
        trainNo: app.globalData.trainNo,
        startCity: app.globalData.startCity,
        endCity: app.globalData.endCity,
        date:params.date?params.date:''
    })
      console.log(that.data.date,that.data.date.day)
      that.getList()  
      var changeType=app.globalData.changeType
      if(changeType){
        that.getpessenger()
        that.setData({
          changeType:changeType
        })
      }
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
    this.timer = setInterval(() => {
      this.setData({
        show: !this.data.show
      })
    }, 2000)
    let listid = []
    let lister=this.data.lister
    for (var i = 0; i < lister.length; i++) {
      listid.push(lister[i].id)
    }
    this.setData({
      listid: listid
    })
    console.log(this.data.listid)
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