//index.js
//获取应用实例
import {orderDetail,cancelHotelOrder,fullCancelHotelOrder} from "../../../api/order"
import { parseTime } from "../../../utils/time";
import {
  Hotelpay
} from '../../../api/hotel';
const app = getApp();

Page({
  data: {
  oid:"",
  info:"",
  dealerId:"",
  shareshow:false,
  countDownHour: '',
    countDownMinute: '',
    countDownSecond: '',
  },
  handlePay(){
    //跳转支付页面
    let that = this;
    wx.navigateTo({
      url:"/hotel/pages/pay/index?oid="+that.data.oid+"&hid="+wx.getStorageSync("dealerId")+"&type=6"
    })
  },
  // 支付
  Hotelpay: function () {
    let that=this
    let data = {
      orderNo: that.data.pfOrderNo,
      payChannel: 'ORIGINAL',
      tradeType: "WX_JSAPI",
      openID: wx.getStorageSync('openId')
    }
    Hotelpay(data).then(res => {
      console.log(res)
      wx.requestPayment({
        'timeStamp': res.data.getwayBody.timeStamp,
        'nonceStr': res.data.getwayBody.nonceStr,
        'package': res.data.getwayBody.package,
        'signType': 'MD5',
        'paySign': res.data.getwayBody.paySign,
        'success': function (res) {
          wx.hideLoading()
          wx.showToast({
            title: '支付成功',
            icon: 'none'
          })
          console.log(res)
          wx.redirectTo({
            url: '/hotel/pages/paySuccess/index?lastprice='+that.data.info.orderAmount/100
          });  
        },
        'fail': function (res) {
          console.log(res)
          // wx.navigateTo({
          //   url: '/page/MyOther/pages/orderDetail/orderDetail?type='+2
          // })
          wx.redirectTo({
            url: "/hotel/pages/payFail/index"
          });
           
        },
        'complete': function (res) {
          console.log(res)
        }
      })
    })
  },
  againd(){
    wx.navigateTo({
      url: '/hotel/pages/index?dealerId=' + this.data.info.dealerId
    });
  },
  // 酒店 客房取消订单
  cancelHotel(e){
    let that = this
    if(that.data.info.orderSource=='1006'){
      wx.showModal({
        title: '取消订单',
        content: '确认取消酒店订单',
        success: function(res) {
          if (res.confirm) {
            cancelHotelOrder({
              dealerId:that.data.info.dealerId,
              orderNo:that.data.info.orderNo,
              customerId:that.data.info.customerId,
            }).then(res => {
              that.data.info.cancelationFlag=1
              that.setData({
                info:that.data.info
              })
            })
          } else if (res.cancel) {
          }
        }
      })
    }else{
      wx.showModal({
        title: '取消订单',
        content: '确认取消酒店订单',
        success: function(res) {
          if (res.confirm) {
            fullCancelHotelOrder({
              orderSn:that.data.info.pfOrderNo,
            }).then(res => {
              console.log(res)
              if(res.code==200){
                that.data.info.cancelationFlag=1
                that.setData({
                  info:that.data.info
                })
              }else{
                wx.showToast({
                  title:res.msg,
                  icon:'none'
                })
              }
              
            })
          } else if (res.cancel) {
          }
        }
      })
    }
    
  },
  pricedetail(){
    this.setData({
      shareshow:true
    })
  },
  closemeng(){
    this.setData({
      shareshow:false
    })
  },
  hoteldel(){
    // wx.makePhoneCall({
    //   phoneNumber: '4000-835-999'
    // })
  },
  getOrderDetail(){
    wx.showLoading({
      title: "加载中",
      mask: true
    });
     let that = this;

    //  let memberId =  that.data.searchObj.memberId;
  
     let dealerId =that.data.dealerId
     let oid=that.data.oid
    // let dealerId = '99998';
     console.log(dealerId,'dealerId')
     orderDetail({
      orderNo:oid,
      orderSource:that.data.orderSource,
      pfOrderNo:that.data.pfOrderNo
    }).then(res=>{
      console.log(res,'123')
      
       let newData = res.data; 
       let times=parseTime(res.data.etd,'{h}:{i}')
       newData.eta = parseTime(res.data.eta,'{y}-{m}-{d}');
       newData.etd = parseTime(res.data.etd,'{y}-{m}-{d}');
       newData.orderTime = parseTime(res.data.orderTime);
       if(newData.orderStatus==0&&newData.payStatus==1){
        newData.expireTime = parseTime(newData.expireTime,'{h}:{i}:{s}');
      }
      that.setData({
        info:newData,
        times:times
      })
      
      setTimeout(()=>{
        wx.hideLoading();
      },1000)
    }).catch(err=>{
      setTimeout(()=>{
        wx.hideLoading();
      },1000)
    })
  },
   // 倒计时
   startTimer: function (totalSecond) {
    console.log(totalSecond)
    let that = this
    // 倒计时
    var totalSecond = totalSecond;
    var interval = setInterval(function () {
      // 秒数
      var second = totalSecond;
      // 年数
      // 小时位
      var hr = Math.floor((second) / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;

      // 分钟位
      var min = Math.floor((second - hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;

      // 秒位
      var sec = second - hr * 3600 - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;

      this.setData({
        countDownHour: hrStr,
        countDownMinute: minStr,
        countDownSecond: secStr,
      });
      totalSecond--;
      if (totalSecond < 0) {
        // that.getOrderList()
        clearInterval(interval);
        setTimeout(() => {
          wx.navigateBack()
        }, 1000)
        this.setData({
          countDownHour: '00',
          countDownMinute: '00',
          countDownSecond: '00',
        });

      }
    }.bind(this), 1000);
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
  onLoad(query) {
    console.log(query,"去酒店订单详情")
    this.setData({
      oid:query.oid,
      pfOrderNo:query.pfOrderNo,
      orderSource:query.orderSource
    })
 
  },
  onShow(){
    this.getOrderDetail();
  },
  map(e){
    var lan=Number(wx.getStorageSync('latitude'))
    var lng=Number(wx.getStorageSync('longitude'))
    var address=e.currentTarget.dataset.address
    console.log(lan,lng,"经纬度")
    // 复制代码
    wx.getLocation({//获取当前经纬度
      type: 'wgs84', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息  
      success: function (res) {
        wx.openLocation({//​使用微信内置地图查看位置。
          latitude: lan,//要去的纬度-地址
          longitude: lng,//要去的经度-地址
          name: address,
          address:address
        })
      }
    })
  }
});
