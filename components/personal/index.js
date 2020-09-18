import {
  memberDetail,
  historyHotel,
  goodShop,
  getNavList,
  cardV2
} from '../../api/personal'

import {
  cardLevel
} from '../../api/hotel'

var app = getApp();

Component({
  properties: {
    status: {
      type: String,
      value: "1"
    }
  },
  data: {
    iShidden: true,
    member: false,
    friendCircle: 0,
    saveMoney: 0,
    commission: 0,
    point: 0,
    historyHotel: [],
    withDrawIncome: 0,
    TuijHotel: [],
    background: 'linear-gradient(29deg,rgba(238,247,255,1),rgba(255,244,253,1));',
    icon: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-21/00/yuelvhuiqjRzxgXOTK1587399992.png',
    coupons:[],
    states:0,
    isLevelState:wx.getStorageSync('isLevelState'),
    levelName:wx.getStorageSync('levelName')
  },
  methods: {
    init() {
      if (wx.getStorageSync('msg_key')) {
        this.setData({
          iShidden: true
        });
      }
    if (wx.getStorageSync('memberId')) {
      this.getMoney() // 获取佣金
      this.getHistoryHotel() // 获取酒店浏览记录
      this.getTuijHotel() // 获取酒店列表
      this.getnavicon()
      this.getCoupon()
      this.setData({
        member: true
      })
      this.cardLevel()
      if (wx.getStorageSync('userinfostr')) {
        this.setData({
          userinfostr: wx.getStorageSync('userinfostr'),
          mobile_first: wx.getStorageSync('userinfostr').mobile.substr(0, 3),
          mobile_last: wx.getStorageSync('userinfostr').mobile.substr(7, 11),
          city: wx.getStorageSync('city')
        })
        if (!wx.getStorageSync('userinfostr').headImg) {
          wx.navigateTo({
            url: '/pages/login/index'
          })
        }
      }
    } else {
      this.getTuijHotel() // 获取酒店列表
      this.getnavicon()
      this.getCoupon()
      if (this.data.status == 1) { //  首页
        this.setData({
          member: false
        })
      } else { // 酒店个人中心
        wx.navigateTo({
          url: '/pages/login/index'
        })
      }
    }
  },
  cardLevel:function(){
    cardLevel({}).then(res=>{
        console.log(res,'resresres')
        this.setData({
          isLevelState:res.data.isLevelState,
          levelName:res.data.levelName,
        })
        wx.setStorageSync('isLevelState', res.data.isLevelState)
        wx.setStorageSync('levelName', res.data.levelName)
      })
    },
    userlogin() { // 登录
      wx.navigateTo({
        url: '/pages/login/index'
      })
    },
    // 券列表
    getCoupon(){
      let that = this
      let data = {
        card_id:3
      }
      cardV2(data).then(res => {
        console.log(res, '会员卡返值1111')
        that.setData({
          coupons:res.data
        })
      })
    },
    // 展示优惠券弹框
    couponShow(){
      if (!wx.getStorageSync('memberId')) {
        wx.navigateTo({
          url: '/pages/login/index'
        })
        return
      }
      this.setData({
        states:1
      })
    },
    // 进入酒店列表
    goHotelList(e){
      wx.navigateTo({
        url: '/hotel/pages/pmsList/pmsList',
      })
    },
    copy(e) { // 复制
      wx.setClipboardData({
        data: e.currentTarget.dataset.text,
        success(res) {
          wx.getClipboardData({
            success(res) {}
          })
        },
        complete(res) {}
      })
    },
    closeTip() { // 点击关闭弹窗
      wx.setStorageSync('msg_key', true);
      this.setData({
        iShidden: true
      })
    },
    toPath(e) { // 跳转页面
      if (!wx.getStorageSync('memberId')) {
        wx.navigateTo({
          url: '/pages/login/index'
        })
        return
      }
      let url = ''
      if (e.currentTarget.dataset.item.id == '1') {
        url = '/my/pages/myOrder/index'
      } else if (e.currentTarget.dataset.item.id == '2') {
        url = '/hotel/pages/collect/index'
      } else if (e.currentTarget.dataset.item.id == '3') {
        url = '/my/pages/coupon/index'
      } else if (e.currentTarget.dataset.item.id == '4') {
        url = '/my/pages/blank/index'
      }
      wx.navigateTo({
        url
      })
    },
    toPaths(e) { // 跳转页面
      if (!wx.getStorageSync('memberId')) {
        wx.navigateTo({
          url: '/pages/login/index'
        })
      }
      let url = e.currentTarget.dataset.url
      wx.navigateTo({
        url
      })
    },
    getMoney() { // 获取佣金数据
      let dealerId = wx.getStorageSync('dealerId') || 0
      let data = {
        memberId: wx.getStorageSync('memberId'),
        dealerId
      }
      memberDetail(data).then(res => {
        this.setData({
          friendCircle: res.data.friendCircle,
          saveMoney: res.data.saveMoney,
          commission: res.data.commission,
          point: res.data.point
        })
      })
    },
    getHistoryHotel() { // 获取酒店浏览记录
      let memberId = wx.getStorageSync('memberId')
      historyHotel(memberId).then(res => {
        let dealers = res.data.dealers || []
        let withDrawIncome = (res.data.withDrawIncome / 100).toFixed(2)
        this.setData({
          historyHotel: dealers.splice(0, 3),
          withDrawIncome
        })
      })
    },
    getTuijHotel() { // 获取推荐酒店列表
      let data = {
        lat: String(wx.getStorageSync('latitude')),
        lng: String(wx.getStorageSync('longitude')),
        city: wx.getStorageSync('city')
      }
      console.log(data)
      goodShop(data).then(res => { // 接口格式需要调整
        console.log(res)
        this.setData({
          TuijHotel: res.data || []
        })
      })
    },
    getnavicon() {
      console.log(wx.getStorageSync('isLevelState'),'00000000')
      getNavList({
        state: wx.getStorageSync('isLevelState')
      }).then(res => {
        console.log(res, 'navnavnav')
        this.setData({
          navList: res.data.nav,
          interests: res.data.interests
        })
      })
    },
    to_tuijian(e) { // 去推荐的酒店
      if (wx.getStorageSync('memberId')) {
        wx.setStorageSync('dealerId', e.currentTarget.dataset.dealerid)

        wx.redirectTo({
          url: '/pages/index/index',
        })
        this.to_tuijian()
      } else {
        wx.navigateTo({
          url: '/pages/login/index'
        })
      }
    },
    to_history(e) { // 去历史酒店
      wx.setStorageSync('dealerId', e.currentTarget.dataset.dealerid)
      wx.redirectTo({
        url: '/pages/index/index',
      })
      app.getCustomerIds()
      // this.getCustomerId()
    },
    // getCustomerId(){
    //   let params = {
    //     dealerId: wx.getStorageSync("dealerId"),
    //     openId: wx.getStorageSync('openId'),
    //     loginLogDto: {}
    //   };
    //   customerId(params).then(res => {
    //     console.log(res,'查看数据')
    //     wx.setStorageSync('customerId', res.response.response.data.customerId)
    //   })
    // }
  },
  lifetimes: { // 组件的生命周期
    created() {
      // 在组件实例刚刚被创建时执行
    },
    attached() { // 在组件实例进入页面节点树时执行

    },
    ready() { // 在组件在视图层布局完成后执行

    },
    moved() {
      // 在组件实例被移动到节点树另一个位置时执行
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
    error() {
      // 每当组件方法抛出错误时执行
    }
  },
  pageLifetimes: { // 组件所在页面的生命周期
    show() {
      // 组件所在的页面被展示时执行
      this.init()
    },
    hide() {
      // 组件所在的页面被隐藏时执行
    },
    resize() {
      // 组件所在的页面尺寸变化时执行
    }
  }
})