
import {ajaxDataProfit} from "../../../../api/Wallet"
const app = getApp()



Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabDataIndex:0,
    params:{
      type:1,
      memberId:wx.getStorageSync("memberId")
    },
    oData:"",
    tabData:[
      {
        name:"上月预估",
        id:0,
        status:1
      },
      {
        name:"本月预估",
        id:1,
        status:2
      },
      {
        name:"近30天预估",
        id:2,
        status:3
      }
    ]
  },
   handleTabMy(e){
     let {id,status} =  e.currentTarget.dataset;
      this.setData({
        tabDataIndex:id,
        "params.type":status
      })
      this.getDataList();
   },
   nextPage(e){
    let {type}  = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/page/CommunityEarn/pages/Statistical/Statistical?type='+type
    });
   },
  getDataList(){
    let params = this.data.params;
    ajaxDataProfit(params).then(res=>{
      if(res.code == 200){
        this.setData({
          oData:res.data
        })
      }
    })
  },
  onLoad: function(options) {
    this.getDataList();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    
  },

});