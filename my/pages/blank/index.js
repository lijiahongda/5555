// my/pages/blank/index.js
import {
  wxRequest 
} from "../../../utils/req"
import myTime from '../../../utils/mytime';
import {memberCard, memberCardDetail} from '../../../api/personal'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member_img:"https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-07-11/18/yuelvhuilzO17YqWcx1594463112.png",
    jointly_img:'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-07-11/18/yuelvhuicTcR9k3Qjo1594463053.png',
    vipBg:[
      'http://image.zhiding365.com/2020/7/23/d475f49c-62a2-487d-a786-1a0fd9550992.png',
      'http://image.zhiding365.com/2020/7/23/8b22ec14-ee49-4f25-889d-2bc47eaedafb.png'
    ],
    cardList: [],
    cardDetail: {},
    hidePop: true
  },

  apply:function(e){ // 渲染数据
    let that = this;
    let memberId = wx.getStorageSync("memberId");
    let params ={
      memberId:memberId,
      dealerId:0
    }
    wxRequest({
      method: "get",
      url: "/api/admin/card/get/all/cardlist",
      data: params
    }).then(res =>{
      console.log(res)
      if(res.cardInfoListDTO.length == 0 && res.dealerCardList.length == 0){
        that.setData({
          not:true
        })
      }else{
        for(var i=0;i<res.cardInfoListDTO.length;i++){
          res.cardInfoListDTO[i].createTime = myTime.formatTimeTwo(res.cardInfoListDTO[i].createTime/1000,'Y-M-D h:m:s')
        }
        for(var i=0;i<res.dealerCardList.length;i++){
          res.dealerCardList[i].createTime = myTime.formatTimeTwo(res.dealerCardList[i].createTime/1000,'Y-M-D h:m:s')
        }
        that.setData({
          applyList:res.cardInfoListDTO,
          dealerCardList:res.dealerCardList,
          not:false
        })
      }
    })
  },

  getMemberCard(){
    let data = {
      memberId: wx.getStorageSync('memberId')
      // memberId: 1073190
    }
    memberCard(data).then(res => {
      if(res.code == 200 && res.data){
        this.setData({
          cardList: res.data.cardInfoListDTO || []
        })
      }
    })
  },

  getCardDetail(e){
    let data = {
      cardId: e.currentTarget.dataset.cardid,
      memberId: wx.getStorageSync('memberId')
      // cardId: 51,
      // memberId: 1073190
    }
    memberCardDetail(data).then(res => {
      if(res.code == 200){
        this.setData({
          cardDetail: res.data || {},
          hidePop: false
        })
      }
    })
  },

  hides(){
    this.setData({
      hidePop: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let that = this;
    // that.apply();
    this.getMemberCard()
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
   console.log("1")
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

  }
})