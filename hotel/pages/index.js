//index.js
//获取应用实例
import {
  parseTime,
  getDays,
  getWeek
} from "../../utils/time"
import {
  getLocalTime
} from "../../utils/mytime"



import {
  hotelDetail,
  hotelBookingList,
  hotelShare,
  planDetail,
  collectList,
  collectSave,
  collectCancel,
  hotelHomeCard,
  hotShopList
} from '../../api/hotel'



const app = getApp()
var WxParse = require('../../components/wxParse/wxParse.js');
// WxParse.wxParse('article', 'html', article, that, 5);

Page({
  data: {
    shareData: "",
    query: "",
    num: 1,
    sdate: "", //开始时间
    edate: "", //结束时间
    sdateText: "", //开始时间显示日期
    edateText: "", //结束时间显示日期
    sdateLabel: "今天", //默认今天
    edateLabel: "明天1", //默认明天
    roomnum: 1,
    hotelinfo: {
      comment: {},
      facilities: [],
      bookingConfig: {}
    },
    romfliterData: "",
    roomLabel: [],
    dealerId: wx.getStorageSync('dealerId'), //酒店id
    calendarConfig: {
      // 配置内置主题
      theme: 'elegant'
    },
    isSelectTime: false,

    bannerImg: [],
    roomData: "",
    id: "", //商品id
    fxImg: "",
    openTime: "",
    lastTime: "",
    // top: false,
    shoucang: true,
    isShow: false, // 显示酒店详情
    roomDetailInfo: {}, // 显示酒店详情的信息
    accessMember: false,

    detailTarget: {},
    isIphoneX: false,
    tabs: [{
        name: '酒店房型',
        id: 1,
        tips: ''
      },
      {
        name: '会员中心',
        id: 2,
        tips: ''
      },
      {
        name: '热卖商品',
        id: 3,
        tips: ''
      },
      {
        name: '酒店介绍',
        id: 4,
        tips: ''
      }
    ],
    tabAct: 1, //tab选择后
    shopList: [],
    memberId: wx.getStorageSync('memberId'),
    roomList: [], //rp列表
  },
  // 到顶部的高度
  setNavSize: function () {
    var that = this,
      sysinfo = wx.getSystemInfoSync(),
      statusHeight = sysinfo.statusBarHeight,
      isiOS = sysinfo.system.indexOf('iOS') > -1,
      isIphoneX = false,
      navHeight;
    if (!isiOS) {
      navHeight = 48;
    } else {
      navHeight = 44;
    }
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.model.length, 'res.model.length')
        let model = res.model.substr(0, 8)
        console.log(model, 'model')
        if (model == "iPhone X") {
          navHeight = 44
          isIphoneX = true
        }
      }
    })

    that.setData({
      status: statusHeight,
      navHeight: navHeight,
      isIphoneX: isIphoneX
    })



  },

  tab(e) {
    this.setData({
      tabAct: e.currentTarget.dataset.id
    })
  },
  call() {
    wx.makePhoneCall({
      phoneNumber: this.data.roomDetail.phone
    })
  },
  getDetail() {
    let that = this;
    hotelDetail({
      hotelId: wx.getStorageSync('dealerId'), //酒店id
      arrivalDate: that.data.arrivalDate, //入住时间  2020-09-27
      departureDate: that.data.departureDate, //入住时间  2020-09-27
      lng: wx.getStorageSync('longitude'),
      lat: wx.getStorageSync('latitude'),
      memberId: that.data.memberId
    }).then(res => {
      console.log("房间数据", res.data.hotels);

      let ratePlan = res.data.hotels.ratePlan
      ratePlan.map(item => {
        item.showStatus = 0;
      })

      that.setData({
        roomData: res.data.hotels,
        roomDetail: res.data.hotels.detail, //基础数据
        roomList: ratePlan, //rp数据
      })
    }).catch(err => {

    })
  },
  // 会员中心
  getVipDetail() {
    let that = this
    hotelHomeCard({
      type: 1,
      dealer_id: wx.getStorageSync('dealerId'), //酒店id
    }).then(res => {
      that.data.tabs[1].tips = res.data.reduceTitle
      that.setData({
        vipDetail: res.data,
        tabs: that.data.tabs
      })

      console.log(res.data, 'res.datares.datares.datares.data')
    }).catch(err => {
      // console.log("错误信息", err);
    })
  },
  // 热卖商品
  getShop(){
    let that = this
    hotShopList({
      dealerId: wx.getStorageSync('dealerId'), //酒店id
    }).then(res => {
      that.setData({
        shopList: res.data,

      })
    }).catch(err => {
      // console.log("错误信息", err);
    })
  },

  // 房间详情
  roomDetail: function (e) {
    this.setData({
      isShow: true,
      roomDetailInfo:e.currentTarget.dataset.item
    })
  },

  // 关闭房间详情
  closeRoomDetail: function () {
    this.setData({
      isShow: false
    })
  },



  getShareData() {
    let that = this
    let params = {
      dealerId: wx.getStorageSync("dealerId"),
    };
    hotelShare(params).then(res => {
      that.setData({
        shareData: res.data
      })
    }).catch(err => {
      console.log("错误信息", err);
    })
  },




  // 选择日历的回调
  onLoadFun: function (e) {
    console.log(e,'选择后日期')

    this.calendar(e.detail.sTime,e.detail.eTime)
    // this.getDetail()
    
    return

    let d_Date = new Date(); //系统时间对象  
    let d_y = d_Date.getFullYear() //完整的年份,千万不要使用getYear,firfox不支持  
    let d_m = d_Date.getMonth() //注意获取的月份比实现的小1  
    let d_d = d_Date.getDate()
    let today = new Date(d_y, d_m, d_d)
    let sdate = parseTime(Date.parse(today), '{m}-{d}');
    console.log(sdate,'sdatesdatesdate')
    let checkInDate = e.detail.checkInDatattachede; //选择的开始时间
    let checkOutDate = e.detail.checkOutDate; //选择的开始时间
    let checkYear = e.detail.year;

    let sdateLabel;
    if (checkInDate == sdate) {
      sdateLabel = '今天'
    } else {
      sdateLabel = "周" + e.detail.Inweek
    }
    //判断是否是今天
    let checkInDateArr = checkInDate.split("-");
    let checkOutDateArr = checkOutDate.split("-");
    let parseSdateText = new Date(checkYear, checkInDateArr[0] * 1 - 1, checkInDateArr[1] * 1);
    let parseEdateText = new Date(checkYear, checkOutDateArr[0] * 1 - 1, checkOutDateArr[1] * 1);
    let sdate_ms = Date.parse(parseSdateText);
    let edate_ms = Date.parse(parseEdateText);

    let ss_Text = checkInDate.substr(0, 2) + "月" + checkInDate.substr(3, 2) + "日";
    let ee_Text = checkOutDate.substr(0, 2) + "月" + checkOutDate.substr(3, 2) + "日";
    this.setData({
      sdate: sdate_ms,
      edate: edate_ms,
      sdateText: ss_Text,
      edateText: ee_Text,
      sdateLabel: sdateLabel,
      roomnum: 1,
      edateLabel: "周" + e.detail.Ouweek
    })
    this.getDetail()
  },

  //选择日期点击事件
  handleChooseCalendar() {
    
    this.setData({
      isSelectTime: true
    })
  },

  // 关闭或显示开通会员
  switch (e) {
    console.log(e.detail.obj, '父组件switch')
    let obj = e.detail.obj
    this.setData({
      detailTarget: obj
    })
    if (this.data.isLevelState) { // 会员直接去购买
      this.handleBook()
    } else {
      this.setData({
        accessMember: !this.data.accessMember
      })
    }
  },

  handleBook() {
    let that = this
    let obj = that.data.detailTarget
    let roomTypeId = obj.roomTypeId,
      ratePlanId = obj.ratePlanId,
      sourceType = obj.sourceType,
      arrivalDate = that.data.arrivalDate,
      departureDate = that.data.departureDate,
      rpType = obj.rpType

    let url = '/hotel/pages/order/index?roomTypeId=' + roomTypeId + "&ratePlanId=" + ratePlanId + "&sourceType=" + sourceType + "&arrivalDate=" + arrivalDate + "&departureDate=" + departureDate +  "&rpType=" + rpType
    wx.navigateTo({
      url: url
    });
  },

  onShow() {
    let that = this;

    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let query = currentPage.options;

    that.setNavSize()
    console.log(query, "接受分享参数", query.dealerId)
    if (query.options) {
      wx.setStorageSync('inviteCode', query.options)
    }
    if (query.dealerId) {
      wx.setStorageSync('dealerId', query.dealerId)
      that.getShareData();
    }
    if (query.cpsCustomerId) {
      wx.setStorageSync('cpsCustomerId', query.cpsCustomerId)
    }
    if (!wx.getStorageSync('memberId')) {
      console.log("来room")
      wx.navigateTo({
        url: '/pages/login/index',
      })
    } else {
      app.getCustomerIds();
      that.getCollect();
      // getRouterUrl();
    }
    that.setData({
      isVip: wx.getStorageSync('isVip'),
      arrivalDate: '2020-09-10', //入住时间  2020-09-27
      departureDate: '2020-09-11', //入住时间  2020-09-27
    })
    wx.setStorageSync('arrivalDate', that.data.arrivalDate)
    wx.setStorageSync('departureDate', that.data.departureDate)

    app.isLevelState(function (isLevelState) {
      that.setData({
        isLevelState: isLevelState, //是否是会员
      })
    })

    // wx.showShareMenu({
    //   withShareTicket: true,
    //   menus: ['shareTimeline']
    // })

    

    that.calendar(that.data.arrivalDate,that.data.departureDate)
    that.getDetail(); //酒店房型 酒店介绍
    that.getVipDetail() //会员中心
    that.getShop()//热卖商品
  },

  // 初始化 日期
  calendar(sday,eday){
    let that = this
    let d_Date = new Date(); //系统时间对象  
    let sdateLabel,edateLabel
    
    let sdateText = sday
    let s_Text = sdateText.substr(5, 2) + "月" + sdateText.substr(8, 2) + "日"
    let edateText = eday
    let e_Text = edateText.substr(5, 2) + "月" + edateText.substr(8, 2) + "日"


    // 判断是否是今天
    if(parseTime(Date.parse(d_Date), "{y}-{m}-{d}") == sday){
      sdateLabel="今天"
    }
    else{
      sdateLabel=getWeek('周',sday)
    }

    // 判断是否是明天
    let tomorrow = d_Date.setTime(d_Date.getTime()+24*60*60*1000);
    tomorrow = new Date(tomorrow)
    if(parseTime(Date.parse(tomorrow), "{y}-{m}-{d}") == eday){
      edateLabel="明天"
    }else{
      edateLabel=getWeek('周',eday)
    }
    
    
    that.setData({
      dealerId: wx.getStorageSync('dealerId'),
      roomnum: 1,
      sdateText: s_Text,
      edateText: e_Text,
      sdateLabel:sdateLabel,
      edateLabel:edateLabel
    })
  },
  // 分享
  onShareAppMessage: function () {

    return {
      title: this.data.shareData.paperwork,
      path: "/hotel/pages/index?options=" + wx.getStorageSync('mYinviteCode') + "&dealerId=" + wx.getStorageSync('dealerId'),
      imageUrl: this.data.shareData.imgUrl,
    }
  },

  // getmYinviteCode() {
  //   wxRequest({
  //     method: "get",
  //     url: baseUrlObj.url+"/customer/member/detail"
  //   }).then(res => {
  //     console.log(res, "7.16获取邀请码")
  //   })
  // },
  onLoad(query) {

  },
  // 购买会员卡
  goButVip() {
    this.setData({
      accessMember: false
    })
    wx.navigateTo({
      url: '/my/pages/vipcard/index',
    })
  },
  // 点击显示地理位置
  getLocation() {
    let that = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        wx.openLocation({ //​使用微信内置地图查看位置。
          latitude: that.data.roomData.lat, //要去的纬度-地址
          longitude: that.data.roomData.lng, //要去的经度-地址
          name: that.data.roomData.dealerName,
          address: that.data.roomData.address
        })
      }
    })
  },
  // 去会员页面
  go_vip() {
    wx.navigateTo({
      url: '/my/pages/vipcard/index',
    })
  },
  // 去设施详情页面
  to_facilityDetail() {
    wx.navigateTo({
      url: '/hotel/pages/facilityDetail/index',
    })
  },
  //查询收藏
  getCollect() {
    let that = this;
    collectList({}).then(res => {
      res.data.forEach(function (item) {
        if (item.dealerId == that.data.dealerId) {
          console.log("已经收藏了")
          that.setData({
            shoucang: false
          })
        }
      })
    }).catch(err => {
      console.log("错误信息", err);

    })
  },
  //收藏
  sh_C() {
    let that = this;
    let dealerId = wx.getStorageSync('dealerId')
    collectSave({
      dealerId: dealerId //酒店id
    }).then(res => {
      that.setData({
        shoucang: false
      })
    }).catch(err => {
      console.log("错误信息", err);

    })
  },
  //取消收藏
  qx_C() {
    let that = this;
    let dealerId = wx.getStorageSync('dealerId')
    collectCancel({
      dealerIds: dealerId //酒店id
    }).then(res => {
      that.setData({
        shoucang: true
      })
    }).catch(err => {
      console.log("错误信息", err);

    })
  }
})