// page/My/My.js

import {ajaxWalletIntro,ajaxVideo} from "../../../../api/CommunityEarn"
import WxParse from "../../../../wxParse/wxParse"

const app = getApp();


Page({
  /**
   * 页面的初始数据
   */
  data: {
    walletData:"",
    videoData:''
  },
  handleDetail(){
    wx.showToast({
      title: '请下载直订App查看',
      icon: 'none'
    });
  },
  nextPage(e){
    console.log(e);
    let {ourl = ''} =  e.currentTarget.dataset
   
    if (wx.getStorageSync("memberId")) {
      wx.navigateTo({
        url: ourl,
      });
    } 
  },
  getWalletIntro(){
    ajaxWalletIntro({
      memberId:wx.getStorageSync("memberId")
    }).then(res=>{
      if(res.code == 200){
        this.setData({
          walletData:res.data
        })
        WxParse.wxParse('article','html', res.data.content, this, 5);

      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
          success: (result)=>{
            
          },
          fail: ()=>{},
          complete: ()=>{}
        });
      }


    })
  },
  webUrlVideo: function (e) {
    let { item } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/page/Community/pages/webUrl/webUrl?url=' + item.url,
      fail(err){
        console.log("错误信息",err)
      }
    })
  },
  getVideoUrl(){
    ajaxVideo({
      memberId:wx.getStorageSync("memberId")
    }).then(res=>{
      if(res.code == 200){
        this.setData({
          videoData:res.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWalletIntro();
    this.getVideoUrl();
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
  
  },
});
