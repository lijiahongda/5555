export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) {
      time = parseInt(time) * 1000
    }

    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['日', '一', '二', '三', '四', '五', '六'][value]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}



export function getDays(edate, sdate) {
  if (arguments.length === 0) {
    return null
  }
  let minsec = edate - sdate
  return minsec / 1000 / 60 / 60 / 24

}

export function getWeek(str,date) {
  var a = new Array("日", "一", "二", "三", "四", "五", "六"); 
  var week = new Date(date).getDay(); 
  str = str + a[week]; 
  return str
}