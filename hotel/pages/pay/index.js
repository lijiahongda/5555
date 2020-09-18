//index.js
//获取应用实例
import { wxRequest } from "../../../utils/request";
import {
  prepayCard
} from '../../../api/hotel'
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
      requestUrl = "/apimall/order/mall/zhiding/pay/"
      params = "tradeType=WX_JSAPI"+
      "&openId=" + that.data.openid+ "&returnUrl=" +
      encodeURIComponent(that.data.returnUrl);;
    }else if(that.data.type == 5){
      //会员卡购买
      requestUrl = "/zhidingapi/zhiding/order/prepay/union/card/"
      params =    "tradeType=WX_JSAPI" +
      "&openId=" +
      that.data.openid+
      "&returnUrl=" +
      encodeURIComponent(that.data.returnUrl);
      prepayCard({
        orderNo:that.data.oid,//订单号
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
              wx.redirectTo({
                url: '/hotel/pages/paySuccess/index?cardId='+that.data.cardId+'&lastprice='+that.data.lastprice+'&coupon='+that.data.coupon
              });
            },
            fail (res) { 
              wx.redirectTo({
                url: "/hotel/pages/payFail/index"
              });
            }
          })
      }).catch(err=>{
        // console.log("错误信息",err);
      })
      return
    }else{

       requestUrl = "/zhidingapi/zhiding/order/prepaynew/";
       params = "tradeType=WX_JSAPI" +
        "&openId=" +
        wx.getStorageSync("openId") +
        "&returnUrl=" +
        encodeURIComponent(that.data.returnUrl);
    }
    wx.request({
      url: 'https://pms.zhiding365.com'+requestUrl+that.data.oid+"?"+params, //仅为示例，并非真实的接口地址
      method:'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        app.wxapp.hideLoading();
        console.log(res.data,'llll')
        let weixininfo = res.data.data.getwayBody;

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
              url: '/hotel/pages/paySuccess/index?lastprice='+that.data.lastprice
            }); 
          },
          fail (res) { 
            wx.redirectTo({
              url: "/hotel/pages/payFail/index"
            });
          }
        })
      }
    })
  },
  onLoad(query) {
    let {oid,hid,type} = query;
    console.log(query,'query')
    let openid = wx.getStorageSync("openId");
    this.setData({
      oid,hid,type,openid
    })
    this.setData({
      lastprice:query.lastprice,
      cardId:query.cardId,
      coupon:query.coupon
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
