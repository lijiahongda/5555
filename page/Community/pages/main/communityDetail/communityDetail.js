// page/community/pages/main/communityDetail/communityDetail.js
import {
  groupActivationList,
  sendCoupon,
  flashDetail,
  ajaxTuijian,
  ajaxSkuidDetil
} from '../../../../../api/Community'



import {retrunScene} from "../../../../../utils/util"

import WxParse from "../../../../../wxParse/wxParse"
var app = getApp();
var timer = require('../../../../../utils/wxTimer-master/wxTimer.js')
let barrageTimerList = [] // 定时器倒计时

// var app = getApp().globalData
var glo = app.globalData
timer = glo.timer;
var wxTimer1;
var previewOnshow; // 解决图片预览 出发onshow
Page({
  /**   
   * 页面的初始数据
   */
  data: {
    isGroupLeader:0,
    showstatus:0,
    typeC: 1,
    danmuList: false,
    isPlay: false,
    isFill: false,
    three: 5,
    imagenum: 20,
    scrollTop: 0,
    scrollId: '', //选中ID
    tabIndex: 0,
    lineText: [{
      title: '宝贝'
    }, {
      title: '评论'
    },
    {
      title: '发圈素材'
    }, {
      title: '详情'
    }
    ],
    productType: 0,
    sureId: 0,
    Share: true,
    gopay: false,
    wxTimer: '',
    wxTimerSecond: '',
    wxTimerList: {},
    time: '00:00:10',
    isRushBuy: '距开抢时间',
    orderData: [],
    addressCode: 0,
    uid: '',
    token: '',
    codeNumber: '',
    bannerItem: [],
    showModalStatus: false, //弹窗状态
    showModal: false,
    selectLabel: '请选择规格',
    selectNum: '数量',
    mobile: '',
    label: [{
      name: '2.0kg/份',
      index: 1
    },
    {
      name: '4.0kg/份',
      index: 2
    }
    ],
    isaddress: false,
    amountNumber: 1,
    shoppingCartNumber: '',
    Tab: 0,
    title: '',
    moneyPrice: '266.20',
    image: '../../../../images/YueMall/banner.jpg',
    labelName: '',
    goodsId: '',
    goodDesc: '',
    goodPrice: '',
    vipPrice: '',
    cardType: '',
    current: 0,
    sharelayer: false,
    notBuyMessage: '', //想买这个东西,分人
    sizeSelectText: [],
    colorSize: [],
    statusArr: [], //各行规格默认选中项
    selectedSku: [], //选中sku的列表
    authorizationStatus: false, //授权按钮状态
    isDisplayFulltext: false,
    islimitInfo: false,
    realName: false, //是否实名
    channelIcon: '',
    canSend: 0, // 
    community: false, //分享群
    room_id: '', //群id
    groupList: [], //群列表
    shareImgB: '', //海报图判断
    reviewId: '', //评论id
    shareBtnShow: true //分享按钮的显示
  },
  handleSharePoster() {
    let that = this;
    //mid,productId,productSkuId,goodsType,goodsId,img,activityId,isH5,callback
    wx.showLoading({
      title:"海报生成中"
    })
    let mid = wx.getStorageSync("uid");
    let productId = this.data.goodsId;
    let goodsType = 1;
    let productSkuId = this.data.skuid;
    let goodsId = this.data.goodsId;
    let img = this.data.bannerItem[0];
    let activityId = that.data.activityId;
    let isH5 = 1;
    let discount = '';
    app.generatePoster(mid, productId, productSkuId, goodsType, goodsId, img, activityId, isH5,discount, function (res) {
      that.setData({
        showstatus: '1',
        posterUrl: res.data
      })
      wx.hideLoading();
    });
  },
  getGroupList() {
    groupActivationList({
      uid: wx.getStorageSync('uid'),
      type: '1',
      page: 1,
      pageSize: 10
    }).then(res => {
      this.setData({
        groupList: res.data
      })
    })
  },
  amountNumberInput: function (e) {
    this.setData({
      amountNumber: e.detail.value
    })
  },
  // 电话
  calltel: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
    })
  },

  GetSoupons: function (e) {
    let that = this
    let cid = e.detail.id
    sendCoupon({
      uid: wx.getStorageSync('uid'),
      cid: cid
    }).then(res => {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      for (let c of that.data.goodsCoupon) {
        if (c.cid == cid) {
          c.couponState = 1
        }
      }
      that.setData({
        goodsCoupon: that.data.goodsCoupon
      })
    })
  },
  limitInfohidden: function () {
    let that = this
    that.setData({
      islimitInfo: false
    })
  },
  limitInfo: function () {
    let that = this
    that.setData({
      islimitInfo: true
    })
  },
  lookAllarticle: function () {
    wx.navigateTo({
      url: '/page/Yuemall/pages/Allarticle/Allarticle?goodsId=' + this.data.goodsId,
    })
  },
  copyText: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success(res) {
        wx.getClipboardData({
          success(res) { }
        })
      },
      complete(res) { }
    })
  },
  DisplayFulltext: function () {
    console.log('====')
    this.setData({
      isDisplayFulltext: this.data.isDisplayFulltext ? false : true
    })
  },
  // 点击标题切换
  NavTab: function (e) {
    let that = this
    let cur = e.currentTarget.dataset.index;
    if (that.data.tabIndex == cur) {
      return false;
    } else {
      that.setData({
        tabIndex: cur,
        scrollId: 'd' + cur
      })
      console.log('d' + cur)
    }
  },
  // 查看更多评论
  lookComment: function () {
    wx.navigateTo({
      url: '/page/Yuemall/pages/lookComment/lookComment?productid=' + this.data.goodsId,
    })
  },
  // 群分享弹窗
  shareBtn: function () {
    this.setData({
      shareImgB: 1
    })
    if (wx.getStorageSync('uid')) {
      if (this.data.room_id != undefined) {
        this.setData({
          sharelayer: true,
          community: false
        })
      } else {
        this.setData({
          community: true
        })
      }
    } else {
      this.VerificationCode()
    }
  },
  // 关闭群分享弹窗
  closeQ() {
    this.setData({
      community: false
    })
  },
  share(e) {
    console.log(this.data.room_id)
    if (wx.getStorageSync('uid')) {
      if (this.data.room_id != undefined) {
        this.setData({
          sharelayer: true,
          shareImgB: 2,
          reviewId: e.detail.reviewId,
        })
      } else {
        this.setData({
          shareImgB: 2,
          reviewId: e.detail.reviewId,
          community: e.detail.community
        })
      }
    } else {
      this.VerificationCode()
    }
    console.log(this.data.shareImgB)
  },
  /**
   * 页面滑动
   */
  bindscroll: function (e) {
    // let data = this.data
    // let scrollTop = e.scrollTop
    // this.setData({
    //   scrollTop: e.detail.scrollTop
    // })
    // if (e.detail.scrollTop > 100) {
    //   wx.setNavigationBarColor({
    //     frontColor: '#ffffff',
    //     backgroundColor: '#CA2519',
    //     animation: {
    //       duration: 400,
    //       timingFunc: 'easeIn'
    //     }
    //   })
    // }
    // if (e.detail.scrollTop == 0) {
    //   wx.setNavigationBarColor({
    //     frontColor: '#000000',
    //     backgroundColor: '#ffffff',
    //     animation: {
    //       duration: 400,
    //       timingFunc: 'easeIn'
    //     }
    //   })
    // }
  },
  // 手机号验证码
  VerificationCode: function () {
    if (this.data.goodsType == 1 || this.data.goodsType == 3) {
      wx.navigateTo({
        url: '/page/Yuemall/pages/VerificationCode/VerificationCode?registerType=' + 1 + '&mobile=' + this.data.mobile
      })
    } else {
      wx.navigateTo({
        url: '/page/Yuemall/pages/VerificationCode/VerificationCode?mobile=' + this.data.mobile
      })
    }

  },
  // 销毁页面
  onUnload: function () {
    if (this.data.success == 'success') {
      wx.navigateBack({
        delta: 2
      })
    }
    wxTimer1 = null
  },
  // 图片点击事件
  imgYu: function (e) {
    var src = e.currentTarget.dataset.src; //获取data-src
    var imgList = e.currentTarget.dataset.list; //获取data-list
    //图片预览
    previewOnshow = true; //解决图片预览出发onshow
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
   handleBox(){
     this.setData({
       showstatus:0
     })
   },
  // 轮播 点击事件
  bindChange: function (e) {
    this.setData({
      current: e.detail.current
    })
  },
  // 倒计时
  startTimer: function (totalSecond) {
    let that = this
    // 倒计时
    var totalSecond;
    // totalSecond = that.data.statrstime
    totalSecond = totalSecond
    var interval = setInterval(function () {
      // 秒数
      var second = totalSecond;
      // 天数位
      var day = Math.floor(second / 3600 / 24);
      var dayStr = day.toString();
      if (dayStr.length == 1) dayStr = dayStr;

      // 小时位
      var hr = Math.floor((second - day * 3600 * 24) / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;

      // 分钟位
      var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;

      // 秒位
      var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;

      this.setData({
        countDownHour: hrStr,
        countDownMinute: minStr,
        countDownSecond: secStr,
        countDownDay: day
      });
      totalSecond--;
      if (totalSecond < 0) {
        that.detaildata()
        clearInterval(interval);
        this.setData({
          countDownHour: '00',
          countDownMinute: '00',
          countDownSecond: '00',
          countDownDay: '0'
        });

      }
    }.bind(this), 1000);
    barrageTimerList.push(interval)
  },

  //秒数 转化成天、小时、秒
  turnTimeFormat: function (seconds) {
    let day = Math.floor(seconds / 60 / 60 / 24);
    let hours = Math.floor(seconds / 60 / 60 % 24);
    let min = Math.floor(seconds / 60 % 60);
    let sec = Math.floor(seconds % 60);
    return {
      day: day,
      time: +hours + ':' + min + ':' + sec
    }
  },
  // 切换地址
  address: function () {
    if (wx.getStorageSync('uid')) {
      wx.navigateTo({
        url: '/page/Address/Address?Mywinning=' + 'datil',
      })
    }
  },
  // detail: function (e) {
  //   console.log(e.detail)
  //   wx.navigateTo({
  //     url: '/page/Yuemall/pages/details/details?goodsId=' + e.detail.data.goodsid + '&skuid=' + e.detail.data.skuid
  //   })
  // },
  // 播放视频
  PlayVideo: function () {
    this.setData({
      isPlay: true
    })
  },
  // 关闭视频
  closePlay: function () {
    this.setData({
      isPlay: false
    })
  },
  // 加载数据
  getOrderList: function () {
    wx.showLoading({
      title: '加载中',
    });
    let that = this;
    let obj = {}
    console.log(that.data.activityId)
    if (true) {
      // if (that.data.activityId) {
      obj = {
        goodsId: this.data.goodsId ? this.data.goodsId : 0,
        activityId: this.data.activityId,
        uid: wx.getStorageSync('uid'),
        room_id: this.data.room_id
        // room_id:''s
      }
    } else {
      obj = {
        product_id: this.data.goodsId ? this.data.goodsId : 0,
        product_sku_id: that.data.skuid,
        uid: wx.getStorageSync('uid'),
        productType: that.data.productType
      }
    }
    if (that.data.video == 'video') {
      obj.fromBy = 1 //1=>带货视频 0=>默认
    }
    flashDetail(obj).then(res => {
      if (res.productInfo.length == 0) {
        wx.showToast({
          title: '商品已下架',
          icon: 'none',
          duration: 2000,
          success: function () {
            setTimeout(function () {
              wx.navigateBack({
                delta: 1,
              })
            }, 2000)
          }
        })
      }
      wx.hideLoading()
      that.setData({
        title:res.productInfo.goodName,
        bannerItem: res.productInfo.banner,
        goodName: res.FlashGoodsInfo.goodName,
        goodDesc: res.productInfo.goodsInfo,
        goodVipPrice: res.FlashGoodsInfo.goodVipPrice,
        goodPrice: res.FlashGoodsInfo.goodPrice,
        priceName: res.productInfo.priceName,
        channelId: res.productInfo.channelId,
        describe: res.productInfo.describe,
        coupon: res.productInfo.coupon,
        address: res.areaInfo,
        colorSize: res.productInfo.saleList,
        goodFreight: res.productInfo.goodFreight,
        goodSupplier: res.productInfo.goodSupplier,
        goodContent: res.productInfo.goodContent,
        shareMoney: res.productInfo.shareMoney,
        Specificationsimg: res.productInfo.banner[0],
        deduc: res.productInfo.deduc,
        activityId: res.FlashGoodsInfo.activityId,
        flashEndTime: res.FlashGoodsInfo.endTime,
        flashStartTime: res.FlashGoodsInfo.startTime,
        nowTime: res.FlashGoodsInfo.nowTime,
        buyLimit: res.FlashGoodsInfo.buyLimit,
        collectState: res.productInfo.collectState,
        skuid: res.FlashGoodsInfo.productSkuId,
        type: res.FlashGoodsInfo.type,
        state: res.areaInfo.state,
        comment: res.productInfo.comment,
        isIdentification: res.isIdentification,
        RushState: res.FlashGoodsInfo.state,
        channelIcon: res.productInfo.channelIcon,
        seckillPrice: res.FlashGoodsInfo.seckillPrice,
        startHour: res.FlashGoodsInfo.startHour,
        cardType: res.identityType,
        isStock: res.FlashGoodsInfo.isStock, //是否抢光
        isReserve: res.FlashGoodsInfo.isReserve, //是否预约
        shoppingCartNumber: res.productInfo.cartTotal,
        goodsFlashState: res.FlashGoodsInfo.state, //抢购状态 0 无抢购商品 1正在抢购 2即将抢购
        newShareScore: res.productInfo.newShareScore,
        instruction:res.productInfo.instruction
      })

      if (res.productInfo.activityPrice) {
        that.setData({
          goodsType: 3, // 活动价格
          showPrice: res.productInfo.activityPrice,
          hiddenPrice: res.productInfo.nowPrice
        })
      }
      console.log(res.productInfo.isAppointment)
      if (res.productInfo.articleInfo.totalCount == 0) { //没有素材圈时
        that.setData({
          lineText: [{
            title: '宝贝'
          }, {
            title: '评论'
          }, {
            title: '详情'
          }],
        })
      } else { //有素材圈时
        that.setData({
          lineText: [{
            title: '宝贝'
          }, {
            title: '评论'
          },
          {
            title: '发圈素材'
          }, {
            title: '详情'
          }
          ]
        })
      }
      if (res.productInfo.channelId == 0) {
        if (res.productInfo.instruction != '') {
          that.data.lineText.push({
            title: '购买须知'
          })
          that.setData({
            lineText: that.data.lineText
          })
        }
      }

      if (res.productInfo.saleList != '') {
        that.initSelected(res.productInfo.saleList, that.data.skuid)
      } else {
        console.log('00000')
        that.skuidDetil()
      }
      ajaxTuijian({
        uid: wx.getStorageSync('uid'),
        goodsId: res.productInfo.product_id
      }).then(res => {
        console.log(res)
        if (res.code == 200) {
          that.setData({
            recommendGoods: res.data
          })
        } else {
          console.log('=====+++')
          that.setData({
            recommendGoods: []
          })
        }
      })

      if (res.FlashGoodsInfo.state == 1) {
        that.startTimer(res.FlashGoodsInfo.startTime - res.FlashGoodsInfo.nowTime)
      } else {
        that.startTimer(res.FlashGoodsInfo.endTime - res.FlashGoodsInfo.nowTime)
      }
      WxParse.wxParse('article', 'html', res.productInfo.goodContent, that, 5);
    })

  },
  // 去支付
  gopay: function (e) {
    let that = this
    if (that.data.isCanBuy == 0) {
      wx.showToast({
        title: that.data.notBuyMessage,
        icon: 'none',
        duration: 2000
      })
      return
    }
    that.setData({
      sureId: 2
    })
    that.showModal();
    that.setData({
      Share: false,
      gopay: true
    })
  },
  // 未实名 点击确认
  closeRealName: function () {
    this.setData({
      realName: false
    })
    this.hideModal()
  },
  // 确定
  sure: function (e) {
    let that = this
    if (e.currentTarget.dataset.id == 1) { //加入购物车
      if (that.data.amountNumber != 0) {
        if (that.data.leaderId == undefined || that.data.leaderId == '') { //大人
          that.setData({
            leaderId: 0
          })
        }

        post('/mall/cart/create2', {
          product_id: that.data.goodsId,
          product_sku_id: that.data.last_sku,
          uid: wx.getStorageSync('uid'),
          activity_Id: that.data.activityId,
          goodsNum: that.data.amountNumber,
          share_form: app.globalData.shareForm,
          position_from: app.globalData.positionFrom
        }, (res) => {
          console.log(res, 7777)
          if (res.data.status == 200) {
            wx.showToast({
              title: '加入成功',
              icon: 'none'
            })
            console.log(res.data.data.cartTotalNum)
            that.setData({
              shoppingCartNumber: res.data.data.cartTotalNum,
              cartGoodsNum: res.data.data.cartGoodNum
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        }, 1, that.data.token, true, that.data.uid, 4)
      } else {
        wx.showToast({
          title: '至少选择一个商品',
          icon: 'none'
        })
      }
    } else {
      // 是否已开抢
      if (that.data.RushState == 1) {
        wx.showToast({
          title: '该商品未开抢',
          icon: 'none'
        })
        return
      }

      // 已抢光
      if (that.data.isStock == 0) {
        wx.showToast({
          title: '该商品已抢光',
          icon: 'none'
        })
        return
      }
      if (e.currentTarget.dataset.amountnumber == 0) {
        wx.showToast({
          title: '请选择规格数量',
          icon: 'none'
        })
      } else {
        let addressIds = that.data.addressCode == 0 ? (that.data.address.proviceId + '_' + that.data.address.cityId + '_' + that.data.address.zoneId + '_' + that.data.address.townId == '' ? 0 : that.data.address.townId) : that.data.addressCode
        let addressType = that.data.channelId == 3 ? 1 : 0
        wx.navigateTo({
          url: '/page/order/RushBuyBalance/RushBuyBalance?Entrance=' + 'RushBuy' + '&goodsnum=' + e.currentTarget.dataset.amountnumber + '&goodid=' + e.currentTarget.dataset.goodid + '&skuid=' + that.data.skuid + '&areaid=' + that.data.address.addressId + '&activityId=' + that.data.activityId + '&type=' + that.data.type + '&room_id=' + that.data.room_id
        })
      }
    }
    that.hideModal()
  },
  // // 确定
  // sure: function(e) {
  //   let that = this
  //   console.log(that.data.channelId, '=====', that.data.isIdentification)

  //   // 判断是否是行云商品 是否实名认证
  //   if (that.data.channelId == 7 && that.data.isIdentification == 0) {
  //     that.setData({
  //       realName: true
  //     })
  //     return
  //   }


  //   if ((this.data.amountNumber > this.data.inventory) && this.data.channelId != 3) {
  //     wx.showToast({
  //       title: '库存数不足请重新选择数量',
  //       icon: 'none'
  //     })
  //   } else if (this.data.channelId == 7 && (this.data.amountNumber < this.data.startBuy)) {
  //     wx.showToast({
  //       title: '该商品最少购买' + this.data.startBuy + '件',
  //       icon: 'none'
  //     })
  //   } else if (this.data.channelId == 7 && (this.data.amountNumber > this.data.endBuy)) {
  //     wx.showToast({
  //       title: '该商品最多购买' + this.data.endBuy + '件',
  //       icon: 'none'
  //     })
  //   } else {
  //     if (e.currentTarget.dataset.id == 1) { //加入购物车
  //       if (that.data.amountNumber != 0) {
  //         if (that.data.leaderId == undefined || that.data.leaderId == '') { //大人
  //           that.setData({
  //             leaderId: 0
  //           })
  //         }

  //         post('/mall/cart/create', {
  //           product_id: that.data.goodsId,
  //           product_sku_id: that.data.last_sku,
  //           uid: wx.getStorageSync('uid'),
  //           product_num: that.data.amountNumber
  //         }, (res) => {
  //           console.log(res, 7777)
  //           if (res.data.status == 200) {
  //             wx.showToast({
  //               title: '加入成功',
  //               icon: 'none'
  //             })
  //             that.setData({
  //               shoppingCartNumber: res.data.data.cartTotalNum,
  //               cartGoodsNum: res.data.data.cartGoodNum
  //             })
  //           } else {
  //             wx.showToast({
  //               title: res.data.msg,
  //               icon: 'none'
  //             })
  //           }
  //         }, 1, that.data.token, true, that.data.uid, 4)
  //       } else {
  //         wx.showToast({
  //           title: '至少选择一个商品',
  //           icon: 'none'
  //         })
  //       }
  //     } else if (e.currentTarget.dataset.id == 2) { //立即购买2
  //       if (e.currentTarget.dataset.amountnumber == 0) {
  //         wx.showToast({
  //           title: '请选择规格数量',
  //           icon: 'none'
  //         })
  //       } else {

  //         console.log(e.currentTarget.dataset.amountnumber, '------=====---=')
  //         console.log(that.data.addressCode, 'addressCode')
  //         let addressIds = that.data.addressCode == 0 ? (that.data.address.proviceId + '_' + that.data.address.cityId + '_' + that.data.address.zoneId + '_' + that.data.address.townId == '' ? 0 : that.data.address.townId) : that.data.addressCode
  //         let addressType = that.data.channelId == 3 ? 1 : 0
  //         let video = that.data.video == 'video' ? 'video' : ''
  //         if (that.data.isZhiboGoods == 1) {
  //           video = 'zhibo'
  //         }
  //         console.log('/page/Yuemall/pages/balance/balance?type=' + 'gopay' + '&amountnumber=' + e.currentTarget.dataset.amountnumber + '&goodid=' + e.currentTarget.dataset.goodid + '&labelName=' + that.data.labelName + '&leaderId=' + that.data.leaderId + '&skuid=' + that.data.skuid + '&addressIds=' + addressIds + '&areaId=' + that.data.address.addressId + '&addressType=' + addressType + '&productType=' + that.data.productType + '&video=' + video)
  //         // return
  //         wx.navigateTo({
  //           url: '/page/Yuemall/pages/balance/balance?type=' + 'gopay' + '&amountnumber=' + e.currentTarget.dataset.amountnumber + '&goodid=' + e.currentTarget.dataset.goodid + '&labelName=' + that.data.labelName + '&leaderId=' + that.data.leaderId + '&skuid=' + that.data.skuid + '&addressIds=' + addressIds + '&areaId=' + that.data.address.addressId + '&addressType=' + addressType + '&productType=' + that.data.productType + '&video=' + video
  //         })
  //       }
  //     }

  //     that.hideModal()
  //     that.getOrderList()
  //   }

  // },
  // 悦豆抵扣规则
  CouponsRule: function () {
    wx.navigateTo({
      url: '/page/CardVolume/pages/Explain/Explain',
    })
  },
  // 购物车
  GoCart: function (e) {
    if (wx.getStorageSync('uid')) {
      wx.navigateTo({
        url: '/page/Yuemall/pages/Cart/Cart',
      })
    } else {
      this.VerificationCode()
    }
  },
  // 规格
  swichLabel: function (e) {
    let that = this
    //选中index

    var index = e.currentTarget.dataset.idx;
    //选中行index
    var data_index = e.currentTarget.dataset.index;
    that.selectLabel(index, data_index);
  },
  selectLabel(index, data_index) {
    let that = this;
    let colorSize = that.data.colorSize;
    var idx = index;
    // let arr=[]
    //选中sku
    var sku = colorSize[index].buttons[data_index]['skuList']
    //选中第几行第几个
    console.log(that.data.statusArr)
    that.data.statusArr[index] = data_index
    console.log(that.data.statusArr[index])
    //取出其他sku
    let m = []
    that.setData({
      sizeSelectText: []
    })
    var is_selected_skus = {};
    this.data.statusArr.map((b, a) => {
      if (a != idx && (typeof this.data.statusArr[a] != "undefined")) {
        is_selected_skus[a] = colorSize[a].buttons[this.data.statusArr[a]].skuList;
      }
      that.data.sizeSelectText.push(colorSize[a].buttons[this.data.statusArr[a]].text)
      console.log(colorSize[a].buttons[this.data.statusArr[a]].text)
    })
    for (let i = 0; i < colorSize.length; i++) {
      var channel_data = colorSize[i].buttons;

      for (let j = 0; j < channel_data.length; j++) {
        if (i != idx) {
          var sku_isists = Array.intersect(sku, channel_data[j].skuList);
          for (let [c, d] in is_selected_skus) {
            if (c != i) {
              sku_isists = Array.intersect(sku_isists, is_selected_skus[c]); //is_selected_skus非当前行其他行选中的元素
            }
          }
          if (sku_isists.length) {
            colorSize[i].buttons[j].isEnable = true;
          } else {
            colorSize[i].buttons[j].isEnable = false;
          }
        } else {
          if (j == data_index) {
            colorSize[i].buttons[j].isEnable = true;
          } else if (colorSize.length == 1) {
            colorSize[i].buttons[j].isEnable = true;
          }
        }
      }
    }
    let last_sku = sku
    for (let [c, d] in is_selected_skus) {
      last_sku = Array.intersect(last_sku, is_selected_skus[c]);
    }
    console.log(this.data.statusArr)
    this.setData({
      statusArr: this.data.statusArr,
      colorSize: colorSize,
      last_sku: last_sku[0],
      skuid: last_sku[0],
      sizeSelectText: that.data.sizeSelectText
    })
    console.log(that.data.sizeSelectText, this.data.statusArr)
    this.skuidDetil()
  },
  // 找相似
  FindSimilarity: function () {
    console.log('FindSimilarity')
    let that = this;
    let type = that.data.channelId
    let typeId = that.data.categoryArr.third
    let parentTypeId = that.data.categoryArr.first
    let topCategoryName = that.data.topCategoryName
    console.log(type)
    if (type == 3) { //京东
      wx.navigateTo({
        url: '/page/Yuemall/pages/JDList/JDList?aid=' + parentTypeId + '&currentTab=' + typeId + '&title=' + topCategoryName + '&id=' + typeId + '&channelId=' + that.data.channelId + '&categoryThreeId=""',
      })
    } else if (type == 2) { //网易
      let second = that.data.categoryArr.second
      wx.navigateTo({
        url: '/page/Yuemall/pages/Monastery/Monastery?parentTypeId=' + parentTypeId + '&name=' + topCategoryName + '&url=' + '/mall/yanListByType' + '&id=' + second,
      })
    } else if (type == 1) { //寺库
      wx.navigateTo({
        url: '/page/Yuemall/pages/Monastery/Monastery?parentTypeId=' + parentTypeId + '&id=' + typeId + '&name=' + topCategoryName + '&url=' + '/mall/skuListByType',
      })
    } else if (type == 0) { //全球购
      wx.navigateTo({
        url: '/page/Yuemall/pages/Monastery/Monastery?parentTypeId=' + parentTypeId + '&goodTypeId=' + typeId + '&name=' + topCategoryName + '&id=' + typeId + '&typePage=' + 'quanqiugou' + '&url=' + '/mall/allEarthList'
      })
    }
  },
  // sku详情
  skuidDetil: function () {
    let that = this
    ajaxSkuidDetil({
      uid: that.data.uid,
      addressCode: that.data.addressCode,
      product_sku_id: that.data.skuid,
      productType: that.data.productType
    }).then(res=>{
      if (res.code == 200) {
        that.setData({
          Specificationsimg: res.data.img,
          priceName: res.data.priceWord,
          inventory: res.data.inventory,
          goodsId: res.data.productId,
          isSale: res.data.isSale,
          state: res.data.address.state,
          channelId: res.data.channelId,
          categoryArr: res.data.categoryArr,
          topCategoryName: res.data.topCategoryName,
          endBuy: res.data.endBuy, //行云商品 最高购买量
          startBuy: res.data.startBuy, //行云商品 最低购买量
          isZhiboGoods: res.data.isZhiboGoods,
          zhiboOriginPrice: res.data.zhiboOriginPrice,
          zhiboPrice: res.data.zhiboPrice,
          goodsType: res.data.goodsType, //是什么价
        })
        if (res.data.activityPrice) {
          that.setData({
            goodsType: 3, // 活动价格
            showPrice: res.data.activityPrice,
            hiddenPrice: res.data.nowPrice
          })
        }
        console.log(that.data.isZhiboGoods)
        if (that.data.isaddress == false) {
          if (res.data.address.length != 0) {
            that.setData({
              address: res.data.address,
              addressCode: res.data.address.proviceId + '_' + res.data.address.cityId + '_' + res.data.address.zoneId + '_' + (res.data.address.townId ? res.data.address.townId : '0')
            })
          }
        }
        this.getShareInfo();
      } else {
        wx.showToast({
          title: res.msg,
          icon: "none"
        })
      }
    })
  },

  // 添加商品数量
  addNumber: function (e) {
    let num = e.currentTarget.dataset.num;
    let that = this
    console.log(that.data.amountNumber)
    console.log(that.data.endBuy)

    if ((that.data.amountNumber >= that.data.inventory) && that.data.channelId != 3) {
      wx.showToast({
        title: '库存数不足请重新选择数量',
        icon: 'none'
      })
      return
    }
    if ((that.data.amountNumber >= that.data.endBuy) && that.data.channelId == 7) {
      wx.showToast({
        title: '行云商品最多可购买' + that.data.endBuy + '个',
        icon: 'none'
      })
      return
    }

    that.setData({
      amountNumber: num + 1
    })

  },
  // 减少商品数量
  subtract: function (e) {
    let num = e.currentTarget.dataset.num
    let that = this

    if (num != 1) {
      if ((that.data.amountNumber <= that.data.startBuy) && that.data.channelId == 7) {
        wx.showToast({
          title: '行云商品最少可购买' + that.data.startBuy + '个',
          icon: 'none'
        })
        return
      }
      this.setData({
        amountNumber: num - 1
      })
    } else {
      wx.showToast({
        title: '受不了了，宝贝不能在减少了哦',
        icon: 'none'
      })
    }
  },
  /**
   * 加入购物车 返回商品总数加上用户选择规格数量相加 goodNum
   * */
  addCart: function (e) {
    let that = this
    if (wx.getStorageSync('uid')) {
      if (that.data.state == 0) {
        wx.showToast({
          title: '请选择配送地',
          icon: 'none'
        })
      } else {
        if (that.data.isCanBuy == 0) {
          wx.showToast({
            title: that.data.notBuyMessage,
            icon: 'none',
            duration: 2000
          })
          return
        }
        that.showModal();
        that.setData({
          Share: false,
          gopay: true
        })
      }
    } else {
      this.VerificationCode
    }
  },
  //禁止滑动  
  disMove: function () {

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
    this.getOrderList()
    this.setData({
      showModal: false,
      Share: true,
      gopay: false
    })
    // 隐藏遮罩层
    this.setData({
      showModal: false,
    })
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  // 隐藏分享
  hideModalShare: function () {
    this.setData({
      showModal: false
    })
    // 隐藏遮罩层
    this.setData({
      showModal: false,
    })
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
    this.getOrderList()
  },
  // 选择规格
  ToUp: function () {
    let that = this
    // if (wx.getStorageSync('uid')) {
    if (that.data.state == 0) {
      wx.showToast({
        title: '请选择配送地',
        icon: 'none'
      })
    } else {
      that.showModal();
      that.setData({
        Share: false,
        gopay: true
      })
    }
    // }
  },
  // 加入会员
  join: function (e) { //加入悦旅会
    wx.switchTab({
      url: '/page/EliteCard/EliteCard',
    })
  },

  onLoad: function (options) {


    this.setData({
      isGroupLeader:wx.getStorageSync("isGroupLeader") || 0
    })


    let that = this
    let scene = '';
    let reCode = '';
    let activityId = '';
    let goodsId = '';
    let skuid = ''
    let room_id = ''
    let productType = 0
    let Modeliphonex = 'iPhone X'
    let ModeliphonePro = 'iPhone Pro'
    if (options.scene != null) {
      console.log(options)
      retrunScene(options.scene, function (sceneObj) {
        console.log(sceneObj)
        reCode = sceneObj.C;
        goodsId = sceneObj.I;
        skuid = sceneObj.U
        activityId = sceneObj.A
      });
    } else {
      reCode = options.reCode;
      goodsId = options.goodsId;
      skuid = options.skuid;
      room_id = options.room_id
      productType = options.productType ? options.productType : 0;
      activityId = options.activityId
    }
    this.getGroupList()
    console.log(options, 'option')
    that.setData({
      room_id: room_id,
      shareBtnShow: room_id == '' ? true : false,
      goodsId: goodsId,
      skuid: skuid,
      leaderId: options.leaderId,
      isLeader: options.isLeader,
      lng: wx.getStorageSync('lng'),
      lat: wx.getStorageSync('lat'),
      activityId: activityId,
      productType: productType,
      video: options.video, //判断是否是从视频进入的  video是
    })
    //取自己的邀请码
    wx.getStorage({
      key: 'selfReCode',
      success: function (res) {
        that.setData({
          reCode: res.data
        })
      }
    })

    that.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      // cardType: wx.getStorageSync('cardType'),
      RushBuy: options.RushBuy,
      success: options.success,
      isFree: options.isFree
    })
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
  onPullDownRefresh: function () {

  },
  getShareInfo(){
    let that = this;
    app.miniWxShare({
      shareType: 1,
      goods_id:this.data.goodsId,
      product_sku_id:this.data.skuid,
      goodVipPrice:this.data.goodVipPrice

    }, function (res) {

      console.log("--------------------成功");


      that.setData({
        shareInfoData:res
      })
    })

  },


  onShow: function () {





    let that = this;
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let options = currentPage.options;
    // this.initSelected(this.data.colorSize, '100000942707')
    //扫码参数分解
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
    console.log(options, '[[[[[[]]]]]=====-----')
    that.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      selectLabel: '请选择规格',
      selectNum: '数量',
      amountNumber: 1
    })
    wx.getStorageSync('selfReCode')
    if (that.data.isaddress == false) {
      that.getOrderList()
    }
    let interval = setInterval(function () {
      let m = new Date().getMinutes();
      if (m = 0) {
        that.getOrderList()
      }
    }, 60000)
    wx.setStorage({
      key: 'curCar',
      data: '1',
    })
    // wx.clearStorage('mapId')
    if (wx.getStorageSync('uid')) {
      //已经绑定了
      console.log('已经绑定了')
      that.setData({
        authorizationStatus: false
      })
      wx.showShareMenu({
        withShareTicket: true
      })
    } else {
      wx.hideShareMenu()
      that.setData({
        authorizationStatus: true
      })
    }
    console.log(wx.getStorageSync('ortherReCode') + '分享者id')
    let ortherRecode = wx.getStorageSync('ortherReCode') ? wx.getStorageSync('ortherReCode') : 0
    barrageTimerList.forEach((item, index) => {
      clearInterval(item)
    })
    barrageTimerList = []
    app.globalData.isSetList = false
  },

  onShareAppMessage: function () {
    let that = this;
    let goodsid = this.data.goodsId;
    let uid = wx.getStorageSync('uid');
    // app.miniWxShare(goodsid,uid,1,function(res){
    //   console.log("分享对象",res)
    // })

    let nickname = wx.getStorageSync("nickname")
    let selfReCode = wx.getStorageSync("selfReCode");

    console.log(      "path:", "page/community/pages/main/communityDetail/communityDetail" + "?reCode=" + selfReCode + "&goodsId=" + goodsid + '&uid=' + wx.getStorageSync('uid') + "&skuid=" + that.data.skuid + '&productType=' + that.data.productType + '&room_id=' + this.data.room_id + '&activityId=' + this.data.activityId
    )
  return {
      title: '[' + nickname + '邀请你一起抢购]' + this.data.title,
      imageUrl: this.data.shareInfoData.img,
      path: "page/community/pages/main/communityDetail/communityDetail" + "?reCode=" + selfReCode + "&goodsId=" + goodsid + '&uid=' + wx.getStorageSync('uid') + "&skuid=" + that.data.skuid + '&productType=' + that.data.productType + '&room_id=' + this.data.room_id + '&activityId=' + this.data.activityId
    }

  },

 
  // 首页
  gohome: function () {
    wx.switchTab({
      url: "/page/Mall/YueMall",
    })
  },
  // 页面内分享
  onShare: function (e) {
    var roomid = e.currentTarget.dataset.roomid
    console.log(roomid)
    this.setData({
      room_id: roomid
    })
    if (wx.getStorageSync('uid')) {
      this.setData({
        sharelayer: true,
        community: false
      })
    } else {
      this.VerificationCode()
    }
  },
  // 关闭分享
  shareLayerClosed: function () {
    this.setData({
      sharelayer: false
    })
  },

  goPoster: function () {
    wx.showLoading({
      title: '海报生成中',
    })
    if (this.data.shareImgB == 1) {
      //商品海报
      post('/mall/community/goodsPosterShare', {
        "uid": wx.getStorageSync('uid'), //用户ID —必填
        "roomId": this.data.room_id,
        "goodsId": this.data.goodsId,
        "activityId": this.data.activityId
      }, (res) => { // 获取分享图片 ajax
        console.log(res)
        wx.previewImage({
          current: res.data.img, // 当前显示图片的http链接
          urls: [res.data.img] // 需要预览的图片http链接列表
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4);
      // mall / community / goodsPosterShare
    } else {
      console.log(this.data.room_id)
      //评论海报
      post('/mall/community/commentPosterShare', {
        "uid": wx.getStorageSync('uid'), //用户ID —必填
        "roomId": this.data.room_id,
        "reviewId": this.data.reviewId,
        "activityId": this.data.activityId
      }, (res) => { // 获取分享图片 ajax
        console.log(res)
        wx.previewImage({
          current: res.data.img, // 当前显示图片的http链接
          urls: [res.data.img] // 需要预览的图片http链接列表
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4);
    }
    // wx.navigateTo({
    //   url: "/page/other/pages/poster/poster?goodsId=" + this.data.goodsId + '&url=' + '/share/MallProductForward' + '&id=' + 'goods' + '&skuid=' + this.data.skuid + '&activityPrice=' + this.data.activityPrice,
    // })
  },

  /**
   * 初始化默认选中项
   */
  initSelected: function (colorsize, skuid) {
    let arr = new Array(colorsize.length)
    for (let i = 0; i < colorsize.length; i++) {
      for (let j = 0; j < colorsize[i].buttons.length; j++) {
        // colorsize[i].buttons[j].isEnable = true
        if (colorsize[i].buttons[j].skuList.indexOf(Number(skuid)) > -1) {
          // this.data.statusArr[i] = j
          this.selectLabel(i, j);
        }
      }
    }
  },
  in_array(stringToSearch, arrayToSearch) {
    for (var s = 0; s < arrayToSearch.length; s++) {
      var thisEntry = arrayToSearch[s].toString();
      if (thisEntry == stringToSearch) {
        return true;
      }
    }
    return false;
  }

})