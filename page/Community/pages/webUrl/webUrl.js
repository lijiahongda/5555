// page/community/pages/webUrl/webUrl.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let url = decodeURIComponent(options.url)
    if (url.indexOf('https')==-1){
      console.log(11)
      url = url.replace(/http/,'https')
    }
    this.setData({
      url
    })
  }
})