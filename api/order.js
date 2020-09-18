import request from "../utils/request1111.js";

//  我的订单首页
export function orderIcon(data) {
  return request.post("/pms/orderIcon", data, { urlType: 2 });
}
// 酒店商城订单
export function getHotelOrderList(data) {
  return request.post("/app/getHotelOrderList", data, { urlType: 2 });
}
// 酒店商城订单详情
export function getOrderDetail(data) {
  return request.post("/app/getOrderDetail", data, { urlType: 2 });
}
// 京东订单列表
export function jdRebate(data) {
  return request.post("/pms/jdRebate", data, { urlType: 2 });
}
// 饿了么订单列表
export function elmOrderList(data) {
  return request.post("/app/member/elmOrderList", data, { urlType: 2 });
}
// 酒店订单列表
export function pageList(data) {
  return request.get("/zhidingapi/zhiding/order/member/room/pageList", data, { urlType: 1 });
}
// 酒店订单详情
export function orderDetail(data) {
  return request.get("/zhidingapi/zhiding/order/detail", data, { urlType: 1 });
}
// 积分商城订单
export function pointOrder(data) {
  return request.get("/zhidingapi/zhiding/vip/card/point/mall/order/list", data, { urlType: 1 });
}
// 加油订单
export function fuelOrder(data) {
  return request.post("/app/member/fuel/order/list", data, { urlType: 1 });
}
// 会员卡订单
export function cardOrder(data) {
  return request.get("/api/admin/card/get/all/cardlist", data, { urlType: 1 });
}
// 默认地址信息
export function getDefautAddressInfo(data) {
  return request.post("/app/member/getDefautAddressInfo", data, { urlType: 2 });
}
// 商品订单创建
export function createOrder(data) {
  return request.post("/apimall/order/mall/zhiding/createOrder", data, { ct:true,urlType: 1 });
}
// 自营商品支付
export function mallPay(data) {
  return request.post("/apimall/order/mall/zhiding/pay", data, { ct:true,urlType: 1 });
}
// prepaycard  /api/order/prepay/card/
export function prepaycard(data) {
  return request.post("/api/order/prepay/card", data, { ct:true,urlType: 1 });
}
// /
export function prepaynew(data) {
  return request.post("/api/order/prepaynew", data, { ct:true,urlType: 1 });
}
// 虚拟商品订单
export function virtualList(data) {
  return request.get("/zhidingapi/zhiding/order/my/virtual/product/list", data, { ct:true,urlType: 1 });
}
// 虚拟商品订单详情
export function virtualDetail(data) {
  return request.get("/zhidingapi/zhiding/order/my/virtual/product/detail", data, { ct:true,urlType: 1 });
}
// 酒店 客房取消订单
export function cancelHotelOrder(data) {
  return request.post("/zhidingapi/zhiding/order/cancel", data, {urlType: 1 });
}
// 中台酒店取消订单
export function fullCancelHotelOrder(data) {
  return request.post("/zdApplet/v2/order/cancelHotelOrder", data, {urlType: 2 });
}