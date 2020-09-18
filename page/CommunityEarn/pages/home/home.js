// page/My/My.js
const app = getApp();
// import {ajaxUserCenter,ajaxSy,ajaxProfit} from "../../../../api/MyApi"


Page({
  /**
   * 页面的初始数据
   */
  data: {
    UserData:'',
    syObj:''

  },
  nextPage(e){
    console.log(e);
    let {ourl = ''} =  e.currentTarget.dataset
   
    if (wx.getStorageSync("uid")) {
      wx.navigateTo({
        url: ourl,
      });
    } 
  },
  handleCopyCode(e){
    //复制悦淘号点击事件
      wx.setClipboardData({
        data: e.currentTarget.dataset.text,
        success(res) {
          wx.getClipboardData({
            success(res) { }
          })
        },
        complete(res) { }
      })
  },
  getSy(){
    //获取个人收益
    let that = this;
    ajaxProfit().then(res=>{
      console.log("收益",res)
      if(res.code == 200){
        that.setData({
          syObj:res.data
        })
      }
    })
  },
  nextPageDataTj(e){
    let {type = 0 } = e.currentTarget.dataset;
    wx.navigateTo({
      url:"/page/CommunityEarn/pages/Statistical/Statistical?type="+type
    })
  },
  getUserCenter(){
    //获取用户中心数据
    
    ajaxUserCenter().then(res=>{
      if(res.code == 200){
        this.setData({
          UserData:res.data
        })
        wx.setStorageSync('vipname',res.data.levelText );
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1500,
          mask: true
        });
          
      }
      wx.hideLoading();
    })



  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: "努力加载中",
      mask: true
    });

    let that = this;
    // 胶囊位计算
    app.navTop(function (res) {
      that.setData({
        fixTop: res.navTop - 16,
        navTop: res.navTop + 44,
        mTop: res.navTop + 44 + res.navTop - 20,
      });
    });
    this.getSy();
    this.getUserCenter();
  },
  onShow(){
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
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
    let that = this;
    // console.log(pagey);
    if (obj.scrollTop > 10) {
      that.setData({
        titleStatus: 1,
      });
    } else {
      that.setData({
        titleStatus: 0,
      });
    }
  },
});
