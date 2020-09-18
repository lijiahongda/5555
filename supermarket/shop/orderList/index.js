//index.js
//获取应用实例
import { wxRequest } from "../../../utils/request";
const app = getApp();

Page({
  data: {
    searchObj:{
      curPage:1,
      memberId:"",
      pageSize:10
    },
    orderList:[]
  },
  handlePay(e){
    //跳转支付页面
    let obj = e.currentTarget.dataset.obj;
  },
  handleNextDetail(e){
    let obj = e.currentTarget.dataset.obj;
    console.log(obj);
    wx.navigateTo({
      url: '/supermarket/shop/orderDetail/index?oid='+obj.orderNo,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  getOrderList(){
    let that = this;

     let memberId =  that.data.searchObj.memberId;
     let curPage =  that.data.searchObj.curPage;
     let pageSize = that.data.searchObj.pageSize;
    wxRequest({
      url: "/apimall/order/mall/pageList?memberId="+memberId+"&curPage="+curPage+"&pageSize="+pageSize,
    }).then(res=>{

      let orderList = that.data.orderList;
      if(that.data.searchObj.curPage == 1){
        orderList = res.list;
      }else{
        orderList = orderList.concat(res.list);
      }
      that.setData({
        orderList:orderList
      })
      wx.stopPullDownRefresh();

      
    }).catch(err=>{

    })
  },
  onLoad() {
    let upKey =  "searchObj.memberId";
    this.setData({
      [upKey]:wx.getStorageSync("memberId")
    })
  },
  onShow(){
    this.getOrderList();
  },
  onReachBottom(){
    //上拉触底了
    console.log("触底了");

    let page = this.data.searchObj.curPage;
    page++;

    let _key = "searchObj.curPage"
    this.setData({
      [_key] : page
    })
    this.getOrderList();
  },
  onPullDownRefresh(){
    //监听下拉刷新
    let upKeyPage =  "searchObj.curPage";
    // wx.startPullDownRefresh();
    // wx.startPullDownRefresh()
    this.setData({
      [upKeyPage]:1
    });
    this.getOrderList();
  
  }
});
