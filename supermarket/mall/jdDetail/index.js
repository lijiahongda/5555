const app = getApp()
import {
  retrunScene,
  getCardCode
} from "../../../utils/public"
import {
  jdGoodsShareData,
  ownGoods,
  jdGoodsShare,
  getSmallProgramLink,
  jdGoodsInfo,
  getPushStatusByGoodsId,
  shopShare,
  jdBrowsed
} from '../../../api/cps'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    posterObj: {
      status: 0,
      url: ""
    },
    shareSelectStatus: 0,
    serverSuit: app.serverSuit(),
    goods_id: '',
    uid: '',
    token: '',
    goodsInfo: {},
    Return: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-30/20/yuelvhuidjEjRAEqX01588248683.png',
    channelIcon: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-02-23/09/yuelvhuiI9ee3xGzmq1582420967.png',
    authorizationStatus: true,
    image: [],
    isExclusiveRobot: app.globalData.isExclusiveRobot
  },




  // 浏览记录
  jdBrowsed: function () {
    // var that = this;
    // let data={
    //   uid:wx.getStorageSync('memberId'),
    //   type:4,
    //   goods_id:this.data.goods_id
    // }
    // jdBrowsed(that.data.serverSuit +'/outside/jd/jdBrowsed',data,res=>{
    //   console.log(res)
    // })
    // // jdBrowsed(data).then(res=>{
    // //   console.log(res)
    // // })
  },
  // 分享
  sharePage: function () {
    let that = this;
    if (wx.getStorageSync('memberId')) {
      // wx.navigateTo({
      //   url: '../CommoditySharing/index?goodsid=' + this.data.goods_id + '&Entrance=' + 'jd' + '&amount=' + this.data.goodsInfo.coupon.discount + '&price=' + this.data.goodsInfo.original_price + '&goodsName=' + this.data.goodsInfo.goods_name + '&vipPrice=' + this.data.goodsInfo.jd_price + '&saleCount=' + this.data.goodsInfo.sale_num
      // })
      that.setData({
        shareSelectStatus: 1
      })
    } else {
      wx.setStorage({
        data: 1,
        key: 'jd',
      })
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }

  },

  ajaxHaiBao() {
    //生成海报

    wx.showLoading({
      title: '海报生成中',
      mask: true
    });

    let params = {
      product_id: this.data.goodsInfo.goods_id,
      dealerId: wx.getStorageSync("dealerId"),
      type: 2, //1自营 2京东 3白拿
      mid: wx.getStorageSync("memberId"),
      sku_id: "",
      vipPrice: this.data.goodsInfo.jd_price,
      price: this.data.goodsInfo.original_price,
      pImg: this.data.goodsInfo.goods_image[0],
      pName: this.data.goodsInfo.goods_name
    }


    ownGoods(params).then(res => {
      console.log("海报接口", res);
      this.setData({
        posterObj: {
          status: 1,
          url: res.data
        }
      })
      wx.hideLoading();
    })
  },
 
  onShareAppMessage: function () {
    return {
      title: this.data.goodsInfo.goods_name,
      imageUrl: this.data.goodsInfo.goods_image[0],
      path: '/supermarket/mall/jdDetail/index?goods_id=' + this.data.goods_id+'&reCode='+wx.getStorageSync('mYinviteCode')
    }
  },
  
  handleCloseShareDialog() {
    console.log("隐藏选项的弹窗");
    this.setData({
      shareSelectStatus: 0
    })
  },
  SharingPosters() {
    //海报点击之后出发该事件
    this.ajaxHaiBao();
  },
  handleBox() {
    //隐藏海报和分享的弹窗
    let _key = "posterObj.status"
    this.setData({
      [_key]: 0,
      shareSelectStatus: 0
    })
  },
  getStatus() {
    var data = {
      mid: wx.getStorageSync('memberId'),
      goods_id: this.data.goods_id,
      goods_sku_id: '',
      activity_id: '',
    }
    getPushStatusByGoodsId(data).then(res => {
      console.log(res, 'res.data')
      this.setData({
        pushStatus: res.data.push_status
      })

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    console.log(options, 'options')
   


  },

  onShow() {
    let that = this;

    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let options = currentPage.options;


    if (!wx.getStorageSync('memberId')) {
      wx.setStorageSync("jd", 1);
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }

    
    let goods_id
    if (options.scene != null) {

      retrunScene(options.scene, function (sceneObj) {
        console.log(sceneObj,'1111111')
        getCardCode(sceneObj.R).then(res => {
          console.log(res,'getCardCode')
          goods_id = res.G;
          wx.setStorageSync("jd", 1);
          wx.setStorageSync("goodid", goods_id);
          that.setData({
            goods_id: goods_id,
            token: wx.getStorageSync('token')
          })
          that.jdBrowsed()
          that.getDetailData()
        })
      });
    } else {
      console.log('22222')
      wx.setStorageSync('inviteCode', options.reCode)
      goods_id = options.goods_id;
      that.setData({
        goods_id: goods_id,
        token: wx.getStorageSync('token')
      })
      that.jdBrowsed()
      that.getDetailData()
      that.getStatus()
    }

    console.log(options.reCode, '京东联盟')








    this.setData({
      uid: wx.getStorageSync('memberId')
    })

  },

  getDetailData() {
    console.log(wx.getStorageSync('memberId'), 'memberId')
    let that = this,
      data = {
        goods_id: that.data.goods_id,
        // goods_id:'62187734859',
        uid: wx.getStorageSync('memberId'),
        type: 2
      }
    jdGoodsInfo(data).then(res => {
      console.log(res.data)
      console.log(res)
      console.log(res.data.xcx_jump, 'xcx_jump')
      if (res.data.xcx_jump) {
        that.setData({
          jd_jump: res.data.xcx_jump
        })
      } else {
        var goods_materialUrl = res.data.goods_materialUrl;
        var data = {
          spreadUrl: goods_materialUrl,
          mid: wx.getStorageSync('memberId'),
        }
        getSmallProgramLink(data).then(res => {
          console.log(res, '11111')
          that.setData({
            jd_jump: res.data
          })
        })
      }

      console.log(res.data)
      that.setData({
        goodsInfo: res.data
      })

      that.dataInitShare(that.data.goods_id)
    })

  },
  // 默认分享数据
  dataInitShare: function (goodsid, bannerItem) {
    let that = this
    let data = {
      goods_id: goodsid,
      uid: wx.getStorageSync('memberId'),
      type: 2
    }
    jdGoodsShareData(data).then(res => {
      console.log(res, '分享的数据')
      let goods_imge = res.data.goods_imge ? res.data.goods_imge : bannerItem
      let image = that.data.image
      for (var i = 0; i < goods_imge.length; i++) {
        image[i] = {
          ischeck: i == 0 ? true : false,
          img: goods_imge[i]
        }
      }
      that.setData({
        image: image,
        good_info: res.data.good_info,
        shareImage: image[0].img,
        poster: image[0].img
      })
      console.log(that.data.image, 'that.data.image')
    })
  },
 


  go() {
    let that = this
    if (wx.getStorageSync('memberId')) {
      wx.navigateToMiniProgram({
        appId: 'wx13e41a437b8a1d2e',
        path: that.data.jd_jump,
        extraData: {

        },
        envVersion: 'release',
        success(res) {
          // 打开成功
        }
      })
    } else {
      wx.setStorage({
        data: 1,
        key: 'jd',
      })
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  }
})