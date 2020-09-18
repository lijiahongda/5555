import request from "../utils/request1111.js";

export function ajaxDataProfit(data) {
  return request.post("/zdApplet/v2/assoc/getEstimateEarn", data, { noAuth: true, urlType: 2 });
}
export function ajaxCanWithDraw(data){
  return request.post("/zdApplet/v2/assoc/getCanWithDraw", data, { noAuth: true, urlType: 2 });
}
export function ajaxSyDetail(data){
  return request.post("/zdApplet/v2/assoc/getEarnDetail", data, { noAuth: true, urlType: 2 });
}