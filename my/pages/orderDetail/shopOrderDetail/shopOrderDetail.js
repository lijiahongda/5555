//index.js
//获取应用实例
import { wxRequest } from "../../../../utils/request";
import drawQrcode from '../../../../utils/thirdObj/weapp.qrcode.esm.js';
import { parseTime } from "../../../../utils/time";
import {
  post,get
} from "../../../../utils/api"
import {getOrderDetail,virtualDetail} from "../../../../api/order"
const app = getApp();

Page({
  data: {
  oid:"",
  orderinfo:"",
  cardStatus:0,
  malltype:1,
  },

  // 查看物流
  shopLogistics(){
    let e = this.data.orderinfo.subInfoList[0].infoList[0]
    wx.navigateTo({
      url: '/my/pages/logistics/shopLogistics/shopLogistics?goodsName='+e.goodsName+'&skuName='+e.skuName+'&goodsNum='+e.goodsNum+'&goodsPrice='+e.goodsPrice+'&imageUrl='+e.imageUrl+'&orderMallNo='+e.orderMallNo,
    })
  },

  // 确认订单
  orderConfirm(){
    let that = this
    let data={
      orderMallNo:this.data.orderinfo.subInfoList[0].infoList[0].orderMallNo
    }
    wx.showLoading()
    post('/app/v1/card/received',data,(res)=>{
      wx.hideLoading()
      if(res.data.code==200){
        that.getOrderDetail()
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },

  handleCardCode(){
    //生成二维码函数
    let that = this;
    wxRequest({
      method:"post",
      contentType:"application/json;charset=UTF-8",
      url:"/apimall/order/mall/get/encryption/h5/code",
      data:{
        orderNo:that.data.oid,
        dealerId:wx.getStorageSync("dealerId")	
      }
    }).then(res=>{
      let _code = res.code;
      // debugger;
      drawQrcode({
        width: 200,
        height: 200,
        canvasId: 'myQrcode',
        // ctx: wx.createCanvasContext('myQrcode'),
        text: _code, //后台返回的参数 
        // v1.0.0+版本支持在二维码上绘制图片
        // image: {
        //   dx: 70,
        //   dy: 70,
        //   dWidth: 60,
        //   dHeight: 60
        // }
      })
      this.setData({
        cardStatus:1
      })
    }).catch(err=>{

    })

  
  
  },

  copyId(e){
    var that = this;
      console.log(e)
      wx.setClipboardData({
        //准备复制的数据
        data: e.currentTarget.dataset.orderno,
        success: function(res) {
          wx.showToast({
            title: '复制成功',
          });
        }
      })
  },
  gopay(){
    //跳转支付页面
   console.log(this.data.oid) 

   let hid = wx.getStorageSync("shid") ;// 注意 这里的hid 是商户id 不是酒店id
   if(this.data.status==0){
    wx.navigateTo({
      url:"/hotel/pages/pay/index?oid="+this.data.oid+"&hid="+hid+"&type=10"
    })
   }else{
    wx.navigateTo({
      url:"/my/pages/newPay/index?oid="+this.data.oid+"&hid="+hid+"&type=5"
    })
   }
   

  },
  again(){
    wx.switchTab({
      url: '/pages/home/index',
    })
  },
  calltel: function (e) {
    wx.makePhoneCall({
      phoneNumber: '4000-835-999'
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
    // wxRequest({
    //   url: "/apimall/order/mall/detail/"+that.data.oid+"?dealerId="+dealerId,
    // }).then(res=>{
    //   console.log("111111111111");
    //   console.log("订单详情",res);
    //   let malltype = res.subInfoList[0].mallOrderType;
    //   that.setData({
    //     orderinfo:res,
    //     malltype
    //   })
    //   setTimeout(()=>{
    //     wx.hideLoading();
    //   },1000)
    // }).catch(err=>{
    //   console.log("错误信息",err)
    //   console.log("2222222222");

    // })
    let data={
      orderNo:that.data.oid,
      memberId:wx.getStorageSync('memberId')
    }
      if(that.data.status==0){
        getOrderDetail(data).then(res=>{
          console.log(res,'新的商城详情')
          that.setData({
            orderinfo:res.data,
          })
          setTimeout(()=>{
            wx.hideLoading();
          },1000)
            
            
        })
      }else{
        virtualDetail(data).then(res=>{
          console.log(res,'购卡的详情')
          res.data.orderTime = parseTime(res.data.orderTime,'{y}-{m}-{d} {h}:{i}:{s}')
          that.setData({
            orderinfo:res.data,
          })
          setTimeout(()=>{
            wx.hideLoading();
          },1000)
        })
      }
  },
  onLoad(query) {
    console.log(query,'query')
    this.setData({
      oid:query.oid,
      status:query.status
    })
  if(query.type=='shop'){
    this.getOrderDetail();

  }else{
    this.getHotelDetail();
  }
  },
  getHotelDetail(){
    wx.showLoading({
      title: "加载中",
      mask: true
    });
     let that = this;

    //  let memberId =  that.data.searchObj.memberId;
  
     let dealerId =this.data.dealerId
     let oid=this.data.oid
    // let dealerId = '99998';
     console.log(dealerId,'dealerId')
     if(that.data.status==0){
      wxRequest({
        url:'/api/order/detail/'+oid+'?dealerId='+dealerId
       }).then(res=>{
          let newData = res; 
          newData.eta = parseTime(res.eta,'{y}-{m}-{d}');
          newData.etd = parseTime(res.etd,'{y}-{m}-{d}');
          newData.orderTime = parseTime(res.orderTime);
   
         that.setData({
           info:res
         })
         setTimeout(()=>{
           wx.hideLoading();
         },1000)
       }).catch(err=>{
         setTimeout(()=>{
           wx.hideLoading();
         },1000)
       })
     }else{

     }
   
  },
  onShow(){
  }
});
