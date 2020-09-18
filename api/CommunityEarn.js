import request from "../utils/request1111.js";
// import request from "./../utils/request.js";

//粉丝列表 和下级群主接口
export function ajaxFlowersList(data){
  return request.post("/zdApplet/v2/assoc/getMyRegister",data,{ noAuth: true, urlType: 2 }) 
  // return request.post("/zdApplet/v2/assoc/getMyRegisterTest?memberId=1",data,{ noAuth: true, urlType: 2 })  测试接口
} 

//提现详情
export function ajaxWalletIntro(data){
  return request.post("/zdApplet/v2/assoc/getCanWithDraw",data, { noAuth: true, urlType: 2 })
}
//获取 url 链接
export function ajaxVideo(data){
  return request.post("/zdApplet/v2/assoc/getVideoUrl",data,{ noAuth: true, urlType: 2 })
}