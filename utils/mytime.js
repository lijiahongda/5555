
function getLocalTime(nS) { 
	//将时间戳（十三位时间搓，也就是带毫秒的时间搓）转换成时间格式
	// d.cTime = 1539083829787
	let date = new Date(nS);
	let year = date.getFullYear();
	let month = date.getMonth()+1;
	let day = date.getDate();
	month = month < 10 ? "0"+month:month;
	day = day < 10 ? "0"+day:day;
	date = year+'-'+month+'-'+day;
	console.log(date); // 2018-10-09
	return date;
}
function formatTimeTwo(number, format) {
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
      format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
	getLocalTime: getLocalTime,
	formatTimeTwo: formatTimeTwo,
}