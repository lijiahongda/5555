//index.js
//获取应用实例
import {
  wxRequest
} from "../../../utils/request";
import {
  getRouterUrl
} from "../../../utils/util"
const app = getApp();

Page({
  data: {
    isCard: '', //1开卡
    centerData: "",
    userinfo: "",
    uimg: ""
  },
  nextMallOrder() {
    wx.navigateTo({
      url: "/supermarket/shop/orderList/index",
    });
  },
  nextRoomOrder() {
    wx.navigateTo({
      url: "/hotel/pages/orderList/index",
    });
  },
  nextAddress() {
    wx.navigateTo({
      url: "/supermarket/shop/address/index?type=1",
    });
  },
  handleNextCoupon() {
    wx.navigateTo({
      url: "/bag/Home/coupon/index",
    });
  },
  nextUrl(e) {
    console.log(e);
    let obj = e.currentTarget.dataset.obj;
    wx.navigateTo({
      url: "/supermarket/shop/detail/index?sid=" + obj.id,
    });
  },


  getUserCenter() {
    let that = this;
    wxRequest({
      url: "/api/customer/userCenter",
      method: "post",
      data: {
        dealerId: that.data.dealerId || wx.getStorageSync("dealerId"),
        customerId: wx.getStorageSync("customerId")
      },
      contentType: "application/json;charset=UTF-8"
    }).then(res => {
      console.log("用户个人中心", res,res.levelCardDTO.levelCardId);
      console.log("分享",res.inviteCode)
      if (res.levelCardDTO.level > 0) {
        //用户已开通卡
        console.log('===')
        that.setData({
          centerData: res,
          "isCard": "1"
        })

      }

    }).catch(err => {

    })
  },
  onLoad(query) {
    let {
      dealerId
    } = query;
    let backurl = getRouterUrl();

    // this.setData({
    //   dealerId,
    //   userinfo:wx.getStorageSync("userinfostr"),
    //   uimg:wx.getStorageSync("userinfostr").headImg || "/images/vipcard/sdgf.png"
    // })
    // this.getUserCenter();


      if(wx.getStorageSync('memberId')){
        this.setData({
          dealerId,
          userinfo: wx.getStorageSync("userinfostr"),
          uimg: wx.getStorageSync("userinfostr").headImg || "/images/vipcard/sdgf.png"
        })
        this.getUserCenter();
      }
     
    // })
  }
});