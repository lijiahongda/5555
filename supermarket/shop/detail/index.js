//index.js
//获取应用实例
import { wxRequest } from '../../../utils/request'
import { getRouterUrl } from "../../../utils/util"
import {getGoodsShareParams,productDetail,getGoodsCommission} from "../../../api/personal"
import {
  
  ownGoods
} from '../../../api/cps'

import {retrunScene,getCardCode} from "../../../utils/public"

const app = getApp()
var WxParse = require('../../../components/wxParse/wxParse.js');

Page({
  data: {
    fromtype:"ziying",
    posterObj:{
      status:0,
      url:""
    },
    shareSelectStatus:0,
    query: "",
    id: "",//商品id
    tabImgSrc: "",//规格选择的图片 默认选择第一张
    shopDetailData: "",
    yfMoney: 0,
    buyPrice: 0,
    tabIndex: 's',
    buyInventory: "",
    onePrice: '',//单价
    num: 1,//购买数量
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    maskStatus: 0,
    nickName: ""
  },
  onLoad(e) {
    
    
  },
  ajaxHaiBao(){
    //生成海报
    wx.showLoading({
      title: '海报生成中',
      mask: true
    });
    let params = {
      product_id:this.data.id,
      dealerId:wx.getStorageSync('dealerId'),
      type:1,//1自营 2京东 3白拿
      mid:wx.getStorageSync("memberId"),
      sku_id:"",
      vipPrice:this.data.buyPrice,
      price:this.data.buyPrice,
      pImg:this.data.shopDetailData.imageList[0].path,
      pName:this.data.shopDetailData.name
    }

    ownGoods(params).then (res => {
    this.setData({
      posterObj:{
        status:1,
        url:res.data
      }
    })
    wx.hideLoading();
   })
  },
  getShareData(){
    var that = this;
    getGoodsShareParams({
      goodsId:that.data.id,
      memberId:wx.getStorageSync("memberId"),
      dealerId:wx.getStorageSync('dealerId')
    }).then(res => {
      console.log("分享信息",res);
      this.setData({
        shareData:res.data
      })
    })
  },
  handleShowSelect(){
    this.setData({
      shareSelectStatus:1
    })
  },
  handleCloseShareDialog(){
    console.log("隐藏选项的弹窗");
    this.setData({
      shareSelectStatus:0
    })
  },
  handleShowPosterStatus(){
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
  // 分享赚
  shareGain:function(e){
    var that = this;
    getGoodsCommission({goodsId:that.data.id}).then(res => {
      console.log(res,'resresres')
      this.setData({
        shareCommission:res.data.shareCommission
      })
    })


  },
  onShow(){
    let that = this;

    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let e = currentPage.options;


    if(wx.getStorageSync("memberId")){
      wx.removeStorageSync("ziying");
      wx.removeStorageSync("goodid");
    }
    
    if (e.options) {
      wx.setStorageSync('inviteCode', e.options);
    }
    if (e.scene != null) {
      retrunScene(e.scene, function (sceneObj) {
        console.log(sceneObj,'sceneObj')
          getCardCode(sceneObj.R).then(res=>{

            let goods_id = res.G;
              that.setData({
                id:goods_id
              })
            wx.setStorageSync("ziying",1);
            wx.setStorageSync("goodid",goods_id);

              if (!wx.getStorageSync('memberId')) {
                console.log("来room")
                wx.showToast({
                  title: '您暂未登录,请授权登录',
                  icon: 'none',
                  duration: 2000
                })
                wx.navigateTo({
                  url: '/pages/login/index',
                })
              }else{
                that.shareGain();
                that.getMallDetail();
                that.getShareData();

              }
          })
       
      });
    } else {
      let id = e.sid;
      that.setData({
        id
      })

      if (!wx.getStorageSync('memberId')) {
        console.log("来room")
        wx.showToast({
          title: '您暂未登录,请授权登录',
          icon: 'none',
          duration: 2000
        })
        wx.navigateTo({
          url: '/pages/login/index',
        })
      }else{
        that.shareGain();
        that.getMallDetail();
        that.getShareData();

      }
    }
    if (e.dealerId) {
      wx.setStorageSync('dealerId', e.dealerId);
    }
    this.setData({
      query: e,
      nickName: wx.getStorageSync('userinfostr').nickName
    })
    console.log("query参数", e)
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
    console.log(wx.getStorageSync('mYinviteCode'),"我要分享")
    return {
      title: this.data.shareData.copyWriting,
      desc: wx.getStorageSync('invite'),
      path: "/supermarket/shop/detail/index?sid="+this.data.id+"&options=" + wx.getStorageSync('mYinviteCode') + "&dealerId=" + wx.getStorageSync('dealerId'),
      imageUrl: this.data.shareData.imageUrl
    }
  },
  handleHideMask() {
    this.listenHideMask(0);
  },
  handleShowMask() {
    this.listenHideMask(1);
  },
  listenHideMask(maskStatus) {
    this.setData({
      maskStatus
    })
  },
  changeIndicatorDots() {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay() {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange(e) {
    this.setData({
      duration: e.detail.value
    })
  },
  addNum() {
    // debugger
    let that = this;
    console.log("this.", this.data.tabIndex);
    if (this.data.tabIndex == 's') {
      wx.showToast({
        title: '请选择商品类型',
        icon: 'none',
      });
      return;
    }


    let num = this.data.num;
    if (this.data.buyInventory > this.data.num) {
      num++;
    }
    this.setData({ num }, () => {
      let buyPrice = (that.data.num * that.data.onePrice).toFixed(2);
      that.setData({
        buyPrice
      })
    })
  },
  reduceNum() {
    let that = this;
    if (this.data.tabIndex == 's') {
      wx.showToast({
        title: '请选择商品类型',
        icon: 'none',
      });
      return;
    }
    let num = this.data.num;

    if (num == 1) {
      return;
    }
    num--;
    this.setData({ num }, () => {
      let buyPrice = (that.data.num * that.data.onePrice).toFixed(2);
      that.setData({
        buyPrice
      })
    })

  },
  handleTab(e) {
    //商品類型 規格點擊事件
    console.log(e, "分享")
    console.log(e);
    let that = this;
    that.setData({
      num: 1
    })
    let tabIndex = e.currentTarget.dataset.index;
    let obj = e.currentTarget.dataset.obj;

    let onePrice = (obj.price / 100).toFixed(2);

    let buyPrice = (that.data.num * onePrice).toFixed(2);

    this.setData({
      tabIndex,
      onePrice,
      buyPrice,
      sid: obj.id
    })
  },
  getMallDetail() {
    //获取客房列表
    app.wxapp.showLoading();
    let that = this;
    productDetail({
      productId: that.data.id
      // curPage:that.data.curPage || 1
    }).then(res => {
      console.log("请求成功", res);

      let yfMoney = 0;
      if (res.data.freight == 0) {
        yfMoney = "包邮";
      } else {
        yfMoney = (res.data.freight / 100).toFixed(2) + "元"
      }
      let buyPrice = (res.data.skuInfo['skuList'][0].price / 100).toFixed(2);
      let tabImgSrc = res.data.imageList[0].path;
      //  this.buyPrice = 
      // this.default_price = (data.skuInfo['skuList'][0].price/100).toFixed(2);
      // this.buyInventory = data.skuInfo['skuList'][0].inventory;	
      // this.onePrice = (data.skuInfo['skuList'][0].price/100).toFixed(2); //单个规格的单个价格
      // this.oneDataImgUrl = data.imageList[0].path;	
      let buyInventory = res.data.skuInfo['skuList'][0].inventory;



      wx.setNavigationBarTitle({
        title: res.data.name
      });
      that.setData({
        shopDetailData: res.data,
        buyInventory,
        yfMoney,
        tabImgSrc,
        buyPrice
      })

      let article = res.data.introduction;
      WxParse.wxParse('article', 'html', article, that, 5);


      app.wxapp.hideLoading();
    }).catch(err => {
      console.log("请求失败", err);

    })

  },
  handleBuy() {
    //立即购买点击事件   
    let that = this;
    // let { sid, shopid, dealerId } = this.data.query; //sid 是商品id  shopid 是商户id
    let { sid } = this.data.query; //sid 是商品id  shopid 是商户id

    // let storageQuery = {
    //   "shid": shopid,
    //   "dealerId": dealerId,
    //   "sid": sid
    // }


    //  let backurl =  "/pages/mall/detail/index?sid="+sid+"&shopid="+shopid+"&dealerId="+dealerId;
    // let backurl = getRouterUrl();
    // let backurl = "/pages/mall/detail/index?sid="+sid+"&shopid="+shopid


    if (wx.getStorageSync('memberId')) {
      // this.setData({
      //   shid: shopid
      // })
      if (this.data.maskStatus == 0) {
        this.setData({
          maskStatus: 1
        })
        return;
      }
      if (this.data.tabIndex == 's') {

        wx.showToast({
          title: '请选择商品类型',
          icon: 'none',
        });



        return;
      }
      wx.navigateTo({
        url: '/supermarket/shop/order/index?sid=' + that.data.id + "&skuid=" + that.data.id + "&currSKUindex=" + that.data.tabIndex + "&num=" + that.data.num,
        success: (result) => {

        },
        fail: () => { },
        complete: () => { }
      });
    }else{
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }

  },
})
