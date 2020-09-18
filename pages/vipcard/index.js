//index.js
//获取应用实例
var aa
import {
  retrunScene,
  getCardCode
} from "../../utils/public"
import {
  posters,
  hotelCard,
  getPrivilegeListRights,
  cardInfo
} from '../../api/personal'
const app = getApp()

Page({
  data: {
    posterObj: {
      status: 0,
      url: ""
    },
    shareSelectStatus: 0,
    dealerId: "",
    currentSwiper: 0,
    list: [],
    cpsCustomerId:'',
    Detail: 'ss',
    equityList: [], //权益左滑列表
    swiper_curPage:0,
    couponShow:false,//优惠券列表
    adminId:'',
    countdown:'',//倒计时关闭

  },
  // 优惠券
  couponBox(){
    this.setData({
      couponShow:!this.data.couponShow
    })
  },
  onShow() {
    let that = this;
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let options = currentPage.options;

    console.log(options, "分享参数接收")

    if (options.op) {
      wx.setStorageSync('inviteCode', options.op);
    }
    if (options.dealerId) {
      wx.setStorageSync('dealerId', options.dealerId);
    }

    if (options.scene != null) {
      retrunScene(options.scene, function (sceneObj) {
        console.log(sceneObj, 'sceneObj')
        getCardCode(sceneObj.R).then(res => {
          console.log(res,'zheli')
          that.setData({
            cardId: res.Q,
            cpsCustomerId:res.H
          })
          if (!wx.getStorageSync('memberId')) {
            // console.log("来room")
            wx.navigateTo({
              url: '/pages/login/index',
            })
          } else {

            var aa = setInterval(function () {
              if (!wx.getStorageSync('customerId')) {
                app.getCustomerIds()
              } else {
                that.getList()
                clearInterval(aa);
              }
            }, 1000);
          }
          that.setData({
            dealerId: wx.getStorageSync('dealerId')
          })
        })
      });
    } else {

      if (!wx.getStorageSync('memberId')) {
        wx.navigateTo({
          url: '/pages/login/index',
        })
      } else {
        this.adminId = options.adminId?options.adminId:'';
        this.cpsCustomerId = options.cpsCustomerId

        aa = setInterval(function () {
          if (!wx.getStorageSync('customerId')) {
            app.getCustomerIds()
          } else {
            that.getList()
            clearInterval(aa);
          }
        }, 1000);
      }
      this.setData({
        dealerId: wx.getStorageSync('dealerId'),
      })
    }

    if (pages.length != 1) {
      this.setData({
        icons1: 'https://yuelvdaren-1300766538.cos.ap-beijing.myqcloud.com/daren/2020/03/26/5e7c267a938c31585194618.png'
      })
    } else {
      this.setData({
        icons2: 'http://image.zhiding365.com/2020/7/23/3d5db616-4f17-483f-9824-9f4866fcb9e2.png'
      })
    }
    
    this.getPrivilegeListRights()//权益滑动列表
   

  },
  onUnload: function() {
    // 页面销毁时执行
    clearInterval(aa);
  },
   // 列表详情
   getList() {
    let that = this
    let data = {
      memberId: wx.getStorageSync('memberId'),
      dealerId: wx.getStorageSync('dealerId'),
      customerId: wx.getStorageSync('customerId')?wx.getStorageSync('customerId'):'',
    }

    hotelCard(data).then(res => {
      that.setData({
        Detail:res.data
      })
      that.getShareData()
    })
  },

  // 权益滑动列表
  getPrivilegeListRights: function () {
    getPrivilegeListRights({}).then(res => {
      this.setData({
        equityList: res.data
      })
    }).catch(err => {
    })
  },
  // 调到八大权益页
  goEquity(e) {
    wx.navigateTo({
      url: '/my/pages/equity/equity?id=' + e.currentTarget.dataset.id + '&canGetEight=' + this.data.canGetEight,
    })
  },
  // 跳转特权详情
  privilegeDetail() {
    let that = this
    wx.navigateTo({
      url: '/my/pages/privilegeDetail/privilegeDetail?id='+this.data.swiper_curPage+'&cardId=' +that.data.Detail[that.data.currentSwiper].cardId + "&cpsCustomerId=" + that.data.cpsCustomerId+'&adminId='+that.data.adminId,
    })
  },

  
  handleShowSelect() {
    this.setData({
      shareSelectStatus: 1
    })
  },
  handleCloseShareDialog() {
    this.setData({
      shareSelectStatus: 0
    })
  },
  handleShowPosterStatus() {
    //海报点击之后出发该事件
    this.ajaxHaiBao();
  },
  ajaxHaiBao() {
    //生成海报
    let _type = this.data.Detail[this.data.currentSwiper].type;
    let that = this
    let carid = '';
    wx.showLoading({
      title: '海报生成中',
      mask: true
    });

    let params = {
      dealerId: wx.getStorageSync("dealerId"),
      mid: wx.getStorageSync("memberId"),
      type: _type,
      cardId: this.data.Detail[this.data.currentSwiper].cardId,
      cpsCustomerId:wx.getStorageSync('customerId')
    }

    that.setData({
      cardId: carid
    })


    posters(params).then(res => {
      this.setData({
        posterObj: {
          status: 1,
          url: res.data
        }
      })
    })

  },
  handleBox() {
    //隐藏海报和分享的弹窗
    let _key = "posterObj.status"
    this.setData({
      [_key]: 0,
      shareSelectStatus: 0
    })
  },
  // 转发
  getShareData() {
    let that = this;
    cardInfo({
      cardId: that.data.Detail[that.data.currentSwiper].cardId
    }).then(res => {
      that.setData({
        shareData: res.data
      })
    }).catch(err => {
    })
  },
  swiperChange: function (e) {
    this.setData({
      currentSwiper: e.detail.current
    })
    this.getShareData();
  },
  // 联名卡滑动
  swiperBindchange: function (e) {
    this.setData({
      swiper_curPage: e.detail.current
    })
  },
 

  open() {
    let that = this;
    wx.navigateTo({
      url: '/my/pages/vipcardCreate/index?cardId=' +that.data.Detail[that.data.currentSwiper].cardId + "&cpsCustomerId=" + that.data.cpsCustomerId+'&adminId='+that.data.adminId
    })
  },


  // 分享
  onShareAppMessage: function () {
    let that = this;
    return {
      title: that.data.shareData.text,
      desc: wx.getStorageSync('invite'),
      path: "/my/pages/vipcard/index?op=" + wx.getStorageSync('mYinviteCode') + "&dealerId=" + wx.getStorageSync('dealerId')+'&cpsCustomerId='+wx.getStorageSync('customerId'),
      imageUrl: that.data.shareData.image
    }
  },
})