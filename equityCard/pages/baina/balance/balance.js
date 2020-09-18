import {
  payPage,
  orderCreate,
  orderPay,
} from '../../../../api/baina.js';
import {exchangePayPage,exchangeOrderCreate} from "../../../../api/personal"


Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: {},
    hasAddress: false,
    receiverAddress: {},
    productClassify: 0,
    isSell: 1,
    receiver_name:"",
    province_name:"",
    city_name:"",
    zone_name:"",
    address:"",
    mobile:"",
    address_id:"",
  },

  // 选择地址
  changeAddress() {
    wx.navigateTo({
      url: '/supermarket/shop/address/index',
    })
  },
  // 调起支付
  goPay(){
    if(this.data.type=='exchange'){
      this.exchangeOrderCreate()
    }else{
      this.orderCreate()
    }
  },
  // 去支付
  orderCreate() {
    orderCreate({
      memberId:this.data.memberId,
      product_id: this.data.productId,
      skuId: this.data.productSkuId,
      addressId:this.data.address_id, 
      goodsType:1
    }).then(res=>{
      wx.showLoading({
        title: '支付中',
      })
      orderPay({
        orderNo: res.data.orderNo,
        tradeType: 'WX_JSAPI',
        openId: wx.getStorageSync('openId'),
        appid:'wx9d427e623c3fb4c4'
      }).then(res=>{

        let jsConfig = res.data.getwayBody
        wx.requestPayment({
          timeStamp: jsConfig.timeStamp,
          nonceStr: jsConfig.nonceStr,
          package: jsConfig.package,
          signType: jsConfig.signType,
          paySign: jsConfig.paySign,
          success (res) { 
            console.log("支付成功",res);
            wx.redirectTo({
              url: '/hotel/pages/paySuccess/index'
            });
          },
          fail (res) { 
            wx.redirectTo({
              url: "/hotel/pages/payFail/index"
            });
          }
        })
      })
    })
  },
  // 去支付 联名卡
  exchangeOrderCreate() {
    exchangeOrderCreate({
      product_id: this.data.productId,
      sku_id: this.data.productSkuId,
      addressId:this.data.address_id, 
      goodsType:2,
      couponId:this.data.couponId,
      memberId:this.data.memberId,
    }).then(res=>{
      wx.showToast({
        title: res.msg,
        icon: 'none',
        success:function(){
          setTimeout(function () {
            //要延时执行的代码
            wx.switchTab({
              url: '/pages/home/index',
            })
          }, 1000) //延迟时间
        }
      })
     
    })
  },
  // 获取订单预览信息
  payPage() {
    let data = {
      product_id: this.data.productId,
      skuId: this.data.productSkuId,
      memberId: this.data.memberId,
    }
    payPage(data).then(res=>{
      // console.log(res,"1111")
         this.setData({
            data: res.data
          })
         if (Object.keys(res.data.receiverAddress).length != 0) {
            this.setData({
              receiverAddress: res.data.receiverAddress,
              hasAddress: true,
              receiver_name:res.data.receiverAddress.receiver_name,
              province_name:res.data.receiverAddress.province_name,
              city_name:res.data.receiverAddress.city_name,
              zone_name:res.data.receiverAddress.zone_name,
              address:res.data.receiverAddress.address,
              mobile:res.data.receiverAddress.mobile,
              address_id:res.data.receiverAddress.address_id,
            })
          }
          // console.log(res.data.data.receiverAddress.receiver_name,"2222")
    })  
  
  },
  // 获取订单预览信息 联名卡
  exchangePage() {
    let data = {
      product_id: this.data.productId,
      sku_id: this.data.productSkuId,
      memberId: this.data.memberId,
      couponId:this.data.couponId
    }
    exchangePayPage(data).then(res=>{
      console.log(res,"1111")
      this.setData({
        data: res.data
      })
      if (Object.keys(res.data.receiverAddress).length != 0) {
        this.setData({
          receiverAddress: res.data.receiverAddress,
          hasAddress: true,
          receiver_name:res.data.receiverAddress.receiver_name,
          province_name:res.data.receiverAddress.province_name,
          city_name:res.data.receiverAddress.city_name,
          zone_name:res.data.receiverAddress.zone_name,
          address:res.data.receiverAddress.address,
          mobile:res.data.receiverAddress.mobile,
          address_id:res.data.receiverAddress.address_id,
        })
      }
    })  
  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      productId: options.productId,
      productSkuId: options.productSkuId,
      memberId: wx.getStorageSync('memberId'),
      productClassify: options.productClassify ? options.productClassify : 0, //0 实物 1 虚拟 2 线路
      isSell: options.isSell, //1是预售
      goodsNum: options.goodsNum ? options.goodsNum : 1,
      type:options.type,
      couponId:options.couponId

    })
    console.log(options,"opsition======")
    
    if(options.type=='exchange'){
      this.exchangePage()
    }else{
      this.payPage()
    }
  },
  onShow(item){
    console.log(item,"==============================")
  }
 
})