//index.js
//获取应用实例

import {
  wxRequest
} from "../../../utils/req"
import myTime from '../../../utils/mytime';
import {
  myCoupons
} from "../../../api/Homeapi"

const app = getApp()

Page({
  data: {
    couponData: [],
    title: '',
    dealerId: '',
    list: [],
    curPage: 0,
    pageSize: 6,
    currtype: 0,
    loading: false,
    isUsed: 1,
    searchObj: {
      curPage: 1,
      pageSize: 10
    },
    isShow:false,
    //tab框
    selected: 0,
    list: ['所有', '未使用', '已使用', '已过期'],
  },
  onLoad: function (options) {
    let that = this;
    that.couponsList()
  },
  //tab框
  selected: function (e) {
    console.log(e)
    let that = this
    let index = e.currentTarget.dataset.index
    console.log(index)
    if (index == 0) {
      that.setData({
        selected: 0
      })
      that.couponsList()
    } else if (index == 1) {
      that.setData({
        selected: 1
      })
      that.couponsList()
    } else if (index == 2) {
      that.setData({
        selected: 2
      })
      that.couponsList()
    } else if (index == 3) {
      that.setData({
        selected: 3
      })
      that.couponsList()
    }
  },
  botDetails(e){
    this.setData({
      isShow:!this.data.isShow
    })
  },
  // 弹框出现
  examine: function (e) {
    var that = this
    console.log(e.currentTarget.dataset.id)
    var id = e.currentTarget.dataset.id;
    var couponsList = that.data.couponsList;
    for (var i = 0; i < couponsList.length; i++) {
      for (var k = 0; k < couponsList[i].coupons.length; k++) {
        if (id == couponsList[i].coupons[k].customerCouponsId) {
          console.log(couponsList[i].coupons[k].instructions)
          var att = JSON.parse(couponsList[i].coupons[k].instructions)

          that.setData({
            title: couponsList[i].coupons[k].couponName,
            contont: att,
            pop: true
          })
        }
      }
    }
  },
  // 弹框消失
  close: function (e) {
    this.setData({
      pop: false
    })
  },

  // 优惠券列表
  couponsList: function (e) {
    let that = this;
    console.log(wx.getStorageSync("dealerId"))
    if (wx.getStorageSync("dealerId")) {
      var dealerId = wx.getStorageSync("dealerId")
    } else {
      var dealerId = '0'
    }
    let params = {
      memberId: wx.getStorageSync("memberId"),
      dealerId: dealerId,
      isUsed: that.data.selected
    }
    myCoupons(params).then(res => {
      console.log(res, '我的优惠券')
      if (!res.data.hotels || res.data.hotels.length == 0) {
        that.setData({
          not: true
        })
      } else {
        for (var i = 0; i < res.data.hotels.length; i++) {
          for (var k = 0; k < res.data.hotels[i].coupons.length; k++) {
            res.data.hotels[i].coupons[k].dueTime = myTime.formatTimeTwo(res.data.hotels[i].coupons[k].dueTime / 1000, 'Y-M-D')
          }
        }
        that.setData({
          couponsList: res.data.hotels,
          not: false
        })
      }

    })
  },

  //使用优惠券
  employ: function (e) {
    console.log(e.currentTarget.dataset.dealerid)
    var dealerId = e.currentTarget.dataset.dealerid
    if (!dealerId) {
      wx.showToast({
        title: '请下载直订APP使用',
        icon: 'none',
      });
    } else {
      wx.navigateTo({
        url: '/hotel/pages/index?dealerId=' + dealerId,
      })
    }
  },


  handleChooseAddress(e) {
    let obj = e.currentTarget.dataset.obj;
    let {
      addressId
    } = obj;
    wx.setStorageSync("addressId", addressId);
    wx.navigateBack();
  },

  parseTimeDate(v) {
    let value = v * 1;
    var date = new Date(value);

    var Y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var H = date.getHours();
    var i = date.getMinutes();
    var s = date.getSeconds();
    console.log("日期", Y + '-' + m + '-' + d);

    return Y + '-' + m + '-' + d;


  },

  getCouponList() {
    //获取房间列表
    let self = this;
    let memberId = wx.getStorageSync("memberId");
    let dealerId = wx.getStorageSync("dealerId");
    let isUsed = self.data.isUsed;
    wxRequest({
      url: "/api/customer/coupon/coupons?curPage=" + self.data.searchObj.curPage + "&pageSize=10&isUsed=" + isUsed + "&customerId=" + memberId + "&dealerId=" + dealerId

      // url:"/api/customer/coupon/coupons?curPage=1&pageSize=50&isUsed="+isUsed+"&customerId="+memberId+"&dealerId="+dealerId
    }).then(res => {
      console.log("优惠券", res);

      let couponList = self.data.couponData;

      if (self.data.searchObj.curPage == 1) {

        couponList = res.list;
      } else {

        couponList = couponList.concat(res.list)

      }




      let newData = couponList.map(val => {
        let obj = val;
        // obj.duetime = datefomate(val.duetime)
        // console.log( datefomate(val.duetime))
        obj.dueTime1 = self.parseTimeDate(val.dueTime)
        return obj;
      })

      self.setData({
        couponData: newData
      })
    }).catch(err => {
      console.log("请求失败", err);

    })
  },


  onShow() {
    // this.getCouponList();
  },

  onReachBottom() {
    //上拉触底了
    // console.log("触底了");

    // let page = this.data.searchObj.curPage;
    // page++;

    // let _key = "searchObj.curPage"
    // this.setData({
    //   [_key] : page
    // })
    // this.getCouponList();
  }

})