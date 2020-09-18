import {
  post
} from "../../../../utils/api"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    copyText:'11',
    logisticsInfo:[],
    data:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderMallNo: options.orderMallNo,
      goodsName:options.goodsName,
      skuName:options.skuName,
      goodsNum:options.goodsNum,
      imageUrl:options.imageUrl,
      goodsPrice:options.goodsPrice
    })
    this.getData()
  },

  copy(e){
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success (res) {
        wx.getClipboardData({
          success (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  
  getData(){
    wx.showLoading()
    let data={
      orderMallNo: this.data.orderMallNo
    }
    post('/app/v1/card/orderLogistics',data,(res)=>{
      console.log(res)
      wx.hideLoading()
      if(res.data.code==200){
        this.setData({
          data:res.data.data,
          logisticsInfo: res.data.data.logisticsInfo
        })
      }else{
        wx.showToast({
          title: res.data.msg,
        })
      }
    })
  }
})