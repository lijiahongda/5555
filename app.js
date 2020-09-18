
import {
  getCustomerId,
  cardLevel
} from './api/hotel'
 

import { get, post } from "./utils/api"
import {
  // 新版
  HTTP_JAVA_URL,
  HTTP_PHP_URL,
  HTTP_ROBOT_URL
} from './config.js';




App({
  data: {
    adminId: "",
    statusArr: []
  },
  onLaunch: function (option) {
    let that = this;
    that.globalData.shareQuery = option.query
    if (option.query.scene) {
      var scan_url = option.query.scene.split('D')[1]
    }
    if (option.query.hasOwnProperty('scene')) {
      switch (option.scene) {
        //扫描小程序码
        case 1047:
          this.publicFromCard(option)
          break;
        //长按图片识别小程序码
        case 1048:
          this.publicFromCard(option)

          break;
        //手机相册选取小程序码
        case 1049:
          this.publicFromCard(option)
          break;
        //直接进入小程序
        case 1001:
          if (wx.getStorageSync('memberId')) {
            wx.redirectTo({
              url: '/pages/home/index',
            })
          } else {
            wx.redirectTo({
              url: '/pages/home/index',
            })
          }

          break;
        case 1011:
          if (wx.getStorageSync('memberId')) {
            wx.redirectTo({
              url: '/pages/home/index',
            })
          } else {
            wx.redirectTo({
              url: '/pages/home/index',
            })
          }
          break;
        case 1012:
          this.publicFromCard(option)
          break;
        case 1013:
          this.publicFromCard(option)
          break;
        case 1007:
          if (wx.getStorageSync('memberId')) {
            wx.redirectTo({
              url: '/pages/home/index',
            })
          } else {
            wx.redirectTo({
              url: '/pages/home/index',
            })
          }
          break;
        case 1008:
          if (wx.getStorageSync('memberId')) {
            wx.redirectTo({
              url: '/pages/home/index',
            })
          } else {
            wx.redirectTo({
              url: '/pages/home/index',
            })
          }
          break;
      }
    }
    const updateManager = wx.getUpdateManager();
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    });

    updateManager.onUpdateFailed(function () {
      return that.Tips({
        title: '新版本下载失败'
      });
    })
  },
  // 酒店dealerId换customerId
  getCustomerIds() {
    // console.log('这里换getCustomerIds')
    getCustomerId({
      dealerId: wx.getStorageSync('dealerId'),//酒店id
    }).then(res => {
      // console.log(res,'customerid返值')
      wx.setStorage({
        data: res.data.customerId,
        key: 'customerId',
      })
      wx.setStorage({
        data: res.data.levelId,
        key: 'levelId',//等级id
      })
    }).catch(err => {

    })
  },
  publicFromCard(option) {
    wx.showLoading();
    //小程序通过扫码进入的
    let that = this;

    if (option.path == 'supermarket/shop/detail/index') {
      wx.setStorageSync("ziying", 1);
    }
    if (option.path == 'supermarket/mall/jdDetail/index') {
      wx.setStorageSync("jd", 1);
    }
    if (option.path == 'my/pages/vipcard/index') {
      wx.setStorageSync("vip", 1);
    }
    var url_dealerId = decodeURIComponent(option.query.scene);
    console.log(url_dealerId, 'scene的值')
    if (url_dealerId.indexOf("&") == -1) {
      var dealerId = decodeURIComponent(option.query.scene);
      var dealerId = dealerId.split("=")[1]
      wx.setStorageSync('dealerId', dealerId)
    } else {

      var url_d = url_dealerId.split("&")[0]
      var url_admin = url_dealerId.split("&")[1]
      var dealerId = url_d.split("=")[1]
      var adminId = url_admin.split("=")[1]
      // url_admin.split("=")[1]
      var goodid = '';
      if (url_admin.split("=")[0] == 'R') {
        // goodid = url_admin.split("=")[1]
        // wx.setStorageSync("goodid",goodid)

      } else if (url_admin.split("=")[0] == 'G') {
        //员工id
        var adminId = url_admin.split("=")[1];
        that.data.adminId = adminId;
      }
      wx.setStorageSync('dealerId', dealerId)
    }
    wx.hideLoading();
    // debugger;
    if (wx.getStorageSync('memberId')) {
      if (wx.getStorageSync('dealerId')) {
        // wx.redirectTo({
        //   url: '/pages/index/index',
        // })
      } else {

        wx.redirectTo({
          url: '/pages/login/index',
        })
      }
    } else {

      wx.redirectTo({
        url: '/pages/login/index',
      })
    }

  },
  onShow: function (options) {
    let that = this;
    if (wx.getStorageSync(("memberId"))) {
      post("/apiH5/stall/isExclusiveRobot", { mid: wx.getStorageSync("memberId") }, res => {
        //查看该用户是否有专属机器人
        if (res.data.code == 200) {
          that.globalData.isExclusiveRobot = res.data.data.status
          // this.setData({
          //   isExclusiveRobot:res.data.data.status
          // })
        }
      })
      post("/zdApplet/v2/card/level", {}, res => {
        console.log(res, 'eeeeeee')
        if (res.data.code == 200) {
          wx.setStorageSync('isLevelState', res.data.data.isLevelState)
          wx.setStorageSync('levelName', res.data.data.levelName)
        }
      })
    }
    this.getjw(false, function (e) {

    });
    var checkInDate = Moment(new Date()).format('YYYY-MM-DD');
    var checkOutDate = Moment(new Date()).add(1, 'day').format('YYYY-MM-DD');
    wx.setStorage({
      key: 'ROOM_SOURCE_DATE',
      data: {
        checkInDate: checkInDate,
        checkOutDate: checkOutDate
      }
    });

    post('/zdApplet/versionStatus', {
      version: '1.0.0'
    }, res => {
      let status = res.data.data.type;
      that.globalData.isStrongLogin = status;
      if (!wx.getStorageSync('memberId')) {
        if (JSON.stringify(that.globalData.shareQuery) == "{}") {
          if (status == 1) {//强登录
            wx.navigateTo({
              url: '/pages/login/index'
            })
          }
        } else {
          console.log('是分享进来的', '==========')
        }
      }
    })

  },
  // 判断是否是会员
  isLevelState: function (callback) {
    cardLevel().then(res => {
      console.log(res, 'rrrr')
      wx.setStorageSync('isLevelState', res.data.isLevelState)
      wx.setStorageSync('levelName', res.data.levelName)
      callback(res.data.isLevelState)
    }).catch(err => {

    })
  },

 
  globalData: {
    isStrongLogin: 1,//是否是强登录
    shareQuery: '',//分享参数
    robotSource: "75f712af51d952af3ab4c591213dea13",//机器人那边需要的source验证 写死就行
    isExclusiveRobot: 0,
    userInfo: "",
    reCode: '', //分享者邀请码
    session_key: '', //手机号授权需要用到
    gnaddress: '', //国内地址
    Loading: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-05-08/02/yuelvhui8kq4fWp5M01588876448.gif',
    //价格
    price: [{
      'text': '价格',
      'max': '',
      'min': '',
      'key': '1'
    }, {
      'text': '¥150元以下',
      'max': '0',
      'min': '150',
      'key': '0'
    }, {
      'text': '¥150-¥300',
      'max': '150',
      'min': '300',
      'key': '0'
    }, {
      'text': '¥301-¥450',
      'max': '301',
      'min': '450',
      'key': '0'
    }, {
      'text': '¥451-¥600',
      'max': '451',
      'min': '600',
      'key': '0'
    }, {
      'text': '¥601-¥1000',
      'max': '601',
      'min': '1000',
      'key': '0'
    }, {
      'text': '¥1000以上',
      'max': '1000',
      'min': '100000',
      'key': '0'
    }],
    // 星级
    starList: [{
      name: '星级',
      condition: '1',
      id: ''
    },
    {
      name: '经济',
      condition: '0',
      id: 1
    },
    {
      name: '三星舒适',
      condition: '0',
      id: 3
    },
    {
      name: '四星高档',
      condition: '0',
      id: 4
    },
    {
      name: '五星豪华',
      condition: '0',
      id: 5
    }
    ],
    // 酒店筛选条件
    screen: [{
      name: '排序',
      id: 1,
      isSelect: false
    },
    {
      name: '价格星级',
      id: 2,
      isSelect: false
    },
    {
      name: '区域位置',
      id: 3,
      isSelect: false
    },
    {
      name: '综合筛选',
      id: 4,
      isSelect: false
    }
    ],
    // 酒店推荐排序
    recommendCell: [{
      title: '推荐排序',
      condition: '1'
    },
    {
      title: '价格 低到高',
      condition: '0'
    },
    {
      title: '价格 高到低',
      condition: '0'
    },
    {
      title: '距离由近到远',
      condition: '0'
    }
    ],
    areaView: [{
      stair: '行政区',
      second: []
    },
    {
      stair: '距离我',
      second: []
    },
    {
      stair: '商圈',
      second: []
    },
    {
      stair: '机场/车站',
      second: []
    },
    {
      stair: '医院',
      second: []
    },
    // {
    //   stair: '地铁站',
    //   second: []
    // },
    {
      stair: '大学',
      second: []
    },
    {
      stair: '室内景点',
      second: []
    },
    // {
    //   stair: '室外景点',
    //   second: []
    // },
    {
      stair: '演出场馆',
      second: []
    },
      // {
      //   stair: '购物中心',
      //   second: []
      // },
    ],
    // 综合筛选
    ComprehensiveScreening: [{
      stair: '品牌连锁',
      level: []
    },
    {
      stair: '设施服务',
      level: [{
        title: 'WIFI',
        isChecked: 0,
        id: 1
      }, {
        title: '会议设施',
        isChecked: 0,
        id: 13
      }, {
        title: '免费停车',
        isChecked: 0,
        id: 5
      }, {
        title: '餐厅',
        isChecked: 0,
        id: 14
      }, {
        title: '室外游泳池',
        isChecked: 0,
        id: 10
      }, {
        title: '健身中心',
        isChecked: 0,
        id: 11
      }, {
        title: '室内游泳池',
        isChecked: 0,
        id: 9
      }, {
        title: '叫醒服务',
        isChecked: 0,
        id: 15
      }, {
        title: '行李寄存',
        isChecked: 0,
        id: 16
      }, {
        title: '免费接机服务',
        isChecked: 0,
        id: 7
      }]
    }
    ],
    hotCity: [{
      cityId: 1,
      cityName: "北京"
    },
    {
      cityId: 691,
      cityName: "上海"
    },
    {
      cityId: 1121,
      cityName: "天津"
    },
    {
      cityId: 1311,
      cityName: "重庆"
    },
    {
      cityId: 3999,
      cityName: "哈尔滨"
    },
    {
      cityId: 4361,
      cityName: "南京"
    },
    {
      cityId: 8053,
      cityName: "青岛"
    },
    {
      cityId: 9605,
      cityName: "武汉"
    },
    {
      cityId: 10291,
      cityName: "长沙"
    },
    {
      cityId: 10824,
      cityName: "广州"
    },
    {
      cityId: 11138,
      cityName: "深圳"
    },
    {
      cityId: 12947,
      cityName: "成都"
    }
    ],
    //悦淘飞机票项目
    flightInfoId: "", //航班信息标识 (请求航班详情接口是需要必传此字段)
    priceInfoId: "", //航班价格ID
    flightInfo: null,
    priceInfo: null,
    products: [],
    selectCouponIdArr: [], //优惠券ID数组
    change: {
      type: false, //是否是改签
      orderNo: "", //改签订单号
      routetype: '', //是否自愿 0 自愿  1非自愿
      ticketId: '', //机票ID，
      depAirportName: '', //出发机场
      arrAirportName: '', //到达机场
      changeFlightInfo: ""
    },

    // 新版
    JavaUrl: HTTP_JAVA_URL,
    PhpUrl: HTTP_PHP_URL,
    RobotUrl: HTTP_ROBOT_URL


  },


  // globalData: {
  //   userInfo: ""
  // },
  wxapp: {
    showLoading(title = "加载中") {
      wx.showLoading({
        title: title,
        mask: true,

      });
    },
    hideLoading() {
      wx.hideLoading();
    }
  },

  // 直订域名
  serverSuit: function () {
    return "https://yuecheng-api.yuelvhui.com"
    //  return "http://yuecheng-api.yuelvhui.testcn"
  },
  // 直订火车票域名
  serverTrain: function () {
    return "https://train.yuelvhui.com"
  },
  /**
   * 初始化商品详情默认选中项
   */
  initSelected: function (colorsize, skuid, callback) {
    let arr = new Array(colorsize.length)
    for (let i = 0; i < colorsize.length; i++) {
      for (let j = 0; j < colorsize[i].buttons.length; j++) {
        // colorsize[i].buttons[j].isEnable = true
        if (colorsize[i].buttons[j].skuList.indexOf(skuid) > -1) {
          // this.data.statusArr[i] = j
          this.selectLabel(i, j, colorsize, callback);
        }
      }
    }
  },
  selectLabel(index, data_index, colorsize, callback) {
    let that = this;
    let colorSize = colorsize;
    // let statusArr = []
    var idx = index;
    //选中sku
    var sku = colorSize[index].buttons[data_index]['skuList']
    //选中第几行第几个
    that.data.statusArr[index] = data_index
    //取出其他sku
    let m = []
    let sizeSelectText = []
    // that.setData({
    //   sizeSelectText: []
    // })
    var is_selected_skus = {};
    that.data.statusArr.map((b, a) => {
      if (a != idx && (typeof that.data.statusArr[a] != "undefined")) {
        is_selected_skus[a] = colorSize[a].buttons[that.data.statusArr[a]].skuList;
      }
      sizeSelectText.push(colorSize[a].buttons[that.data.statusArr[a]].text)
    })
    for (let i = 0; i < colorSize.length; i++) {
      var channel_data = colorSize[i].buttons;

      for (let j = 0; j < channel_data.length; j++) {
        if (i != idx) {
          var sku_isists = Array.intersect(sku, channel_data[j].skuList);
          for (let [c, d] in is_selected_skus) {
            if (c != i) {
              sku_isists = Array.intersect(sku_isists, is_selected_skus[c]); //is_selected_skus非当前行其他行选中的元素
            }
          }
          if (sku_isists.length) {
            colorSize[i].buttons[j].isEnable = true;
          } else {
            colorSize[i].buttons[j].isEnable = false;
          }
        } else {
          if (j == data_index) {
            colorSize[i].buttons[j].isEnable = true;
          } else if (colorSize.length == 1) {
            colorSize[i].buttons[j].isEnable = true;
          }
        }
      }
    }
    let last_sku = sku
    for (let [c, d] in is_selected_skus) {
      last_sku = Array.intersect(last_sku, is_selected_skus[c]);
    }
    callback({
      statusArr: that.data.statusArr,
      colorSize: colorSize,
      last_sku: last_sku[0],
      skuid: last_sku[0],
      sizeSelectText: sizeSelectText
    })
    // this.skuidDetil()
  },
  // 自定义导航头部高度计算
  navTop: function (callback) {
    let that = this
    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: res => {
        let statusBarHeight = res.statusBarHeight,
          navTop = (menuButtonObject.top * 2) + 8, //胶囊按钮与顶部的距离
          navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2; //导航高度
        callback({
          navTop: navTop
        })
      },
      fail(err) { }
    })
  },
  // 获取当前位置
  getjw: function (Manual, callback) {
    let that = this
    wx.getLocation({ //获取当前位置
      type: 'gcj02',
      success: function (res) {
        let locationString = res.latitude + "," + res.longitude;
        wx.setStorageSync('latitude', res.latitude)
        wx.setStorageSync('longitude', res.longitude)
        wx.request({
          url: 'https://apis.map.qq.com/ws/geocoder/v1/',
          data: {
            "key": "CSBBZ-OLQWW-C5JR6-OIMZW-L2RNF-KHBF7",
            "location": locationString
          },
          method: 'GET',
          success: function (e) {
            //输出一下位置信息
            if (e.data.result) {
              // 城市
              let city = e.data.result.ad_info.city.substring(0, e.data.result.ad_info.city.length - 1);

              wx.setStorageSync('gnCity', city)
              wx.setStorageSync('LocgnCity', city)
              // 具体城市地址
              let address = e.data.result.address;
              var index = address.lastIndexOf("市");
              if (Manual) {
                that.globalData.gnaddress = e.data.result.formatted_addresses.recommend;
              }
              callback({
                address: city
              })
              // wx.request({
              //   url: 'https://api2.yuelvhui.com/hotelApp/areas/getCityCode/' + city,
              //   data: {},
              //   method: 'GET',
              //   header: {
              //     'content-type': 'application/json'
              //   },
              //   success(res) {
              //     if (res.statusCode === 200) {

              //     } else if (res.code === 400) {
              //       wx.showToast({
              //         title: res.data.msg,
              //         icon: 'none',
              //         duration: 2000
              //       })
              //     } else {
              //       wx.showToast({
              //         title: '网络错误 ',
              //         icon: 'none',
              //         duration: 1000
              //       })
              //     }
              //   }
              // })
            } else {

            }
          },
          fail: function () { }
        });
      },
      fail: function (res) {
        console.log('获取当前位置失败', res);
      }
    });
  },

});
