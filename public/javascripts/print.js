Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o){
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}
function convertDateFromString(dateString) {
    if (dateString) {
        var arr1 = dateString.split(" ");
        var sdate = arr1[0].split('-');
        var timedate = arr1[1].split(':');
        var date = new Date(sdate[0], sdate[1]-1, sdate[2]);
        date.setHours(timedate[0]);
        date.setMinutes(timedate[1]);
        date.setSeconds(timedate[2]);
        return date;
    }
}
var setOrderData = function (str) {
    console.log(JSON.parse(str));
    $('#order_records').empty();
    var orderData = JSON.parse(str).Data.Records;
    var UseInfo = JSON.parse(str).Data.UseInfo;
    var startTime = null ;
    for (var i = 0 ; i < orderData.length ; i ++){
        var tempTime =convertDateFromString(orderData[i].ScanTime);
        var inTime = new Date(tempTime.getTime());
        var random = parseInt(3*Math.random());
        inTime.setHours(inTime.getHours() + random);
        random = parseInt(50*Math.random());
        inTime.setMinutes(inTime.getHours() + random);
        random = parseInt(50*Math.random());
        inTime.setSeconds(inTime.getHours() + random);
        inTime = inTime.Format("yyyy-MM-dd hh:mm:ss");

        var costTime = "---" ;
        if (startTime != null){
            var costTempTime = tempTime.getTime()-startTime.getTime();
            var days=Math.floor(costTempTime/(24*3600*1000));
            var leave1=costTempTime%(24*3600*1000); //计算天数后剩余的毫秒数
            var hours=Math.floor(leave1/(3600*1000));
            if (days != 0 ){
                costTime = days +  "天";
            }
            if (hours != 0 ){
                if (costTime == "---"){
                    costTime = "";
                }
                costTime += hours +  "小时";
            }
        }
        startTime = tempTime ;
        var str = "";
        str += "<tr class=\"h_l\">";
        str += "<td style='width: 160px;'>" + orderData[i].ScanTime + "</td>";
        str += "<td class='c_blue'>" + orderData[i].ScanSiteName + "</td>";
        str += "<td>" + orderData[i].ScanType + "</td>";
        str += "<td class='t_l' style='width: 260px;'>" + orderData[i].Memo
            .replace("已收件","<span class='c_red'>已收件</span>")
            .replace("已到达","<span class='c_red'>已到达</span>")
            .replace("已发往","<span class='c_red'>已发往</span>")
            .replace("已袋袋发往","<span class='c_red'>已袋袋发往</span>")
            .replace("已签收","<span class='c_red'>已签收</span>")+ "</td>";

        str += "<td>" + costTime + "</td>";

        str += "<td class='c_blue'>" + orderData[i].ScanUser + "</td>";
        str += "<td>" + orderData[i].Weight + "</td>";
        str += "<td>" + "</td>";
        str += "<td style='width: 160px;'>" + "</td>";
        str += "<td style='width: 160px;'>" + orderData[i].PackageNo + "</td>";
        str += "<td>" + "</td>";
        str += "<td>" + orderData[i].Other + "</td>";
        str += "<td style='width: 160px;'>" + inTime + "</td>";
        str += "<td  style='width: 160px;'>" + orderData[i].BqId + "</td>";


        str += "</tr>";
        $('#order_records').append(str);
    }

    //console.log(UseInfo);
    $('#UseSiteName').text(UseInfo.UseSiteName);
    $('#FirstSendSite').text(UseInfo.FirstSendSite);
    $('#CurrentOpSiteName').text(UseInfo.CurrentOpSiteName);
    $('#CurrentOpTime').text(UseInfo.CurrentOpTime);

};
var ajax_search = function (order) {
    $.ajax({
        url:"/order",
        method: "post",
        data:{
            orders: order
        },
        success :function (msg) {
            if (msg.code != 200){
                alert(msg.res);
            }
            else {
                setOrderData(msg.res);
                $('#orderNumber').text(order);
                $('#w_orderNumber_RecordsInfo').text(order + "跟踪记录");
                $('#w_orderNumber_useInfo').text(order + "面单使用情况");

            }
        }
    })
};
$(function(){
    $('#searchOrder').on('click',function () {
        $('#left_orderList').empty();
        var orderList = $('#order_searchData').val().split('\n');
        for (var  i = 0 ; i < orderList.length ; i ++){
            $('#left_orderList').append("<li class='left_li_orderList'>" + orderList[i] + "</li>");
        }
        $('#left_orderList li').on('click',function (e) {
            var a = $(this);
            console.log($(this).text());
            ajax_search($(this).text());
        });
        ajax_search(orderList[0])
    })
});