// // import {
// //   getMemberProductDetail,
// //   productDetail,
// // } from '../../../../utils/mall.js';
// // import {
// //   getAddressList,
// //  } from '../../../../api/user.js';
// import WxParse from "../../../../wxParse/wxParse.js"

// import {
//   post,get
// } from "../../../../utils/api"

// var app = getApp();
// // var app = getApp().globalData
// var glo = app.globalData

// var previewOnshow; // 解决图片预览 出发onshow
// Page({
//   /**
//    * 页面的初始数据
//    */
//   data: {
//     isFill: true,
//     binding: false,
//     three: 5,
//     imagenum: 20,
//     scrollTop: 0,
//     scrollId: '', //选中ID
//     tabIndex: 0,
//     lineText: [{
//       title: '宝贝'
//     }, {
//       title: '评论'
//     }, {
//       title: '详情'
//     }],

//     sureId: 0,
//     Share: true,
//     gopay: false,
   
//     time: '00:00:10',
//     isRushBuy: '距开抢时间',
//     orderData: [],
//     addressCode: 0,
//     uid: '',
//     token: '',
//     codeNumber: '',
//     bannerItem: [],
//     showModalStatus: false, //弹窗状态
//     showModal: false,
//     selectLabel: '请选择规格',
//     selectNum: '数量',
//     mobile: '',
//     label: [{
//       name: '2.0kg/份',
//       index: 1
//     },
//     {
//       name: '4.0kg/份',
//       index: 2
//     }
//     ],
//     isaddress: false,
//     amountNumber: 1,
//     shoppingCartNumber: '',
//     Tab: 0,
//     title: '',
//     moneyPrice: '266.20',
//     image: '../../../../images/YueMall/banner.jpg',
//     labelName: '',
//     goodsId: '',
//     goodDesc: '',
//     goodPrice: '',
//     vipPrice: '',
//     cardType: '',
//     current: 0,
//     sharelayer: false,
//     notBuyMessage: '', //想买这个东西,分人
//     sizeSelectText: [],
//     colorSize: [],
//     statusArr: [], //各行规格默认选中项
//     selectedSku: [], //选中sku的列表
//     channelIcon: '',
//     recommendGoods: [], // 推荐
//     showCardType: false,
//     authorizationStatus: false ,//授权按钮状态
//     limit:8
//   },
//   tipMember: function () {
//     wx.showToast({
//       title: '您已是店主',
//       icon: 'none'
//     })
//   },
//   amountNumberInput: function (e) {
//     this.setData({
//       amountNumber: e.detail.value
//     })
//   },
  
//   // // 手机号验证码
//   // VerificationCode: function () {
//   //   wx.navigateTo({
//   //     url: '/page/Yuemall/pages/VerificationCode/VerificationCode'
//   //   })
//   // },
//   // 
//   // 供应商
//   copyText: function (e) {
//     wx.setClipboardData({
//       data: e.currentTarget.dataset.text,
//       success(res) {
//         wx.getClipboardData({
//           success(res) { }
//         })
//       },
//       complete(res) { }
//     })
//   },
//   checkMemberChangePower: function () {
//     let that = this
//     // post('/app/member/basic/update/checkMemberChangePower', {}, (res) => {
//     //   if (res.data.code == 200) {
//     //     console.log(res)
//     //     that.setData({
//     //       flag: res.data.data.flag,
//     //       nickName: res.data.data.nickname,
//     //       codeNumber: res.data.data.codeNumber,
//     //       headimgurl: res.data.data.headimgurl
//     //     })
//     //   } else {
//     //     wx.showToast({
//     //       title: res.data.msg,
//     //       icon: "none"
//     //     })
//     //   }
//     // }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
//   },

//   // 点击标题切换
//   NavTab: function (e) {
//     let that = this
//     let cur = e.currentTarget.dataset.index;
//     if (that.data.tabIndex == cur) {
//       return false;
//     } else {
//       that.setData({
//         tabIndex: cur,
//         scrollId: 'd' + cur
//       })
//       console.log('d' + cur)
//     }
//   },
//   // 查看更多评论
//   lookComment: function () {
//     wx.navigateTo({
//       url: '/page/Yuemall/pages/lookComment/lookComment?productid=' + this.data.goodsId,
//     })
//   },
//   /**
//    * 页面滑动
//    */
//   bindscroll: function (e) {
//     let data = this.data
//     let scrollTop = e.scrollTop
//     this.setData({
//       scrollTop: e.detail.scrollTop
//     })
//     if (e.detail.scrollTop > 100) {
//       wx.setNavigationBarColor({
//         frontColor: '#ffffff',
//         backgroundColor: '#F34746',
//         animation: {
//           duration: 400,
//           timingFunc: 'easeIn'
//         }
//       })
//     }
//     if (e.detail.scrollTop == 0) {
//       wx.setNavigationBarColor({
//         frontColor: '#000000',
//         backgroundColor: '#ffffff',
//         animation: {
//           duration: 400,
//           timingFunc: 'easeIn'
//         }
//       })
//     }
//   },
//   // 销毁页面
//   onUnload: function () {
//     // if (this.data.success == 'success') {
//     //   wx.navigateBack({
//     //     delta: 2
//     //   })
//     // }
//   },
//   // 图片点击事件
//   imgYu: function (e) {
//     var src = e.currentTarget.dataset.src; //获取data-src
//     var imgList = e.currentTarget.dataset.list; //获取data-list
//     //图片预览
//     previewOnshow = true; //解决图片预览出发onshow
//     wx.previewImage({
//       current: src, // 当前显示图片的http链接
//       urls: imgList // 需要预览的图片http链接列表
//     })
//   },
//   //收藏
  
//   // 轮播 点击事件
//   bindChange: function (e) {
//     this.setData({
//       current: e.detail.current
//     })
//   },

//   // 切换地址
//   address: function () {
//     // if (wx.getStorageSync('uid')) {
//     //   wx.navigateTo({
//     //     url: '/page/Yuemall/pages/addressAdministration/addressAdministration?Mywinning=' + 'datil',
//     //   })
//     // } else {
//       wx.navigateTo({
//         url: '/page/MyOther/pages/addressList/index?mobile=' + this.data.mobile + '&codeNumber=' + this.data.codeNumber
//       })
//     // }
//   },
//   PlayVideo: function () {
//     this.setData({
//       isPlay: true
//     })
//   },
//   // 关闭视频
//   closePlay: function () {
//     this.setData({
//       isPlay: false
//     })
//   },
//   // 加载数据
//   getOrderList: function () {
//     wx.showLoading({
//       title: '加载中',
//     });
//     let that = this;
//     let obj = {}
  
//       obj = {
//         product_id: that.data.goodsId,
//         product_sku_id: that.data.skuid,
//         type:that.data.card_type
//       }
//     getMemberProductDetail(obj).then(res => {
//       wx.hideLoading()
//       console.log(res,'resresres-----=====')
//       that.setData({
//         colorSize: res.data.saleList,
//         bannerItem: res.data.banner,
//         Specificationsimg: res.data.banner[0],
//         title: res.data.goodName,
//         goodDesc: res.data.goodDesc,
//         goodContent: res.data.goodContent,
//         goodVipPrice: res.data.vip_price,
//         goodId: res.data.product_id,
//         goodPrice: res.data.price,
//       })
//       this.initSelected(res.data.saleList, that.data.skuid)
//       this.getAddressList()
//       WxParse.wxParse('article', 'html', res.data.goodContent, that, 5);
//     })
//   },
//   // 去支付
//   gopay: function (e) {
//     let that = this
//     if (that.data.isCanBuy == 0) {
//       wx.showToast({
//         title: that.data.notBuyMessage,
//         icon: 'none',
//         duration: 2000
//       })
//       return
//     }
//     that.setData({
//       sureId: 2
//     })
//     that.showModal();
//     that.setData({
//       Share: false,
//       gopay: true
//     })
//   },
 

//   // 确定
//   sure:function(e){
//     let that = this
//     if((this.data.amountNumber > this.data.inventory) && this.data.channelId != 3){
//       wx.showToast({
//         title: '库存数不足请重新选择数量',
//         icon: 'none'
//       })
//     }else if(e.currentTarget.dataset.amountnumber == 0){
//       wx.showToast({
//         title: '请选择规格数量',
//         icon: 'none'
//       })
//     }else if(!that.data.address){
//       wx.showToast({
//         title: '请选择收货地址',
//         icon: 'none'
//       })
//     }else{
//       console.log(that.data.address,'00000000000000')
//         let proviceId = that.data.address.proviceId == '' ? 0 : that.data.address.proviceId
//         let cityId = that.data.address.cityId == '' ? 0 : that.data.address.cityId
//         let zoneId = that.data.address.zoneId == '' ? 0 : that.data.address.zoneId
//         let townId = that.data.address.townId == '' ? 0 : that.data.address.townId
//         let addressIds = proviceId + '_' + cityId + '_' + zoneId + '_' + townId
//         // console.log(townId, 'townId')
//         // let add = that.data.addressCode ? that.data.addressCode : addressIds
//         // console.log(add)
//         let addressType = that.data.channelId == 3 ? 1 : 0
//         wx.navigateTo({
//           url: '../balancers/balancers?type=' + 'gopay' + '&amountnumber=' + e.currentTarget.dataset.amountnumber + '&goodid=' + that.data.goodId + '&labelName=' + that.data.labelName + '&leaderId=' + that.data.leaderId + '&skuid=' + that.data.skuid + '&addressIds=' + addressIds + '&areaId=' + that.data.address.addressId + '&addressType=' + addressType + '&card_type=' + that.data.card_type
//         })
//     }
//   },
//   // sure: function (e) {
//   //   let that = this
//   //   if ((this.data.amountNumber > this.data.inventory) && this.data.channelId != 3) {
//   //     wx.showToast({
//   //       title: '库存数不足请重新选择数量',
//   //       icon: 'none'
//   //     })
//   //   } else {
//   //     if (e.currentTarget.dataset.amountnumber == 0) {
//   //       wx.showToast({
//   //         title: '请选择规格数量',
//   //         icon: 'none'
//   //       })
//   //     } else if(that.data.address) {
//   //       console.log(that.data.address,'00000000000000')
//   //       let proviceId = that.data.address.proviceId == '' ? 0 : that.data.address.proviceId
//   //       let cityId = that.data.address.cityId == '' ? 0 : that.data.address.cityId
//   //       let zoneId = that.data.address.zoneId == '' ? 0 : that.data.address.zoneId
//   //       let townId = that.data.address.townId == '' ? 0 : that.data.address.townId
//   //       let addressIds = proviceId + '_' + cityId + '_' + zoneId + '_' + townId
//   //       let addressType = that.data.channelId == 3 ? 1 : 0
//   //       wx.navigateTo({
//   //         url: '../balancers/balancers?type=' + 'gopay' + '&amountnumber=' + e.currentTarget.dataset.amountnumber + '&goodid=' + that.data.goodId + '&labelName=' + that.data.labelName + '&leaderId=' + that.data.leaderId + '&skuid=' + that.data.skuid + '&addressIds=' + addressIds + '&areaId=' + that.data.address.addressId + '&addressType=' + addressType + '&card_type=' + that.data.card_type
//   //       })
//   //     }else{
//   //       wx.showToast({
//   //         title: '请选择收货地址',
//   //         icon: 'none'
//   //       })
//   //     }
//   //     that.hideModal()
//   //     that.getOrderList()
//   //   }

//   // },
//   // 悦旅币抵扣规则
//   CouponsRule: function () {
//     wx.navigateTo({
//       url: '/page/CardVolume/pages/Explain/Explain',
//     })
//   },
//   // 购物车
//   GoCart: function (e) {
//     // if (wx.getStorageSync('uid')) {
//     //   wx.navigateTo({
//     //     url: '/page/Yuemall/pages/Cart/Cart',
//     //   })
//     // } else {
//     //   wx.navigateTo({
//     //     url: '/page/Yuemall/pages/VerificationCode/VerificationCode?mobile=' + this.data.mobile + '&codeNumber=' + this.data.codeNumber
//     //   })
//     // }
//   },
//   // 规格
//   swichLabel: function (e) {
//     let that = this
//     //选中index

//     var index = e.currentTarget.dataset.idx;
//     //选中行index
//     var data_index = e.currentTarget.dataset.index;
//     that.selectLabel(index, data_index);
//   },
//   selectLabel(index, data_index) {
//     console.log(index, data_index, 'colorSizecolorSize')
//     let that = this;
//     let colorSize = that.data.colorSize;
//     var idx = index;
//     // let arr=[]
//     //选中sku
//     var sku = colorSize[index].buttons[data_index]['skuList']
//     //选中第几行第几个
//     that.data.statusArr[index] = data_index
//     //取出其他sku
//     let m = []
//     that.setData({
//       sizeSelectText: []
//     })
//     var is_selected_skus = {};
//     this.data.statusArr.map((b, a) => {
//       if (a != idx && (typeof this.data.statusArr[a] != "undefined")) {
//         is_selected_skus[a] = colorSize[a].buttons[this.data.statusArr[a]].skuList;
//       }
//       that.data.sizeSelectText.push(colorSize[a].buttons[this.data.statusArr[a]].text)
//     })
//     for (let i = 0; i < colorSize.length; i++) {
//       var channel_data = colorSize[i].buttons;

//       for (let j = 0; j < channel_data.length; j++) {
//         if (i != idx) {
//           var sku_isists = Array.intersect(sku, channel_data[j].skuList);
//           for (let [c, d] in is_selected_skus) {
//             if (c != i) {
//               sku_isists = Array.intersect(sku_isists, is_selected_skus[c]); //is_selected_skus非当前行其他行选中的元素
//             }
//           }
          
//           if (sku_isists.length) {
//             colorSize[i].buttons[j].isEnable = true;
//           } else {
//             colorSize[i].buttons[j].isEnable = false;
//           }
//         } else {
//           if (j == data_index) {
//             colorSize[i].buttons[j].isEnable = true;
//           } else if (colorSize.length == 1) {
//             colorSize[i].buttons[j].isEnable = true;
//           }
//           console.log(colorSize,'colorSizecolorSize')
//         }
//       }
//     }
//     let last_sku = sku
//     for (let [c, d] in is_selected_skus) {
//       last_sku = Array.intersect(last_sku, is_selected_skus[c]);
//     }
//     this.setData({
//       statusArr: this.data.statusArr,
//       colorSize: colorSize,
//       last_sku: last_sku[0],
//       skuid: last_sku[0],
//       sizeSelectText: that.data.sizeSelectText
//     })
//     this.skuidDetil()
//   },
//   // 找相似
//   FindSimilarity: function () {
//     let that = this;
//     let type = that.data.channelId
//     let typeId = that.data.categoryArr.third
//     let parentTypeId = that.data.categoryArr.first
//     let topCategoryName = that.data.topCategoryName
//     if (type == 3) { //京东
//       wx.navigateTo({
//         url: '/page/Yuemall/pages/JDList/JDList?aid=' + parentTypeId + '&currentTab=' + typeId + '&title=' + topCategoryName + '&id=' + typeId,
//       })
//     } else if (type == 2) { //网易
//       let second = that.data.categoryArr.second
//       wx.navigateTo({
//         url: '/page/Yuemall/pages/Monastery/Monastery?parentTypeId=' + parentTypeId + '&name=' + topCategoryName + '&url=' + '/mall/yanListByType' + '&id=' + second,
//       })
//     } else if (type == 1) { //寺库
//       wx.navigateTo({
//         url: '/page/Yuemall/pages/Monastery/Monastery?parentTypeId=' + parentTypeId + '&id=' + typeId + '&name=' + topCategoryName + '&url=' + '/mall/skuListByType',
//       })
//     } else if (type == 0) { //全球购
//       wx.navigateTo({
//         url: '/page/Yuemall/pages/Monastery/Monastery?parentTypeId=' + parentTypeId + '&goodTypeId=' + typeId + '&name=' + topCategoryName + '&id=' + typeId,
//       })
//     }
//   },
//   // sku详情
//   skuidDetil: function () {
//     let that = this
//     // post('/mall/getProductSkuDatail', {
//     //   uid: that.data.uid,
//     //   addressCode: that.data.addressCode,
//     //   product_sku_id: that.data.skuid
//     // }, (res) => {
//     //   if (res.data.code == 200) {
//     //     that.setData({
//     //       Specificationsimg: res.data.data.img,
//     //       goodVipPrice: res.data.data.vipPrice,
//     //       priceName: res.data.data.priceWord,
//     //       goodPrice: res.data.data.nowPrice,
//     //       inventory: res.data.data.inventory,
//     //       goodsId: res.data.data.productId,
//     //       isSale: res.data.data.isSale,
//     //       state: res.data.data.address.state,
//     //       channelId: res.data.data.channelId,
//     //       categoryArr: res.data.data.categoryArr,
//     //       topCategoryName: res.data.data.topCategoryName,
//     //       card: res.data.data.card,
//     //       toMemberInfo: res.data.data.toMemberInfo,
//     //     })
//     //     if (that.data.isaddress == false) {
//     //       if (res.data.data.address.length != 0) {
//             // that.setData({
//             //   address: res.data.data.address,
//             //   addressCode: res.data.data.address.proviceId + '_' + res.data.data.address.cityId + '_' + res.data.data.address.zoneId + '_' + res.data.data.address.townId
//             // })
//     //       }
//     //     }
//     //   } else {
//     //     wx.showToast({
//     //       title: res.data.msg,
//     //       icon: "none"
//     //     })
//     //   }
//     // }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
//   },
//   getAddressList: function (isPage) {
//     var that = this;
//     console.log('8888888')
//     if (isPage) that.setData({
//       loadend: false,
//       page: 1,
//       addressList: []
//     });
//     if (that.data.loading) return;
//     if (that.data.loadend) return;
//     that.setData({
//       loading: true,
//       loadTitle: ''
//     });
//     getAddressList({
//       page: that.data.page,
//       limit: that.data.limit
//     }).then(res => {
//       console.log(res,'popopoppppppp')
//       that.setData({
//         address: res.data[0],
//         addressCode: res.data[0].proviceId + '_' + res.data[0].cityId + '_' + res.data[0].zoneId + '_' + res.data[0].townId
//       })
//     }).catch(err => {
//       that.setData({
//         loading: false,
//         loadTitle: '加载更多'
//       });
//     });
//   },
//   // 添加商品数量
//   addNumber: function (e) {
//     let num = e.currentTarget.dataset.num;
//     this.setData({
//       amountNumber: num + 1
//     })
//     if ((this.data.amountNumber > this.data.inventory) && this.data.channelId != 3) {
//       wx.showToast({
//         title: '库存数不足请重新选择数量',
//         icon: 'none'
//       })
//     }
//   },
//   // 减少商品数量
//   subtract: function (e) {
//     let num = e.currentTarget.dataset.num
//     if (num != 1) {
//       this.setData({
//         amountNumber: num - 1
//       })
//     } else {
//       wx.showToast({
//         title: '受不了了，宝贝不能在减少了哦',
//         icon: 'none'
//       })
//     }
//   },
//   /**
//    * 加入购物车 返回商品总数加上用户选择规格数量相加 goodNum
//    * */
//   addCart: function (e) {
//     console.log(this.data.addressList)
    
//     let that = this
//     if (wx.getStorageSync('memberId')) {
//       if (that.data.address == []) {
//         wx.showToast({
//           title: '请选择配送地',
//           icon: 'none'
//         })
//       } else {
//         if (that.data.isCanBuy == 0) {
//           wx.showToast({
//             title: that.data.notBuyMessage,
//             icon: 'none',
//             duration: 2000
//           })
//           return
//         }
//         that.showModal();
//         that.setData({
//           Share: false,
//           gopay: true
//         })
//       }
//     } else {
//       // wx.navigateTo({
//       //   url: '/page/Yuemall/pages/VerificationCode/VerificationCode?mobile=' + this.data.mobile + '&codeNumber=' + this.data.codeNumber
//       // })
//     }
//   },
//   //禁止滑动  
//   disMove: function () {

//   },
//   // 显示弹窗
//   showModal: function () {
//     // 显示遮罩层
//     var animation = wx.createAnimation({
//       duration: 200,
//       timingFunction: "linear",
//       delay: 0
//     })
//     this.animation = animation
//     animation.translateY(300).step()
//     this.setData({
//       animationData: animation.export(),
//       showModalStatus: true
//     })
//     setTimeout(function () {
//       animation.translateY(0).step()
//       this.setData({
//         animationData: animation.export()
//       })
//     }.bind(this), 200)
//   },
//   // 隐藏弹窗
//   hideModal: function () {
//     this.getOrderList()
//     this.setData({
//       showModal: false,
//       Share: true,
//       gopay: false
//     })
//     // 隐藏遮罩层
//     this.setData({
//       showModal: false,
//     })
//     var animation = wx.createAnimation({
//       duration: 200,
//       timingFunction: "linear",
//       delay: 0
//     })
//     this.animation = animation
//     animation.translateY(300).step()
//     this.setData({
//       animationData: animation.export(),
//     })
//     setTimeout(function () {
//       animation.translateY(0).step()
//       this.setData({
//         animationData: animation.export(),
//         showModalStatus: false
//       })
//     }.bind(this), 200)
//   },
//   // 隐藏分享
//   hideModalShare: function () {
//     this.setData({
//       showModal: false
//     })
//     // 隐藏遮罩层
//     this.setData({
//       showModal: false,
//     })
//     var animation = wx.createAnimation({
//       duration: 200,
//       timingFunction: "linear",
//       delay: 0
//     })
//     this.animation = animation
//     animation.translateY(300).step()
//     this.setData({
//       animationData: animation.export(),
//     })
//     setTimeout(function () {
//       animation.translateY(0).step()
//       this.setData({
//         animationData: animation.export(),
//         showModalStatus: false
//       })
//     }.bind(this), 200)
//     this.getOrderList()
//   },
//   // 选择规格
//   ToUp: function () {
//     let that = this
//     console.log('1211123123')
//     // if (wx.getStorageSync('uid')) {
//       // if (that.data.state == 0) {
//       //   wx.showToast({
//       //     title: '请选择配送地',
//       //     icon: 'none'
//       //   })
//       // } else {
//         that.showModal();
//         that.setData({
//           Share: false,
//           gopay: true
//         })
//       // }
//     // } else {
//     //   wx.navigateTo({
//     //     url: '/page/Yuemall/pages/VerificationCode/VerificationCode?mobile=' + this.data.mobile + '&codeNumber=' + this.data.codeNumber
//     //   })
//     // }
//   },
//   // 加入会员
//   join: function (e) { //加入悦旅会
//     wx.switchTab({
//       url: '/page/EliteCard/EliteCard',
//     })
//   },

//   onLoad: function (options) {
//     let that = this
//     let scene = '';
//     let reCode = '';
//     let goodsId = '';
//     let skuid = '';
//     let card_type=''
//     let Modeliphonex = 'iPhone X'
//     let ModeliphonePro = 'iPhone Pro'
//     if (options.scene != null) {
//       retrunScene(options.scene, function (sceneObj) {
//         reCode = sceneObj.C;
//         goodsId = sceneObj.I;
//         skuid = sceneObj.U
//       });
//     } else {
//       reCode = options.reCode;
//       goodsId = options.goodsId;
//       skuid = options.skuid;
//       card_type=options.type
//     }
//     that.setData({
//       goodsId: goodsId,
//       skuid: skuid,
//       leaderId: options.leaderId,
//       isLeader: options.isLeader,
//       lng: wx.getStorageSync('lng'),
//       lat: wx.getStorageSync('lat'),
//       activityId: options.activityId,
//       card_type: card_type
//     })
//     wx.getSystemInfo({
//       success: function (res) {
//         that.setData({
//           windowHeight: res.windowHeight
//         })
//         console.log(res.model)
//         if (res.model.indexOf(Modeliphonex) > -1 || res.model.indexOf(ModeliphonePro) > -1) {
//           console.log('---')
//           that.setData({
//             isFill: true
//           })
//         }
//       }
//     })
//     //取自己的邀请码
//     wx.getStorage({
//       key: 'reCode',
//       success: function (res) {
//         that.setData({
//           reCode: res.data
//         })
//       }
//     })
//     that.setData({
//       uid: wx.getStorageSync('memberId'),
//       token: wx.getStorageSync('token'),
//       // cardType: wx.getStorageSync('cardType'),
//       RushBuy: options.RushBuy
//     })
//     wx.getSystemInfo({
//       success: function (res) {
//         that.setData({
//           windowHeight: res.windowHeight
//         })
//       }
//     })
//     that.checkMemberChangePower()
//   },
//   onShow: function () {
//     let that = this;
//     let pages = getCurrentPages() //获取加载的页面
//     let currentPage = pages[pages.length - 1] //获取当前页面的对象
//     let url = currentPage.route;
//     let options = currentPage.options;
//     // this.initSelected(this.data.colorSize, '100000942707')
//     //扫码参数分解
//     if (options.scene != null) {
//       retrunScene(options.scene, function (sceneObj) {
//         wx.setStorageSync('reI', sceneObj.I); //缓存用户id
//         relations(sceneObj.C);
//       });
//     } else if (options.reCode) {
//       relations(options.reCode);
//     }
//     that.setData({
//       uid: wx.getStorageSync('memberId'),
//       token: wx.getStorageSync('token'),
//       selectLabel: '请选择规格',
//       selectNum: '数量',
//     })
//     wx.getStorageSync('selfReCode')
//     if (that.data.isaddress == false) {
//       that.getOrderList()
//     }
//     let interval = setInterval(function () {
//       let m = new Date().getMinutes();
//       if (m = 0) {
//         that.getOrderList()
//       }
//     }, 60000)
//     wx.setStorage({
//       key: 'curCar',
//       data: '1',
//     })
//     // wx.clearStorage('mapId')
//     if (wx.getStorageSync('memberId')) {
//       //已经绑定了
//       console.log('已经绑定了')
//       that.setData({
//         authorizationStatus: false
//       })
//       wx.showShareMenu({
//         withShareTicket: true
//       })
//     } else {
//       wx.hideShareMenu()
//       that.setData({
//         authorizationStatus: true
//       })
//     }
//     let ortherRecode = wx.getStorageSync('ortherReCode') ? wx.getStorageSync('ortherReCode') : 0
//     // get('/app/member/distribution/record/' + this.data.goodsId + '/' + ortherRecode + '/' + 2, {}, (res) => {
//     //   console.log(res)
//     //   if (res.data.code == 200) { } else if (res.data.code == 400) {
//     //     wx.showToast({
//     //       title: res.data.msg,
//     //       icon: 'none'
//     //     })
//     //   }
//     // }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'));
//   },
//   postShareImg: function (goodid, _this) {
//     // post('/share/MallProductShare', {
//     //   product_sku_id: _this.data.skuid,
//     //   product_id: goodid

//     // }, (res) => { // 获取分享图片 ajax

//     //   if (res.data.code == 200) {
//     //     _this.sharePostUrl = res.data.img;
//     //     _this.setData({
//     //       tips: res.data.tips
//     //     })

//     //   } else if (res.data.code == 400) {
//     //     wx.showToast({
//     //       title: res.data.mag,
//     //       icon: 'none'
//     //     })
//     //   }
//     // }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4);
//   },
  
//   // 电话
//   calltel: function (e) {
//     wx.makePhoneCall({
//       phoneNumber: e.currentTarget.dataset.tel
//     })
//   },
//   // 首页
//   gohome: function () {
//     wx.switchTab({
//       url: "/page/Home/Home",
//     })
//   },
//   // // 页面内分享
//   // onShare: function () {
//   //   if (wx.getStorageSync('uid')) {
//   //     this.setData({
//   //       sharelayer: true
//   //     })
//   //   } else {
//   //     wx.navigateTo({
//   //       url: '/page/Yuemall/pages/VerificationCode/VerificationCode?mobile=' + this.data.mobile + '&codeNumber=' + this.data.codeNumber
//   //     })
//   //   }
//   // },
//   // 关闭分享
//   shareLayerClosed: function () {
//     this.setData({
//       sharelayer: false
//     })
//   },

//   goPoster: function () {
//     wx.navigateTo({
//       url: "/page/other/pages/poster/poster?goodsId=" + this.data.goodsId + '&url=' + '/share/MallMemberGoodsForward' + '&id=' + 'MembershipProductDetails' + '&skuid=' + this.data.skuid,
//     })
//   },

//   /**
//    * 初始化默认选中项
//    */
//   initSelected: function (colorsize, skuid) {
//     let arr = new Array(colorsize.length)
//     for (let i = 0; i < colorsize.length; i++) {
//       for (let j = 0; j < colorsize[i].buttons.length; j++) {
//         // colorsize[i].buttons[j].isEnable = true
//         if (colorsize[i].buttons[j].skuList.indexOf(Number(skuid)) > -1) {
//           // this.data.statusArr[i] = j
//           this.selectLabel(i, j);
//         }
//       }
//     }
//   },
//   in_array(stringToSearch, arrayToSearch) {
//     for (var s = 0; s < arrayToSearch.length; s++) {
//       var thisEntry = arrayToSearch[s].toString();
//       if (thisEntry == stringToSearch) {
//         return true;
//       }
//     }
//     return false;
//   }

// })