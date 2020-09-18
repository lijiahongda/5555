// equityCard/pages/service/method/method.js
import {
  post,get
} from "../../../../utils/api"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    list:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
    })
    console.log(this.data.id)
    this.list()
  },
  list(){
    post('/api/help/getHelpInfo',{id:this.data.id},(res)=>{
      console.log(res,'lalalalalla')
      if(res.data.code==200){
          this.setData({
            list:res.data.data
          })
      }
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

  }
})