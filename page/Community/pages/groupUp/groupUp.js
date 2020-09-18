const app =getApp();
import {
  ajaxUpgrade,
  ajaxGroupList,
  ajaxApplyCopyWriting,
  ajaxGroupAssistantV2,
  ajaxGroupStep
} from '../../../../api/Community'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mengceng:0,
    data: {},
    stepActive: 1,
    adopt: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-07-29/20/yuelvhui9nR63cqmWc1596026067.png',
    fail: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-07-29/20/yuelvhuiDJzNMG6gAM1596026157.png',
    group_id: '',
    isOnePopup: false
  },
  // 点击申请
  ClickApply: function () {
    this.setData({
      isOnePopup: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    this.setData({
      uid: wx.getStorageSync('memberId'),
      token: wx.getStorageSync('token'),
      status: options.status,
      group_id:options.groupId,
      stepActive:options.status
    })


   
    let data = {
      mid: this.data.uid,
      source: app.globalData.robotSource,
    }

    if(options.status == 1){
      //第一步获取创建群信息 2 3部不需要走她了
      ajaxUpgrade(data).then(res => {
        if (res.code == 200) {
          that.setData({
            data: res.data,
            group_id: res.data.groupId,
            upgradeContent: res.data.upgradeContent
          })
          let params = {
            groupId:this.data.group_id,
            source:app.globalData.robotSource,
            mid:wx.getStorageSync("memberId"),
            examine_step:options.status
          }
          ajaxGroupStep(params).then(res=>{
            if(res.code == 200){
              if(options.status == 3){
                  this.getZlWx();
              }
            }
          })
        
        }else{
          this.setData({
            mengceng:1
          })
          // wx.showToast({
          //   title: res.msg,
          //   icon: 'none'
          // });
          wx.showModal({
            title: res.msg,
            content: '',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '确定',
            confirmColor: '#3CC51F'
          });
        }
      })
    }else {
      let params = {
        groupId:this.data.group_id,
        source:app.globalData.robotSource,
        mid:wx.getStorageSync("memberId"),
        examine_step:options.status
      }
      ajaxGroupStep(params).then(res=>{
        if(res.code == 200){
          if(options.status == 3){
            this.getZlWx();
          }
        }
      })
    }

   
  },
  // 下一步
  nextStep: function (e) {
    let {
      stepactive
    } = e.currentTarget.dataset
    if (stepactive == 1) {//第一步
      this.setData({
        isOnePopup: true
      })
    }
    if (stepactive == 2) {//第二步
      this.setData({
        stepActive: 1
      })
    }
  },
  getZlWx(){
    let params = {
      mid: wx.getStorageSync("memberId"),
      source:app.globalData.robotSource
    }
    ajaxGroupAssistantV2(params).then(res=>{
      console.log("助理微信",res.data.assistantWx);
      if(res.code == 200){
        this.setData({
          stepActive: 3,
          assistantWx:res.data.assistantWx
        })
      }
    })
  },
  onShow() {
    this.getData()
    // this.getZlWx();//获取助理微信
  },
  // 复制
  copy: function (e) {
    let that = this
    let {
      type
    } = e.currentTarget.dataset
    wx.setClipboardData({
      data: type == 3 ? this.data.assistantWx : this.data.groupName,
      success(res) {
        wx.getClipboardData({
          success(res) {
            if (type == 3) {
              that.setData({
                isOnePopup: true
              })
            }
          }
        })
      },
      complete(res) {}
    })
  },
  // 取消第一步弹窗
  clickOnePopup: function (e) {
    let {
      type
    } = e.currentTarget.dataset
    if (type == 2) { //确认按钮
      console.log(this.data.stepActive)
      if (this.data.stepActive == 1) { //点击第一步弹窗确认按钮
        let params = {
          groupId:this.data.groupId,
          source:app.globalData.robotSource,
          mid:wx.getStorageSync("memberId"),
          examine_step :2
        }
        ajaxGroupStep(params).then(res=>{
          console.log(res);
          if(res.code == 200){
            this.setData({
              stepActive: 2
            })
          }
        })  
      } else if (this.data.stepActive == 2) { //点击第二步弹窗确认按钮
        // this.setData({
        //   stepActive: 3
        // })

        let params = {
          groupId:this.data.group_id,
          source:app.globalData.robotSource,
          mid:wx.getStorageSync("memberId"),
          examine_step :3
        }
        ajaxGroupStep(params).then(res=>{
          console.log(res);
          if(res.code == 200){
            this.getZlWx();
            this.setData({
              stepActive: 2
            })
          }
        })  
       
      }else if(this.data.stepActive == 3){//点击第三步弹窗确认按钮 
        wx.switchTab({
          url: '/page/strategy/index/index'
        })
      }
    }
    this.setData({
      isOnePopup: false
    })
  },
  getData() {
    let that = this,
      data = {
        mid: wx.getStorageSync("memberId"),
        source: app.globalData.robotSource,
      }
    wx.showLoading({
      title: '加载中',
    })
    ajaxApplyCopyWriting({
      mid: wx.getStorageSync('memberId'),
      source: app.globalData.robotSource
    }).then(res => {
      if (res.code == 200) {
        that.setData({
          oneStep: res.data.oneStep,
          twoStep: res.data.twoStep,
          threeStep: res.data.threeStep,
          groupName: res.data.groupName,
          usernum:res.data.userNum
        })
      }
      wx.hideLoading();
    })
    ajaxGroupList({
      "type": 1,
      "mid": wx.getStorageSync('memberId'),
      "source": app.globalData.robotSource,
      "group_id": that.data.group_id
    }).then(res => {
      if (res.code == 200) {
        // that.setData({
        //   stepActive: res.data.examine_step == 0 ? 1 : res.data.examine_step == 1 ? 1 : res.data.examine_step == 2 ? 2 : 1
        // })
        // that.setData({
        //   stepActive:res.data.examine_step == 0 ? 1 :res.data.examine_step
        // })
      }
    })
    

  }
})