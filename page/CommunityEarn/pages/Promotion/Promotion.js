// page/My/My.js
const app = getApp();


Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabDataIndex:0,
    tabData:[
      {
        name:"限时补贴",
        id:0
      },
      {
        name:"超会补贴",
        id:1
      }
    ],
  },
  handleTabMy(e){
    let {id} =  e.currentTarget.dataset;
     this.setData({
       tabDataIndex:id
     })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
