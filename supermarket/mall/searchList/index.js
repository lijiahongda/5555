import {
  jdSearchList
} from '../../../api/cps'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword:'',
    searchVal:''
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    var that = this;
    that.setData({
      keyword:option.key
    })
    that.getList()
  },
  // 搜索
  searchBind:function(e){
    this.setData({
      keyword:e.detail
    })
    this.getList()
  },
  // 搜索结果
  getList:function(){
    jdSearchList({
      keyword:this.data.keyword
    }).then(res => {
      let jdList = []
      for (let s of res.data) {
        jdList.push({
          name: s.goodsInfo.goods_name,
          picurl: s.goodsInfo.goods_image,
          goodsId: s.goodsInfo.goods_id,
          vipPrice: s.goodsInfo.jd_price,
          oprice: s.goodsInfo.original_price,
          discount:s.coupon.discount
        })
      }
      this.setData({
        jdList: jdList
      })
    })
  },

  // 跳转京东详情
  jdDetail(e) {
    wx.redirectTo({
      url: '/supermarket/mall/jdDetail/index?goods_id=' + e.currentTarget.dataset.item.goodsId
    })
  },
  
})