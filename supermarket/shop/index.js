//index.js
//获取应用实例
import {wxRequest} from '../../utils/request'
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    shopData:[],
    shid:"",//商户id
    hasUserInfo: false,
    nickName:""
  },
  nextUrl(e){
    console.log(e);
 
    let obj =  e.currentTarget.dataset.obj
    wx.navigateTo({
      url: "/supermarket/shop/detail/index?sid="+obj.id+"&shopid="+wx.getStorageSync("shid")+"&dealerId="+wx.getStorageSync("dealerId")
    });
  }, 
  getMallList(){
    //获取客房列表
    app.wxapp.showLoading();
    let self = this;
    let shid = self.data.shid;
    wxRequest({
      url:"/apimall/mall/polymerize/query?pageSize=10&dealerId="+wx.getStorageSync("dealerId")+"&curPage=1"
    }).then(res=>{
      console.log("请求成功",res);

      let data = res.docs;
      data.forEach((val,index)=>{

        self.getMallDetail(val.productId);
      })

      app.wxapp.hideLoading();

    }).catch(err=>{
      console.log("请求失败",err);
      app.wxapp.hideLoading();
    })
    
  },
  getMallDetail(id){

    //获取客房列表
    let self = this;
    wxRequest({
      url:"/apimall/mall/polymerize/"+id
    }).then(res=>{
      console.log("请求成功1111",res);
       let _res = res;
        let shopData = self.data.shopData;
        
        shopData.push({
          id:_res.id,
          name:_res.name,
          price:(_res.skuInfo['skuList'][0].price/100).toFixed(2),
          imgList:_res.imageList
        })
      this.setData({
        shopData
      })
  

    }).catch(err=>{
      console.log("请求失败",err);

    })
    
  },

  onLoad(query){
    this.setData({ 
      nickName:wx.getStorageSync('userinfostr').nickName
    })
    console.log(query.options,"分享参数",query.dealerId)
    if (query.options) {
      wx.setStorageSync('inviteCode', query.options);
    }
    if (query.dealerId) {
      wx.setStorageSync('dealerId', query.dealerId);
    }
    if(wx.getStorageSync("memberld")){ 
      wx.redirectTo({
        url: '/pages/index/index'
      })
    }
    else{ 
    
    }
    let {shid,dealerId} = query;
    let storageQuery = {
        "shid":shid,
        "dealerId":dealerId
    }
    let backurl = "/supermarket/shop/index?shid="+shid+"&dealerId="+dealerId;
    wx.setStorageSync("shid", shid);
    this.setData({
      shid
    })
    this.getMallList();
  }
})
