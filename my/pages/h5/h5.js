import {
  post,get
} from "../../../utils/api"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'',
    share_info:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,'options')
    let that = this,
    data={
      mid:wx.getStorageSync('memberId'),
      // uri:'http://pms.zhiding365.com/h5/shop/elm'
    }
      wx.hideShareMenu();
      post('/pms/elmAuthLink',data,(res)=>{
        that.setData({
          url:res.data.data.link
        })
      })
    console.log(that.data.url,'urlurlurl')

  },
  clones(e){
    
    wx.setClipboardData({
      //准备复制的数据
      data: e.currentTarget.dataset.url,
      success: function(res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    })
  },
  quxiao(){
    wx.navigateBack({
      delta: 1,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  }
})