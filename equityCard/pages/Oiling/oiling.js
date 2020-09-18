// equityCard/pages/Oiling/oiling.js
let page = 1;
console.log(page, "页数")
import {
  getFuelList
} from "../../../api/cps"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oilling: 0, //tab文字
    current: "",
    current2: "",
    showView: false,
    modelShow: false,
    mode: 'scaleToFill	',
    page: 1, //当前页数
    pages: 0, //每页条数
    total: 0, //总条数
    list: [], //列表
    fuelNumber: [], //92#
    sort: [], //距离优先
    id: 1,
    name: "92#",
    names: "距离优先",
    items: {},
    cont: {}, //选中的对象
  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    that.setData({
      oilling: e.target.dataset.current,
      showView: false,
    })
  },
  modalX: function () {
    this.setData({
      modelShow: false,
    })
  },
  onShow() {
    this.setData({
      modelShow: false
    })
  },
  //点击tab 里面的文字
  changeStyle(e) {
    var that = this;
    that.setData({
      name: e.currentTarget.dataset.name,
      current: e.target.dataset.id,
      showView: true
    })
    that.list(1)
  },
  changeStyle1(e) {
    var that = this;
    that.setData({
      current2: e.target.dataset.id,
      id: e.currentTarget.dataset.id,
      names: e.currentTarget.dataset.names,
      showView: true
    })
    that.list(1)
    // this.list(e.currentTarget.dataset)
  },
  //点击背景色关闭
  bgBox() {
    let that = this;
    that.setData({
      showView: true
    })
  },
  // 点击导航
  map(e) {
    var lan = Number(e.currentTarget.dataset.lat)
    var lng = Number(e.currentTarget.dataset.lng)
    var address = e.currentTarget.dataset.address
    console.log(lan, lng, "经纬度")
    // 复制代码
    wx.getLocation({ //获取当前经纬度
      type: 'wgs84', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息  
      success: function (res) {
        wx.openLocation({ //​使用微信内置地图查看位置。
          latitude: lan, //要去的纬度-地址
          longitude: lng, //要去的经度-地址
          name: address,
          address: address
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.list(1)
  },
  list: function (id) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var that = this; //这部必须有，非常重要
    var token = wx.getStorageSync('token');
    getFuelList({
      page: that.data.page,
      gasName: that.data.name,
      // nameSort:that.data.nameSort,
      sort: that.data.id,
      lng: wx.getStorageSync('longitude'),
      lat: wx.getStorageSync('latitude')
    }).then(res => {
      console.log(res, '加油的首页列表')
      res.data.list = res.data.list || []
      var list = []
      if (id == 2) {
        list = that.data.list.concat(res.data.list)
      } else {
        list = res.data.list
      }
      var fuelNumber = res.data.fuelNumber || [];
      var sort = res.data.sort || [];

      that.setData({
        list: list,
        fuelNumber: fuelNumber,
        sort: sort,
        total: res.data.total || 0,
      })

      that.data.fuelNumber.map((item, idx) => {
        item.list.map((items, index) => {
          if (items.name == that.data.name) {
            that.setData({
              current: items.id
            })
          }
        })
      })
      that.data.sort.map((item, idx) => {
        if (item.id == that.data.id) {
          that.setData({
            current2: item.id
          })
        }
      })
    })
    // wx.request({//从后端获取数据
    //   method: "post",
    //   url: 'https://yuecheng-api.yuelvhui.com/app/member/getFuelList',//后端传数据的路径
    //   data: {

    //   },
    //   header: {
    //     'content-type': 'application/json', // 默认值
    //     'Authorization': token
    //   },

    //   success(res) {
    //     wx.hideLoading();//隐藏加载
    //     if(res.data.code == 200 && res.data.data){

    //     }
    //   }
    // })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.list.length < this.data.total) { // 判断当前数据列表是否小于等于总条数
      this.data.page++
      this.list(2)
    }
  },
  // 详情
  goDetail: function (e) {
    let that = this
    let item = e.currentTarget.dataset.item
    let type = e.currentTarget.dataset.type
    let url = '/equityCard/pages/Oiling/OilingAll/choose/choose?id=' + item.gasId + '&name=' + item.title + '&type=' + that.data.current2 + '&listid=' + item.id
    // console.log(url,'-----')
    if (item.alert == 1) {
      console.log('333')
      that.setData({
        modelShow: true,
        cont: item
      })
      if (type == 1) {
        wx.navigateTo({
          url: url
        })
      }
    } else {
      console.log('123')
      wx.navigateTo({
        url: url
      })
    }
  }
})