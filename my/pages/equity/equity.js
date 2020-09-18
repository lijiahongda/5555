import {
  post,get
} from "../../../utils/api"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:{},
    canGetEight: 0,
    id:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      canGetEight: options.canGetEight
    })
    this.getData(options.id)
  },

  toNext(){
    let id = this.data.id
    if(this.data.canGetEight==0){
      wx.navigateBack()
    }else if(id == 1 || id == 3 || id == 5 || id == 7){
      wx.navigateTo({
        url: '/equityCard/pages/equityCard/equityCard', // 联名卡权益页
      })
    }else if(id == 2){
      wx.navigateTo({
        url: '/equityCard/pages/Oiling/OilingAll/Strategy/Strategy', // 加油省钱介绍页面
      })
    }else if(id == 4){
      wx.navigateTo({
        url: '/supermarket/mall/commodityList/index', // 京东超市
      })
    }else if(id == 6 || id == 8){
      wx.navigateTo({
        url: '/my/pages/integral/integral', // 积分商城
      })
    }
  },

  getData(id){
    post('/api/getMemberPowers',{
      id
    },(res)=>{
      if(res.data.code==200){
        this.setData({
          data:res.data.data
        })
      }else{
        wx.showToast({
          title: res.data.msg,
        })
      }
      
    }) 
  }

})