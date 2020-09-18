// page/My/My.js
const app = getApp();
import {ajaxUserCenter,ajaxTopShop,ajaxCouponList,ajaxMaskCouponList,ajaxSy,ajaxMyTeacherWx} from '../../../../api/Community'


Page({
  /**
   * 页面的初始数据
   */
  data: {
    isExclusiveRobot:0, //1是有专属机器人 0是没有 
    notUsedNum:0,
    showstatus:0,
    posterUrl:'',
    showstatusPoster:0,//海报显示的状态
    titleStatus: 0,
    fixTop: 0,
    navTop: 0,
    mTop: 0,
    UserData:'',
    shopData:[],
    notUsed:[],
    couponData:'',
    syObj:"",
    teacherWxCode:'',
  },

  nextPage(e){
    console.log(e);
    let {ourl = ''} =  e.currentTarget.dataset
   
    if (wx.getStorageSync("uid")) {
      wx.navigateTo({
        url: ourl,
      });
    } else {
      this.login();
    }
  },
  handleGuanjia(){
    //小悦管家点击事件
    let content = this.data.teacherWxCode;
    wx.showModal({
      title: '导师微信号',
      content: content,
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          wx.setClipboardData({
            data: content,
            success(res) {
              wx.getClipboardData({
                success(res) { }
              })
            },
            complete(res) { }
          })
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });


  },
  handleShowstatus(){
    this.setData({
      showstatus:1
    })
  },
  handleCallBack(){
    this.setData({
      showstatus:0
    })
  },
  handleCopyCode(e){
    //复制悦淘号点击事件
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
  getAllCouponList(){
    let that = this;
    ajaxCouponList().then(res=>{
      if(res.code == 200){


        let notUsed = res.data.notUsed;
        console.log("又回去",notUsed);
        let _arr = notUsed.map(val=>{
          let time = val.entTime.split("-");
          val['newendtime'] = time[1]+"-"+time[2];
          return val;
        })
        that.setData({
          notUsed: _arr
        })




      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });
      }
    })
    
  },
  getSy(){
    //获取个人收益
    let that = this;
    ajaxSy().then(res=>{
      console.log("收益",res)
      if(res.code == 200){
        that.setData({
          syObj:res.data
        })
      }
    })
  },
  getMyteacher(){
    ajaxMyTeacherWx().then(res=>{
      if(res.code == 200){
          this.setData({
            teacherWxCode:res.data
          })
      }
    })
  },
  getCouponList: function() {
    wx.showLoading({
      title: "加载中",
      mask: true,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
    let that = this;
    wx.hideLoading();

    ajaxMaskCouponList().then(res=>{
    
      if(res.data.length){

  

      let notUsedNum = res.data.notUsedNum;
    
      that.setData({

        notUsedNum
      })
      
      console.log("即将过期的优惠券",_arr);

    }

    })
  },
  getTopShop(){
    //获取排名前10位商品



    let params = {
      mid: wx.getStorageSync('uid'),
      page: 1,
      pageSize: 10
    }
    ajaxTopShop(params).then(res=>{

      console.log(res);
      if(res.code == 200){
          if(res.data.length){
            let shopData = res.data.map((val,index) =>{
              let oneData = {
                id:val.goodsId, //商品id
                skuid:val.skuId,
                type:val.type,
                goods_type:val.type,
                name:val.goodsName,
                minilogo:'',
                sortIndex:index * 1 +1, //排序
                picurl:val.imgPath,   //商品图片
                progress_num:"empty", //如果不显示进度条 传个字符窜 empty
                coupon:[], //优惠券放在数组里，避免以后出现多个优惠券的情况  结构  {name:"",id:""}
                comment_num:"empty", //评论数量
                avatar:[], //购买人的头像 结构 {url:""}
                buy_num:val.count,//已购买人数
                oprice:val.price,//原价
                vipPrice:val.buyPrice,//现价
                promote_price:val.femalesPrice,//推广赚多少钱  如果不显示这个数据 请传字符串 empty
                btntype:['copy','share','buy']
              }
              return oneData;
            })
            this.setData({shopData})
          }
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
          mask: true
        });
      }
    })
  },
  handleCopy: function (e) {
    if (e.detail.goods_type == 1) {//自营
      this.shopGoodsCopyText(e.detail.id,e.detail.skuid)
    } else if (e.detail.goods_type == 2) {//京东
      this.dataInitShare(e.detail.id, e.detail.picurl, 1)
    } else if (e.detail.goods_type == 3) {//拼多多
      this.pddGoodsShareData(e.detail.id, e.detail.picurl, 1)
    }
},
handleShare:function (e){
  // if (e.detail.goods_type == 1) {//自营
  //   this.shopGoodsShare(wx.getStorageSync('uid'), e.detail.id, e.detail.skuid, 1, e.detail.id, e.detail.picurl, '', 1)
  // } else if (e.detail.goods_type == 2) {//京东
  //   this.dataInitShare(e.detail.id,e.detail.picurl, 2)
  // } else if (e.detail.goods_type == 3) {//拼多多
  //   this.pddGoodsShareData(e.detail.id, e.detail.picurl, 2)
  // }
},
  getUserCenter(){
    //获取用户中心数据
    
    ajaxUserCenter().then(res=>{
      if(res.code == 200){
        this.setData({
          UserData:res.data
        })
        wx.setStorageSync('vipname',res.data.levelText );
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1500,
          mask: true
        });
          
      }
      wx.hideLoading();
    })



  },

  handleBuy(e){

    console.log(e);
    let obj = e.detail;

    if(obj.type == 1){
      //自营
      wx.navigateTo({
        url:"/page/shopDetails/shopDetails?goodsId="+obj.id+"&skuid="+obj.skuid
      })
    }else if(obj.type == 2){
      //京东
      wx.navigateTo({
          url:"/page/yuemall/pages/JDUnionDetail/JDUnionDetail?goods_id="+e.detail.id
      })
    }else if(obj.type == 3){
      //拼多多
      wx.navigateTo({
        url:"/page/yuemall/pages/pddDetails/pddDetails?goodsId="+e.detail.id
      })


    }
    return;
   

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    wx.showLoading({
      title: "努力加载中",
      mask: true
    });

    let that = this;
    // 胶囊位计算
    app.navTop(function (res) {
      that.setData({
        fixTop: res.navTop - 16,
        navTop: res.navTop + 44,
        mTop: res.navTop + 44 + res.navTop - 20,
      });
    });
    if(wx.getStorageSync("uid")){
      this.getTopShop();
    }else{

       wx.navigateTo({
        url: '/page/MyOther/pages/VerificationCode/VerificationCode'
      })
    }
  },
  onShow(){

    if(wx.getStorageSync('uid')){
      this.setData({
        isExclusiveRobot:app.globalData.isExclusiveRobot
      })
      this.getSy();
      this.getCouponList();
      this.getMyteacher();
      this.getUserCenter();
      this.getAllCouponList();
    }else{
     
    }
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
    let that = this;
    // console.log(pagey);
    if (obj.scrollTop > 10) {
      that.setData({
        titleStatus: 1,
      });
    } else {
      that.setData({
        titleStatus: 0,
      });
    }
  },
});
