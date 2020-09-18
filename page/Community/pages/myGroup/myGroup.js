import {ajaxGroupList} from '../../../../api/Community'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:1, // 1-直推群；2-间推群
    page:1,
    data:{}, 
    list:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      uid: wx.getStorageSync('memberId'),
      token: wx.getStorageSync('token')
    })
  },
  onShow(){
    this.getData()
  },
  handleNextTab(e){
      let obj = e.currentTarget.dataset.item;
      console.log(obj.examine_step);
      let step = obj.examine_step * 1 +1;
      let gid = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/page/Community/pages/groupUp/groupUp?status='+step+"&groupId="+gid,
      })
  },


  getData() {
    let that = this;
    let  data = {
        type: this.data.type,  //列表类型 1直推群 2间推群
        page: this.data.page, //页数
        pageSize: 20, //一页展示数
        mid: this.data.uid,
        source:1,
      };

      ajaxGroupList(data).then(res=>{

        if (res.code == 200) {
          this.setData({
            data:res.data
          })
          if(this.data.page == 1){
            that.setData({
             
              list: res.data.list
            })
          }else{
            that.setData({
            
              list: this.data.list.concat(res.data.list)
            })
          }
         
        }
      }).catch(err=>{
        console.log(err);
        wx.showToast({
          "title":"网络请求超时",
          "icon":"none"
        })
      })
    
  },

  // 升级群
  upLv(e) {
    let that = this,
      data = {
        groupId: e.currentTarget.dataset.groupid,
        mid: this.data.uid
      }
      ajaxApplyReviewV2(data).then(res=>{
        if (res.code == 200) {
          that.setData({
            page: 1,
            list: []
          })
          that.getData()
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
  },

  goGroupUp() {
    wx.navigateTo({
      url: '/page/Community/pages/groupUp/groupUp?status=1',
    })
  },

  goOpen(e){
    wx.navigateTo({
      url: '/page/Community/pages/openAssistant/openAssistant?groupId=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      page: this.data.page+1,
    })
    this.getData()
  },
  // onPullDownRefresh(){
  //   wx.startPullDownRefresh();

  //   this.setData({
  //     page: 1
  //   })
  //   this.getData()
  //   wx.stopPullDownRefresh();
  // }
  
})