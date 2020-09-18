// hotel/pages/pmsList/pmsList.js
import {pmsList} from '../../../api/hotel'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curPage:1,
    pageSize:10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
this.getTuijHotel()
  },
  getTuijHotel() { // 获取推荐酒店列表
    let data = {
      lat: String(wx.getStorageSync('latitude')),
      lng: String(wx.getStorageSync('longitude')),
      curPage:this.data.curPage,
      pageSize:this.data.pageSize
    }
    console.log(data)
    pmsList(data).then(res => { // 接口格式需要调整
      console.log(res)
      let TuijHotel=[]
      if (this.data.curPage == 1) {
        TuijHotel = res.data.list;
      } else {
        TuijHotel = this.data.TuijHotel.concat(res.data.list);
        if (res.data.list == 0 && TuijHotel.length != 0) {
          wx.showToast({
            title: '没有更多了',
            icon:'none'
          })
        }
      }
      this.setData({
        TuijHotel: TuijHotel,
        warnMsg:res.data.warnMsg
      })
    })
  },
  to_tuijian(e) { // 去推荐的酒店
    if (wx.getStorageSync('memberId')) {
      wx.setStorageSync('dealerId', e.currentTarget.dataset.dealerid)

      wx.redirectTo({
        url: '/pages/index/index',
      })
      this.to_tuijian()
    } else {
      wx.navigateTo({
        url: '/pages/login/index'
      })
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
  onReachBottom: function () {
    let page = this.data.curPage;
    page++;

    this.setData({
      curPage: page
    })
    this.getTuijHotel()
  }
})