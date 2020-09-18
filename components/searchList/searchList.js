// components/HotelHomeList/index.js
const app = getApp()
Component({
  properties: {
    isShow: {
      type: Boolean,
      value: false,
    },
    marginTop: {
      type: String,
      value: ''
    },
    citylist: {
      type: Array,
      value: []
    },
    type: {
      type: String,
      value: 1
    },
    searchType:{
      type: String,
      value: ''
    }
  },
  data: {
    isShow: false
  },

  attached: function () {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        })
        console.log(res.windowHeight)
      },
    })
  },
  methods: {

    hotelBIndtap: function (e) {
      //点击取值
      let { id, item, tagname } = e.currentTarget.dataset;
      // let searchCity = this.data.searchCity;
      // let tab
      this.setData({
        isShow: false
      })
      // let item = this.data.searchCity[hotelId];
      console.log(item)
      if (this.data.type == 1) {
        this.triggerEvent('setCity', {
          gnCity: item.cityName,
          tagname: tagname
        })
      }else{
        console.log(item)
        console.log(this.data.type)
      }

      // 修改搜索关键词
      app.globalData.gnaddress = tagname
      console.log(app.globalData.gnaddress, id)
      if (id) {//如果有酒店id就去酒店详情
        console.log()
        wx.setStorageSync('dealerId', id)
        wx.navigateTo({
          url: '/pages/index/index'
        })
      } else {
        wx.navigateBack()
      }
      //首页回填城市
      // if (hotelType == 0) {
      //   item = searchCity[hotelId];
      //   let item1 = searchCity[hotelId];
      //   wx.setStorageSync('hotelDepartCity', item.city.cityName);
      //   wx.setStorageSync('SamsungHotelCity', item.city.cityName);

      //   wx.setStorageSync('hotelDepartId', item.city.cityId);
      //   wx.setStorageSync('searchText', '关键词/酒店/地址');
      //   if (e.currentTarget.dataset.item.isGat == 1) {
      //     tab = 1
      //   } else {
      //     tab = 0
      //   }

      //   const wxCurrPage = getCurrentPages(); //获取当前页面的页面栈
      //   const wxPrevPage = wxCurrPage[wxCurrPage.length - 2]; //获取上级页面的page对象
      //   if (wxPrevPage) {
      //     wxPrevPage.setData({
      //       page: 1,
      //       searchText: item.group_name,
      //       currentTab: tab,
      //       isClearKw: true,//清除关键词
      //       back: 2
      //     })
      //     wx.navigateBack()
      //   }
      //   //详情
      // } else if (hotelType == 4) {
      //   item = searchCity[hotelId];
      //   //跳转酒店详情页 
      //   wx.navigateTo({
      //     url: '../hotelDetail/index?hotelId=' + item.hotelId + '&screening=' + 'screening',
      //     success: function (res) {

      //     }
      //   })
      //   //品牌
      // } else {
      //   item = searchCity[hotelId];
      //   const wxCurrPage = getCurrentPages(); //获取当前页面的页面栈
      //   const wxPrevPage = wxCurrPage[wxCurrPage.length - 2]; //获取上级页面的page对象
      //   wx.setStorageSync('hotelDepartCity', item.city.cityName);
      //   wx.setStorageSync('SamsungHotelCity', item.city.cityName);

      //   wx.setStorageSync('hotelDepartId', item.city.cityId);
      //   wx.setStorageSync('searchText', item.tagName);
      //   // wx.setStorageSync('lat', '');
      //   // wx.setStorageSync('lng', '');
      //   if (wxPrevPage) {
      //     wxPrevPage.setData({
      //       brandId: item.brandId,
      //       keyword: item.brandName,
      //       page: 1,
      //       searchText: item.brandName,

      //     })
      //     wx.navigateBack()
      //   }
      // }
      // let item1 = searchCity[hotelId];

    },

  }

})