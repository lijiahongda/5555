import{ajaxApplyCopyWriting,ajaxApplyGroupAssistant} from '../../../../api/Community'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:{},
    oneStep:{},
    twoStep:{},
    threeStep:{},
    step:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      groupId: options.groupId
    })
    this.getData()
  },

  getData() {
    let that = this,
      data = {
        groupId: this.data.groupId,
        mid: this.data.uid
      }
      ajaxApplyCopyWriting(data).then(res=>{

        if (res.code == 200) {
          res.data.oneStep.content = res.data.oneStep.content.split('\n')
          res.data.twoStep.content = res.data.twoStep.content.split('\n')
          res.data.threeStep[1].content = res.data.threeStep[1].content.split('\n')
          res.data.threeStep[2].content = res.data.threeStep[2].content.split('\n')
          that.setData({
            data: res.data,
            oneStep: res.data.oneStep,
            twoStep: res.data.twoStep,
            threeStep: res.data.threeStep,
            content: res.data.threeStep[0].content
          })
        }
      })
  },

  apply(){
    let that = this,
      params = {
        groupId: this.data.groupId,
        mid: wx.getStorageSync("memberId")
      }
    wx.showModal({
      title: '请确认群您的群人数',
      content: '您的群人数大于等于' + this.data.data.userNum + '人',
      success(res) {
        if (res.confirm) {
          ajaxApplyGroupAssistant(params).then(res=>{


            if (res.code == 200) {
              that.setData({
                step: that.data.step + 1,
                number: res.data.assistantWx
              })
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none'
              })
            }

          })
        }
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

  next(){
    let that=this
    wx.showModal({
      title: '请确认群名称已修改',
      content: '请确认群名称已修改为【' + this.data.data.groupName +'】否则无法成功开通助理哦~',
      success(res) {
        if (res.confirm) {
          that.setData({
            step: that.data.step + 1
          })
        } else if (res.cancel) {
          
        }
      }
    })
  },

  pre(){
    this.setData({
      step: this.data.step - 1
    })
  }


})