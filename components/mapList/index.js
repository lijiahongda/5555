// components/HotelHomeList/index.js
var QQMapWX = require('../../qqmap-wx-jssdk.min.js');
var qqmapsdk;
Component({
  properties: {
    HotelList: {
      type: Array,
      value: [],
    },
    ismap: {
      type: Boolean,
      value: false
    },
    gnCity: {
      type: String,
      value: ''
    }
  },
  data: {
    locImage: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-17/01/yuelvhuiLOelairLiw1587057788.png', //定位icon
    Label: [{
      name: '直订补贴'
    }]
  },
  attached: function () {

  },
  methods: {
    // 滑块
    bindChange: function (e) {
      this.triggerEvent('mapFun', {
        current: e.detail.current,
        currentSelectedPoiId: e.detail.current
      })
    },
    // 酒店详情
    HotelDetail: function(e) {
      wx.navigateTo({
          url: '/page/HotelOther/pages/HotelDetail/HotelDetail?id=' + e.currentTarget.dataset.id
      })
  },
  }

})

