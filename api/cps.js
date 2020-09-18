import request from "../utils/request1111.js";

// 京东商城首页
export function jdHomeIndex(data) {
  return request.post("/outside/jd/jdHomeIndex", data, {urlType: 2 });
}
// 京东秒杀商品
export function jdHomeEliteGoodsList(data) {
  return request.post("/outside/jd/jdHomeEliteGoodsList", data, {urlType: 2 });
}
// 京东中间的推荐商品
export function getJdGoodsThreePieces(data) {
  return request.post("/outside/jd/getJdGoodsThreePieces", data, {urlType: 2 });
}
// 京东首页搜索
export function jdSearchList(data) {
  return request.post("/outside/jd/jdGoodsList", data, {urlType: 2 });
}
// 京东首页获取搜索默认词
export function JdGoodsKeyword(data) {
  return request.post("/outside/jd/JdGoodsKeyword", data, {urlType: 2 });
}
// 京东首页 判断酒店爆品标题是否展示
export function hotHotelShow(data) {
  return request.get("/app/v1/hotel/hotHotelShow", data, {urlType: 2 });
}

// 加入助理
export function addAssistantPush(data) {
  return request.post("/apiH5/stall/addAssistantPush", data, {urlType: 2 });
}
// 京东商品列表
export function jdHomeSearchGoodsList(data) {
  return request.post("/outside/jd/jdHomeSearchGoodsList", data, {urlType: 2 });
}
// 京东复制文案  
export function jdGoodsShareData(data) {
  return request.post("/outside/jd/jdGoodsShareData", data, {urlType: 2 });
}
// 生成海报  /api/share/hb/ownGoods
export function ownGoods(data) {
  return request.post("/api/share/hb/ownGoods", data, {urlType: 2 });
}
// 助理发品开关     
export function updateAssistantPush(data) {
  return request.post("/apiH5/stall/updateAssistantPush", data, {urlType: 2 });
}
// 助理商品
export function getAssistantList(data) {
  return request.post("/apiH5/stall/getAssistantList", data, {urlType: 2 });
}
// 移除助理  
export function delAssistantPush(data) {
  return request.post("/apiH5/stall/delAssistantPush", data, {urlType: 2 });
}
// 浏览记录
export function jdBrowsed(data) {
  return request.post("/outside/jd/jdBrowsed", data, {urlType: 2 });
}
// 分享信息    
export function shopShare(data) {
  return request.post("/pms/shopShare", data, {urlType: 2 });
}
// 单个商品推送状态 
export function getPushStatusByGoodsId(data) {
  return request.post("/apiH5/stall/getPushStatusByGoodsId", data, {urlType: 2 });
}
// 京东商品详情 
export function jdGoodsInfo(data) {
  return request.post("/outside/jd/jdGoodsInfo", data, {urlType: 2 });
}
// /outside/jd/getSmallProgramLink
export function getSmallProgramLink(data) {
  return request.post("/outside/jd/getSmallProgramLink", data, {urlType: 2 });
}
//  /outside/jdGoodsShare
export function jdGoodsShare(data) {
  return request.post("/outside/jdGoodsShare", data, {urlType: 2 });
}
// 饿了么是否授权
export function authCheck(data) {
  return request.post("/pms/authCheck", data, {urlType: 2 });
}
// 饿了么首页信息
export function elmCover(data) {
  return request.post("/pms/elmCover", data, {urlType: 2 });
}
// 饿了么淘口令
export function elmTkl(data) {
  return request.post("/pms/elmTkl", data, {urlType: 2 });
}
// 饿了么海报
export function elmPoster(data) {
  return request.post("/pms/elmPoster", data, {urlType: 2 });
}
// 积分商城列表   
export function pointList(data) {
  return request.get("/zhidingapi/zhiding/vip/card/point/mall/list", data, {urlType: 1 });
}
// 积分商城详情
export function pointDetail(data) {
  return request.get("/zhidingapi/zhiding/vip/card/point/mall/detail", data, {urlType: 1 });
}
// 积分商城兑换  
export function pointExchange(data) {
  return request.post("/zhidingapi/zhiding/vip/card/point/mall/exchange", data, {urlType: 1, ct:true });
}
// 加油首页 
export function fuelCover(data) {
  return request.post("/pms/fuelCover", data, {urlType: 2 });
}
// 加油列表  /app/member/getFuelList
export function getFuelList(data) {
  return request.post("/app/member/getFuelList", data, {urlType: 2 });
}
// 加油 判断加油规则介绍是否展示
export function fuelRule(data) {
  return request.post("/pms/fuelRule", data, {urlType: 2, ct:true });
}
// 加油详情
export function getGzbGasDetail(data) {
  return request.post("/app/member/getGzbGasDetail", data, {urlType: 2 });
}
// 加油优惠信息
export function getGzbMemberCouponInfo(data) {
  return request.post("/app/member/getGzbMemberCouponInfo", data, {urlType: 2 });
}
// 加油支付
export function orderPay(data) {
  return request.post("/app/member/fuel/order/pay", data, {urlType: 2 });
}