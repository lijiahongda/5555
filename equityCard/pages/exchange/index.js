import {
  exchangeProductList
} from "../../../api/personal"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getList(options.cardId)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  // 列表
  getList(id){
    exchangeProductList({
      yuechengCardId: id
    }).then(res => {
      this.setData({
        detail:res.data
      })
    })
  },
  // 进入白拿详情
  goDetail(e){
    console.log(e,'3333')
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/equityCard/pages/baina/goodsDetail/goodsDetail?productId=' + item.product_id + '&productSkuId=' + item.sku_id+'&type=exchange',
    })

  },
})