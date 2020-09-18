Component({
  /**
   * 组件的属性列表
   */
  properties: {
    background: {
      type: String,
      value: 'rgba(255, 255, 255, 1)'
    },
    color: {
      type: String,
      value: 'rgba(0, 0, 0, 1)'
    },
    titleText: {
      type: String,
      value: '导航栏'
    },
    titleImg: {
      type: String,
      value: ''
    },
    postion: {
      type: String,
      value: 'static'
    },
    tops: {
      type: Number,
      value: 0
    },
    backIcon: {
      type: String,
      value: 'https://yuelvdaren-1300766538.cos.ap-beijing.myqcloud.com/daren/2020/03/26/5e7c267a938c31585194618.png'
    },
    homeIcon: {
      type: String,
      value: 'http://image.zhiding365.com/2020/8/31/7f9a2ce1-ed67-41d2-b8a9-543a1ce7501a.png'
    },
    closeIcon: {
      type: String,
      value: 'https://yuelvdaren-1300766538.cos.ap-beijing.myqcloud.com/daren/2020/03/26/5e7c267a938c31585194618.png'
    },
    fontSize: {
      type: Number,
      value: 16
    },
    iconHeight: {
      type: Number,
      value: 19
    },
    iconWidth: {
      type: Number,
      value: 58
    }
  },
  attached: function () {
    var that = this;
    that.setNavSize();
    that.setStyle();
  },
  data: {

  },
  methods: {
    // 通过获取系统信息计算导航栏高度
    setNavSize: function () {
      var that = this,
        sysinfo = wx.getSystemInfoSync(),
        statusHeight = sysinfo.statusBarHeight,
        isiOS = sysinfo.system.indexOf('iOS') > -1,
        navHeight;
      if (!isiOS) {
        navHeight = 48;
      } else {
        navHeight = 44;
      }
      that.setData({
        status: statusHeight,
        navHeight: navHeight
      })
    },
    setStyle: function () {
      var that = this,
        containerStyle, textStyle, iconStyle;
      containerStyle = [
        'background:' + that.data.background
      ].join(';');
      textStyle = [
        'color:' + that.data.color,
        'font-size:' + that.data.fontSize + 'px'
      ].join(';');
      iconStyle = [
        'width: ' + that.data.iconWidth + 'px',
        'height: ' + that.data.iconHeight + 'px'
      ].join(';');
      that.setData({
        containerStyle: containerStyle,
        textStyle: textStyle,
        iconStyle: iconStyle
      })
    },
    // 返回事件
    back: function () {
      wx.navigateBack({
        delta: 1
      })
      // this.triggerEvent('back', { back: 1 })
    },
    home: function () {
      wx.switchTab({
        url: '/pages/home/index',
      })
    },
    close: function (e) {
      // 有上一页 返回上一页 没有返回首页
      let pages = getCurrentPages();
      if (pages.length == 1) {
        wx.switchTab({
          url: '/pages/home/index',
        })
      } else {
        wx.navigateBack({
          delta: 1,
        })
      }
    },
  }
})