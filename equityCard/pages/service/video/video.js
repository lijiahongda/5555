// equityCard/pages/service/video/video.js
import {
  post,get
} from "../../../../utils/api"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:{},
    mode:'widthFix'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.list()
  },
  list(){
    post('/api/help/getHelpList',{},(res)=>{
      console.log(res,'lalalalalla')
      if(res.data.code==200){
          this.setData({
            data:res.data.data
          })
      }
    })
  },
  videoErrorCallback: function(e) {
    console.log('视频错误信息:')
    console.log(e.detail.errMsg)
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

  }
})