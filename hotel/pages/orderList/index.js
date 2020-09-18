//index.js
//获取应用实例
import { wxRequest } from "../../../utils/request";
import { parseTime } from "../../../utils/time";
import myTime from '../../../utils/mytime';

const app = getApp();

Page({
  data: {
    dealerId:"",
    currtype: 0,
    searchObj:{
      curPage:1,
      memberId:"",
      pageSize:10,
      
    },
    orderList:[]
  },
  handleTab(e){
    console.log(e);
    // const index =e.currentTarget.target.index;
    const index =   e.currentTarget.dataset.index
    this.setData({
      currtype:index,
      isUsed:parseInt(index) + 1
    })

    let _key = "searchObj.curPage"
    this.setData({
      [_key] : 1
    })


    this.getOrderList();
  },
  handleOrder(e){
    let obj = e.currentTarget.dataset.obj;
    let oid=obj.orderNo
    let dealerId=obj.dealerId
    console.log(e,"订房的详情数据");
    wx.navigateTo({
      url: '/hotel/pages/orderDetail/index?oid='+oid+"&dealerId="+dealerId,
    });
  },
  handlePay(e){
    //跳转支付页面
    let obj = e.currentTarget.dataset.obj;
  },

  getOrderLists(){
    let that = this;
    let memberId =  that.data.searchObj.memberId;
    let curPage =  that.data.searchObj.curPage;
    let pageSize = that.data.searchObj.pageSize;
    let dealerId = wx.getStorageSync('dealerId');
  //  let dealerId = 0
   wxRequest({
     // url: "/apimall/order/mall/pageList?memberId="+memberId+"&curPage="+curPage+"&pageSize="+pageSize,
     url: '/api/order/member/room/pageList?dealerId=' + dealerId + '&curPage=1'  + '&pageSize=' + pageSize +"&memberId="+memberId+'&orderStatus=0'
   }).then(res=>{
     console.log(res.list)
     let orderList = that.data.orderList;
     if(that.data.searchObj.curPage == 1){
       orderList = res.list;
     }else{
       orderList = orderList.concat(res.list);
     }

     let newOrderList =  orderList.map(val=>{

       let obj = val;
       
       // obj.eta = parseTime(val.eta).slice(0,10);
       obj.eta = myTime.formatTimeTwo(val.eta/1000,'M月D日')
       obj.etd = myTime.formatTimeTwo(val.etd/1000,'M月D日')
      //  console.log(val.eta)
       return obj;


     })



     that.setData({
       orderList:newOrderList
     })

     wx.stopPullDownRefresh();
     
   }).catch(err=>{

   })
 },
  getOrderList(){
     let that = this;
    //  console.log(11111)
     let memberId =  that.data.searchObj.memberId;
     let curPage =  that.data.searchObj.curPage;
     let pageSize = that.data.searchObj.pageSize;
     let dealerId = wx.getStorageSync('dealerId');
    // let dealerId = 0
    wxRequest({
      // url: "/apimall/order/mall/pageList?memberId="+memberId+"&curPage="+curPage+"&pageSize="+pageSize,
      url: '/api/order/member/room/pageList?dealerId=' + dealerId + '&curPage=' + curPage + '&pageSize=' + pageSize +"&memberId="+memberId+'&orderStatus=0'
    }).then(res=>{
      console.log(res.list)
      let orderList = that.data.orderList;
      if(that.data.searchObj.curPage == 1){
        orderList = res.list;
      }else{
        orderList = orderList.concat(res.list);
      }

      let newOrderList =  orderList.map(val=>{

        let obj = val;
        
        // obj.eta = parseTime(val.eta).slice(0,10);
        // obj.eta = myTime.formatTimeTwo(val.eta/1000,'M月D日')
        // obj.etd = myTime.formatTimeTwo(val.etd/1000,'M月D日')
        console.log(val.eta)
        return obj;


      })



      that.setData({
        orderList:newOrderList
      })

      wx.stopPullDownRefresh();
      
    }).catch(err=>{

    })
  },


  onLoad() {

    

    // console.log("时间",parseTime("1590033600")) 

    let upKey =  "searchObj.memberId";
    this.setData({
      [upKey]:wx.getStorageSync("memberId"),
      dealerId:wx.getStorageSync("dealerId")
    })
    this.getOrderLists();
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
    this.getOrderLists();
  
  }
});
