import {
  fuelCover
} from "../../../../../api/cps"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgImg: '',
    btnImg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
  },

  getList() {
    let that = this
    wx.showLoading()
    fuelCover({}).then(res => {
      console.log(res, 'lalalalalla')
      wx.hideLoading()
      that.setData({
        bgImg: res.data.fuelCover,
        btnImg: res.data.fuelButton
      })
    })
  },
  goOiling() {
    wx.navigateTo({
      url: '/equityCard/pages/Oiling/oiling'
    })
  },
})