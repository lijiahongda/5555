//index.js
//获取应用实例
import {wxRequest} from '../../utils/request'
const app = getApp()

Page({
  data: {
    mobile:"",
    smsCode:"",
    sendStatus:0,
    timeNum:60
  },
  onLoad(){
    console.log(app);
  },
  handleInput(e){
    // console.log("eeee",e)
    let type = e.currentTarget.dataset.type;
    this.setData({
     [type]:e.detail.value
    })
  },

  handleBindPhone(){
    //登录
    if (this.checkPhone()) {
      //如果手机号格式正确 执行  不正确的话 会自动弹出提示信息
     let self = this;
     let params = {
       mobile:self.data.mobile,
       smsCode:self.data.smsCode,
       subWechatDto: {
        ylhUnionid:wx.getStorageSync("openid"),
        openId: wx.getStorageSync("openid")
      }
     };


    
     wxRequest({
      url:"/api/customer/wechat/register",
      method:"post",
      contentType:"application/json",
      data:params
     }).then(res=>{

      let params = {
        dealerId:wx.getStorageSync("dealerId"),
        openId: wx.getStorageSync("openid"),
        loginLogDto: {}
      };
      wxRequest({
        method: "post",
        url: "/api/customer/login/wechat",
        data: params,
        contentType:"application/json;charset=UTF-8"
      }).then(res=>{
        console.log("自动登录成功",res);
        wx.showToast({
          title: '绑定成功',
          icon: 'none'
        });
         let access_token = res.access_token;
         wx.setStorageSync("token", access_token);
         wx.setStorageSync("userinfostr",res.response.data)
         wx.setStorageSync("memberId",res.response.data.customerId);    

          wx.reLaunch({
            url: wx.getStorageSync("backurl")
          });

      }).catch(err=>{

      })

     



      // console.log("----------",res.data.response);
      // let _res = res.data.response['response']['data'];
      // debugger;
      // console.log("绑定的信息",res.data.response);
      // let access_token = res.data.response.access_token;
      // wx.setStorageSync("token", access_token);
      // wx.setStorageSync("userinfostr",res.data.response.response.data)
      // wx.setStorageSync("memberId",res.data.response.response.data.memberId);     
      // wx.hideLoading();
      // wx.redirectTo({
      //   url: wx.getStorageSync("backurl")
      // });
     }).catch(err=>{
      console.log("catch",err);

      wx.showToast({
        title:'亲，',
        icon:"none"
      })


    



     })
    }
  },
  checkPhone() {
    var phone = this.data.mobile;
    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(phone)) {
      wx.showToast({
        title: '请填写正确的手机号',
        icon: 'none',
      });
      return false;
    } else {
      console.log("手机号格式正确");
      return true;
    }
  },
  handleSend() {
    let self = this;

    if (this.checkPhone()) {
      self.setData({
        sendStatus:1
      })

      // self.setData({
      //   sendStatus:1
      // })
      // this.dgNum();
      wxRequest({
        url:"/api/customer/send/code?mobile=" + self.data.mobile,
       }).then(response=>{
      
        this.dgNum();

       }).catch(err=>{
        self.setData({
          sendStatus:1
        })
       })
    }
  },
  dgNum() {
    setTimeout(() => {
      let timeNum = this.data.timeNum;
      timeNum--;
      this.setData({
        timeNum:timeNum
      })
      if (this.data.timeNum == 0) {

        this.setData({
          timeNum:60,
          sendStatus:0
        })
      } else {
        this.dgNum();
      }
    }, 1000);
  },
})
