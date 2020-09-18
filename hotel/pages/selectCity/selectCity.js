const QQMapWX = require('../../../qqmap-wx-jssdk.min.js')
const QQMapKey = 'CSBBZ-OLQWW-C5JR6-OIMZW-L2RNF-KHBF7'
const qqmapsdk = new QQMapWX({
  key: QQMapKey
})
import {
  getCityList
} from '../../../api/hotel.js';
const app = getApp()
Page({
  data: {
    searchImage: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-17/22/yuelvhui2BVkWmYIx31587133991.png', //搜索
    loc: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-17/22/yuelvhuifOuUwYuOUi1587134050.png', //定位
    HistoricalRecord: [], //历史记录
    searchCity: [],
    keyWord: '全球城市/区域/位置/酒店名/拼音缩写',
    isShow: false,
    Clear: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-05-07/22/yuelvhuios2ilJg5kx1588862282.png'
  },
  navi: function () {
    const wxCurrPage = getCurrentPages(); //获取当前页面的页面栈
    const wxPrevPage = wxCurrPage[wxCurrPage.length - 2]; //获取上级页面的page对象
    if (wxPrevPage) {
      wxPrevPage.setData({
        isRefresh: 1,
      })
      wx.navigateBack()
    }
  },
  // 清除历史
  ClearRecord: function () {
    wx.setStorage({
      data: '',
      key: 'HistoricalRecord',
    })
    this.setData({
      HistoricalRecord: ''
    })
  },
  // 点击历史记录
  SelectHistoricalRecord: function (e) {
    app.globalData.gnaddress = ''
    wx.setStorage({
      data: e.currentTarget.dataset.city,
      key: 'city',
    })
    const wxCurrPage = getCurrentPages(); //获取当前页面的页面栈
    const wxPrevPage = wxCurrPage[wxCurrPage.length - 2]; //获取上级页面的page对象
    if (wxPrevPage) {
      wxPrevPage.setData({
        isRefresh: 1,
      })
      wx.navigateBack()
    }
  },
  // 更新历史记录
  UpHistoricalRecord: function (city) {
    let HistoricalRecord = wx.getStorageSync('HistoricalRecord') ? wx.getStorageSync('HistoricalRecord') : []
    let removeRepetition = function (city, self) {
      var cityArr = HistoricalRecord;
      for (let key in cityArr) {
        if (cityArr[key] == city) {
          return false;
        }
      }
      return true;
    };
    for (var H of HistoricalRecord) {
      if (H == city) {
        return
      }
      if (city.indexOf(H) > -1) {
        return
      }
    }
    if (HistoricalRecord.length < 10) {
      HistoricalRecord.push(city)
    } else {
      console.log('----')
      if (removeRepetition(city, self)) {
        HistoricalRecord.unshift(city);
        HistoricalRecord.splice(10, 1);
      }
    }
    wx.setStorageSync('HistoricalRecord', HistoricalRecord)
  },
  // 选择热门城市
  selectHotCity: function (e) {
    app.globalData.gnaddress = ''
    wx.setStorage({
      data: e.currentTarget.dataset.name,
      key: 'city',
    })
    const wxCurrPage = getCurrentPages(); //获取当前页面的页面栈
    const wxPrevPage = wxCurrPage[wxCurrPage.length - 2]; //获取上级页面的page对象
    if (wxPrevPage) {
      wxPrevPage.setData({
        isRefresh: 1,
      })
      wx.navigateBack()
    }
    this.UpHistoricalRecord(e.currentTarget.dataset.name)
  },
  setCity: function (e) { //选择搜索结果后更新当前选择城市/关键词
    this.setData({
      gnCity: e.detail.gnCity,
      keyWord: e.detail.tagname
    })
    wx.setStorageSync('city', e.detail.gnCity);
    this.UpHistoricalRecord(e.detail.gnCity)

  },

  // 搜索结果
  getCityList: function (keyword) {
    let {
      checkInDate,
      checkOutDate
    } = wx.getStorageSync("ROOM_SOURCE_DATE");
    let data={
      keyword:keyword,
      cityName:wx.getStorageSync('city'),
      lat:wx.getStorageSync('latitude'),
      lng:wx.getStorageSync('longitude'),
      arrivalDate:wx.getStorageSync('key'),
      arrivalDate:checkInDate,
      departureDate:checkOutDate
    }
    getCityList(data).then(res => {
      console.log(res)
      this.setData({
        citylist: res.list
      })
    })
  },
  //搜索
  bindblur: function (e) {
    this.getCityList(e.detail.value)
      this.setData({
        marginTop: this.data.navTop + 80 + 'rpx',
        isShow: true,
      })
      if(e.detail.value==''){
        this.setData({
          isShow: false,
        })
      }
  },
  onShow: function () {
    this.setData({
      gnCity: wx.getStorageSync('city'),
      HistoricalRecord: wx.getStorageSync('HistoricalRecord'),
      LocgnCity:wx.getStorageSync('LocgnCity')?wx.getStorageSync('LocgnCity'):'北京'
      // keyWord: app.globalData.gnaddress ? app.globalData.gnaddress : '全球城市/区域/位置/酒店名/拼音缩写'
    })
    console.log(this.data.keyWord)
  },
  onLoad(options) {
    let that = this
    that.getCitys()
    // 胶囊位计算
    app.navTop(function (res) {
      that.setData({
        navTop: res.navTop
      })
    });
    this.setData({
      navigatorUrl: options.navigatorUrl,
      hotCity: app.globalData.hotCity
    })
  },

  onChoose(e) {
    console.log('onChoose', e)
    app.globalData.gnaddress = ''
    wx.setStorage({
      data: e.detail.item.name,
      key: 'city',
    })
    this.UpHistoricalRecord(e.detail.item.name)
    const wxCurrPage = getCurrentPages(); //获取当前页面的页面栈
    const wxPrevPage = wxCurrPage[wxCurrPage.length - 2]; //获取上级页面的page对象
    if (wxPrevPage) {
      wxPrevPage.setData({
        isRefresh: 1,
      })
      wx.navigateBack()
    }
  },

  getCitys() {
    const _this = this
    qqmapsdk.getCityList({
      success(res) {
        const cities = res.result[1]
        // 按拼音排序
        cities.sort((c1, c2) => {
          let pinyin1 = c1.pinyin.join('')
          let pinyin2 = c2.pinyin.join('')
          return pinyin1.localeCompare(pinyin2)
        })
        // 添加首字母
        const map = new Map()
        for (const city of cities) {
          const alpha = city.pinyin[0].charAt(0).toUpperCase()
          if (!map.has(alpha)) map.set(alpha, [])
          map.get(alpha).push({
            name: city.fullname
          })
        }

        const keys = []
        for (const key of map.keys()) {
          keys.push(key)
        }
        keys.sort()

        const list = []
        for (const key of keys) {
          list.push({
            alpha: key,
            subItems: map.get(key)
          })
        }
        _this.setData({
          list: list
        })
      }
    })
  }
})