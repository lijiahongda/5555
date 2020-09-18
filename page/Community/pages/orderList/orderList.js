import {ajaxStallOrderList,ajaxMyBuyOrderList} from '../../../../api/Community'


const app = getApp()

const date = new Date()
const years = []
const months = []
const days = []

for (let i = 2013; i <= date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i)
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusObj:{
      date:1
    },
    alltime:"",
    years,
    year: date.getFullYear(),
    months,
    month: '',
    days,
    day: '',
    value: [9999, 1, 1],
    isDaytime: true,
    tabDataIndex:0,
    orderTabDataIndex:0,
    StallListData:[],
    BuyListData:[],
    StallParams:{
      memberId:wx.getStorageSync('memberId'),
      startTime:'',//开始时间
      endTime:'',//截止时间
      page:1,
      pageNum:10

      // startTime:0,
      // endTime:0,
      // orderType:0,
    },
    buyParamas:{
      memberId:wx.getStorageSync('memberId'),
      startTime:0,
      endTime:0,
      orderType:0,
      page:1,
      pageSize:10
    },
    tabData:[
      {
        name:"我的推广",
        id:0
      },
      {
        name:"我购买的",
        id:1
      }
    ],
    orderTabData:[
      {
        name:"全部",
        id:0,
        status:0
      },
      {
        name:"待付款",
        id:1,
        status:1
      },
      {
        name:"已付款",
        id:2,
        status:2
      },
      {
        name:"已完成",
        id:3,
        status:3
      },
       {
        name:"失效",
        id:4,
        status:4
      },
    ]
  },
  handleCopy(e){
    let {ordersn}  = e.currentTarget.dataset;
    wx.setClipboardData({
      data: new String(ordersn),
      success(res) {
        wx.getClipboardData({
          success(res) { }
        })
      },
      complete(res) { }
    })
  },
  bindDateTimeChange(e) {
    //picker 滑动切换时间事件
    const val = e.detail.value
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
      day: this.data.days[val[2]],
      isDaytime: !val[3]
    })
  },
  handleHideMc(){
    //隐藏蒙层点击事件
    this.setData({
      "statusObj.date":1
    })
  },
  handleTrueDate(){
    //选择日期确认事件
    console.log();
    this.setData({
      "statusObj.date":1
    })

    // let _timeStr = this.data.year +"/"+this.data.month+"/"+this.data.day;
    let _timeStr = this.data.year +"/"+this.data.month;
    this.setData({
      alltime:_timeStr,
    })
    if(this.data.tabDataIndex == 0){
      //我推广的
      this.setData({
        "StallParams.startTime": this.getMonthStartEndTime(this.data.year,this.data.month - 1,1),
        "StallParams.endTime": this.getMonthStartEndTime(this.data.year,this.data.month - 1)
      })
    }else{
      //我购买的
      this.setData({
        "buyParamas.startTime": this.getMonthStartEndTime(this.data.year,this.data.month - 1,1),
        "buyParamas.endTime": this.getMonthStartEndTime(this.data.year,this.data.month - 1)
      })
    }

    console.log("日期",_timeStr);
    this.initParams();
  },
  handleChooseDate(){
    //下单时间时间选择事件
    this.setData({
      "statusObj.date":0
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
   initTime(){
    let d = new Date();
    let month = d.getMonth();
    let year_index = (this.data.years.length) * 1 - 1;
    let day =d.getDate() - 1;
    this.setData({
      month,
      day,
      month:month * 1 + 1,
      value:[year_index,month,day],
      selectIndex:[year_index,month,day],
    })
   },
   handleTabMy(e){
     let {id} =  e.currentTarget.dataset;
      this.setData({
        tabDataIndex:id
      })
      this.setData({
        alltime:''
      })
      this.initParams();
   },
   handleTabOrderStaus(e){
    console.log(e);
    let {id,status} =  e.currentTarget.dataset;
      this.setData({
        orderTabDataIndex:id,
        BuyListData:[],
        "buyParamas.orderType":status,
        "buyParamas.page":1
      })
      this.getMyOrderList();
  },
  // 我购买的
  getMyOrderList(){
    wx.showLoading({
      title:'努力加载中',
      mask: true
    });
    let params  = this.data.buyParamas;
    ajaxMyBuyOrderList(params).then(res=>{
      if(res.code == 200){
        let data = this.data.BuyListData.concat(res.data.lists);
        this.setData({
          BuyListData:data
        })
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });
      }
      wx.hideLoading();
    })
  },
  initParams(){
    //重新初始化请求参数 并重新请求
    if(this.data.tabDataIndex == 0){
      this.setData({
        StallListData:[],
        "StallParams.page":1
      })
      this.getStallOrderList();
    }else{
      this.setData({
        BuyListData:[],
        "buyParamas.page":1
      })
      this.getMyOrderList();
    }
  },
  getStallOrderList(){
    //我推广的
    wx.showLoading({
      title:'努力加载中',
      mask: true
    });
    let params  = this.data.StallParams;
    ajaxStallOrderList(params).then(res=>{
      if(res.code == 200){
        let data = this.data.StallListData.concat(res.data.lists);
        this.setData({
          StallListData:data
        })
      }else{
        wx.wx.showToast({
          title: res.msg,
          icon: 'none'
        });
      }
      wx.hideLoading();
    })
  },


  getMonthStartEndTime(nowYear,nowMonth,status){

    //本月的开始时间
    
    var monthStartDate = new Date(nowYear, nowMonth, 1); 
    //本月的结束时间
    var monthEndDate = new Date(nowYear, nowMonth+1, 0);


    var YMDHMS = monthStartDate.getFullYear() + "-" +(monthStartDate.getMonth()+1) + "-" + monthStartDate.getDate() 
    var EMDHMS = monthEndDate.getFullYear() + "-" +(monthEndDate.getMonth()+1) + "-" + monthEndDate.getDate() 


      console.log("开始时间",YMDHMS);
      console.log("结束时间",EMDHMS);
      var timeStar= YMDHMS+" 00:00:00";
      var timeEnd=EMDHMS+" 00:00:00";



    return  status == 1 ? timeStar:timeEnd


  },


  onLoad: function(options) {
    this.initTime();
    this.getStallOrderList();
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
    console.log("到底");

    if(this.data.tabDataIndex == 0){
      //我推广的
      let page = this.data.StallParams.page + 1;
      this.setData({
        "StallParams.page":page
      })
      wx.showLoading({});
      this.getStallOrderList();
    }else{
      //我购买的
      let page = this.data.buyParamas.page + 1;
      this.setData({
        "buyParamas.page":page
      })
      wx.showLoading({});
      this.getMyOrderList();
    }
  },

});