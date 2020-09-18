// page/MyOther/pages/editInfo/editInfo.js
const app = getApp()
import {
  searchHotel
} from '../../../api/hotel'
import {
  getProvince,
  getCity,
  getArea
} from "../../../api/baina.js"
import {hotelShare}  from "../../../api/personal"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Return: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-30/20/yuelvhuidjEjRAEqX01588248683.png',
    del: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-30/20/yuelvhui3Ptw9eiM2R1588248772.png',
    list: [],
    first: false,
    Status: false,
    provinceId: '',
    province: '',
    isprovince: true,
    city: '',
    cityId: '',
    iscity: false,
    area: '',
    areaId: '',
    isarea: false,
    Town: '',
    TownId: 0,
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        Status: false
      })
    }.bind(this), 200)
  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      Status: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  getshare(){
    hotelShare({id:1}).then(res=>{
      console.log(res.data,'90909090')
      this.setData({
        shareData:res.data
      })
    })
  },
  // 默认加载省接口
  defaultData: function (e) {
    let that = this
    that.setData({
      isprovince: true,
      iscity: false,
      isarea: false,
      isTown: false
    })
    if (that.data.TownId) {
      that.setData({
        isTown: true
      })
    }
    getProvince({}).then(res => {
      that.setData({
        provincelist: res.data
      })

    })
  },
  // 选择省-加载市数据
  Selectprovince: function (e) {
    let that = this;
    that.setData({
      city: '',
      area: '',
      Town: '',
      cityId: '',
      areaId: '',
      TownId: '',
    })
    if (e.currentTarget.dataset.id) {
      that.setData({
        provinceId: e.currentTarget.dataset.id,
      })
    }
    that.setData({
      provinceId: that.data.provinceId,
      province: e.currentTarget.dataset.name,
      isprovince: false,
      iscity: true,
    })
    getCity({
      province_id: that.data.provinceId
    }).then(res => {
      that.setData({
        citylist: res.data
      })
    })
  },
  // 选择市-加载区数据
  SelectCity: function (e) {
    let that = this;
    if (e.currentTarget.dataset.id) {
      that.setData({
        cityId: e.currentTarget.dataset.id,
      })
    }
    that.setData({
      cityId: that.data.cityId,
      city: e.currentTarget.dataset.name,
      isprovince: false,
      iscity: false,
      isarea: true
    })
    getArea({
      city_id: that.data.cityId
    }).then(res => {
      that.setData({
        arealist: res.data
      })
    })
  },
  // 选择区-加载街道数据
  Selectarea: function (e) {
    let that = this;
    that.setData({
      area: e.currentTarget.dataset.name,
      areaId: e.currentTarget.dataset.id
    })
    that.hideModal()

  },
  LocationMore() {
    let that = this;
    that.showModal()
  },
  // 返回
  navigatorUrl: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  code: function (e) {
    console.log(e)
    this.setData({
      areaCode: e.detail.areaCode,
      areaName: e.detail.areaName,
      cityCode: e.detail.cityCode,
      cityName: e.detail.cityName,
      provincesCode: e.detail.provincesCode,
      provincesName: e.detail.provincesName
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      keyword: '',
      list: []
    })
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let options = currentPage.options;
    
    if (JSON.stringify(options) == "{}") {

    } else {
      if (!wx.getStorageSync('memberId')) {
        if (app.globalData.isStrongLogin == 1) {
          wx.navigateTo({
            url: '/pages/login/index'
          })
        }
      }
    }
    this.getshare()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,'分享接收')
    if (options.inviteCode) {
      wx.setStorageSync('inviteCode', options.inviteCode);
    }
    let that = this
    that.defaultData()
  },
  // 下一步
  btn: function () {
    wx.navigateTo({
      url: '/hotel/pages/hotelInfo/hotelInfo'
    })
  },
  explain: function () {
    wx.navigateTo({
      url: '/hotel/pages/hotelExplain/hotelExplain',
    })
  },
  // 关键词
  hotelKey: function (e) {
    let that = this
    if (!e.detail.value) {
      return
    }
    that.setData({
      keyword: e.detail.value,
      first: true
    })
    searchHotel({
      cityName: that.data.city,
      keyword: e.detail.value
    }).then(res => {
      console.log(res, '酒店入驻')
      if (res.code == 200) {
        this.setData({
          list: res.list,
          first: false
        })
      } else if (res.empty == 1) {
        this.setData({
          list: [],
          first: true
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  // 选择酒店
  choose: function (e) {
    let that = this
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/hotel/pages/hotelInfo/hotelInfo?hotelName=' + item.hotelName + '&hotelMobile=' + item.phone + '&hotelAddress=' + item.address + '&type=1'
    })
  },
  // 分享的接口
  onShareAppMessage() {
    console.log(this.shareData)
    return{
      title:this.data.shareData.title,
      imageUrl:this.data.shareData.img,
      path: "/hotel/pages/hotelCheck/hotelCheck?inviteCode=" + wx.getStorageSync('mYinviteCode'),
    }
  }
})