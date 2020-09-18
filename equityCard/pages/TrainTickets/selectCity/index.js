// equityCard/pages/TrainTickets/selectCity/index.js
// pages/home/hotel/selectCity/index.js
var app = getApp();
import request from '../../../../utils/util'
// import {
//   stationsFormat,
//   stationsSearch
// } from '../../../../api/train.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverSuit: app.serverTrain(),
    aa: {
      "bg_color": "linear-gradient(0deg,rgba(252,68,71,1) 0%,rgba(247,48,55,1) 100%)",
      "color": "#fff",
      "flag": 1,
      "name": "车站选择",
      "nameImg": '',
      "name2": '',
      "nameImgW": '',
      "nameImgH": '',
      "nameMg": ''
    },
    lineDepartCity: '北京',
    isChan: true,
    types: '', //1.酒店: 2线路
    lineDepartCityArr: [], //历史记录
    hotCityCellData: [],
    list: [],
    alpha: '',
    windowHeight: '',
    searchKey: 1,
    //所搜列表数组
    searchCity: [],
    istab: false,
    cityType: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let self = this;
    var lineDepartCity = wx.getStorageSync('lineDepartCity');
    var lineDepartCityArr = wx.getStorageSync('hotelHistoryCity')
    self.setData({
      lineDepartCity: lineDepartCity,
      lineDepartCityArr: lineDepartCityArr ? lineDepartCityArr : [],
      cardType: options.cityType
    })
    console.log(self.data.lineDepartCityArr, options)
    //线路出发地选择列表dada
    self.getlineCityData();
  },

  getlineCityData: function() {
    let that = this;
    // let lineCityData = [];
    request._post(this.data.serverSuit +'/train/stations/format','',res=>{
      if (res.data.code === 200) {
        that.setData({
          samHotelCity: res.data.data.hot,
          list: res.data.data.list
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }

    })

    // stationsFormat().then(res => {
      
    // })
    // post('/train/stations/format', {}, (res) => {
    //   console.log(res)

    // }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 5)
  },
  //点击城市
  cityBindtap: function(e) {
    console.log(e)
    let lineDepartCity = e.currentTarget.dataset.city;
    let hotelDepartId = e.currentTarget.dataset.id;
    let item = e.currentTarget.dataset.item
    if (this.data.cardType == 0) {
      let hotelHistoryList = wx.getStorageSync('hotelHistoryCity')
      if (!hotelHistoryList) {
        hotelHistoryList = []
      }
      let count = 0
      for (let i = 0; i < hotelHistoryList.length; i++) {
        if (hotelHistoryList[i].id == item.id) {
          count++
        }
      }
      if (count == 0) {
        hotelHistoryList.unshift(item)
      }
      wx.setStorageSync('hotelHistoryCity', hotelHistoryList)
      // this.addDepartCity(lineDepartCity);
      wx.setStorageSync('devCity', lineDepartCity);
      wx.setStorageSync('hotelDepartId', hotelDepartId);
    } else if (this.data.cardType == 1) {
      let hotelHistoryList = wx.getStorageSync('hotelHistoryCity')
      if (!hotelHistoryList) {
        hotelHistoryList = []
      }
      let count = 0
      for (let i = 0; i < hotelHistoryList.length; i++) {
        if (hotelHistoryList[i].id == item.id) {
          count++
        }
      }
      if (count == 0) {
        hotelHistoryList.unshift(item)
      }
      wx.setStorageSync('hotelHistoryCity', hotelHistoryList)
      // this.addDepartCity(lineDepartCity);
      wx.setStorageSync('arrCity', lineDepartCity);
      wx.setStorageSync('hotelDepartId', hotelDepartId);
    }
    var tab = 2


    const wxCurrPage = getCurrentPages(); //获取当前页面的页面栈
    const wxPrevPage = wxCurrPage[wxCurrPage.length - 2]; //获取上级页面的page对象
    if (wxPrevPage) {
      wxPrevPage.setData({
        page: 1,
        currentTab: tab,
        isClearKw: true,
        back: 2,
        districtId: 0,
        zoneId: 0,
        brandId: 0
      })
      wx.navigateBack()
    }
  },
  hotelBIndtap: function(e) {
    //点击取值
    let hotelId = e.currentTarget.dataset.id;
    let searchCity = this.data.searchCity;
    let item = null;
    let tab
    //首页回填城市
    if (this.data.cardType == 0) {
      item = searchCity[hotelId];
      let item1 = searchCity[hotelId];
      wx.setStorageSync('devCity', item.name);
      wx.setStorageSync('SamsungHotelCity', item.name);
    } else if (this.data.cardType == 1) {
      item = searchCity[hotelId];
      let item1 = searchCity[hotelId];
      wx.setStorageSync('arrCity', item.name);
      wx.setStorageSync('SamsungHotelCity', item.name);
    }


    const wxCurrPage = getCurrentPages(); //获取当前页面的页面栈
    const wxPrevPage = wxCurrPage[wxCurrPage.length - 2]; //获取上级页面的page对象
    if (wxPrevPage) {
      wxPrevPage.setData({
        page: 1,
        searchText: item.group_name,
        isClearKw: true, //清除关键词
        back: 2
      })
      wx.navigateBack()
    }


  },
 

  // 快速导航
  handlerAlphaTap(e) {
    let {
      ap
    } = e.target.dataset;
    console.log(ap)
    this.setData({
      alpha: ap
    });
  },
  handlerMove(e) {
    let {
      list
    } = this.data;
    let moveY = e.touches[0].clientY;
    let rY = moveY - this.offsetTop;
    if (rY >= 0) {
      let index = Math.ceil((rY - this.apHeight) / this.apHeight);
      if (0 <= index < list.length) {
        let nonwAp = list[index];
        nonwAp && this.setData({
          alpha: nonwAp.header
        });
      }
    }
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},


  // 输入框:输入时
  bindinput: function(e) {
    let that = this
    let value = e.detail.value;
    if (value != '') {
      let data = {
        keyword: e.detail.value
      }

      request._post(this.data.serverSuit +'/train/stations/search','',res=>{
        if (res.data.code == 200) {
          let searchCity = [];
          searchCity = res.data.data.list
          if (searchCity.length > 0) {
            that.setData({
              searchKey: 0,
              searchCity: searchCity,
            })
          } else {
            that.setData({
              searchKey: 1,
              searchCity: [],
            })
          }
        }
      })

      // stationsSearch(data).then(res => {
        
      // })
      // post('/train/stations/search', data, (res) => {
      //   console.log(res)
        
      // }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 5)
    } else {
      that.setData({
        searchKey: 1,
        searchCity: [],
      })
    }

  },
  // 输入框:聚焦
  bindfocus: function(e) {


  },
  // 输入框:失去聚焦
  bindblur: function(e) {

  },
  // 输入框:点击完成
  bindconfirm: function(e) {

  },

})