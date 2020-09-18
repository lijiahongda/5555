// page/HotelOther/pages/HotelDetail/HotelDetail.js
var Moment = require("../../../../utils/moment.js");
const app = getApp()
import {
  zdAppletHotelDetail,
  collect,
  stateCollect,
  hotelShare,
  cardLevel
} from '../../../../api/hotel';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectCollection: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-06-21/17/yuelvhui4zy8C79zZj1592730782.png',
    indicatorDots: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    background: [1, 2, 3],
    Return: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-06-19/20/yuelvhui8S64ctVyO41592569898.png',
    fullstar: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-21/00/yuelvhuiylrhKNgBND1587400395.png',
    halfstar: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-21/01/yuelvhuikMuDLJWkfY1587402137.png',
    emptystar: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-21/01/yuelvhuida49JeV8g31587402247.png',
    Collection: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-06-19/21/yuelvhui3hn1Gniesk1592572315.png',
    share: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-06-19/21/yuelvhuiyCYlhln2Hu1592572527.png',
    detailmore: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-21/03/yuelvhuiaNt8ICOb2v1587410633.png',
    loc: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-21/03/yuelvhuiWQIyULnY2T1587411064.png',
    map: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-21/03/yuelvhuiCSvCZtaWoy1587411333.png',
    call: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-21/03/yuelvhuiu2vIoe7O7m1587411403.png',
    roomsImage: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-21/03/yuelvhuidmSkPHfCoY1587412340.png',
    tipImage: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-21/21/yuelvhuizp2vbb4Dy41587477172.png',
    isShow: false,
    roomNum: 1,
    nights: 1,
    isSellOut:0,
    navBg:false,
    butie:'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-06-19/21/yuelvhuimjTHXNotFu1592573082.png',
    position:'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-06-19/23/yuelvhuiw4DdZm6Vy51592579558.png',
    merber:'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-06-19/23/yuelvhuiKbgLKSYcSn1592580549.png',
    // 默认轮播数
    current: 0,
    massage:'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-06-21/12/yuelvhui59tWZLNhrh1592714417.png',
    accessMember:false,
  },
  onPageScroll(e) {
    if (e.scrollTop > 52) {
      this.setData({
        navBg: true
      })
    } else {
      this.setData({
        navBg: false
      })
    }
  },
  // 分享
  onShareAppMessage: function () {
    var that = this;
    console.log(wx.getStorageSync('inviteCode'), '酒店反向吗')
    return {
      title: that.data.detail.name || '',
      imageUrl: that.data.shareImage || '',
      path: '/page/HotelOther/pages/HotelDetail/HotelDetail?id=' + that.data.id + '&reCode=' + wx.getStorageSync('inviteCode')
    }
  },
  cardLevel:function(){
    cardLevel({}).then(res=>{
      console.log(res,'resresres')
      this.setData({
        isLevelState:res.data.isLevelState
      })
    })
  },
  // 酒店分享数据
  hotelShare: function (vipPrice, price, img) {
    let data = {
      type: "hotel",
      id: this.data.id,
      prices: vipPrice,
      priced: price,
      preferential: "",
      cover: img,
    }
    hotelShare(data).then(res => {
      console.log(res)
      if (res.code == 200) {
        this.setData({
          shareImage: res.img
        })
      }
    })
  },
   // 关闭或显示开通会员
   BookNow(e){
    let item = e.currentTarget.dataset.item

    if(this.data.isLevelState==1){ // 会员直接去购买
      this.handleBook(item)
      return
    }else{
      this.setData({
        accessMember: !this.data.accessMember,
      })
    }
  },
  // 房间数回调
  setRoomNum: function (e) {
    console.log(e)
    this.setData({
      roomNum: e.detail
    })
  },
  // 房间数
  roomNum: function () {
    console.log('88888')
    this.setData({
      isShow: true
    })
  },
  // 选择日历的回调
  onLoadFun: function (e) {
    this.setData({
      CheckTime: e.detail.checkInDate,
      outTime: e.detail.checkOutDate,
      nights: e.detail.nights
    })
    this.initDetail()
  },
  // 选择时间
  selectTime: function () {
    console.log('8888')
    this.setData({
      isSelectTime: true
    })
  },
  // 收藏
  sellout: function () {
    if (wx.getStorageSync('memberId')) {
      collect(this.data.id, wx.getStorageSync('memberId'), this.data.isSellOut).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.setData({
            isSellOut: res.isCollect
          })
        }
      })
      console.log(this.data.isSellOut,'oooooooooooooo')

    } else {
      wx.navigateTo({
        url: '/page/Member/pages/authorize/authorize'
      })
    }
  },
  // 拨打电话
  call: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  //地图位置
  bindLocationChoose: function (e) {
    var that = this;
    wx.setStorageSync('isdetail', 'detail')
    wx.openLocation({
      latitude: Number(that.data.detail.googleLat),
      longitude: Number(that.data.detail.googleLon),
      scale: 15
    })
  },
  // 是否收藏初始化接口
  stateCollect: function (e) {
    // stateCollect(this.data.id, wx.getStorageSync('memberId')).then(res => {
    //   console.log(res)
    //   this.setData({
    //     isSellOut:res.isCollect
    //   })
    //   console.log(this.data.isSellOut,'----00000099999999')
    // })
  },
  // 酒店详情接口
  initDetail: function () {
    zdAppletHotelDetail({
      hotelId:wx.getStorageSync('dealerId'), 
      arrivalDate:wx.getStorageSync('ROOM_SOURCE_DATE').checkInDate,
      departureDate:wx.getStorageSync('ROOM_SOURCE_DATE').checkOutDate,
      memberId: wx.getStorageSync('memberId'),
      hotelType:this.data.hotelType
    }).then(res => {
      console.log(res)
      if (res.code == 200) {
        if (res.result.hotels.ratePlan) {
          for (let r = 0; r < res.result.hotels.ratePlan.length; r++) {
            if (r == 0) {
              res.result.hotels.ratePlan[0].isSelect = true
            } else {
              res.result.hotels.ratePlan[r].isSelect = false
            }
          }
          let score = []
          console.log(Math.floor(res.result.hotels.detail.score), res.result.hotels.detail.score)
          for (var s = 0; s < Math.floor(res.result.hotels.detail.score); s++) {
            console.log(s)
            score.push(true)
          }
          if (res.result.hotels.detail.score - Math.floor(res.result.hotels.detail.score) > 0) {
            score.push(false)
          }
          for (var i = 0; i < 5 - res.result.hotels.detail.score; i++) {
            score.push('empy')
          }
          console.log(score)

          this.setData({
            detail: res.result.hotels.detail,
            ratePlan: res.result.hotels.ratePlan,
            isLoading: false,
            score: score,
            memberSubDto:res.result.hotels.memberInfo.memberSubDto
          })

          this.hotelShare(res.result.hotels.ratePlan[0].plans[0].vipPrice, res.result.hotels.ratePlan[0].plans[0].price, res.result.hotels.ratePlan[0].image)
          
        }else{
         
        }
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //去详情看配置
  goGetail(){
    console.log(this.data.detail,'---------------')
    wx.navigateTo({
      url: '/equityCard/pages/fullHotel/fullHotelDetailNew/fullHotelDetailNew?id='+ wx.getStorageSync('dealerId'),
    })
  },
  // 轮播 点击事件
  bindChange: function(e) {
    this.setData({
      current: e.detail.current
    })
  },
  //
  goEquity(){
    wx.navigateTo({
      url: '/hotel/pages/pmsList/pmsList',
    })
  },
  handleBook: function (item) {
    
    console.log(item)
    if (wx.getStorageSync('memberId')) {
      wx.navigateTo({
        url: '/equityCard/pages/fullHotel/fullHotelOrder/fullHotelOrder?id=' + this.data.id + '&roomTypeId=' + plans.roomTypeId + '&rpId=' + plans.ratePlanId + '&sourceType=' + plans.sourceType + '&roomId=' + roomid

        // roomId= + roomId +"&fxImg="+self.data.fxImg+ "&roomPlanId=" + roomPlanId + "&sdate=" + self.data.sdate + "&edate=" + self.data.edate + "&roomnum=1" + "&protocolId=" + protocolId + "&tailRoom=" + tailRoom
      })
    } else {
      console.log('memberId没有')
      wx.navigateTo({
        url: '/page/Member/pages/authorize/authorize'
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    // 胶囊位计算
    that.cardLevel()
    app.navTop(function (res) {
      that.setData({
        navTop: res.navTop + 10
      })
    });
    console.log(options.id)
    that.setData({
      id: options.id,
      isLoading: true,
      isBack: options.reCode ? false : true,
      distance:options.distance,
      hotelType:options.hotelType?options.hotelType:''
    })
    console.log(options.reCode, '酒店详情')
    wx.setStorageSync('shareCode', options.reCode)
    that.initDetail()
    that.stateCollect()
    
  },
  navigatorUrl: function () {
    wx.navigateBack({
      delta: 1
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
    if (wx.getStorageSync('CheckTime')) { //如果有缓存是时间就默认用缓存的
      console.log('mmmmm')
      this.setData({
        CheckTime: wx.getStorageSync('CheckTime'),
        outTime: wx.getStorageSync('leaveTime')
      })
    } else { //设置默认时间
      console.log('aaaaaa')
      var checkInDate = Moment(new Date()).format('YYYY-MM-DD');
      var checkOutDate = Moment(new Date()).add(1, 'day').format('YYYY-MM-DD');
      console.log(checkInDate, checkOutDate)
      this.setData({
        CheckTime: checkInDate.substr(5, checkInDate.length),
        outTime: checkOutDate.substr(5, checkOutDate.length)
      })
      wx.setStorage({
        key: 'ROOM_SOURCE_DATE',
        data: {
          checkInDate: checkInDate,
          checkOutDate: checkOutDate
        }
      });
    }
    // 获取几晚的缓存
    if (wx.getStorageSync('nights')) {
      this.setData({
        nights: wx.getStorageSync('nights')
      })
    }
    if (wx.getStorageSync('memberId')) {
      wx.showShareMenu({
        withShareTicket: true
      })
      this.setData({
        isShare: true
      })
    } else {
      this.setData({
        isShare: false
      })
      wx.hideShareMenu()
    }
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