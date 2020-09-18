import myTime from '../../../../utils/mytime';
import {
  pageList,
  getHotelOrderList,
  pointOrder,
  virtualList,
  cancelHotelOrder
} from "../../../../api/order"
const app = getApp();

Page({
  data: {
    searchObj: {
      curPage: 1,
      memberId: "",
      pageSize: 10
    },
    orderList: [],
    tab: [true,false],
    status:0
  },
  handlePay(e) {
    //跳转支付页面
    let obj = e.currentTarget.dataset.obj;
  },
  changetab(e){
    var idx = e.currentTarget.dataset.idx;
    if(idx == 0){
      this.getOrderList()
    }
    if(idx == 1){
      console.log('酒店套餐')
      this.getCardList()
    }
    var mk = []
    this.data.tab.forEach((item,index) => {
      if(index == idx){
        mk.push(true)
      }else{
        mk.push(false)
      }
    })
    this.setData({
      tab: mk,
      status:idx
    })
  },

  getCardList(){
    let that=this
    virtualList({
      memberId:wx.getStorageSync('memberId'),
      // memberId:'309070000141',
      curPage:that.data.searchObj.curPage,
      pageSize:that.data.searchObj.pageSize
    }).then(res=>{
      console.log(res.data,'虚拟商品订单')
      let cardList = that.data.cardList;
      if (that.data.searchObj.curPage == 1) {
        cardList = res.data.list;
      } else {
        cardList = cardList.concat(res.data.list);
        if (res.data.list.length == 0 && cardList.length != 0) {
          wx.showToast({
            title: '没有更多了',
            icon:'none'
          })
        }
      }

      that.setData({
        cardList: cardList
      })
    })
  },
  handleNextDetail(e) {
    let obj = e.currentTarget.dataset.item;
    console.log(obj);
    if (this.data.type == 'hotel') {
      let oid = obj.orderNo
      wx.navigateTo({
        url: '/hotel/pages/orderDetail/index?oid=' + oid + '&orderSource='+obj.orderSource+'&pfOrderNo='+obj.pfOrderNo,
      });
    } else {
      wx.navigateTo({
        url: '/my/pages/orderDetail/shopOrderDetail/shopOrderDetail?oid=' + obj.orderNo + '&type=' + this.data.type+'&status='+this.data.status
      });
    }

  },
  // 酒店订单
  getOrderLists() {
    let that = this;
    let memberId = that.data.searchObj.memberId;
    let curPage = that.data.searchObj.curPage;
    let pageSize = that.data.searchObj.pageSize;
    let dealerId = wx.getStorageSync('dealerId');
    let data = {
      dealerId: dealerId,
      curPage: curPage,
      pageSize: pageSize,
      memberId: memberId,
      orderStatus: 0
    }
    // let dealerId = 0
    pageList(data).then(res => {
      console.log(res)
      let newOrderList = res.data.list.map(val => {

        let obj = val;

        // obj.eta = parseTime(val.eta).slice(0,10);
        obj.eta = myTime.formatTimeTwo(val.eta / 1000, 'M月D日')
        obj.etd = myTime.formatTimeTwo(val.etd / 1000, 'M月D日')
        console.log(val.eta)
        return obj;


      })
      let orderList = that.data.orderList;
      if (that.data.searchObj.curPage == 1) {
        orderList = newOrderList;
      } else {
        orderList = orderList.concat(newOrderList);
      }


      that.setData({
        orderList: orderList
      })

      wx.stopPullDownRefresh();

    }).catch(err => {

    })
  },
  //  酒店商城订单
  getOrderList() {
    let that = this;

    let memberId = that.data.searchObj.memberId;
    let data = {
      pageNum: that.data.searchObj.curPage,
      pageSize: 10,
      orderType: '101',
      orderStatus: 0,
      memberId: memberId,
      goodsType: that.data.goodsType
    }
    getHotelOrderList(data).then(res => {
      console.log(res, '新的商城订单')
      let orderList = that.data.orderList;
      if (that.data.searchObj.curPage == 1) {
        orderList = res.data.list;
      } else {
        orderList = orderList.concat(res.data.list);
        if (res.data.list.length == 0 && orderList.length != 0) {
          wx.showToast({
            title: '没有更多了',
            icon:'none'
          })
        }
      }

      that.setData({
        orderList: orderList
      })
    })


  },
  // 酒店 客房取消订单
  cancelHotel(e){
    console.log(e,'333333')
    let that = this
    let item = e.currentTarget.dataset.item
    let idx = e.currentTarget.dataset.idx
    wx.showModal({
			title: '取消订单',
			content: '确认取消酒店订单',
			success: function(res) {
				if (res.confirm) {
				  cancelHotelOrder({
            dealerId:item.dealerId,
            orderNo:item.orderNo,
            customerId:item.customerId,
          }).then(res => {
            that.data.orderList[idx].cancelationFlag=1
            that.setData({
              orderList:that.data.orderList
            })
          })
				} else if (res.cancel) {
				}
			}
		})


    
    
  },
  // 积分商城订单
  getshoperList() {
    let that = this;

    let memberId = that.data.searchObj.memberId;
    let curPage = that.data.searchObj.curPage;
    let pageSize = that.data.searchObj.pageSize;
    let data = {
      memberId: memberId,
      curPage: curPage,
      pageSize: pageSize
    }
    pointOrder(data).then(res => {
      console.log(res, 'resresresres')
      let orderList = that.data.orderList;
      if (that.data.searchObj.curPage == 1) {
        orderList = res.data.list;
      } else {
        orderList = orderList.concat(res.data.list);
        if (res.data.list.length == 0 && orderList.length != 0) {
          wx.showToast({
            title: '没有更多了',
            icon:'none'
          })
        }
      }
      
      that.setData({
        orderList: orderList
      })
      wx.stopPullDownRefresh();


    }).catch(err => {

    })
  },
  onLoad(options) {
    let upKey = "searchObj.memberId";
    this.setData({
      [upKey]: wx.getStorageSync("memberId"),
      type: options.type,
      goodsType: options.goodstype
    })
    console.log(options, this.data.goodsType)
    if (options.type == 'shop') {
      this.getOrderList();


    } else if (options.type == 'hotel') {
      this.getOrderLists();
    } else {
      this.getshoperList()
    }
    wx.setNavigationBarTitle({
      title: options.title
    })
  },
  // 再次预定
  againd(e){
    wx.navigateTo({
      url: '/hotel/pages/index?dealerId=' +  e.currentTarget.dataset.item.dealerId
    });
  },
  onShow() {

  },
  onReachBottom() {
    //上拉触底了
    console.log("触底了");

    let page = this.data.searchObj.curPage;
    page++;

    let _key = "searchObj.curPage"
    this.setData({
      [_key]: page
    })
    if (this.data.type == 'shop') {
      this.getOrderList();

    } else if (this.data.type == 'hotel') {
      this.getOrderLists();

    } else if (this.data.type == 'point') {
      this.getshoperList()
    }
  },
  onPullDownRefresh() {
    //监听下拉刷新
    let upKeyPage = "searchObj.curPage";
    // wx.startPullDownRefresh();
    // wx.startPullDownRefresh()
    this.setData({
      [upKeyPage]: 1
    });
    this.getOrderList();

  }
})