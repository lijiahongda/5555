import request from "../utils/request1111.js";

//  根据code获取openId
export function getOpenId(data) {
  return request.get("/apimall/wechat/wxLogin", data, { urlType: 1 });
}

//  微信一键授权登录
export function weChatLogin(data) {
  return request.post("/apimall/wechat/weChatLogin", data, { urlType: 1,ct:true });
}

//  更新用户信息（小程序登录第二步）  
export function updateUserInfo(data) {
  return request.post("/apimall//wechat/updateUserInfo", data, { urlType: 1,ct:true });
}


