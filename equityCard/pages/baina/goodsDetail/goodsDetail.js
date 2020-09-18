
//获取应用实例
import WxParse from "../../../../wxParse/wxParse.js"
import {detail} from "../../../../api/baina"
import {exchangeProductDetail} from "../../../../api/personal"
const app = getApp();
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    data:{},
    productId: '',
    productSkuId: '',
    bannerList: [],
    bannerIndex: 1,
    detailData: {},
    isShow:false,
    cartNum:1
  },

  buy(){
    wx.navigateTo({
      url: '/equityCard/pages/baina/balance/balance?productId=' + this.data.productId + '&productSkuId=' + this.data.productSkuId,
    })
  },


  /**
   * 立即购买
   */
  goBuy: function (e) {
    this.setData({
      isShow: true,
    })
    if(this.data.type=='exchange'){
      this.setData({
        isShow: false,
      })
      this.goCat()
    }
  },
 

  goCat: function (e) {
    let url = '/equityCard/pages/baina/balance/balance?productId=' + this.data.productId + '&productSkuId=' + this.data.productSkuId
    if(this.data.type=='exchange'){
      url = url +'&couponId='+this.data.detailData.couponId+'&type=exchange'
    }
    wx.navigateTo({
      url: url
    })
  },

  /**
   * 购物车数量加和数量减
   * 
   */
  ChangeCartNum: function (e) {
    let that = this
    // console.log('增加商品数量', e.detail)
    //是否 加|减
    var changeValue = e.detail;
    //数量+
    if (changeValue) {
      that.data.cartNum++;
      // //大于库存时,等于库存
      // if (productSelect.cart_num > stock) productSelect.cart_num = stock;
      // console.log(that.data.cartNum)
      that.setData({
        cartNum: that.data.cartNum,
        isShow: true
      });
    } else {
      //数量减
      that.data.cartNum--;
      //小于1时,等于1
      if (that.data.cartNum < 1) that.data.cartNum = 1;
      this.setData({
        cartNum: that.data.cartNum,
        isShow: true
      });
    }
  },

  updateSkuid: function (e) {
    // console.log('---', typeof (e.detail.isShow), e.detail.isShow)
    this.setData({
      productSkuId: e.detail.skuid ? e.detail.skuid : this.data.skuid,
      isShow: e.detail.isShow,
      sizeSelectText: e.detail.sizeSelectText ? e.detail.sizeSelectText : this.data.sizeSelectText
    })
    // console.log(2)
    this.freeProductDetail()
  },

  bannerChange(e){
    this.setData({
      bannerIndex: e.detail.current+1
    })
  },

  // 获取商品详情
  freeProductDetail(){
    let data={
      product_id:this.data.productId,
      product_sku_id: this.data.productSkuId,
      member_id: wx.getStorageSync('memberId')
    }
    var that=this
    detail({
      product_id:this.data.productId,
      product_sku_id: this.data.productSkuId,
      member_id: wx.getStorageSync('memberId')
    }).then(res=>{
        wx.hideLoading();//隐藏加载
        that.setData({
          data: res.data,
          detailData: res.docs,
          bannerList: res.docs.productInfo.pic,
          Specificationsimg: res.docs.productInfo.pic[0].path,
        })
        app.initSelected(res.docs.saleList, Number(that.data.productSkuId), function(res) {
          that.setData({
            colorSize: res.colorSize,
            statusArr: res.statusArr,
            last_sku: res.last_sku[0],
            skuid: res.skuid,
            sizeSelectText: res.sizeSelectText
          })
         
        })
        WxParse.wxParse('article', 'html', res.docs.productInfo.introduction, this, 5);
    })
  },
  // 联名卡 获取商品详情
  exchangeProductDetail(){
    var that=this
    exchangeProductDetail({
      product_id:this.data.productId,
      sku_id: this.data.productSkuId
    }).then(res=>{
      console.log(res,'zhzzzzz')
        that.data.detailData={
          vipPrice:res.data.price,
          name:res.data.goods_name,
          isCanBuy:res.data.isCanBuy,
          payButtonDesc:res.data.payButtonDesc,
          couponId:res.data.couponId,
        }
        that.setData({
          detailData: that.data.detailData,
          bannerList: res.data.goodsSuggestImage,
          Specificationsimg: res.data.goodsSuggestImage[0],
        })
        WxParse.wxParse('article', 'html', res.data.introduction, this, 5);
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,'000000')
    this.setData({
      productId: options.productId,
      productSkuId: options.productSkuId,
      memberId: wx.getStorageSync('memberId'),
      type:options.type,//type=exchange 联名卡兑换
    })
    wx.showLoading({
      title: '加载中',
    })
    if(options.type=='exchange'){
      this.exchangeProductDetail()
    }else{
      this.freeProductDetail()
    }
  }
})