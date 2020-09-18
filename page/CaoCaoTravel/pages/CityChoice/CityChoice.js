// pages/home/hotel/selectCity/index.js
var app = getApp();
import {
  post,
  get
} from '../../../../utils/caocao.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityCode: wx.getStorageSync('cityCode'),
    hotelDepartCity: wx.getStorageSync('hotelDepartCity'),
    alpha: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.getCityData()
  },
  // 获取城市列表
  getCityData: function () {
    let that = this;
    post('/travel/v1/getAllCities', {
      cityCode: that.data.cityCode
    }, (res) => {
      if (res.statusCode == 200) {
        that.setData({
          hotCityCellData:res.data.data.hot,
          list:res.data.data.list
        })
      } else if (res.code == 400) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.showToast({
          title: '网络错误 ',
          icon: 'none',
          duration: 1000
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  //点击城市
  cityBindtap: function (e) {
    let that = this
    const wxCurrPage = getCurrentPages(); //获取当前页面的页面栈
    const wxPrevPage = wxCurrPage[wxCurrPage.length - 2]; //获取上级页面的page对象
    if (wxPrevPage) {
      wxPrevPage.setData({
        hotelDepartCity: e.currentTarget.dataset.city
      })
      wx.navigateBack()
    }
  },

  //点击酒店搜索列表
  /*
   * 左侧 酒店 hotel_name 地标/城市 group_name  
   * 右侧展示 type_name  
   * 1.城市_返回 城市回填+ cityid 
   * 2.酒店->详情页 hotel_id+ time
   *  3.地标->返回  回填citycode 回填地标 keyword  回填城市cityname
   */
  hotelBIndtap: function (e) {
    //点击取值
    let hotelType = e.currentTarget.dataset.type;
    let hotelId = e.currentTarget.dataset.id;
    let searchCity = this.data.searchCity;
    let item = null;
    let tab
    //首页回填城市
    if (hotelType == 0) {
      item = searchCity[hotelId];
      let item1 = searchCity[hotelId];
      wx.setStorageSync('hotelDepartCity', item.city.cityName);
      wx.setStorageSync('SamsungHotelCity', item.city.cityName);

      wx.setStorageSync('hotelDepartId', item.city.cityId);
      wx.setStorageSync('searchText', '关键词/酒店/地址');
      if (e.currentTarget.dataset.item.isGat == 1) {
        tab = 1
      } else {
        tab = 0
      }

      const wxCurrPage = getCurrentPages(); //获取当前页面的页面栈
      const wxPrevPage = wxCurrPage[wxCurrPage.length - 2]; //获取上级页面的page对象
      if (wxPrevPage) {
        wxPrevPage.setData({
          page: 1,
          searchText: item.group_name,
          currentTab: tab,
          isClearKw: true,//清除关键词
          back: 2
        })
        wx.navigateBack()
      }
      //详情
    } else if (hotelType == 4) {
      item = searchCity[hotelId];
      //跳转酒店详情页 
      wx.navigateTo({
        url: '../hotelDetail/index?hotelId=' + item.hotelId + '&screening=' + 'screening',
        success: function (res) {

        }
      })
      //品牌
    } else {
      item = searchCity[hotelId];
      const wxCurrPage = getCurrentPages(); //获取当前页面的页面栈
      const wxPrevPage = wxCurrPage[wxCurrPage.length - 2]; //获取上级页面的page对象
      wx.setStorageSync('hotelDepartCity', item.city.cityName);
      wx.setStorageSync('SamsungHotelCity', item.city.cityName);

      wx.setStorageSync('hotelDepartId', item.city.cityId);
      wx.setStorageSync('searchText', item.tagName);
      // wx.setStorageSync('lat', '');
      // wx.setStorageSync('lng', '');
      if (wxPrevPage) {
        wxPrevPage.setData({
          brandId: item.brandId,
          keyword: item.brandName,
          page: 1,
          searchText: item.brandName,

        })
        wx.navigateBack()
      }
    }
    let item1 = searchCity[hotelId];

  },
  //添加出发地数组更新出发地
  addDepartCity: function (city) {
    let arrLength = this.data.lineDepartCityArr.length;
    let self = this;
    let removeRepetition = function (city, self) {
      var cityArr = self.data.lineDepartCityArr;
      for (let key in cityArr) {
        if (cityArr[key] == city) {
          return false;
        }
      }
      return true;
    };

    let lineDepartCityArr = this.data.lineDepartCityArr;

    if (arrLength == 0) {
      lineDepartCityArr = [city];
    } else if (arrLength > 0 && arrLength <= 9) {
      if (removeRepetition(city, self)) {

        lineDepartCityArr.unshift(city);
      }

    } else if (arrLength == 10) {
      if (removeRepetition(city, self)) {
        lineDepartCityArr.unshift(city);
        lineDepartCityArr.splice(10, 1);
      }
    }
    wx.setStorage({
      key: 'lineDepartCityArr',
      data: lineDepartCityArr
    })
    wx.setStorage({
      key: 'lineDepartCity',
      data: city
    })

    this.setData({
      lineDepartCityArr: lineDepartCityArr,
      // lineDepartCity: value,
    })
  },

  handlerAlphaTap(e) {
    let {
      ap
    } = e.target.dataset;
    console.log(ap)
    this.setData({
      alpha: ap
    });
    console.log(this.data.alpha)
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

  inlandForeign: function (e) {


    if (this.data.types == 2) {
      let inlandForeignId = e.currentTarget.dataset.id;

      this.setData({
        hotCityCellData: this.data.lineCityData[inlandForeignId].hotLeave,
        list: this.data.lineCityData[inlandForeignId].item.item,
      })
    }



  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  // 输入框:输入时
  bindinput: function (e) {
    let value = e.detail.value;
    if (value != '') {
      let url = '';
      url = '/app/linev2/real/';
      get(url + value, {}, (res) => {
        if (res.statusCode === 200) {
          let searchCity = [];
          if (this.data.types == 1) {
            searchCity = res.data.data;
          } else if (this.data.types == 2) {
            searchCity = res.data.data;
          } else if (this.data.types == 6) {
            console.log(res)
            searchCity = res.data.data;
          }
          if (searchCity.length > 0) {
            this.setData({
              searchKey: 0,
              searchCity: searchCity,
            })
          } else {
            this.setData({
              searchKey: 1,
              searchCity: [],
            })
          }
          // console.log(searchCity)


        } else if (res.code === 400) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '网络错误 ',
            icon: 'none',
            duration: 1000
          })
        }
      })
    } else {
      this.setData({
        searchKey: 1,
        searchCity: [],
      })
    }

  },
  // 输入框:聚焦
  bindfocus: function (e) {


  },
  // 输入框:失去聚焦
  bindblur: function (e) {
    this.setData({
      // searchKey: 'none',
    })
  },
  // 输入框:点击完成
  bindconfirm: function (e) {

  },

})