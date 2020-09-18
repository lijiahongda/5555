import request from "../utils/request1111.js";

// 分享，我也不确定
export function personCenterInfo(data) {
  return request.post("/api/weixin/share/personCenterInfo", data, { noAuth: true, urlType: 1 });
}
// 判断隐藏权益   
export function upgradeShow(data) {
  return request.post("/api/vip/card/version/upgrade/show", data, { noAuth: true, urlType: 1 });
}
// 推荐酒店列表
export function hotelList(data) {
  return request.get("/zhidingapi/zhiding/hotel/home/hotel/list", data, { noAuth: true, urlType: 1 });
}
// /api/home/member/detail  佣金数据
export function memberDetail(data) {
  return request.get("/api/home/member/detail", data, { noAuth: true, urlType: 1 });
}
// /api/customer/login/wechat 可能是登陆
export function loginWechat(data) {
  return request.get("/api/customer/login/wechat", data, { noAuth: true, urlType: 1 });
}
// 朋友圈列表
export function subordinate(data) {
  return request.post("/zhidingapi/zhiding/customer/member/relation/subordinate", data, { noAuth: true, urlType: 1 });
}
// 我的钱包
export function totalCommission(data) {
  return request.get("/apimall/member/zhiding/totalCommission", data, { noAuth: true, urlType: 1 });
}
// 佣金分类列表
export function orderStatus(data) {
  return request.get("/apimall/member/zhiding/orderStatus", data, { noAuth: true, urlType: 1 });
}
// 我的优惠券 
export function myCoupons(data) {
  return request.get("/zhidingapi/zhiding/customer/member/coupons", data, { noAuth: true, urlType: 1 });
}
// 我的会员卡 
export function cardlist(data) {
  return request.get("/zhidingapi/zhiding/card/get/all/cardlist", data, { noAuth: true, urlType: 1 });
}
// 酒店浏览记录 
export function byMemberId(data) {
  return request.get("/zhidingapi/zhiding/hotel/getDealerList/byMemberId", data, { noAuth: true, urlType: 1 });
}
// 首页icon
export function iconList(data) {
  return request.get("/zdApplet/v2/index/iconList", data, { noAuth: true, urlType: 2 });
}