// my/pages/myCommission/index.js
import {
  wxRequest
} from "../../../utils/req"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //tab框
    selected: 0,
    list: ['累计','今日','昨日','本月'],

    pitch_up:'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-07-09/10/yuelvhuiLjBqJxhkCc1594262496.png',
    pitch_un:'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-07-09/10/yuelvhuiW9OxWUydSK1594262529.png',
    pitch:'m1'

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options.id)
    that.setData({
      memberId:options.id
    })
    that.getUserCash()
    that.commissionList() 
  },
  // 提现
  deposit:function(e){
    wx.showToast({
      title: '请下载直订APP提现',
      icon: 'none'
    })
  },
  //tab框
  selected: function(e){
    console.log(e)
    let that= this
    let index = e.currentTarget.dataset.index
    console.log(index)
    if( index == 0){  
      that.setData({
        selected: 0
      })
      that.commissionList() 
    }else if( index == 1) {
      that.setData({
        selected: 1
      })
      that.commissionList() 
    }else if(index == 2 ){
      that.setData({
        selected: 2
      })
      that.commissionList() 
    }else if(index == 3 ){
      that.setData({
        selected: 3
      })
      that.commissionList() 
    }
  },

  total:function(e){
    let that = this;
    that.setData({
      pitch_up:'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-07-09/10/yuelvhuiLjBqJxhkCc1594262496.png',
      pitch_un:'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-07-09/10/yuelvhuiW9OxWUydSK1594262529.png',
      pitch:'m1'
    })
  },
  await:function(e){
    let that = this;
    that.setData({
      pitch_up:'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-07-09/10/yuelvhuiW9OxWUydSK1594262529.png',
      pitch_un:'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-07-09/10/yuelvhuiLjBqJxhkCc1594262496.png',
      pitch:'m0'
    })
  },
  // 金额
  getUserCash:function(e){
    let that = this;
    console.log(wx.getStorageSync("memberId"))
    let params ={
      memberId:that.data.memberId
    }
    wxRequest({
      method: "post",
      url: "/apimall/order/mall/getUserCash",
      data: params
    }).then(res =>{
      console.log(res)
      that.setData({
        ommissionAmount:res.ommissionAmount,
        purchaseAmount:res.purchaseAmount,
        whenBill:res.whenBill
      })
    })

  },
  // 列表
  commissionList:function(e){
    let that = this;
    console.log(typeof(JSON.stringify(wx.getStorageSync("memberId"))))
    console.log(typeof(JSON.stringify(that.data.selected)))
    let params ={
      memberId:that.data.memberId,
      type:that.data.selected+''
    }
    wxRequest({
      method: "post",
      url: "/apimall/order/mall/getCommissionList",
      data: params,
      contentType:"application/json"
    }).then(res =>{
      console.log(res)
      if(res.list.length == 0){
        that.setData({
          not:true
        })
      }else{
        for(var i = 0;i<res.list.length;i++){          
          if(!res.list[i].headImg){
            res.list[i].headImg = "https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-07-09/11/yuelvhuiOklOUBNYyn1594265685.png"
          }
        }
        that.setData({
          commissionList:res.list,
          not:false
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

  },

  /**
   * 用户点击右上角分享
   */

})