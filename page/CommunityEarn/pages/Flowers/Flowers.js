
import{ajaxFlowersList} from '../../../../api/CommunityEarn'
const app = getApp();


Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabDataIndex:0,
    params:{
      page:1,
      type:2,
      memberId:wx.getStorageSync("memberId"),
    },
    flowerData:[],
    tabData:[
      {
        name:"我的注册用户",
        id:0,
        status:2
      },
      {
        name:"我的下级群主",
        id:1,
        status:1
      }
    ],
  },
  handleTabMy(e){
    let {id,status} =  e.currentTarget.dataset;
     this.setData({
       tabDataIndex:id,
       "params.type":status,
       "params.page":1,
       flowerData:[]
     })
     this.getFlowersList();
  },
  getFlowersList(){
    let params = this.data.params;
    ajaxFlowersList(params).then(res=>{
      if(res.code == 200){
          this.setData({
            flowerData:this.data.flowerData.concat(res.data.list)   
          })
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
          image: '',
          duration: 1500
        });

      }



    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getFlowersList();
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
  onReachBottom: function () {},
  onPageScroll(obj) {
  
  },
});
