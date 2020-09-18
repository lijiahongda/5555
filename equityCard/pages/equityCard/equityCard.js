import {
  freeProduct
} from "../../../api/baina"
import {
  cardEquity
} from "../../../api/hotel"
import {
  authCheck,
} from "../../../api/cps"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mid: "",
    show: false,
    freeCont: {},
    isLevelState:wx.getStorageSync('isLevelState')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getlist()
  },
  // 初始化请求数据
  getlist() {
    this.mid = wx.getStorageSync('memberId');
    cardEquity({
      mid: this.mid
    }).then(res => {
      this.setData({
        coupon: res.data.coupon,
        hot: res.data.hot,
        travel: res.data.travel,
        lineData: res.data.lineData,
        saveMoney: res.data.saveMoneyNew,
        card:res.data.card
      })
    })
    freeProduct({}).then(res => {
      this.setData({
        freeList: res.data.data,
        freeCont: res.data
      })
    })
  },
  close() {
    this.setData({
      show: false
    })
  },
  // 白拿商品 查看更多
  freeMore() {
    wx.navigateTo({
      url: '/equityCard/pages/baina/whiteWith/whiteWith',
    })
  },
  // 立即兑换
  goCard(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/equityCard/pages/exchange/index?cardId='+id,
    })
  },
  // 热门 点击跳转
  gohot(e) {
    if (this.data.isLevelState==0) {
      this.setData({
        show: true
      })
      return
    }
    
    let item=e.currentTarget.dataset.item
    if(item.id==1){
      let that=this,
      data={
        mid:wx.getStorageSync('memberId')
        // mid:'309140000016'
      }
      authCheck(data).then(res => {
      console.log(res,'444444')
      if (res.code == 200) {
        if(res.data.auth==1){
          wx.navigateTo({
            url: '/equityCard/pages/ELM/ELM',
          })
        }else{
          
          wx.navigateTo({
            url: '/my/pages/h5/h5',
          })
        }
      } else if (res.data.code == 400) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })

      }
    })
      // wx.navigateToMiniProgram({
      //   appId: 'wxece3a9a4c82f58c9',
      //   path: item.url,
      //   extraData: {
  
      //   },
      //   envVersion: 'release',
      //   success(res) {
      //     // 打开成功
      //   }
      // })
    }else{

      wx.navigateTo({
        url: '/equityCard/pages/blank/blank',
      })
    }
  },
  lockHotel() {
    wx.navigateTo({
      url: '/my/pages/vipcard/index'
    })
  },
  // 
  gocoupon() {
    if (this.data.isLevelState==0) {
      this.setData({
        show: true
      })
      return
    }
    wx.navigateTo({
      url: '/equityCard/pages/blank/blank',
    })
  },

  // 
  gotravel(e) {
    if (this.data.isLevelState==0) {
      this.setData({
        show: true
      })
      return
    }
    let item = e.currentTarget.dataset.item
    if (item.id == 3) {
      wx.navigateTo({
        url: '/equityCard/pages/Oiling/OilingAll/Strategy/Strategy',
      })
    } else {
      wx.navigateTo({
        url: '/equityCard/pages/blank/blank',
      })
    }
  },
  gowhith(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/equityCard/pages/baina/goodsDetail/goodsDetail?productId=' + item.id + '&productSkuId=' + item.skuId,
    })
  },
  gointeral() {
    wx.navigateTo({
      url: '/my/pages/integral/integral',
    })
  }
})