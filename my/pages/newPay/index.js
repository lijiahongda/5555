//index.js
//获取应用实例
import { wxRequest } from "../../../utils/request";
const app = getApp();

Page({
  data: {
    oid:"",
    openid:"",
    hid:"",
    type:"",
    returnUrl:""
  },
  nextMallOrder(){
    wx.navigateTo({
      url: "/supermarket/shop/orderList/index",
    });
  },
  nextRoomOrder(){
    wx.navigateTo({
      url: "/hotel/pages/orderList/index",
    });
  },
  nextAddress(){
    wx.navigateTo({
      url: "/supermarket/shop/address/index?type=1",
    });
  },
  nextUrl(e) {
    console.log(e);
    let obj = e.currentTarget.dataset.obj;
    wx.navigateTo({
      url: "/supermarket/shop/detail/index?sid=" + obj.id,
    });
  },
 

  getWxPay(){
    app.wxapp.showLoading("正在唤醒支付");
    let that = this;
    let requestUrl = ""
    let params = "";
    if(that.data.type == 10){
      requestUrl = "/apimall/order/mall/pay/"
      params = "tradeType=WX_JSAPI"+
      "&openId=" + that.data.openid+ "&returnUrl=" +
      encodeURIComponent(that.data.returnUrl);;
    }else if(that.data.type == 5){
      //会员卡购买
      requestUrl = "/api/order/prepay/vip/card/"
      params =    "tradeType=WX_JSAPI" +
      "&openId=" +
      that.data.openid+
      "&returnUrl=" +
      encodeURIComponent(that.data.returnUrl);
    }else{

       requestUrl = "/api/order/prepaynew/";
       params = "tradeType=WX_JSAPI" +
        "&openId=" +
        wx.getStorageSync("openId") +
        "&returnUrl=" +
        encodeURIComponent(that.data.returnUrl);
    }
    wxRequest({
      url: requestUrl+that.data.oid+"?"+params,
      method:"post",
    }).then(res=>{

      if(res){

        let weixininfo = res.getwayBody;

        console.log("支付信息",weixininfo);
        app.wxapp.hideLoading();
        wx.requestPayment({
          timeStamp: weixininfo.timeStamp,
          nonceStr: weixininfo.nonceStr,
          package: weixininfo.package,
          signType: weixininfo.signType,
          paySign: weixininfo.paySign,
          success (res) { 
            console.log("支付成功",res);
            wx.redirectTo({
              url: '/pages/myHome/index'
            });
          },
          fail (res) { 
            console.log("支付失败",res,that.data.returnUrl)
            wx.redirectTo({
              url: that.data.returnUrl
            });
            
            
          }
        })

      }else{
        app.wxapp.hideLoading();
        wx.showToast({
          title: '未知错误,唤醒支付失败',
          icon: 'none',
        });
      }
          

    }).catch((err,data)=>{
        console.log("唤醒支付失败111",err);
        console.log("唤醒支付失败222",data);
        wx.showToast({
          title: '唤醒支付失败',
          icon: 'none',
        });

    })
  },
  onLoad(query) {
    let {oid,hid,type} = query;
    let openid = wx.getStorageSync("openId");
    this.setData({
      oid,hid,type,openid
    })
    let backurl;
    if(type == 10){
      //商品下单 支付成功或失败跳转 商品订单详情
      // backurl = "/pages/mall/orderDetail/index?oid="+oid

      backurl = "/pages/myHome/index?dealerId="+hid;

    }else if(type == 5) {
      let ygid = query.yg_id || 0;
      backurl =  "/my/pages/vipcard/index?dealerId="+hid+"&adminId="+ygid;
      // backurl = "/pages/my/index?dealerId="+hid;
    }else{
      // backurl = "/pages/room/orderDetail/index?oid="+oid
      backurl = "/pages/myHome/index?dealerId="+hid;
    }
    this.setData({
      returnUrl:backurl
    })

    this.getWxPay();
    //this.getUserCenter();
  }
});
