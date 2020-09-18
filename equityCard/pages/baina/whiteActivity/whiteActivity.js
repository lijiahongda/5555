// import {
//   freeActivity
// } from '../../../../utils/mall.js';
// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {
//     data:{}
//   },

//   // 获取海报
//   freeActivity(){
//     freeActivity().then(res=>{
//       if (res.code == 200){
//         this.setData({
//           data:res.data
//         })
//       }
//     })
//   },

//   // 去白拿列表
//   goList(){
//     wx.navigateTo({
//       url: '/page/mall/pages/whiteWith/whiteWith',
//     })
//   },

//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {
//     this.freeActivity()
//   }
// })