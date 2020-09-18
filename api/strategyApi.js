


// import request from "./../utils/request.js";
import request from "../utils/request1111.js";
/**
 * 公共接口 ，优惠券接口 , 行业此讯 , 手机号码注册
 * 


*/
//刷新个人信息
export function ajaxShareXcx(data){
    return request.post("/community/groupRule/shareXcx",data,{ noAuth: true, urlType: 3 })
}
export function ajaxNewList(data){
    return request.post("/zdApplet/v2/assoc/getNewComers",data,{ noAuth: true, urlType: 2 })
}

export function ajaxGroupList(data){
    return request.post("/api/community/groupRule/groupList",data,{ noAuth: true, urlType: 3 })
}



export function ajaxInvitePosterList(data){
    return request.post("/zdApplet/v2/assoc/getPosterList",data,{ noAuth: true, urlType: 2 })
}
//生成海报接口
export function ajaxPoster(data){
    return request.post("/zdApplet/v2/assoc/getAssocPoster",data,{ noAuth: true, urlType: 2 })
}
export function ajaxUniversity(data){
    return request.post("/zdApplet/v2/assoc/getAdvanerLearnList",data,{ noAuth: true, urlType: 2 })
}


