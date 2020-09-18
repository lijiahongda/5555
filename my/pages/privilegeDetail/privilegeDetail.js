// my/pages/privilegeDetail/privilegeDetail.js
import {
  getPrivilegeList,
} from '../../../api/personal'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabAct:0,
    atabAct:''
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      tabAct:options.id,
      atabAct:'a'+options.id,
      cardId:options.cardId,
      cpsCustomerId:options.cpsCustomerId,
      adminId:options.adminId,
    })
    this.getList()
  },
  // 列表
  getList: function () {
    getPrivilegeList({}).then(res => {
      console.log(res)
      let tabList = []
      for(let s of res.data){
        tabList.push({
          icon:s.image,
          title:s.title,
        })
      }
      console.log(tabList,'tabList')
      this.setData({
        list: res.data,
        tabList:tabList
      })
    })
  },
  open() {
    let that = this;
    wx.navigateTo({
      url: '/my/pages/vipcardCreate/index?cardId=' +that.data.cardId + "&cpsCustomerId=" + that.data.cpsCustomerId+'&adminId='+that.data.adminId
    })
  },
  setTab: function (e) {
    console.log(e,'eee')

    this.setData({
      tabAct: e.currentTarget.dataset.idx,
      atabAct:'a'+e.currentTarget.dataset.idx
    })
  },
  // 滑动
  bindchange:function(e){
    this.setData({
      tabAct:e.detail.current,
      atabAct:'a'+e.detail.current,
    })
  }
})