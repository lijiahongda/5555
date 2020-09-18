import request from "../utils/request1111.js";

// 获取会员佣金数据
export function memberDetail(data) {
  return request.get("/zhidingapi/zhiding/customer/member/detail", data, { urlType: 1 });
}

// 获取酒店浏览记录
export function historyHotel(data) {
  return request.get("/zhidingapi/zhiding/hotel/getDealerList/byMemberId?memberId=" + data, {}, { urlType: 1 });
}

// 获取推荐酒店列表
export function goodShop(data) {
  return request.get("/zhidingapi/zhiding/hotel/home/hotel/list", data, { urlType: 1 });
}

// 获取身份
export function customerId(data) {
  return request.post("/zhidingapi/customer/login/wechat", data, { urlType: 1, ct:true });
}

// 获取酒店爆品中的特价商品
export function getTJshop(data) {
  return request.get("/apimall/mall/polymerize/zhiding/query", data, { urlType: 1});
}

// 获取酒店爆品中的虚拟商品
export function getFICshop(data) {
  return request.get("/zhidingapi/zhiding/vip/card//product/list", data, { urlType: 1});
}

// 获取酒店爆品中的虚拟商品详情
export function getFICshopDetail(data) {
  return request.get("/zhidingapi/zhiding/vip/card/product/detail", data, { urlType: 1});
}

// 获取会员卡列表
export function memberCard(data) {
  return request.get("/zhidingapi/zhiding/card/get/union/cardlist", data, { urlType: 1});
}

// 获取会员卡详情
export function memberCardDetail(data) {
  return request.get("/zhidingapi/zhiding/card//union/card/detail", data, { urlType: 1});
}
// 获取联名卡单个信息（用于酒店下单）
export function byDealerId(data) {
  return request.get("/zhidingapi/zhiding/card/union/card/detail/byDealerId", data, { urlType: 1});
}

// 获取会员卡特权详情
export function getPrivilegeList(data) {
  return request.post("/api/card/getPrivilegeList", data, { urlType: 2});
}
// 联名卡权益列表介绍
export function getPrivilegeListRights(data) {
  return request.post("/api/card/getPrivilegeListRights", data, { urlType: 2});
}
// 联名卡点击开通后预支付页面
export function cardCreateDetail(data) {
  return request.get("/zhidingapi/zhiding/card/union/card/confirm/detail", data, { urlType: 1,ct: true});
}
// 联名卡创建订单
export function cardCreate(data) {
  return request.post("/zhidingapi/zhiding/order/union/create/order", data, { urlType: 1,ct: true});
}
// 联名卡 转发
export function cardInfo(data) {
  return request.get("/zhidingapi/zhiding/weixin/share/union/cardInfo", data, { urlType: 1,ct: true});
}

// 创建订单
export function createOrder(data) {
  return request.post("/zhidingapi/zhiding/order/create/vip/card", data, { urlType: 1, ct: true});
}
// 获取商品分享数据
export function getGoodsShareParams(data) {
  return request.get("/apimall/mall/goods/zhiding/getGoodsShareParam", data, { urlType: 1, ct: true});
}
// 获取商品分享分佣信息
export function getGoodsCommission(data) {
  return request.post("/apimall/mall/goods/zhiding/getGoodsCommission", data, { urlType: 1, ct: true});
}
// // 酒店自营商品列表
// export function polymerize(data) {
//   return request.get("/mall/goods/getGoodsCommission", data, { urlType: 1, ct: true});
// }
// 虚拟商品生成二维码 
export function encryption(data) {
  return request.post("/get/encryption/h5/zhiding/code", data, { urlType: 1, ct: true});
}
// 商品详情
export function productDetail(data) {
  return request.get("/apimall/mall/goods/zhiding/productDetail", data, { urlType: 1, ct: true});
}
// 酒店入驻的分享
export function hotelShare(data) {
  return request.post("/api/share/hotelShare", data, { urlType: 2, ct: true});
}

//海报接口
export function posters(data) {
  return request.post("/api/share/hb/memberCard", data, { urlType: 2, ct: true});
}

// 获取会员卡列表
export function getCard(data) {
  return request.get("/api/vip/card/home/page/card/list", data, { urlType: 1});
}

// 酒店会员卡列表
export function hotelCard(data) {
  return request.get("/zhidingapi/zhiding/card//union/card/list", data, { urlType: 1});
}
// 首页的我的订单那四个
export function getNavList(data) {
  return request.post("/zdApplet/v2/home/getNavList", data, { urlType: 2});
}

// 联名卡 商品兑换
export function exchangeProductList(data) {
  return request.post("/zdApplet/v2/vip/exchangeProductList", data, { urlType: 2,ct:true});
}
// 联名卡 商品兑换详情
export function exchangeProductDetail(data) {
  return request.post("/zdApplet/v2/vip/exchangeProductDetail", data, { urlType: 2,ct:true});
}
// 联名卡 确认订单
export function exchangePayPage(data) {
  return request.post("/zdApplet/v2/vip/exchangePayPage", data, { urlType: 2,ct:true});
}
// 联名卡 确认订单
export function exchangeOrderCreate(data) {
  return request.post("/zdApplet/v2/vip/exchangeOrderCreate", data, { urlType: 2,ct:true});
}

// 首页 获取券列表
export function cardV2(data) {
  return request.post("/zdApplet/v2/coupon/cardV2", data, { urlType: 2,ct:true});
}