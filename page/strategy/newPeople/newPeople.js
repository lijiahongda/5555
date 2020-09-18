
import WxParse from "../../../wxParse/wxParse"
import {ajaxNewList} from "../../../api/strategyApi"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: { // 属性名
      type: String,
      value: ''
    },
    hGroup:{
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    list:[],
    articleList:[]
  },
  pageLifetimes: {
    show: function () {
      console.log('----+++')
      this.getData()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    openMember() {
      wx.switchTab({
        url: '/page/EliteCard/EliteCard',
      })
    },
    goGroupUp(e){
      wx.navigateTo({
        url: '/page/Community/pages/groupUp/groupUp?status=' + e.currentTarget.dataset.status,
      })
    },
    getData(){
      let that=this
      this.setData({
        uid:wx.getStorageSync('uid'),
        token:wx.getStorageSync('token')
      })
      let data={
        source:app.globalData.robotSource
      }
      // 刷新个人信息
      wx.showLoading({
        title: '加载中',
      })


      ajaxNewList(data).then(res=>{
        console.log("this.properties-------",this.properties);
        if (res.code == 200) {
          console.log('调取新人上手api')
          // 富文本解析
          let list = res.data
          list.forEach((obj,index)=>{
              WxParse.wxParse('article' + index, 'html', obj.content, that, 5);
              obj.richText = that.data['article' + index]
          })


            that.setData({
              list:list
            })
          
         
        }
      })
    },
    copy: function (e) {
      wx.setClipboardData({
        data: e.currentTarget.dataset.text,
        success(res) {
          wx.getClipboardData({
            success(res) { }
          })
        },
        complete(res) { }
      })
    },
    gray(){
      wx.showToast({
        title: '建群后才可申请开通助理',
        icon: 'none'
      })
    },
    goVideo(e){
      wx.navigateTo({
        url: '/page/Community/pages/webVideo/webVideo?url=' + e.currentTarget.dataset.url,
      })
    },
    goIndex(){
      wx.navigateTo({
        url: '/page/Community/pages/myGroup/myGroup',
      })
    }

  }
})
