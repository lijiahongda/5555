// page/community/pages/payment/Recharge/index.js
import {
  post
} from '../../../../../utils/util.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textValue:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.openagreement()
  }, 
  // 打开协议弹窗
  openagreement() {
    // 刷新个人信息
    post('/app/getBalanceRule', {}, (res) => {
      if (res.data.code == 200) {
        this.setData({
          textValue: res.data.data.str,
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 1)
  }
})