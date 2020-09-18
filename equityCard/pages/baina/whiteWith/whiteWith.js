// import {
//   freeProductList
// } from '../../../../utils/mall.js';

import {
  post,get
} from "../../../../utils/api"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // data: {},
    list: []
  },

  freeProductList() {
    get('/api/v1/free-product-list',{},(res)=>{
      if(res.data.code==200){
        this.setData({
          // data: res.data,
          list: res.data.data
        })

      }
      
    })
  },
  buy(e) {
    if (!wx.getStorageSync('memberId')) {
      // wx.navigateTo({
      //   url: '/equityCard/pages/baina/authorize/authorize',
      // })
      // return
    }
    wx.navigateTo({
      url: '/equityCard/pages/baina/goodsDetail/goodsDetail?productId=' + e.currentTarget.dataset.id + '&productSkuId=' + e.currentTarget.dataset.skuid,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.freeProductList()
  }
})