// component/banner/banner.js
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    icon:{
      type:String,
      value:''
    },
    type:{
      type:String,
      value:''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    iconImg: [
      // 0未点击  1点击后
      {
        name: '酒店预订',
        val: 'hotel',
        icon: [
          'http://image.zhiding365.com/2020/8/7/5a9a8cda-22d8-4cc4-b23c-11ef974b6ddf.png',
          'http://image.zhiding365.com/2020/8/7/55322bc5-3671-4ef9-9d0e-d79207c0bfd6.png'
        ],
        url: '/hotel/pages/index?dealerId='
      },
      {
        name: '京东商城',
        val: 'mall',
        icon: [
          'http://image.zhiding365.com/2020/8/7/704b95e2-1b6e-455b-8d05-24409610dfc8.png',
          'http://image.zhiding365.com/2020/8/7/5337e644-6732-4cf5-991d-8f4439c248dd.png'
        ],
        url: '/supermarket/mall/commodityList/index?dealerId='
      },
      {
        name: '会员',
        val: 'vip',
        icon: [
          'http://image.zhiding365.com/2020/8/7/c4999f62-709a-4942-8720-b1d994fea288.png',
          'http://image.zhiding365.com/2020/8/7/5a8dc02b-9edb-4d79-a87d-1184317f29f1.png'
        ],
        url: '/my/pages/vipcard/index?dealerId='
      },
      {
        name: '我的',
        val: 'my',
        icon: [
          'http://image.zhiding365.com/2020/8/7/19c9586b-3e7d-4eab-87e4-96ca5790e36b.png',
          'http://image.zhiding365.com/2020/8/7/39141cbe-d2b3-4341-9836-b5e9847072a3.png'
        ],
        url: '/pages/myHome/index?dealerId='
      },
    ],
    type: '',
    JdIconImg: [
      // 0未点击  1点击后
      {
        name: '首页',
        val: 'home',
        icon: [
          'http://image.zhiding365.com/2020/8/30/ac78e9f1-b614-49c7-9a31-d89d962800d7.png',
          'http://image.zhiding365.com/2020/8/30/8f770c0d-3de7-405b-a7ac-48528987893f.png'
        ],
        url: '/supermarket/mall/commodityList/index'
      },
      {
        name: '攻略',
        val: 'Strategy',
        icon: [
          'http://image.zhiding365.com/2020/8/30/2f4d0adc-a523-49ba-995a-15ece596873f.png',
          'http://image.zhiding365.com/2020/8/30/a76a2876-d624-48d6-9f86-5cae0a73b35e.png'
        ],
        url: '/page/strategy/index/index'
      },
      {
        name: '社群赚',
        val: 'Community',
        icon: [
          'http://image.zhiding365.com/2020/8/30/122ae0b5-41e3-43c5-9843-f129252e99b8.png',
          'http://image.zhiding365.com/2020/8/30/52879ab5-746f-4fc2-8e1c-8b5c1f760cfa.png'
        ],
        url: '/page/Community/index'
      }
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    nextUrl(e) {
      let that = this;
      if (wx.getStorageSync('memberId')) {
        wx.showLoading({
          mask: true
        })
        let type = e.currentTarget.dataset.type,
          url = e.currentTarget.dataset.url

        that.setData({
          type: type
        })
        console.log(url,'urlurlurlurl')
        if(that.properties.icon == 'JdIconImg'){
          wx.redirectTo({
            url: url
          })
        }else{
          wx.navigateTo({
            url: url + wx.getStorageSync("dealerId")
          });
        }
        
      } else {
        wx.navigateTo({
          url: '/pages/login/index',
        })
      }
    }

  }
})