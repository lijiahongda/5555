import {
  fuelRule
} from "../../../../../api/cps"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rule:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
  },

  getList(){
    let that = this
    fuelRule({}).then(res => {
      that.setData({
        rule:res.data.rule,
      })
    })
  },
  goOiling(){
    wx.navigateTo({
      url: '/equityCard/pages/Oiling/oiling'
    })
  },
})