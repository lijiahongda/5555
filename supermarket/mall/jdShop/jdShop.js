// supermarket/mall/jdShop/jdShop.js
import {
  jdHomeEliteGoodsList,
  addAssistantPush,
  jdGoodsShareData,
  ownGoods
} from '../../../api/cps'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    eliteId: '',
    page: 1,
    isExclusiveRobot: app.globalData.isExclusiveRobot
  },
  // 初始数据
  getlist() {
    let that = this

    let data = {
      "eliteId": that.data.eliteId,
      "page": that.data.page,
      "pageSize": 10

    }
    wx.showLoading({
      title: '加载中',
      icon: 'none'
    })
    jdHomeEliteGoodsList(data).then(res => {
      console.log(res, 'resresress')
      var screllLists = []

      wx.hideLoading()
      if (that.data.page == 1) {
        for (let s of res.data) {
          screllLists.push({
            name: s.goodsInfo.goods_name,
            picurl: s.goodsInfo.goods_image,
            coupon: s.coupon,
            progress_num: 'empty',
            comment_num: 0,
            buy_num: s.goodsInfo.sale_num,
            vipPrice: s.goodsInfo.jd_price,
            oprice: s.goodsInfo.original_price,
            btntype: app.globalData.isExclusiveRobot == 0 ? ['', 'copy', 'share', '', ''] : ['add', 'copy', 'share', '', ''],
            promote_price: s.commission_info.earn_price,
            goodsId: s.goodsInfo.goods_id,
            listType: 2,
            // isAddAssistant:s.isAddAssistant
          })
        }
        this.setData({
          screllList: screllLists
        })
      } else {
        if (res.data.length == 0) {
          wx.showToast({
            title: '没有更多数据了',
          })
        } else {
          for (let s of res.data) {
            screllLists.push({
              name: s.goodsInfo.goods_name,
              picurl: s.goodsInfo.goods_image,
              coupon: s.coupon,
              progress_num: 'empty',
              comment_num: 0,
              buy_num: s.goodsInfo.sale_num,
              vipPrice: s.goodsInfo.jd_price,
              oprice: s.goodsInfo.original_price,
              btntype: ['', 'copy', 'share', '', ''],
              promote_price: s.commission_info.earn_price,
              goodsId: s.goodsInfo.goods_id,
              listType: 2,
              // isAddAssistant:s.isAddAssistant
            })
          }
          this.setData({
            screllList: that.data.screllList.concat(screllLists)
          })
        }
      }
      wx.stopPullDownRefresh();

    })
  },
  // 跳转京东详情
  jdDetail(e) {
    wx.navigateTo({
      url: '/supermarket/mall/jdDetail/index?goods_id=' + e.currentTarget.dataset.item.goodsId
    })
  },
  // 加入群助理
  handleAdd: function (e) {
    console.log(e)
    let data = {
      mid: wx.getStorageSync('memberId'),
      goods_type: 2,
      goodsId: e.detail.goodsId,
      activity_id: e.detail.activityId,
      product_sku_id: e.detail.skuid
    }
    addAssistantPush(data).then(res => {
      console.log(res, '加入助理')
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      eliteId: options.eliteId
    })
    wx.setNavigationBarTitle({
      title: options.title,
    })
    this.getlist()

  },
  // 复制文案
  handleCopy: function (e) {
    console.log(e)
    this.dataInitShare(e.detail.goodsId, e.detail.picurl, 1)
  },
  // 分享海报
  handleShare: function (e) {
    console.log('----', e)
    this.dataInitShare(e.detail.goodsId, e.detail.picurl, 2, e.detail.vipPrice, e.detail.oprice)
  },
  //京东复制文案数据
  dataInitShare: function (goodsid, bannerItem, type, vipPrice, price) {
    let that = this
    wx.showLoading()
    var data = {
      goods_id: goodsid,
      uid: wx.getStorageSync('memberId'),
      type: 2
    }
    jdGoodsShareData(data).then(res => {
      let CopyText = ''
      if (type == 1) {
        wx.hideLoading()
        CopyText = '👇👇👇' + '\n' + res.data.good_info.goods_name + ' \n' + res.data.good_info.sale_desc + '\n' + res.data.good_info.buy_desc + '\n' + res.data.good_info.panic_desc + '\n' + res.data.good_info.panic_link
        wx.setClipboardData({
          data: CopyText,
          success(res) {
            wx.getClipboardData({
              success(res) {}
            })
          },
          complete(res) {}
        })
      }
      console.log(type)
      if (type == 2) {

        // 生成H5海报
        var data = {
          product_id: goodsid,
          dealerId: wx.getStorageSync("dealerId"),
          type: 2, //1自营 2京东 3白拿
          mid: wx.getStorageSync("memberId"),
          sku_id: "",
          vipPrice: vipPrice,
          price: price,
          pImg: bannerItem,
          pName: res.data.good_info.goods_name
        }
        this.ajaxHaiBao(data)

      }
    })


  },
  ajaxHaiBao(data) {
    //生成海报
    wx.showLoading({
      title: '海报生成中',
      mask: true
    });
    ownGoods(data).then(res => {
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
  handleBox() {
    //隐藏海报和分享的弹窗
    let _key = "posterObj.status"
    this.setData({
      [_key]: 0,
      shareSelectStatus: 0
    })
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
    let page = this.data.page;
    page++;

    this.setData({
      page: page
    })
    this.getlist();
  }
})