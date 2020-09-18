import request from "../utils/request1111.js";

// 微嘉付测试页面
export function payTest(data) {
  return request.post("/test/payTest", data, { urlType: 2 });
}
// 联名卡权益
export function cardEquity(data) {
  return request.post("/pms/cardEquity", data, { urlType: 2 });
}
// /api/getMemberInterest
export function getMemberInterest(data) {
  return request.post("/api/getMemberInterest", data, { urlType: 2 });
}
// 酒店转发文案及图片
export function homePageInfo(data) {
  return request.get("/zhidingapi/zhiding/hotel/share", data, { urlType: 1 });
}

// 酒店预订页面海报
export function hotelHb(data) {
  return request.post("/api/share/hb/hotelHb", data, { urlType: 2 });
}

// 虚拟商品转发
export function shopVrShare(data) {
  return request.get("/zhidingapi/zhiding/weixin/share/virtual/cardInfo", data, { urlType: 1 });
}
// 虚拟商品复制链接
export function hotelCardShare(data) {
  return request.post("/apiH5/hotelCardShare", data, { urlType: 2});
}


// 酒店收藏列表
export function collectList(data) {
  return request.get("/zhidingapi/zhiding/hotel/collect/list", data, { urlType: 1 });
}
// 酒店收藏
export function collectSave(data) {
  return request.get("/zhidingapi/zhiding/hotel/collect/save", data, { urlType: 1 });
}
// 酒店首页
export function hotelHome(data) {
  return request.get("/zhidingapi/zhiding/hotel/wxapp/customer/home", data, { urlType: 1 });
}

// 酒店首页详情-------  1
export function hotelDetail(data) {
  return request.get("/hotel/v3/hotel/detail", data, { urlType: 2});
}
// 酒店详情中 客房列表
export function hotelBookingList(data) {
  return request.post("/zhidingapi/zhiding/room/booking/list", data, { urlType: 1 });
}
// 酒店dealerId换customerId
export function getCustomerId(data) {
  return request.get("/zhidingapi/zhiding/customer/detail", data, { urlType: 1 });
}
// 酒店分享
export function hotelShare(data) {
  return request.get("/zhidingapi/zhiding/hotel/share", data, { urlType: 1 });
}
// 客房房型
export function planDetail(data) {
  return request.get("/zhidingapi/zhiding/room/plan/detail", data, { urlType: 1 });
}


// 酒店预订
export function customerAvailable(data) {
  return request.post("/zdApplet/v2/order/hotelBooking", data, { urlType: 2 });
}


// 酒店id换取供应商id
// export function getSupplierId(data) {
//   return request.post("/api/hotel/getSupplierId", data, { urlType: 1 });
// }


// /api/order/prepaynew
export function prepaynew(data) {
  return request.post("/api/order/prepaynew", data, { urlType: 2 });
}
// 客房创建订单
export function createRoom(data) {
  // return request.post("/zhiding/order/create/room", data, { urlType: 1 });
  return request.post("/zhidingapi/zhiding/order/create/room", data, { urlType: 1, ct: true });
}

// 酒店首页秒杀列表
export function jdHomeEliteGoodsList(data) {
  return request.post("/outside/jd/jdHomeEliteGoodsList", data, { urlType: 2 });
}

// 酒店首页火热爆品
export function jdHomeSearchGoodsList(data) {
  return request.post("/outside/jd/jdHomeSearchGoodsList", data, { urlType: 2 });
}
// 酒店首页 会员中心
export function hotelHomeCard(data) {
  return request.post("/zdApplet/v2/card/info", data, { urlType: 2 });
}
// 酒店首页 会员中心
export function hotShopList(data) {
  return request.get("/zdApplet/v2/hotel/hotShopList", data, { urlType: 2 });
}
// 酒店取消收藏
export function collectCancel(data) {
  return request.get("/zhidingapi/zhiding/hotel/collect/cancel", data, { urlType: 1 });
}
// 酒店入驻说明 /zhidingapi/zhiding/hotel/entry/imgs
export function hotelExplain(data) {
  return request.post("/zhidingapi/zhiding/hotel/entry/imgs", data, { urlType: 1 });
}
// 申请入住酒店关键词搜索
export function searchHotel(data){
  return request.get("/app/v1/hotel/searchHotel",data, { noAuth: true ,urlType: 2});
}
// 提交酒店入驻 
export function checkHotel(data){
  return request.post("/app/v1/hotel/checkHotel",data, { noAuth: true ,urlType: 2});
}
// 发送验证码 
export function hotelPhoneVerify(data){
  return request.post("/app/hotelPhoneVerify",data, { noAuth: true ,urlType: 2});
}
// 手机号验证码验证
export function hotelPhoneCheckCode(data){
  return request.post("/app/hotelPhoneCheckCode",data, { noAuth: true ,urlType: 2});
}
// 酒店区域位置接口
export function getAreaData(cityname) {
  console.log(cityname, '-----')
  return request.get("/app/v1/hotel/areaSearch?cityname=" + cityname, {}, { noAuth: true ,urlType: 2});
}
// 酒店列表
export function hotelList(data) {
  return request.post("/app/v1/hotel/list", data, { noAuth: true });
}
//商圈搜索结果
export function BusinessCircle(data) {
  return request.get("/hotel/v3/hotel/hotelSelect", data, { noAuth: true });
}
// 商圈列表
export function Business(cityname) {
  return request.get("/hotel/v3/hotel/cityBusiness?cityName=" + cityname, {}, { noAuth: true,urlType: 2,ct:true });
}
// 城市搜索结果
export function getCityList(data) {
  return request.get("/hotel/v3/hotel/citySelect", data, { noAuth: true,urlType: 2,ct:true });
}

// 创建购买联名卡订单
export function createCard(data) {
  return request.post("/zhidingapi/zhiding/order/create/card", data, { noAuth: true ,urlType: 1,ct:true});
}

// 联名卡支付
export function prepayCard(data) {
  return request.post("/zhidingapi/zhiding/order/prepay/union/card/", data, { noAuth: true ,urlType: 1,ct:true});
}
//  /apiH5/hotelGoodsShare  自营商品复制链接
export function hotelGoodsShare(data) {
  return request.post("/apiH5/hotelGoodsShare", data, { noAuth: true ,urlType: 2,ct:true});
}
// 全量酒店列表
export function zdAppletHotelList(data) {
  return request.post("/zdApplet/v2/hotel/list", data, { noAuth: true ,urlType: 2,ct:true});
}
// 全量酒店详情
export function zdAppletHotelDetail(data) {
  return request.get("/zdApplet/v2/hotel/detail", data, { noAuth: true ,urlType: 2,ct:true});
}
// 全量酒店创建订单 
export function createHotelOrder(data) {
  return request.post("/zdApplet/v2/order/createHotelOrder", data, { noAuth: true ,urlType: 2,ct:true});
}
// 全量酒店支付 
export function Hotelpay(data) {
  return request.post("/zdApplet/v2/order/hotelPay", data, { noAuth: true ,urlType: 2,ct:true});
}
// 全量酒店预定 
export function booking(data) {
  return request.post("/zdApplet/v2/order/hotelBooking", data, { noAuth: true ,urlType: 2,ct:true});
}
// 判断是否是会员
export function cardLevel(data) {
  return request.post("/zdApplet/v2/card/level", data, { noAuth: true ,urlType: 2,ct:true});
}
// pms酒店只有会员卡的
export function pmsList(data) {
  return request.get("/zhidingapi/zhiding/hotel/home/card/hotel/list", data, { noAuth: true ,urlType: 1,ct:true});
}
// 酒店详情接口
export function initDetail(hotelId, arrivalDate, departureDate,mid) {
  return request.get("/app/v2/hotel/detail?hotelId=" + hotelId + '&arrivalDate=' + arrivalDate + '&departureDate=' + departureDate+'&memberId='+mid, {}, { noAuth: true ,urlType: 2});
}
// 酒店详情服务设施
export function facilities(data) {
  return request.get("/hotel/v3/hotel/facilities", data, { noAuth: true ,urlType: 2,ct:true});
}
// 酒店纠错
export function feedback(data) {
  return request.post("/hotel/v3/hotel/feedback", data, { noAuth: true ,urlType: 2,ct:true});
}
// 收藏酒店
export function sureCollect(data) {
  return request.post("/hotel/v3/hotel/collect", data, { noAuth: true ,urlType: 2,ct:true});
} 
// 领券中心
export function receiveList(data) {
  return request.post("/zdApplet/receive/coupon/list", data, { noAuth: true ,urlType: 2,ct:true});
} 