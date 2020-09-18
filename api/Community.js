import request from "../utils/request1111.js";
// import request from "./../utils/request.js";
/**
 * 公共接口 ，优惠券接口 , 行业此讯 , 手机号码注册
 * 


*/

//用户中心数据接口
export function myData(data){
    return request.post("/zdApplet/v2/assoc/myData",data,{ urlType: 2 })
}

//订单列表接口 -- 我购买的
export function ajaxMyBuyOrderList(data){
    return request.post("/zdApplet/v2/assoc/myBuyOrder",data,{ noAuth: true, urlType: 2 });
}

//订单列表接口 -- 我推广的
export function ajaxStallOrderList(data){
    return request.post("/zdApplet/v2/assoc/myPromotionOrder",data,{ noAuth: true, urlType: 2 });
}
//获取即将过期优惠券列表接口

export function ajaxCouponList(data){
    return request.post("/stall/couponList",data,{ urlType: 2 })
}
export function ajaxMaskCouponList(data){
    return request.post("/stall/couponRxpireSoonRemind",data,{ urlType: 2 })
}
//优惠券设置提醒
export function ajaxEditCoupon(data){
    return request.post("/stall/memberCouponPopEdit",data,{ urlType: 2 })
}

//获取排名前10的商品
export function ajaxTopShop(data){
    return request.post("/stall/getSalesRankingList",data,{ urlType: 1 })
}

export function ajaxSy(data){
    return request.post("/stall/revenueStatistics",data,{ urlType: 2 })    
}

//收益详情
export function ajaxSyDetail(data){
    return request.post("/stall/getProfitList",data,{ urlType: 2 })    
}

export function ajaxMyTeacherWx(data){
    return request.post("/stall/getHeadmasterWeChatNumber",data,{ urlType: 2 })    
}


export function ajaxAssistantList(data){
    return request.post("/stall/getAssistantList",data,{ urlType: 1 })    
}
export function ajaxCloseAssistantPush(data){
    //关闭推送

    return request.post("/stall/closeAssistantPush",data,{ urlType: 1 })    

}
export function ajaxOpenAssistantPush(data){
    //开启推送
    return request.post("/stall/openAssistantPush",data,{ urlType: 1 })    

}
export function ajaxRmovedelAssistantPush(data){
    return request.post("/stall/delAssistantPush",data,{ urlType: 1 })    
}
//社群赚首页的收益
export function ajaxProfit(data){
    return request.post("/stall/getEstimateProfit",data,{ urlType: 2 })    
}

// 自营复制链接
export function getShortUrl(data) {
  return request.post("/mall/getShortUrl", data, { urlType: 1 });
}

export function pddGoodsShareData(data) {
  return request.post("/outside/pddGoodsShareData", data, { urlType: 1 });
}

// export function jdSearchList(data) {
//   return request.post("/outside/jd/jdGoodsList", data, {urlType: 2 });
// }





//刷新个人信息
export function ajaxUpgrade(data) {
    return request.post("/api/community/groupRule/upgrade", data, { noAuth: true, urlType: 3 })
}

// 秒杀详情
export function flashDetail(data) {
  return request.post("/mall/flashDetail", data, { noAuth: true, urlType: 1 });
}
// 领券
export function sendCoupon(data) {
  return request.post("/mall/sendCoupon", data, { noAuth: true, urlType: 1 });
}

export function ajaxGroupList(data) {
    return request.post("/api/community/groupRule/groupList", data, { noAuth: true, urlType: 3 })
}
export function ajaxApplyReviewV2(data) {
    return request.post("/api/community/groupRule/applyReviewV2", data, { noAuth: true, urlType: 3 })
}

export function ajaxApplyaReview(data) {
    return request.post("/api/community/groupRule/applyReview", data, { noAuth: true, urlType: 3 })
}
export function activationIndex(data) {
    return request.post("/community/group/activationIndex", data, { noAuth: true, urlType: 2 })
}
export function groupActivationList(data) {
    return request.post("/community/group/groupActivationList", data, { noAuth: true, urlType: 2 })
}

export function communityAdPic(data) {
    return request.post("/mall/community/communityAdPic", data, { noAuth: true, urlType: 1})
}
export function goodsList(data) {
    return request.post("/mall/community/goodsList", data, { noAuth: true, urlType: 1 })
}
export function goodsListWechatShare(data) {
    return request.post("/mall/community/goodsListWechatShare", data, { noAuth: true, urlType: 1 })
}
export function goodsListPosterShare(data) {
    return request.post("/mall/community/goodsListPosterShare", data, { noAuth: true, urlType: 1 })
}
export function noActivationRoomById(data) {
    return request.post("/community/group/noActivationRoomById", data, { noAuth: true, urlType: 2 })
}
export function activationShareXcx(data) {
    return request.post("/share/activationShareXcx", data, { noAuth: true, urlType: 1 })
}

export function ajaxMemberList(data){
   
    return request.post("/community/group/queryMemberList", data, { noAuth: true, urlType: 2 })
}

export function ajaxQueryGroupInfo(data){
    return request.post("/community/group/queryGroupInfo", data, { noAuth: true, urlType: 2})

}

export function ajaxQueryShareInfo(data){
    return request.post("/community/group/queryShareInfo", data, { noAuth: true, urlType: 2 })
}
export function ajaxQueryOrderList(data){
    return request.post("/community/order/queryOrderList", data, { noAuth: true, urlType: 2 })
}

export function  ajaxApplyCopyWriting(data){
    return request.post("/api/community/groupRule/applyCopyWriting", data, { noAuth: true, urlType: 3 })
}
export function ajaxApplyGroupAssistant(data){
    return request.post("/api/community/groupRule/applyGroupAssistant", data, { noAuth: true, urlType: 3 })

}
//获取助理微信
export function ajaxGroupAssistantV2(data){
    return request.post("/api/community/groupRule/applyGroupAssistantV2", data, { noAuth: true, urlType: 3 })
}
//开通群 一个步骤一个步骤
export function ajaxGroupStep(data){
    return request.post("/api/community/groupRule/applyReview", data, { noAuth: true, urlType: 3 })
}

//获取即将过期优惠券列表接口
export function ajaxTuijian(data){
  return request.post("/mall/V2/recommendGoods",data,{ noAuth: true, urlType: 1 })
}
export function ajaxSkuidDetil(data){
  return request.post("/mall/getProductSkuDatail",data,{ noAuth: true, urlType: 1 })
}
export function ajaxMyFans(data){
    return request.post("/zdApplet/v2/assoc/getMyRegister",data,{ noAuth: true, urlType: 1 })
}