// page/HotelOther/HotelList/HotelList.js
var Moment = require("../../../utils/moment.js");
// var QQMapWX = require('../../../../qqmap-wx-jssdk.min.js');
var qqmapsdk;
const app = getApp()
import {
  hotelList,
  zdAppletHotelList
} from '../../../api/hotel';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRefresh: 0,
    map: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-17/15/yuelvhuit0Hb1we6Id1587109391.png', //切换地图的icon
    loc: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-17/15/yuelvhuidDMuuOPpt61587110077.png', //定位图
    del: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-17/16/yuelvhui7FK19FX9kC1587110955.png', //删除地址
    screenImage: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-15/23/yuelvhuirLiBcoaVVS1586964364.png', //筛选image
    isHotelList: true, //控制列表间距
    showModalStatus: false, //价钱星级弹窗
    isSort: false, //是否显示排序弹窗
    isArea: false, //是否显示区域位置
    isScreening: false, //是否显示综合筛选
    frameClass2: 'frame z2',
    current: 0,
    HotelList: [],
    locImage: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-17/01/yuelvhuiLOelairLiw1587057788.png', //定位icon
    controls: [{
      id: 1,
      iconPath: '',
      position: {
        left: 0,
        top: 10,
        width: 40,
        height: 40
      },
      clickable: true
    }],
    ismap: false,
    listImage: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-20/21/yuelvhuiuB8SrMT5Lx1587390102.png',
    sortType: '', //排序
    page: 1, //请求页数
    minPrice: 0, //最小价钱
    maxPrice: 999999999, //最大价钱
    radius: '', //距离
    starRate: [], //星级
    facilities: '', //酒店设施
    themes: '', //酒店主题
    brandId: '' //品牌
  },
  // onPullDownRefresh: function () {
  //   this.setData({['where.page']:1,loadend:false,productList:[]});
  //   this.get_product_list();
  //   wx.stopPullDownRefresh();
  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      page: this.data.page + 1
    })
    this.initData();
  },
  // 选择日历的回调
  onLoadFun: function (e) {
    this.setData({
      CheckTime: e.detail.checkInDate,
      leaveTime: e.detail.checkOutDate
    })
  },
  // 选择地址
  selectKey: function () {
    wx.navigateTo({
      url: '/hotel/pages/keyWordView/keyWordView?navigatorUrl=' + '/hotel/pages/HotelList/HotelList'
    })
  },

  // 选择城市
  selectCity: function () {
    wx.navigateTo({
      url: '/hotel/pages/selectCity/selectCity?navigatorUrl=' + '/hotel/pages/HotelList/HotelList'
    })
  },
  // 选择时间
  selectTime: function () {
    console.log('8888')
    this.setData({
      isSelectTime: true,
      isSort: false,
      marginTop: this.data.navTop + 224 + 'rpx',
      showModalStatus: false,
      isScreening: false,
      isArea: false
    })
  },
  // 酒店列表数据
  initData: function (e) {
    let that = this
    wx.showLoading()

    let starRate = []
    for (let s of app.globalData.starList) {
      if (s.condition == 1) {
        starRate.push(s.id)
        this.setData({
          starRate: starRate
        })
      }
      console.log(app.globalData.starList)
    }
    let data = {
      cityName: wx.getStorageSync('city') ? wx.getStorageSync('city') : '北京',
      checkIn: wx.getStorageSync('ROOM_SOURCE_DATE').checkInDate,
      checkOut: wx.getStorageSync('ROOM_SOURCE_DATE').checkOutDate,
      keyword: that.data.keyword,
      lng: wx.getStorageSync('longitude'),
      lat: wx.getStorageSync('latitude'),
      sortType: that.data.sortType,
      page: that.data.page,
      minPrice: that.data.minPrice,
      maxPrice: that.data.maxPrice,
      radius: that.data.radius,
      starRate: that.data.starRate.join(',') == '不限' ? '' : that.data.starRate.join(','),
      facilities: that.data.facilities,
      brand_id: that.data.brandId,
      memberId: wx.getStorageSync('memberId'),
      theme:that.data.themes
    }
    console.log(data)
    zdAppletHotelList(data).then(res => {
      console.log(res,'请求的东西111')
      wx.hideLoading()
        let HotelList=[]
        if(that.data.page==1){
          HotelList=res.list
        }else{
          if(res.list.length==0){
            wx.showToast({
              title: '没有更多酒店',
            })
          }else{
            HotelList=that.data.HotelList.concat(res.list)
          }
        }
        that.setData({
          HotelList:HotelList
        })
      
      
      // 初试化地图
      that.initMap(res.list)
    })
  },
  // 切换列表
  ToggleList: function () {
    this.setData({
      ismap: this.data.ismap ? false : true
    })
  },
  // 区域位置回调
  areaFun: function (e) {
    let keyword = ''
    this.setData({
      isArea: e.detail.isArea
    })
    console.log(e, this.data.screen[2])
    this.data.screen[2].isSelect = false
    this.data.screen[2].name = e.detail.keyword
    if (e.detail.keyword != '不限') {
      keyword = e.detail.keyword
    }
    if (e.detail.stairKey == 1) {
      this.setData({
        screen: this.data.screen,
        radius: e.detail.radius
      })
    } else {
      this.setData({
        screen: this.data.screen,
        keyword: keyword
      })
    }

    this.initData()
  },
  navi: function (e) {
    console.log('22222')
    for (var s of this.data.screen) {
      s.isSelect = false
    }

    this.setData({
      screen: this.data.screen
    })
    app.globalData.screen = this.data.screen
    wx.navigateBack()
  },
  // 综合筛选关闭弹窗
  ScreenFunPopup: function (e) {
    console.log(e)
    this.setData({
      isScreening: e.detail
    })
  },
  // 设施服务、品牌回调
  facilitiesFun: function (e) {
    console.log(e)
    this.setData({
      facilities: e.detail.facilities,
      brandId: e.detail.brandId
    })
    this.initData()
  },
  // 综合筛选拼品牌+设施回调
  ScreenFun: function (e) {
    console.log(e.detail)
    this.data.screen[3].name = e.detail
    if (e.detail == '') {
      this.data.screen[3].name = '综合排序'
    }
    // that.data.facilities,
    //   themes:that.data.themes
    this.setData({
      screen: this.data.screen
    })
    this.initData()
  },
  // 排序回调
  sortFun: function (e) {
    console.log(e)
    let screen = this.data.screen
    this.setData({
      recommendCell: e.detail.recommendCell, //更新数据
      sortType: e.detail.sort, //更新排序值
      isSort: e.detail.isSort //关闭弹窗
    })
    console.log(e.detail.sort)
    for (let r of e.detail.recommendCell) {
      if (r.condition == 1) {
        console.log(screen[0].name, r.title)
        screen[0].name = r.title
        this.setData({
          screen: screen
        })
      }
    }
    this.initData()
  },
  // 回调及初始化更新价格和星级的拼写
  setPriceStar: function (source) {
    let price = ''
    for (let p of app.globalData.price) {
      if (p.key == 1) {
        price = p.text
        console.log(price)
        for (let p of app.globalData.starList)
          if (p.condition == 1) {
            price += ',' + p.name
            for (let s = 0; s < app.globalData.screen.length; s++) {
              if (s == 1) {
                if (source) { //是否是初始化
                  if (price.indexOf('不限,不限') > -1) {
                    app.globalData.screen[s].name = '价格星级'
                  }
                } else {
                  app.globalData.screen[s].name = price
                }
                this.setData({
                  screen: app.globalData.screen
                })
              }
            }
          }
      }
    }
    console.log('xxxxxxxxxx')
    this.setData({
      HotelList: []
    })
    this.initData()
  },
  // 选择价钱的回调
  PriceFun: function (e) {
    this.setData({
      screen: app.globalData.screen
    })
    let id = e.detail
    console.log(id)
    if (id == 0) { //不限
      this.setData({
        minPrice: 0,
        maxPrice: 9999999
      })
    } else if (id == 1) { //150元以下
      this.setData({
        minPrice: 0,
        maxPrice: 150
      })
    } else if (id == 2) { //150-300
      this.setData({
        minPrice: 150,
        maxPrice: 300
      })
    } else if (id == 3) { //301-450
      this.setData({
        minPrice: 301,
        maxPrice: 450
      })
    } else if (id == 4) { //451-600
      this.setData({
        minPrice: 451,
        maxPrice: 600
      })
    } else if (id == 5) { //600-1000
      this.setData({
        minPrice: 601,
        maxPrice: 1000
      })
    } else if (id == 6) { //1000以上
      this.setData({
        minPrice: 1000,
        maxPrice: 99999999
      })
    }

    this.setPriceStar()
  },
  // 星级清空回调
  empy: function (e) {
    console.log(e.detail)
    app.globalData.screen[e.detail.screen].name = '价格星级'
    this.setData({
      screen: app.globalData.screen,
      minPrice: '',
      maxPrice: '',
      starRate: '',
      HotelList: []
    })
    for (let a = 0; a < app.globalData.price.length; a++) {
      if (a == 0) {
        app.globalData.price[a].key = 1

      } else {
        app.globalData.price[a].key = 0
      }
    }
    for (let a = 0; a < app.globalData.starList.length; a++) {
      if (a == 0) {
        app.globalData.starList[a].condition = 1

      } else {
        app.globalData.starList[a].condition = 0
      }
    }
    this.initData()
  },
  // 星级回调
  starFun: function () {
    let price = ''
    let starRate = []
    for (let p of app.globalData.price) {
      if (p.key == 1) {
        price = p.text
        console.log(p.text)
        for (let p of app.globalData.starList)
          if (p.condition == 1) {
            // console.log(p)
            starRate.push(p.name)
            this.setData({
              starRate: starRate
            })
            console.log(starRate)
            price += ',' + p.name
            for (let s = 0; s < app.globalData.screen.length; s++) {
              if (s == 1) {
                app.globalData.screen[s].name = price
                this.setData({
                  screen: app.globalData.screen
                })
              }
            }
          }
      }

    }
    console.log('星级回调', app.globalData.screen)
    this.setPriceStar()
  },
  // 筛选条件点击
  Selsctscreen: function (e) {
    console.log('aaaa ')
    let {
      id
    } = e.currentTarget.dataset
    for (let s of this.data.screen) {
      if (s.id == id) {
        s.isSelect = s.isSelect ? false : true
      } else {
        s.isSelect = false
      }
      this.setData({
        screen: this.data.screen,
        isSelectTime: false
      })
    }
    if (id == 1) { //排序
      this.setData({
        isSort: this.data.isSort ? false : true,
        marginTop: this.data.navTop + 224 + 'rpx',
        showModalStatus: false,
        isScreening: false,
        isArea: false
      })
      console.log(this.data.marginTop)
    } else if (id == 2) { //价格星级
      this.setData({
        showModalStatus: this.data.showModalStatus ? false : true,
        marginTop: this.data.navTop + 224 + 'rpx',
        isSort: false,
        isScreening: false,
        isArea: false
      })
    } else if (id == 3) { //区域位置
      this.setData({
        showModalStatus: false,
        marginTop: this.data.navTop + 224 + 'rpx',
        isSort: false,
        isArea: this.data.isArea ? false : true,
        isScreening: false
      })
    } else if (id == 4) { //综合筛选
      console.log('综合筛选')
      this.setData({
        showModalStatus: false,
        marginTop: this.data.navTop + 242 + 'rpx',
        isSort: false,
        isArea: false,
        isScreening: this.data.isScreening ? false : true
      })
      console.log(this.data.isScreening)
    }

  },
  // 清空选择酒店
  delAddress: function () {
    this.setData({
      gnAddress: '搜索' + wx.getStorageSync('city') + '全城',
      isgnAddress: false,
    })
    app.globalData.gnaddress = '搜索' + wx.getStorageSync('city') + '全城'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    // 胶囊位计算
    app.navTop(function (res) {
      that.setData({
        navTop: res.navTop
      })
    });
    // 设置返回路径
    that.setData({
      navigatorUrl: options.navigatorUrl,
      ismap: options.ismap,
      minPrice: options.highRate?options.highRate:'',
      maxPrice: options.lowRate?options.lowRate:'',
    })
    // 添加腾讯地图秘钥
    // qqmapsdk = new QQMapWX({
    //   key: 'CSBBZ-OLQWW-C5JR6-OIMZW-L2RNF-KHBF7'
    // });
    // 设置地图高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          mapHeight: ((res.screenHeight) * 2)
        })
      },
    })
    console.log('-----', options)
    // 酒店列表
    // that.initData()

  },
  // 地图列表滑动回调
  mapFun: function (e) {
    this.setData({
      current: e.detail.current,
      currentSelectedPoiId: e.detail.currentSelectedPoiId
    })
    console.log('---')
    this.initMap()
  },
  DiscountPopup: function (e) {
    this.triggerEvent('DiscountPopup', true)
  },
  // 初始化地图
  initMap: function () {
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: (res) => {
        let latitude = res.latitude;
        let longitude = res.longitude;
        let marker = this.createMarker(res);
        this.setData({
          markers: this.getSchoolMarkers()
        })
      }
    });
    this.mapCtx = wx.createMapContext('myMap')
  },
  // 获取标记点数据
  getSchoolMarkers() {
    let markers = [];
    let HotelList = this.data.HotelList

    for (let i = 0; i < HotelList.length; i++) {
      HotelList[i].current = i
      let marker = this.createMarker(HotelList[i]);
      markers.push(marker)
    }
    return markers;
  },
  // 处理标记点数据
  createMarker(point) {
    let latitude = point.latitude;
    let longitude = point.longitude;
    let marker = {
      iconPath: "/images/hotel/location.png",
      id: point.current || 0,
      name: point.name || '',
      latitude: point.lat,
      longitude: point.lon,
      width: 20,
      height: 30,
      callout: {
        content: '￥' + (point.price) + '起',
        fontSize: point.fontSize,
        bgColor: this.data.currentSelectedPoiId == point.current ? '#ffffff' : '#EC4543',
        color: this.data.currentSelectedPoiId == point.current ? '#FF6636' : '#ffffff',
        padding: 5,
        borderRadius: 6,
        display: "ALWAYS",
        textAlign: "center"
      }
    };
    return marker;
  },
  //点击标记点对应的气泡
  bindcallouttap: function (e) {
    let markerId = e.markerId
    this.setData({
      current: markerId,
      currentSelectedPoiId: markerId,
      scrollId: 'd' + markerId
    })
    this.initMap()
  },
  // 点击地图触发事件
  bindtap: function (e) {},
  regionchange(e) {},
  markertap(e) {},
  controltap(e) {
    this.moveToLocation()
  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 使用 wx.createMapContext 获取 map 上下文 
    this.mapCtx = wx.createMapContext('myMap')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.getStorageSync('CheckTime')) { //如果缓存有
      this.setData({
        CheckTime: wx.getStorageSync('CheckTime'), //设置入住时间
        leaveTime: wx.getStorageSync('leaveTime'), //设置离店时间
      })
    } else { //设置默认时间
      var checkInDate = Moment(new Date()).format('YYYY-MM-DD');
      var checkOutDate = Moment(new Date()).add(1, 'day').format('YYYY-MM-DD');
      this.setData({
        CheckTime: checkInDate.substr(5, checkInDate.length),
        leaveTime: checkOutDate.substr(5, checkOutDate.length)
      })
    }
    this.setData({
      gnCity: wx.getStorageSync('city') ? wx.getStorageSync('city') : '北京', //设置当前城市
      gnAddress: app.globalData.gnaddress ? app.globalData.gnaddress : '搜索' + wx.getStorageSync('city') + '全城', //设置当前位置
    })

    this.setData({
      isgnAddress: this.data.gnAddress.indexOf('全城') > -1 ? false : true, //是否显示删除地区的close
      screen: app.globalData.screen, //设置筛选条件
      recommendCell: app.globalData.recommendCell, //设置排序条件
      areaView: app.globalData.areaView, //设置区域位置左侧菜单
      ComprehensiveScreening: app.globalData.ComprehensiveScreening, //综合筛选
      keyword: app.globalData.gnAddress ? app.globalData.gnAddress : wx.getStorageSync('city')
    })
    console.log(this.data.screen)
    this.setPriceStar(true)
    if (this.data.isRefresh == 1) {
      this.setData({
        HotelList: []
      })
      this.initData()
      this.selectComponent('#areaView').getAreaData()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  }
})