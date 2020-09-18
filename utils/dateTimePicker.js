function withData(param) {
  return param < 10 ? '0' + param : '' + param;
}

function getLoopArray(start, end, unit = "") {
  var start = start || 0;
  var end = end || 1;
  var array = [];
  for (var i = start; i <= end; i++) {
    array.push(withData(i) + unit);
  }
  return array;
}

function getMonthDay(year, month) {
  var flag = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0),
    array = null;

  switch (month) {
    case '01':
    case '03':
    case '05':
    case '07':
    case '08':
    case '10':
    case '12':
      array = getLoopArray(1, 31)
      break;
    case '04':
    case '06':
    case '09':
    case '11':
      array = getLoopArray(1, 30)
      break;
    case '02':
      array = flag ? getLoopArray(1, 29) : getLoopArray(1, 28)
      break;
    default:
      array = '月份格式不正确，请重新输入！'
  }
  return array;
}

function getNewDateArry() {
  // 当前时间的处理
  var newDate = new Date();
  var year = withData(newDate.getFullYear()),
    mont = withData(newDate.getMonth() + 1),
    date = withData(newDate.getDate()),
    hour = withData(newDate.getHours()),
    minu = withData(newDate.getMinutes()),
    seco = withData(newDate.getSeconds());

  return [year, mont, date, hour, minu, seco];
}

function dateTimePicker(startYear, endYear, date) {
  console.log(startYear, endYear, date)
  // 返回默认显示的数组和联动数组的声明
  var dateTime = [],
    dateTimeArray = [
      [],
      [],
      [],
      [],
      [],
      []
    ];
  var start = startYear || 1978;
  console.log(start)
  var end = endYear || 2100;
  console.log(end)
  console.log(date)
  // 默认开始显示数据
  var defaultDate = date ? [...date.split(' ')[0].split('-'), ...date.split(' ')[1].split(':')] : getNewDateArry();
  console.log(defaultDate)
  // 处理联动列表数据
  /*年月日 时分秒*/
  dateTimeArray[0] = getLoopArray(start, end);
  dateTimeArray[1] = getLoopArray(1, 12);
  dateTimeArray[2] = getMonthDay(defaultDate[0], defaultDate[1]);
  dateTimeArray[3] = getLoopArray(0, 23);
  dateTimeArray[4] = getLoopArray(0, 59);
  dateTimeArray[5] = getLoopArray(0, 59);
  console.log(dateTimeArray)
  dateTimeArray.forEach((current, index) => {
    dateTime.push(current.indexOf(defaultDate[index]));
  });
  console.log(dateTimeArray)
  console.log(dateTime)
  return {
    dateTimeArray: dateTimeArray,
    dateTime: dateTime
  }
}

//预订时间处理器
function travelDateTimePicker() {

  let date = new Date(); //当前日期
  let year = date.getFullYear();//当前年份
  let month = date.getMonth() + 1; //当前月份
  let dateTime = date.getDate(); //当前日期
  let hour = date.getHours(); //当前小时
  let m = date.getMinutes(); //当前分
  let s = date.getSeconds();//当前秒
  let week = date.getDay(); //星期几
  let hours = getCurrentTime(1); //获取当前天剩余小时  半小时后
  let minutes = getCurrentTime(2); //获取当前剩余分钟数组  半小时后
  // 明天
  let nextDate = getNextDate(1); //明天日期
  let month1 = nextDate.getMonth() + 1; //明天月份
  let dateTime1 = nextDate.getDate(); //明天日期
  let week1 = nextDate.getDay(); //星期几
  // 后天
  let nextDate1 = getNextDate(2); //后天日期
  let month2 = nextDate1.getMonth() + 1; //明天月份
  let dateTime2 = nextDate1.getDate(); //明天日期
  let week2 = nextDate1.getDay(); //星期几

  let dateArray = []; //日期数组
  dateArray.push(month + "月" + dateTime + "日" + getWeek(week));
  dateArray.push(month1 + "月" + dateTime1 + "日" + getWeek(week1));
  dateArray.push(month2 + "月" + dateTime2 + "日" + getWeek(week2));

  let dateTimeArr = [];
  dateTimeArr.push(dateArray);
  dateTimeArr.push(hours);
  dateTimeArr.push(minutes);

  return {
    dateArray: dateArray,
    dateTimeArr: dateTimeArr,
    dateYear:year
  }
}

//获取下一个日期
//n 间隔天使
function getNextDate(n) {
  return new Date(new Date().setTime(new Date().getTime() + 24 * 60 * 60 * 1000 * n));
}

function getWeek(n) {
  let weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  return weekday[n];
}

//获取正常的时间数组  1小时 2分钟
function getTime(type) {
  if (type == 1) return getLoopArray(0, 23, "点");
  return getLoopArray(0, 59, "分");
}

//获取当前的时间 半小时后的数组  1小时 2分钟   
function getCurrentTime(type) {
  if (type == 1) return getLoopArray(new Date(new Date().getTime() + 1000 * 60 * 31).getHours(), 24,"点");
  return getLoopArray(new Date(new Date().getTime() + 1000 * 60 * 31).getMinutes(), 59,"分");
  
  // let date = new Date();
  // if (type == 1) {
  //   if (date.getMinutes() + 30 > 59) {
  //     return getLoopArray(date.getHours() + 1, 24, "点")
  //   } else {
  //     return getLoopArray(date.getHours(), 24, "点")
  //   }
  // } else {
  //   if (date.getMinutes() + 30 > 59) {
  //     return getLoopArray(date.getMinutes()-29, 59, "分");
  //   } else {
  //     return getLoopArray(date.getMinutes(), 59, "分");
  //   }
  // }

}

module.exports = {
  dateTimePicker: dateTimePicker,
  getMonthDay: getMonthDay,
  travelDateTimePicker: travelDateTimePicker,
  getTime: getTime,
  getCurrentTime: getCurrentTime
}