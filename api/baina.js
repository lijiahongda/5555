import request from "../utils/request1111.js";

// 地址列表
export function getAddressList(data) {
  return request.post("/app/member/getAddressList", data, { noAuth: true, urlType: 2 });
}
// 删除地址 
export function deleteAddress(data) {
  return request.post("/app/member/deleteAddress", data, { noAuth: true, urlType: 2 });
}
// 创建订单
export function orderCreate(data) {
  return request.post("/api/v1/mall-order-create", data, { noAuth: true, urlType: 2 });
}
// 支付接口
export function orderPay(data) {
  return request.post("/api/v1/order-pay", data, { noAuth: true, urlType: 2 });
}
// 获取订单预览信息
export function payPage(data) {
  return request.get("/api/v1/pay-page", data, { noAuth: true, urlType: 2 });
}
// 白拿详情
export function detail(data) {
  return request.post("/api/v1/product/detail", data, { noAuth: true, urlType: 2 });
}
// 白拿列表
export function freeProduct(data) {
  return request.get("/api/v1/free-product-list", data, { noAuth: true, urlType: 2 });
}
// 获取省接口
export function getProvince(data) {
  return request.get("/app/getProvince", data, { noAuth: true, urlType: 2 });
}
// 选择省获取市
export function getCity(data) {
  return request.get("/app/getCity", data, { noAuth: true, urlType: 2 });
}
// 选择市加载区
export function getArea(data) {
  return request.get("/app/getArea", data, { noAuth: true, urlType: 2 });
}
// 选择区加载街道数据
export function getTown(data) {
  return request.get("/app/getTown", data, { noAuth: true, urlType: 2 });
}
// 添加地址
export function createAddress(data) {
  return request.post("/app/member/createAddress", data, { noAuth: true, urlType: 2 });
}