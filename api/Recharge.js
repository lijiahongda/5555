
import request from "../utils/request1111.js";

/**
 * 
 * 充值版块
 */

// 获取手机充值详情
export function getPhoneInfo(data) {
  return request.post("/zdApplet/v2/recharge/mobileDetail",data,{ urlType:2});
}

// 视频充值 支付
export function phonePay(data) {
  return request.post("/zdApplet/v2/recharge/createMobileOrder",data,{ urlType:2});
}

// 视频充值列表
export function videolist(data) {
  return request.post("/zdApplet/v2/recharge/list",data,{ urlType:2});
}

// 视频充值详情
export function getCardInfo(data) {
  return request.post("/zdApplet/v2/recharge/videoDetail",data,{ urlType:2});
}

// 视频充值详情
export function videoPay(data) {
  return request.post("/zdApplet/v2/recharge/createVideoOrder",data,{ urlType:2});
}

