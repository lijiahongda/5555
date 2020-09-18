//index.js
//获取应用实例
import {encryption} from "../../../api/personal"
import {orderdetail} from "../../../api/order"
import drawQrcode from '../../../utils/thirdObj/weapp.qrcode.esm.js';


const app = getApp();

Page({
  data: {
  oid:"",
  orderinfo:"",
  cardStatus:0,
  malltype:1,
  },

  handleCardCode(){
    //生成二维码函数
    let that = this;
    encryption({
        orderNo:that.data.oid,
        dealerId:wx.getStorageSync("dealerId")	
      }).then(res=>{
        console.log(res,'生成二维码')
      let _code = res.code;
      // debugger;
      drawQrcode({
        width: 200,
        height: 200,
        canvasId: 'myQrcode',
        text: _code, //后台返回的参数 
      })
      this.setData({
        cardStatus:1
      })
    }).catch(err=>{

    })

  
  
  },


  handlePay(){
    //跳转支付页面
   console.log(this.data.oid) 

   let hid = wx.getStorageSync("shid") ;// 注意 这里的hid 是商户id 不是酒店id
   wx.navigateTo({
     url:"/hotel/pages/pay/index?oid="+this.data.oid+"&hid="+hid+"&type=10"
   })

  },

  getOrderDetail(){
    wx.showLoading({
      title: "加载中",
      mask: true
    });



     let that = this;

    //  let memberId =  that.data.searchObj.memberId;
  
     let dealerId = wx.getStorageSync("dealerId");
     orderdetail({
      orderNo: that.data.oid,
      dealerId:dealerId,
    }).then(res=>{
      console.log("订单详情",res);
      // console.log( "地址地址",res.subInfoList[0].receiveInfo.addressDetail) 
      // debugger
      let malltype = res.subInfoList[0].mallOrderType;
      that.setData({
        orderinfo:res,
        malltype
      })
      setTimeout(()=>{
        wx.hideLoading();
      },1000)
    }).catch(err=>{
      console.log("错误信息",err)
      console.log("2222222222");

    })
  },
  onLoad(query) {
    this.setData({
      oid:query.oid
    })
  
  },
  onShow(){
    this.getOrderDetail();
  }
});
