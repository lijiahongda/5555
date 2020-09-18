Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      // content: JSON.parse(options.content)
      content:options.content
    })
    console.log(this.data.content)
  },
  ValuationRules:function(){
    wx.navigateTo({
      url: '/page/CaoCaoTravel/pages/ValuationRules/ValuationRules',
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let date = new Date(); //当前日期
    let year = date.getFullYear();//当前年份
    let month = date.getMonth() + 1; //当前月份
    let day = date.getDate(); //当前日期
    this.setData({
      time: year + '-' + month + '-' + day
    })
  }
})