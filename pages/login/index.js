// pages/login/index.js
import { getOpenId,weChatLogin,updateUserInfo } from "../../api/login.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    backImg:'',
    backImgList:['http://image.zhiding365.com/2020/8/6/efa2e35f-da97-46a5-bb76-fcd1c142c9b4.jpg','http://image.zhiding365.com/2020/8/6/c563cf14-274e-42d3-9b98-e6f49e2f0715.jpg'],
    longPhone:true,
    isauthorization:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let screen = wx.getSystemInfoSync().screenWidth/wx.getSystemInfoSync().screenHeight
    this.setData({
      backImg: screen < 750/1334 ? this.data.backImgList[1] : this.data.backImgList[0], // 0-短图，1-长图
      longPhone: screen < 750/1334 ? true : false
    })
    this.getjw()
  },
  loginout(){
    wx.switchTab({
      url: '/pages/home/index',
    })
  },
  wxLogin(ev){
    let that = this
    console.log(ev,'evevevev')
    if(!ev.detail.encryptedData){
      return
    }
    wx.login({
      success(loginRes) {
        getOpenId({
          "code": loginRes.code,
        }).then(res => {
          wx.setStorageSync('openId', res.data.opedId)
          let data = {
            encryptedData:ev.detail.encryptedData,
            iv:ev.detail.iv,
            dealerId:0,	//酒店id 默认可以传0	
            openId:res.data.opedId,	//用户openid
            inviteCode:wx.getStorageSync('inviteCode'),	//非必须 邀请该用户的邀请码
            adminId:'',	//非必须 邀请该用户的邀请码  扫码登录
          }
          weChatLogin(data).then(resNew => {
            console.log(data,resNew,'zhelishi fanzhi adfase')
            wx.setStorageSync('mYinviteCode', resNew.data.inviteCode)
            wx.setStorageSync('customerId', resNew.data.customerId)
            wx.setStorageSync('memberId', resNew.data.memberId)
            wx.setStorageSync('token', resNew.data.access_token)
            wx.setStorageSync('isVip', resNew.data.memberSubDto.identity==0 ? false : true) // 是否是会员
            // 后期要改掉
            wx.setStorageSync('userinfostr', resNew.data)


            // 新用户弹框
            if(resNew.data.status==2){
              that.setData({
                isauthorization:true
              })
              return
            }


            if (wx.getStorageSync('dealerId')) {
              that.goUrl()
            } else {
              console.log('-------333333',wx.getStorageSync('jd'))
              if(wx.getStorageSync('jd')){
                wx.navigateBack({//返回
                  delta: 1
                })
              }else if(wx.getStorageSync('elm')){
                wx.navigateBack({//返回
                  delta: 1
                })
              }else{
                wx.switchTab({
                  url: '/pages/home/index',
                })
              }
            }
          })
        })
      }
    })
  },


  // 新用户 获取头像
  getPerson:function(){
    var that = this;

    wx.getSetting({
      success: function (resCont) {
        if (resCont.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.login({
            success: function (loginRes) {
              console.log(loginRes,'loginRes')
              wx.getUserInfo({
                success: function (resNew) {
                  console.log(resNew,'resNew')
                  updateUserInfo({
                    openId:wx.getStorageSync('openId'),//用户openId	
                    rawData:resNew.rawData,
                    signature:resNew.signature,
                    encryptedData:resNew.encryptedData,
                    iv:resNew.iv,
                    memberId:wx.getStorageSync('memberId'),//用户memberId
                  }).then(res=>{
                      console.log(res,'这里是结果')

                      wx.setStorageSync('userinfostr', resNew.data)
                      that.goUrl()
                  }).catch(err=>{
                    // console.log("错误信息",err);
                  })
                }
              })
            }
          })
        }
      }
    })
  },

  // 跳转
  goUrl(){
    if(wx.getStorageSync('jd') == 1){
      wx.reLaunch({
        url: '/supermarket/mall/jdDetail/index?goods_id=' + wx.getStorageSync("goodid") + '&reCode=' + wx.getStorageSync('inviteCode') + '&Entrance=' + 'jd',
        success:function (){
          wx.removeStorageSync("jd");
          wx.removeStorageSync("goodid");
        }
      })
    }else if(wx.getStorageSync('ziying') == 1){
      
      wx.reLaunch({
        url: '/supermarket/shop/detail/index?sid='+wx.getStorageSync("goodid")+"&dealerId="+wx.getStorageSync('dealerId'),
        success:function (){
          wx.removeStorageSync("ziying");
          wx.removeStorageSync("goodid");
        }
      })

    }else if(wx.getStorageSync('vip') == 1){
      wx.reLaunch({
        url: "/my/pages/vipcard/index?dealerId="+wx.getStorageSync('dealerId')+"&adminId="+wx.getStorageSync('adminId'),
        success:function (){
          wx.removeStorageSync("vip");
          wx.removeStorageSync("vipcardid");
        }
      })

    }else{
      console.log('2222222')
      wx.navigateBack({
        delta: 1,
      })
      // wx.redirectTo({
      //   url: '/pages/index/index',
      // })
    } 
  },



  getPhoneNum: function (ev) {
    console.log("授权登录",ev)
    if(wx.getStorageSync("openId")){
      wx.checkSession({
        success() {
          // session_key 未过期，并且在本生命周期一直有效
        },
        fail() {
          // session_key 已经失效，需要重新执行登录流程
          this.wxLogin(ev) // 重新登录
        }
      })
    }else{
      this.wxLogin(ev)
    }
  },
  // 获取当前位置
  getjw: function () {
    let that = this
    wx.getLocation({ //获取当前位置
      type: 'gcj02',
      success: function (res) {
        let locationString = res.latitude + "," + res.longitude;
        wx.setStorageSync('latitude', res.latitude)
        wx.setStorageSync('longitude', res.longitude)
        wx.request({
          url: 'https://apis.map.qq.com/ws/geocoder/v1/',
          data: {
            "key": "CSBBZ-OLQWW-C5JR6-OIMZW-L2RNF-KHBF7",
            "location": locationString
          },
          method: 'GET',
          success: function (e) {
            //输出一下位置信息
            console.log(e, '位置')
            wx.setStorageSync('city', e.data.result.address_component.province)
          },
          fail: function () { }
        });
      },
      fail: function (res) {
        console.log('获取当前位置失败', res);
      }
    });
  },
  

})