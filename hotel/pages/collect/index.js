// hotel/pages/collect/index.js
import {
  collectList,
  collectCancel
} from "../../../api/hotel"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect: "",
    collectLength:"",
    unselected:'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-07-20/11/yuelvhuiftZB7MzqJI1595216106.png',
    selected:'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-07-20/11/yuelvhuiMKSoZyYPGk1595216132.png',

    details:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      selectedImg:this.data.unselected,
      allCheckUrl:this.data.unselected
    })
    this.getCollect()
  },
  getCollect() {
    let that = this;
    collectList({}).then(res => {
      console.log(res, "收藏列表")
      for(var i = 0;i<res.data.length;i++){
        res.data[i].electUrl = 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-07-20/11/yuelvhuiftZB7MzqJI1595216106.png'
      }
      that.setData({
        collect: res.data,
        collectLength:res.data.length
      })
    })
  },
  // 点击编辑
  compile:function(e){
    var that =this;
    that.setData({
      redact:true,
      details:false
    })
  },
  //选择酒店
  choose:function(e){
    var that = this;
    console.log(e.currentTarget.dataset.id)
    var id = e.currentTarget.dataset.id;
    console.log(that.data.collect);
    var collect = that.data.collect;
  
    for(var i=0;i<collect.length;i++){
      if(collect[i].dealerId == id){
        if(collect[i].electUrl == that.data.unselected){
          collect[i].electUrl = that.data.selected       
        }else{             
          collect[i].electUrl = that.data.unselected;
        }
      }
    }

    
    that.setData({
      collect:collect
    })

  },
  // 全选酒店
  allCheck:function(){
    var that = this;
    var collect = that.data.collect;
    if(that.data.allCheckUrl == that.data.unselected){
      for(var i=0;i<collect.length;i++){
        collect[i].electUrl = that.data.selected
      }
      that.setData({
        allCheckUrl:that.data.selected,
        collect:collect
      })
    }else{
      for(var i=0;i<collect.length;i++){
        collect[i].electUrl = that.data.unselected
      }
      that.setData({
        allCheckUrl:that.data.unselected,
        collect:collect
      })
    }

  },
  // 取消收藏
  cancelCollection:function(e){
    var that = this;
    var collect = that.data.collect;
    var cancelIds = []
    for(var i=0;i<collect.length;i++){      
      if(collect[i].electUrl == that.data.selected){
        cancelIds.push(collect[i].dealerId)
      }
    }
    console.log(cancelIds,'cancelIds')
    if(cancelIds.length == 0){
      wx.showToast({
        title: '请选择酒店',
        icon: "none",
      });
    }else{
      var parameter = {
        dealerIds:cancelIds.join(',')
      }
      console.log(typeof(cancelIds.join(',')))
      collectCancel( parameter).then(res =>{
        console.log(res,'取消收藏')
        if(res.data){
          that.setData({
            redact:false,
            details:true
          })
          this.getCollect()
        }
      })
    }
  },
  //取消编辑
  cancel:function(){
    var that =this;
    that.setData({
      redact:false,
      details:true
    })
  },
  to_tuijian(e) {
    console.log(e) 
    console.log(e.currentTarget.dataset.dealerid, "推荐")
    if(this.data.details == true){
      wx.setStorageSync('dealerId', e.currentTarget.dataset.dealerid)
      wx.redirectTo({
        url: '/hotel/pages/index?dealerId=' + e.currentTarget.dataset.dealerid
      });
    }

    
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


  /**
   * 用户点击右上角分享
   */

})
