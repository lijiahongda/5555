import {
  wxRequest
} from "../../../utils/req"
import {elmCover,elmTkl,elmPoster} from "../../../api/cps"
import {
  retrunScene,
  getCardCode
} from "../../../utils/public"
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  getData(){
    let that=this,
      data={
        mid:wx.getStorageSync('memberId')
      }
      elmCover(data).then(res => {
      console.log(res,'444444')
        that.setData({
          bg: res.data.coverBg,
          ruleDesc:res.data.ruleDesc,
          shareDesc:res.data.shareDesc,
          wechatIcon:res.data.wechatIcon,
          elmCoupon:res.data.elmCoupon,
          elmXcxPath:res.data.elmXcxPath
        })
    })
    
  },
  clonetkl(){
   let data={
      mid:wx.getStorageSync('memberId')
    }
    elmTkl(data).then(res=>{
      console.log(res,'9999999')
      wx.setClipboardData({
        //准备复制的数据
        data: res.data,
        success: function(res) {
          wx.showToast({
            title: '复制成功',
          });
        }
      })
    })
  },
  go(){
    let that=this
    console.log(that.data.elmXcxPath)
    wx.navigateToMiniProgram({
      appId: 'wxece3a9a4c82f58c9',
      path: that.data.elmXcxPath,
      extraData: {

      },
      envVersion: 'release',
      success(res) {
        // 打开成功
      }
    })
  },
  showversion(){
    wxRequest({
      method: 'get',
      url: "/api/vip/card/version/upgrade/show",
      data: {
        version:'1.0.28',
      }
    }).then(res => {
      console.log(res)
      wx.hideLoading()
      this.setData({
        showversion: res.show,
      })
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  shareTB(){
    //生成海报

    wx.showLoading({
      title: '海报生成中',
      mask: true
    });
    let params = {
      mid:wx.getStorageSync('memberId'),
      inviteCode:wx.getStorageSync('mYinviteCode')
    }
    elmPoster(params).then(res => {
      console.log(res,'resresresres')
      this.setData({
        posterObj:{
          status:1,
          url:res.data.img
        }
    })
    wx.hideLoading();
   })
  },
  handleBox(){
    //隐藏海报和分享的弹窗
    let _key = "posterObj.status"
    this.setData({
      [_key]:0,
      shareSelectStatus:0
    })
  },
  // 手机号验证码
  VerificationCode: function () {
    let that=this
    wx.navigateTo({
      url: '/page/Yuemall/pages/VerificationCode/VerificationCode?codeNumber' + that.data.codeNumber
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  onShow(){
    let that = this;
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let options = currentPage.options;

    if (options.scene != null) {
      retrunScene(options.scene, function (sceneObj) {


        console.log(sceneObj,'sceneObjsceneObjsceneObj')
        wx.setStorageSync("inviteCode", sceneObj.C);


        if (wx.getStorageSync('memberId')) {
          that.getData()
        } else {
          wx.navigateTo({
            url: '/pages/login/index'
          })
        }
        that.showversion()


      });
    } else {
      console.log('111111111111')
      wx.setStorageSync('inviteCode', options.reCode)
      wx.setStorageSync('elm', 1)
      console.log(wx.getStorageSync('inviteCode'),'inviteCode')
      if (wx.getStorageSync('memberId')) {
        that.getData()
        
      } else {
        wx.navigateTo({
          url: '/pages/login/index'
        })
      }
      that.showversion()
    }


    
  },



  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log('/equityCard/pages/ELM/ELM?reCode=' + wx.getStorageSync('mYinviteCode'))
    return {
      title: this.data.shareDesc.title,
      path: '/equityCard/pages/ELM/ELM?reCode=' + wx.getStorageSync('mYinviteCode'),
      imageUrl:this.data.shareDesc.image
    }
  } 
})