// page/My/My.js
const app = getApp();
import {ajaxDataLyb} from "../../../../api/Wallet"
import WxParse from "../../../../wxParse/wxParse"


Page({
  /**
   * 页面的初始数据
   */
  data: {
    bData:""
  },
  getLyb(){
    ajaxDataLyb().then(res=>{
      if(res.code == 200){
       this.setData({
        bData:res.data
       })
        WxParse.wxParse('article','html', res.data.rule, this, 5);
        WxParse.wxParse('elseRule','html', res.data.elseRule, this, 5);
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });
      }
    })
  },
  
  onLoad: function (options) {
      this.getLyb();
   
  },
  onShow(){

    
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

 

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  onPageScroll(obj) {
    
  }
});
