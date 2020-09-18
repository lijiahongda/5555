
import {ajaxWalListHistory} from "../../../../api/Wallet"
const app = getApp();


Page({
  /**
   * 页面的初始数据
   */
  data: {
    oList:[],
    params:{
      page:1,
      pageSum:10
    }
  },
  getWalletHistory(){
    let params = this.data.params;
    ajaxWalListHistory(params).then(res=>{

      if(res.code == 200){

        let oList = this.data.oList.concat(res.data.list);
        this.setData({
          oList
        })
      }else{

        wx.showToast({
          title: res.msg,
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
          success: (result)=>{
            
          },
          fail: ()=>{},
          complete: ()=>{}
        });

      }


    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWalletHistory();
  },
  onShow(){

    
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

 

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
   this.setData({
     "params.page":this.data.params.page+1
   })
   this.getWalletHistory();
  },
  onPageScroll(obj) {
  
  },
});
