//index.js
//获取应用实例
import {
  wxRequest
} from "../../../utils/request";
import {
  parseTime
} from "../../../utils/time" 
import {
  customerAvailable,
  createRoom,
  createCard,
  prepayCard,
  hotelHb
} from '../../../api/hotel'
import {
  byDealerId,

} from '../../../api/personal'

const app = getApp();
Page({
  data: {
    showModalStatus: false,//优惠券
    animationData: '',//优惠券
    explain:true,//显示优惠券说明
    account: "",
    close:"",
    orderinfo: {
      num: 1,
      dealerId: '',
      orderType: 1,
      payType: 1,
      customerId: "",
      levelId: 1 || 0,
      nickName: "",
      contact: '',
      telPhone: '',
      oriAmount: 0,
      orderAmount: 0,
      couponCodes: [],
      cmt: '',
      sysSource: 'ebooking',
      usePointValue: '',
      eta: '',
      etd: '',
      roomId: " ",
      roomPlanId: " ",
      protocolId: " ",
      num: 1,
      addBed: false,
      addBedNum: '',
      startDate: '',
      endDate: '',
      payTradeType: 'WX_JSWEB',
      tailRoom: false
    },
    isshowcoupon: false,
    couponprice: 0,
    pointprice: 0,
    lastprice: 0, //最终的价格
    daynum: "",
    info: "",
    roomId: "",
    roomPlanId: "",
    edate: "",
    sdate: "",
    sdateText: "",
    edateText: "",
    roomnum: "",
    tailRoom: "",
    protocolId: "",
    currCouponIndex: "-1",
    mxstatus: false,
    maskStatus: 0,
    couponstatus: 0 ,//1显示 0 隐藏
    readBox:false,//订房必读
    retain: [ //房间保留至数组
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '20:00',
      '21:00',
      '22:00',
      '22:00',
      '23:00',
      '23:59',
      '次日1点',
      '次日2点',
      '次日3点',
      '次日4点',
      '次日5点',
      '次日6点'
    ],

    retainIndex: 0, //房间保留至
    examineBox:false,//权益卡弹框
    rommcount:1,//选择的房间数量
    roomBox:false,//选择房间弹框
    isVip:wx.getStorageSync('isVip'),
    cardDetail:'',//联名卡信息
    couponBox:false,//优惠券弹框
    discountBox:false,//优惠券更多弹出
    couponIdx:0,//优惠券弹框默认选择
    timeEnd:parseTime(new Date(), "{h}"),//当前时间整点
    timeArr:[],//用于算时间
    contacts:[],//房间人名字多时
    shareSelectStatus:0
  },

  // 明细  
  handleShowMxBox() {
    this.setData({
      mxstatus: !this.data.mxstatus,
      maskStatus: 1
    })
  },
  handleHideCouponBox() {
    this.setData({
      couponstatus: 0,
      maskStatus: 0,
      mxstatus: 0
    })
  },
  handleShowCouponBox() {
    this.setData({
      couponstatus: 1,
      maskStatus: 1,
    })
  },
  handleShowSelect() {
    this.setData({
      shareSelectStatus: 1
    })
  },
  handleCloseShareDialog() {
    // console.log("隐藏选项的弹窗");
    this.setData({
      shareSelectStatus: 0
    })
  },
  handleShowPosterStatus() {
    //海报点击之后出发该事件
    this.ajaxHaiBao();
  },
  handleBox(){
    //隐藏海报和分享的弹窗
    let _key = "posterObj.status"
    this.setData({
      [_key]:0,
      shareSelectStatus:0
    })
  },
  ajaxHaiBao() {
    //生成海报
    wx.showLoading({
      title: '海报生成中',
      mask: true
    });
    let params = {
      dealerId:wx.getStorageSync('dealerId'),//酒店id
      type:1,//1酒店详情
      mid:wx.getStorageSync("memberId"),
      vipPrice:this.data.info.prices[0].vipPrice,
      price:this.data.info.prices[0].price,
      pImg:this.data.info.imgUrl,
      pName:this.data.info.roomName
    }

    hotelHb(params).then (res => {
    this.setData({
      posterObj:{
        status:1,
        url:res.data
      }
    })
    wx.hideLoading();
   })
 
  },
  computPrice() {

    let self = this
    let addbedprice = self.data.orderinfo.addBedNum * self.data.daynum * self.data.info.extraBedAmount;
    let price = self.data.info.totalPrice - self.data.couponprice - self.data.pointprice + addbedprice;
    let lastprice = price > 0 ? price / 100 : 0; //最终价格
    console.log("最终价格", lastprice);
    self.setData({
      lastprice
    })

  },
  handleBindInput(e) {

    let type = e.currentTarget.dataset.type;
    // console.log(type)
    let _key = `orderinfo.${type}`
    

    // console.log("_key",_key);
    // console.log(e);
    if(type=='num'){
      this.setData({
        [_key]: e.detail.value,
        roomnum: e.detail.value
      })
      this.getRoom()
    }else{
      this.setData({
        [_key]: e.detail.value
      })
    }
    console.log([_key],'12333')
    if(type=='contacts'){
      if(e.detail.value.length>10){
        wx.showToast({
          title: '不得超过10个汉字',
          icon:'none'
        })
        return
      }
      this.data.contacts[e.currentTarget.dataset.idx] = e.detail.value
    }else if(type=='contact'){
      if(e.detail.value.length>10){
        wx.showToast({
          title: '不得超过10个汉字',
          icon:'none'
        })
        return
      }
      this.data.contacts[0] = e.detail.value
    }
  },
  handleShowCoupon() {
    this.setData({
      isshowcoupon: true
    })
  },
  handleChooseAddress() {
    //选择地址
    wx.navigateTo({
      url: "/supermarket/shop/address/index",
    });
  },
  nextUrl(e) {
    console.log(e);
    let obj = e.currentTarget.dataset.obj;
    wx.navigateTo({
      url: "/supermarket/shop/detail/index?sid=" + obj.id,
    });
  },
  handleBuy() {
    let self = this

    if (self.data.contacts.length == 0) {
      wx.showToast({
        title: '联系人不能为空',
        icon: "none",
        duration: 1500,
        mask: true
      });
      this.setData({
        accessMember:false
      })
      return false;
    }else{
      if(self.data.rommcount > 1){
        self.data.contacts.map(item=>{
          if(!item){
            wx.showToast({
              title: '联系人不能为空',
              icon: "none",
              duration: 1500,
              mask: true
            });
            this.setData({
              accessMember:false
            })
            return false;
          }
        })
      }
    }

    if (self.data.orderinfo.telPhone == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: "none",
        duration: 1500,
        mask: true
      });
      return false;
    }

    let mobile = /^1\d{10}$/;
    if (!mobile.test(self.data.orderinfo.telPhone)) {//联系电话
      wx.showToast({
        title: '手机号格式不正确',
        icon: "none",
        duration: 1500,
        mask: true
      });
      return false;
    }
    if (self.data.orderinfo.addBed) {//是否加床
      if (self.data.orderinfo.num == 1) {
        self.data.orderinfo.addBedNum = 1
      } else if (self.data.orderinfo.addBedNum > self.data.orderinfo.num) {
        self.data.orderinfo.addBedNum = self.data.orderinfo.num
      } else if (self.data.orderinfo.addBedNum == 0) {
        self.data.orderinfo.addBed = false
      }
    } else {
      self.data.orderinfo.addBedNum = 0//加床数量
    }

    self.data.orderinfo.clientIp = "127.0.0.1";//ip
    self.data.orderinfo.contacts= self.data.contacts;//联系人数组
    self.data.orderinfo.dealerId = self.data.dealerId;//酒店id
    self.data.orderinfo.eta = self.data.sdate//入店时间
    self.data.orderinfo.etd = self.data.edate//离店时间
    self.data.orderinfo.endDate = self.data.edate//结束时间
    self.data.orderinfo.startDate = self.data.sdate//开始时间
    self.data.orderinfo.roomId = self.data.roomId;//房型id
    self.data.orderinfo.roomPlanId = self.data.roomPlanId;//房型规则id
    self.data.orderinfo.tailRoom = self.data.tailRoom;//是否是尾房
    self.data.orderinfo.oriAmount = self.data.info.totalPrice//订单原始金额
  
    self.data.orderinfo.customerId = wx.getStorageSync('customerId');//下单用户id
    self.data.orderinfo.cpsCustomerId = wx.getStorageSync('cpsCustomerId'); //分享者id（可为空）
    self.data.orderinfo.levelId = wx.getStorageSync('levelId'); //等级id（没有传0）
    self.data.orderinfo.num = self.data.rommcount;//数量
    self.data.orderinfo.nickName = wx.getStorageSync('userinfostr').nickName //昵称
    self.data.orderinfo.sysSource = 'zhiding_wxap' //系统的来源（ebooking）
    self.data.orderinfo.payType = 1, //支付类型 传1 微信
    self.data.orderinfo.orderAmount = self.data.info.totalPrice, //订单应付金额
    self.data.orderinfo.orderType = 1, //订单类型 传1
    self.data.orderinfo.payTradeType = 'WX_JSAPI' //支付方式
    self.data.orderinfo.cmt = '不加床' //用户下单留言（可为空）

    if(self.data.account.couponDTOList.length){
      if(self.data.account.couponDTOList[self.data.couponIdx].couponChannel==2){
        self.data.orderinfo.couponCodes = self.data.account.couponDTOList.length != 0 ? [self.data.account.couponDTOList[self.data.couponIdx].customerCouponsId] : []//优惠券
      }else{
        self.data.orderinfo.couponCodes = self.data.account.couponDTOList.length != 0 ? [self.data.account.couponDTOList[self.data.couponIdx].couponCode] : []//优惠券
      }
      self.data.orderinfo.couponChannel = self.data.account.couponDTOList[self.data.couponIdx].couponChannel
    }

// console.log(self.data.orderinfo,'3333')
// return


    createRoom(self.data.orderinfo).then(res=>{
      if (res.data.orderFee > 0) {
        //支付页面
        let dealerId = wx.getStorageSync('dealerId')
        wx.redirectTo({
          url: "/hotel/pages/pay/index?oid=" + res.data.orderNo+"&lastprice="+self.data.lastprice+ "&hid="+dealerId+ "&type=6"
        });


      } else {
        //直接去客房的订单详情页面
        let dealerId = wx.getStorageSync('dealerId')
        wx.redirectTo({
          url: "/hotel/pages/orderDetail/index?oid=" + res.data.orderNo+'&dealerId='+dealerId

        });

      }
    }).catch(err=>{
      console.log("错误信息",err);
      
    })
  },
 


 
  // 预计到点
  estimate(){
    
  },



  ajaxCreateOrder(model) {
    wxRequest({
        method: "post",
        url: "/apimall/order/mall/createOrder",
        data: model,
        contentType: "application/json",
      })
      .then((res) => {
        console.log("创建订单", res);
      })
      .catch((err) => {
        console.log("err", err);
      });
  },

  // couponType
  // Discount(1, "折扣券"),   房间数*discountAmount
  // Cash(2, "现金券"),       discountAmount
  // Exchange(3,"兑换券"),    discountAmount
  // FullSubtraction (4,"满减券"),  满fullAmount-discountAmount


  onLoad(query) {
    console.log(this.data.retain.indexOf('17:00'),'2355')
    console.log("query", query,this.data.timeEnd,'timeEnd');
    let {
      roomTypeId,
      ratePlanId,
      sourceType,
      arrivalDate,
      departureDate,
      rpType,



      // roomId,
      // edate,
      // sdate,
      // roomnum,
      // tailRoom,
      // roomPlanId,
      // protocolId,
    } = query;
    // let sdateText = parseTime(sdate / 1000, "{m}月{d}日");
    // let edateText = parseTime(edate / 1000, "{m}月{d}日");
    // let timeArr = [
    //   parseTime(sdate / 1000, "{y}-{m}-{d}"),
    //   parseTime(edate / 1000, "{y}-{m}-{d}"),
    // ]
    let nickName = wx.getStorageSync("userinfostr").nickName;
    this.setData({


      roomTypeId,
      ratePlanId,
      sourceType,
      arrivalDate,
      departureDate,
      rpType,
      dealerId: wx.getStorageSync("dealerId"),
      memberId:wx.getStorageSync("memberId")





      // nickName,
      // roomId,
      // edate,
      // sdate,
      // roomnum,
      // tailRoom,
      // roomPlanId,
      // protocolId,
      // sdateText,
      // edateText,
      // attention: '',
      // timeArr
    });
    // this.setData({
    //   fxImg:query.fxImg
    // })
    // let dealerId = wx.getStorageSync("dealerId");
    // let minsec = this.data.edate - this.data.sdate
    // let daynum = minsec / 1000 / 60 / 60 / 24
    // let customerId = wx.getStorageSync("memberId");
    // let _key = 'orderinfo.customerId'
    // let _phone = 'orderinfo.telPhone'
    // this.setData({
    //   daynum,
    //   [_key]: customerId,
    //   [_phone]: wx.getStorageSync("userinfostr").mobile || '',
    //   isVip: wx.getStorageSync('isVip')
    // })
    this.getRoom();
    this.getCard()
    

    // this.timeCount()
    
  },
  getRoom() {
    //获取客房列表

    let that = this
    var lastprice = that.data.lastprice
    wx.showLoading()
    customerAvailable({
      // dealerId:parseInt(that.data.dealerId),
      // orderType:1,
      // couponChannel:1,
      // roomId:that.data.roomId,
      // roomPlanId:that.data.roomPlanId,
      // startDate: that.data.sdate,
      // endDate:that.data.edate,
      // customerId:wx.getStorageSync("customerId"),
      // num:that.data.rommcount,


      hotelId:that.data.dealerId,//酒店id
      roomTypeId:that.data.roomTypeId,//房间ID
      ratePlanId:that.data.ratePlanId,//价格计划ID
      sourceType:that.data.sourceType,//渠道来源:0 艺龙(默认) 1 捷旅 2 携程 3 高星特惠 4 自营 5 泰坦云 6.好巧 7.美团
      arrivalDate:that.data.arrivalDate,//入住时间,格式:yyyy-mm-dd
      departureDate:that.data.departureDate,//离店时间,格式:yyyy-mm-dd
      rpType:that.data.rpType,//0/1是否会员价购买
      mid:that.data.memberId
      
      
      
      
      
      
      

      // dealerId: 100273,
      // orderType: 1,
      // couponChannel: 1,
      // roomId: 11316,
      // roomPlanId: 132,
      // startDate: 1597161600000,
      // endDate: 1597248000000,
      // customerId: 309020010551,
      // num: that.data.rommcount,
    }).then(res=>{
      console.log(res,'详情 详情')
      return
      let prices = res.data.price.prices.map(val => {
        let obj = val;
        obj.roomDate = parseTime(val.roomDate, '{m}-{d}')
        obj.totalPrice = parseInt(val.vipPrice) * parseInt(that.data.rommcount)
        return obj;
      })
     
      var couponDTOList = res.data.couponDTOList;
      for (var i = 0; i < couponDTOList.length; i++) {
        couponDTOList[i].startTime =  parseTime(couponDTOList[i].effecTime, '{y}-{m}-{d}')
        couponDTOList[i].endTime =  parseTime(couponDTOList[i].dueTime, '{y}-{m}-{d}')
        if (couponDTOList[i].couponType == 4) {
          if (couponDTOList[i].fullAmount > lastprice) {
            couponDTOList[i].nochoose = 1
          }
        } else {
          couponDTOList[i].nochoose = 0
        }
      }
      
      let account = res.data
      let info = res.data.price
      let Reduction = ''
      if(res.data.couponDTOList.length){
        Reduction = Math.round((info.totalPrice-info.vipTotalAmount + account.couponDTOList[that.data.couponIdx].discountAmount)/100)
      }
      console.log(Reduction,'ReductionReduction')
      that.setData({
        account: res.data,
        info: res.data.price,
        Reduction:Reduction,
        timecounts:prices
      })
      that.computPrice();
      wx.hideLoading()
    }).catch(err=>{
      console.log("错误信息",err);
      
    })

   
  },

  
  
  timeCount(){
    let that = this
    console.log(this.data.timeArr,'1233234')
    
    let sdateText = this.data.timeArr[0];
    let edateText = this.data.timeArr[1];
    let lyear = sdateText.substr(0,4) //开始年
    let nyear = edateText.substr(0,4) //结束年
    let lmonth = sdateText.substr(5,2) //开始月
    let nmonth = edateText.substr(5,2) //结束月
    let yday = sdateText.substr(8,2) //开始日
    let nday = edateText.substr(8,2) //结束日
    let yearType = lyear == nyear//年是否相等
    let monthType = lmonth == nmonth//月是否相等
    let lastMonth = that.mGetDate(lyear,lmonth)//上月天数
    let daysNum = 0 //相差天数

    let timecounts = []//拼数组
    if(monthType){
      daysNum = nmonth - lmonth
      for(let i=0;i<daysNum+1;i++){
        timecounts[i]= lmonth + '-' + (parseInt(yday) + i)
      }
    }else{
      daysNum = lastMonth - parseInt(yday)
      // 前月
      for(let i=0;i< parseInt(daysNum)+1;i++){
        timecounts[i]= lmonth + '-' + (parseInt(yday) + i)
      }
      // 后月
      for(let i=0;i< parseInt(nday);i++){
        timecounts.push(nmonth + '-' + (i+1))
      }
    }

    that.setData({
      timecounts
    })
    

  },
  // 判断当月天数
  mGetDate(year, month){
    console.log(year,month,'--23333--')
      var d = new Date(year, month, 0);
      return d.getDate();
  },


  // 获取联名卡信息
  getCard(){
    let data = {
      dealerId: wx.getStorageSync('dealerId'),//酒店id
      memberId: wx.getStorageSync('memberId'),//用户id
      customerId:wx.getStorageSync('customerId')
    }
    byDealerId(data).then(res => {
      console.log(res,'resres')
      this.setData({
        cardDetail: res.data,
      })
    })
  },

  onShow() {
    // let addressId = wx.getStorageSync("addressId");
    // if(addressId){
    //   this.getOneAddress();
    // }
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let options = currentPage.options;
    
    if (JSON.stringify(options) == "{}") {

    } else {
      if (!wx.getStorageSync('memberId')) {
        if (app.globalData.isStrongLogin == 1) {
          wx.navigateTo({
            url: '/pages/login/index'
          })
        }
      }
    }
  },

  // 分享
  onShareAppMessage: function () {
    console.log(wx.getStorageSync('customerId'))
    console.log(wx.getStorageSync('mYinviteCode'))
    return {
      title: this.data.nickName + "邀请您入住" + this.data.info.dealerName,
      path: "/pages/index/index?dealerId=" + wx.getStorageSync('dealerId') + "&inviteCode=" + wx.getStorageSync('mYinviteCode'),
      imageUrl: this.data.fxImg,
    }
  },

  explainBox(e){
    var idx = e.currentTarget.dataset.idx
    console.log( this.data.account.couponDTOList[idx].instructions,"=====")
    
    this.setData({
      attention: this.data.account.couponDTOList[idx].instructions,
      explain:false
    })
  },
  explainBtn(){
    this.setData({
      explain:true
    })
  },
  // 订房必读
  readMore(){
    this.setData({
      readBox:!this.data.readBox
    })
  },
  // 房间保留至
  bindPickerChangeRetain: function (e) {
    this.setData({
      retainIndex: e.detail.value,
      arriveTime: this.data.retain[e.detail.value],
    })
  },
  // 查看权益
  examine(){
    this.setData({
      examineBox:!this.data.examineBox
    })
  },
  // 选择房间
  roomChoose(e){
    console.log(e,'eeee')
    this.setData({
      rommcount:e.currentTarget.dataset.val
    })
    this.getRoom()
  },
  // 展开选择房间
  roomShow(){
    this.setData({
      roomBox:!this.data.roomBox,
      rommcount:this.data.roomBox?1:this.data.rommcount
    })
  },
  // 优惠券弹框
  couponShow(){
    this.setData({
      couponBox:!this.data.couponBox
    })
  },
  // 打开优惠
  couponList(){
    this.setData({
      discountBox:!this.data.discountBox
    })
    
  },
  // 优惠券选择
  couponChoose(e){
    let that = this
    let Reduction = ''
    let couponIdx = e.currentTarget.dataset.index
    
    Reduction = Math.round((that.data.info.totalPrice-that.data.info.vipTotalAmount + that.data.account.couponDTOList[couponIdx].discountAmount)/100)
    console.log(Reduction,'ReductionReduction')
    that.setData({
      Reduction:Reduction,
      couponIdx:couponIdx,
      couponBox:false
    })
  },
  buyCard() {
    let that = this;
    
    let obj = {};
    // 联名卡
    obj = {
      customerId: wx.getStorageSync("customerId"),//前登录酒店会员id
      cardPrice: that.data.cardDetail.unionCardDTO.cardPrice, //卡的价格
      cardLevelId : that.data.cardDetail.unionCardDTO.cardLevelId, //卡等级id
      cardLevel : that.data.cardDetail.unionCardDTO.cardLevel, //卡等级
      cardName: that.data.cardDetail.unionCardDTO.cardName, //卡名字
      yuechengCardId :that.data.cardDetail.unionCardDTO.yuechengCardId ,//悦城id
      dealerId: that.data.dealerId, //酒店id
      cardId: that.data.cardDetail.unionCardDTO.cardId, //pms卡id
      orderAmount: that.data.cardDetail.unionCardDTO.cardPrice * 1, //订单金额
      oriAmount: that.data.cardDetail.unionCardDTO.cardPrice * 1, //原始金额
      adminId: wx.getStorageSync('adminId') || 0, //管理员id
      memberId : wx.getStorageSync('memberId'),
      cpsCustomerId:wx.getStorageSync('inviteCode'),//分享者customerId
      sysSource:'zhiding'
    }

    createCard(obj).then(res=>{
      console.log('asfaosid')
      prepayCard({
        orderNo:res.data.orderNo,//订单号
        openId:wx.getStorageSync('openId'),
        tradeType:'WX_JSAPI'
      }).then(resNew=>{
          console.log(resNew,'234')
          let weixininfo = resNew.data.getwayBody;
          wx.requestPayment({
            timeStamp: weixininfo.timeStamp,
            nonceStr: weixininfo.nonceStr,
            package: weixininfo.package,
            signType: weixininfo.signType,
            paySign: weixininfo.paySign,
            success (res) { 
              console.log("支付成功",res);
              wx.showToast({
                title: '购买成功',
              })
              // wx.redirectTo({
              //   url: '/hotel/pages/paySuccess/index'
              // });  
            },
            fail (res) { 
              // wx.redirectTo({
              //   url: "/hotel/pages/payFail/index"
              // });
            }
          })
      }).catch(err=>{
        // console.log("错误信息",err);
      })
    }).catch(err=>{
      // console.log("错误信息",err);
      
    })
return
    if (that.data.currentSwiper == 0) {
      wxRequest({
        method: "post",
        url: url,
        contentType: "application/json;charset=UTF-8",
        data: obj
      }).then(res => {
        // console.log(res)
        let _data = res;


        wx.navigateTo({
          url: '/hotel/pages/pay/index?oid=' + _data.orderNo + "&hid=" + that.data.dealerId + "&type=5&aid=" + adminId
        })
        // wx.navigateTo({
        //   url: '/pages/pay/index?oid='+_data.orderNo+"&hid="+that.data.dealerId+"&type=5&aid="+that.data.yg_id
        // });
      }).catch(err => {
        // console.log(err)
      })
    } else {
      wxRequest({
        method: "post",
        url: url,
        contentType: "application/json;charset=UTF-8",
        data: obj
      }).then(res => {
        // console.log(res)
        let _data = res;
        // wx.redirectTo({
        //   url: '/my/pages/newPay/index?oid=' + _data.orderNo + "&hid=" + self.data.dealerId + "&type=5&aid=" + adminId
        // })
        wx.navigateTo({
          url: '/hotel/pages/pay/index?oid=' + _data.orderNo + "&hid=" + that.data.dealerId + "&type=5&aid=" + adminId
        })
        // wx.navigateTo({
        //   url: '/pages/pay/index?oid='+_data.orderNo+"&hid="+self.data.dealerId+"&type=5&aid="+self.data.yg_id
        // });
      }).catch(err => {
        // console.log(err)
      })
    }

  },
});
