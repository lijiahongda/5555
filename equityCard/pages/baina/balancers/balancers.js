// import {
//   getMemberOrderCreat,
//   payPage,
//   getMemberOrderPay
// } from '../../../../api/mall.js';
import {
  post,get
} from "../../../../utils/api"
// /app/v1/card/OrderCreate
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scroll: true,
    showModalStatus: false, //弹窗状态,
    cartId: '',
    receiverName: '',
    mobile: '',
    address: '',
    totelPrice: '',
    couponList: [],
    DiscountAmount: '',
    actualPrice: '',
    totelPrice: '',
    isAble: 0,
    couponid: '',
    addressId: '',
    isDefault: 0,
    Able: 0,
    addressAdministration: '',
    labelName: '',
    addressType: 0,
    addressIds: 0,
    areaId: 0,
    ispay: '',
    isgopay: true,
    btnText: '',
    exchange: '',
    exchangeBoxShow: false,
    cardType: 1,
    confirmSiteType: 0, // 收货地址确认弹窗;0-未更改地址、1-已更改过地址 
    confirmSiteShow: false, // 显示收货地址弹窗
    couponPrice: 0,
    goodsList: [], // 商品列表
    // 支付方式弹窗
    alertChoseShow: false,
    // 类型选择下标
    typeIndex: 1,
    // cardchose 购物车是否选中
    cardchose: false
  },
  // 显示收货弹窗 
  confirmSite() {
    this.setData({
      confirmSiteShow: true,
      confirmSiteType: 1
    })
  },

  
  // 初始化数据  -- 入口详情去购买
  ordergopay: function () {
    let that=this
      let data = {
        product_id: that.data.goodid,
        skuId: that.data.skuid,
        memberId: wx.getStorageSync('memberId'),
        type:that.data.card_type
      }
    let url = '/app/v1/card/payPage'
      
      // payPage(data, url).then(res => {
      //   console.log(res,'resres9999999')
      //   let list = res.data
      //   that.setData({
      //     list: res.data,
      //     receiverName: res.data.receiverAddress.receiver_name,
      //     mobile: res.data.receiverAddress.mobile,
      //     address: res.data.receiverAddress.province_name + res.data.receiverAddress.city_name + res.data.receiverAddress.zone_name + res.data.receiverAddress.town_name + res.data.receiverAddress.address,
      //     isaddress: res.data.receiverAddress,
      //     addressId: res.data.receiverAddress.address_id,
      //     isDefault: res.data.receiverAddress.is_default,
      //   })
        
      // })
  },
  // 优惠券
  immediateUse: function (e) {
    let that = this
    let index = e.currentTarget.dataset.index
    console.log(that.data.Calculation, that.data.couponList[index].amount, that.data.totalFreight)
    that.setData({
      couponid: e.currentTarget.dataset.couponid,
      actualPrice: ((that.data.Calculation - that.data.couponList[index].amount) + that.data.totalFreight).toFixed(2),
      couponPrice: that.data.couponList[index].amount,
      DiscountAmount: that.data.couponList[index].couponName,
      baMoney: (that.data.actualPrice - that.data.balanceMoney).toFixed(2),
      showModalStatus: false
    })
    console.log(e.currentTarget.dataset.couponid)
  },
 
  // 支付
  payment: function () {
    let that = this
    if (that.data.leaderId == undefined || that.data.leaderId == 'undefined') {
      that.setData({
        leaderId: 0
      })
    }
    console.log(that.data.isaddress, 'that.data.isaddress')
      // wx.showLoading({
      //   title: '请稍等',
      // });
      // let obj = {
      //   card_id:that.data.card_type,
      //   product_id: that.data.goodid,
      //   skuId: that.data.skuid,
      //   addressType: that.data.addressType,
      //   addressId: that.data.addressId,
      //   memberId: wx.getStorageSync('memberId'),
      // }
      post('/app/v1/card/OrderCreate',{
        card_id:that.data.card_type,
        product_id: that.data.goodid,
        skuId: that.data.skuid,
        addressType: that.data.addressType,
        addressId: that.data.addressId,
        memberId: wx.getStorageSync('memberId'),
      },(res)=>{
        if(res.code==200){
          console.log(res,'dasitamen')
            that.setData({
              ordersn: res.data.orderNo
            })
          }
      })
      // getMemberOrderCreat(obj).then(res=>{
      //   if(res.code==200){
      //   console.log(res,'dasitamen')
      //     that.setData({
      //       ordersn: res.data.orderNo
      //     })
      //     getMemberOrderPay({
      //       orderNo:res.data.orderNo,
      //       tradeType:'WX_JSAPI',	//	WX_JSAPI：微信小程序支付  WX_APP：微信app支付   WX_MWEB：微信H5支付      ALI_APP：支付宝app支付     WX_JSWEB：微信公众号支付

      //       openId:wx.getStorageSync('openid')
      //     }).then(res=>{
      //       wx.requestPayment({
      //         'timeStamp': res.data.getwayBody.timeStamp,
      //         'nonceStr': res.data.getwayBody.nonceStr,
      //         'package': res.data.getwayBody.package,
      //         'signType': 'MD5',
      //         'paySign': res.data.getwayBody.paySign,
      //         'success': function (res) {
      //           wx.hideLoading()
      //           wx.showToast({
      //             title: '支付成功',
      //             icon: 'none'
      //           })
      //           if (that.data.pagetype == 'dalibao') {
      //             wx.redirectTo({
      //               url: '../payResult/payResult?orderNo=' + that.data.ordersn + '&balance=balance&isSuccess=' + true + '&payType=0' + '&typePage=' + that.data.pagetype + '&Mywinning=' + 'dalibao'
      //               //isSuccess 代表支付状态是否成功, payType 代表支付类型 0 商城 1 酒店 2 线路 3 定制游 4 会员卡
      //             })
      //           } else {
      //             wx.redirectTo({
      //               url: '../payResult/payResult?orderNo=' + that.data.ordersn + '&balance=balance&isSuccess=' + true + '&payType=0' + '&address=' + that.data.address + '&mobile=' + that.data.mobile + '&receiverName=' + that.data.receiverName
      //               //isSuccess 代表支付状态是否成功, payType 代表支付类型 0 商城 1 酒店 2 线路 3 定制游 4 会员卡
      //             })
      //             console.log('address')
      //           }
      //         },
      //         'fail': function (res) {
      //           wx.hideLoading()
      //           wx.redirectTo({
      //             url: '../payResult/payResult?orderNo=' + that.data.ordersn + '&balance=balance&isSuccess=' + false + '&payType=0' + '&Mywinning=' + that.data.pagetype + '&address=' + that.data.address + '&mobile=' + that.data.mobile + '&receiverName=' + that.data.receiverName
      //             //isSuccess 代表支付状态是否成功, payType 代表支付类型 0 商城 1 酒店 2 线路 3 定制游 4 会员卡
      //           })

      //         },
      //       })
      //     })
      //     wx.hideLoading()
      //   }
      // })
  },
  // 添加地址
  addressAdministration: function () {
    // wx.navigateTo({
    //   url: '/equityCard/pages/baina/addressList/index',
    // })
  },
  // 显示弹窗
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  // 隐藏弹窗
  hideModal: function () {
    this.setData({
      showModalStatus: false
    })
    // 隐藏遮罩层
    this.setData({
      showModalStatus: false,
    })
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
  },
  // 优惠券
  coupon: function () {
    this.showModal();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let Modeliphonex = 'iPhone X'
    let ModeliphonePro = 'iPhone Pro'
    console.log(options.type)
    this.setData({
      pagetype: options.pagetype,
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      cartId: options.cartId,
      amountnumber: options.amountnumber,
      goodid: options.goodid,
      type: options.type,
      addressAdministration: options.addressAdministration,
      labelName: options.labelName,
      // cardType: wx.getStorageSync('cardType'),
      leaderId: options.leaderId,
      skuid: options.skuid,
      addressIds: options.addressIds,
      addressType: options.addressType,
      areaId: options.areaId,
      cartType: options.cartType,
      ismodify: options.ismodify,
      productType: options.productType,
      productId: options.productId,
      video: options.video, //是否是视频中进入的  video 是
      cardType: wx.getStorageSync('cardType'),
      card_type:options.card_type
    })
    get('/app/v1/card/OrderCreate',{},(res)=>{
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
    })

    // wx.getSystemInfo({
    //   success: function (res) {
    //     that.setData({
    //       windowHeight: res.windowHeight
    //     })
    //     console.log(res.model)
    //     if (res.model.indexOf(Modeliphonex) > -1 || res.model.indexOf(ModeliphonePro) > -1) {
    //       console.log('---')
    //       that.setData({
    //         isFill: true
    //       })
    //     }
    //   }
    // })
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
  
        this.ordergopay()
      
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  // 兑换弹框
  exchangeBox: function () {
    this.setData({
      exchangeBoxShow: !this.data.exchangeBoxShow
    })
  },
  
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.data.ismodify == 'ismodify') {
      // wx.navigateBack({
      //   delta: 2
      // })
    }
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

  },
  // 点击修改密码
  updatePassword() {
    this.setData({
      alertShow: true,
      comIndex: 0
    })
    // 调用子级的倒计时
    this.selectComponent('#myCode').countdownFun()
  },
  // 子组件点击下一步事件
  nextAlert(e) {
    console.log(e.detail)
    this.setData({
      comIndex: e.detail
    })
  },
 
  // 右上角关闭
  closeMyself() {
    if (this.data.type == 'gopay') {
      this.setData({
        alertShow: false
      })
    } else {
      this.setData({
        alertShow: false
      })
      wx.showToast({
        title: '订单已取消',
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 2000)
    }
  },
  // 下一步
  nextAlert() {
    if (this.data.password.length != 6) {
      wx.showToast({
        title: '请输入6位密码',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.showLoading({
      title: '支付中',
    });
    this.intoStart()
    // this.triggerEvent('into', this.data.password)
    // this.triggerEvent('nextCom', 2)
  },
  // 输入密码
  setPsw(e) {
    this.setData({
      password: e.detail.value
    })
  },
  closeTypeAlert() {
    this.setData({
      alertChoseShow: false,
      cardchose: false,
      isgopay: true
    })
  },
  // 去支付
  toPay() {
    wx.hideLoading()
    if (this.data.address == 'NaNundefined') {
      wx.showToast({
        title: '至少添加一个收货地址',
        icon: 'none'
      })
      return false
    }
    this.setData({
      alertChoseShow: true,
      confirmSiteShow: false
    })
  },
  // 
  choseType(e) {
    var index = e.currentTarget.dataset.index
    console.log(this.data.balanceMoney > this.data.actualPrice)
    if (this.data.balanceMoney * 1 < this.data.actualPrice * 1 && index == '2') {
      wx.showToast({
        title: '余额不足，请选择其他支付方式',
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.setData({
      typeIndex: index
    })
  },
  // 关闭地址弹窗
  closeConfirm() {
    this.setData({
      confirmSiteShow: false
    })
  }
})