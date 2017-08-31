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
    var weight = UseInfo.weight ;
    var startTime = null ;
    var resStr = "";
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

        var tempWeight = "---" ;
        if (orderData[i].Memo.indexOf("已到达") > 0 ){
            tempWeight = parseFloat(weight) + (1-Math.random()) ;
            tempWeight = tempWeight.toFixed(1);
        }
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
        if (i == 0){
            startTime = tempTime ;
        }

        var str = "";
        str += "<tr class=\"h_l\">";
        if ( i == orderData.length -1){
            str = "<tr class=\"h_l b_o\">";
        }
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
        str += "<td>" + tempWeight + "</td>";
        str += "<td>" + "</td>";
        str += "<td style='max-width: 160px;'>" + "</td>";
        str += "<td style='max-width: 160px;'>" + orderData[i].PackageNo + "</td>";
        str += "<td>" + "</td>";
        str += "<td>" + orderData[i].Other + "</td>";
        str += "<td style='max-width: 160px;'>" + inTime + "</td>";
        str += "<td  style='max-width: 160px;'>" + orderData[i].BqId + "</td>";


        str += "</tr>";
        resStr+=str;
        $('#order_records').append(str);
    }
    var resResult = {
        "records":resStr,
        "UseSiteName":UseInfo.UseSiteName,
        "FirstSendSite":UseInfo.FirstSendSite,
        "CurrentOpSiteName":UseInfo.CurrentOpSiteName,
        "CurrentOpTime":UseInfo.CurrentOpTime
    };
    return resResult;
    //console.log(UseInfo);
    $('#UseSiteName').text(UseInfo.UseSiteName);
    $('#FirstSendSite').text(UseInfo.FirstSendSite);
    $('#CurrentOpSiteName').text(UseInfo.CurrentOpSiteName);
    $('#CurrentOpTime').text(UseInfo.CurrentOpTime);

};
var ajax_search = function (order , cb) {
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
                cb(order,msg.res);
                // setOrderData(msg.res);
                // $('#orderNumber').text(order);
                // $('#w_orderNumber_RecordsInfo').text(order + "跟踪记录");
                // $('#w_orderNumber_useInfo').text(order + "面单使用情况");

            }
        }
    })
};
var insertRecords = function (orderNumber, resStr) {
    var parseData = setOrderData(resStr);
    var str_content =
        "<div class=\"content_wrap\">\n" +
        "            <table>\n" +
        "                <thead class=\"c_gray\">\n" +
        "                <tr class=\"h_xl \">\n" +
        "                    <td> <img src=\"/images/text.png\"/><span style=\"font-weight: bold; color: rgb(238,106,5);\"> "+ orderNumber +"</span></td>\n" +
        "                    <td style=\"text-align: right\"><img src=\"/images/arrow.png\"/></td>\n" +
        "                </tr>\n" +
        "                </thead>\n" +
        "                <tbody>\n" +
        "                    <tr class=\"h_xl t_c\">\n" +
        "                        <td>\n" +
        "                            <div class=\"btn action_btn\">运单发放</div>\n" +
        "                            <div class=\"btn action_btn\">没有图片</div>\n" +
        "                            <div class=\"btn action_btn\">订单信息</div>\n" +
        "                            <div class=\"btn action_btn\">录单记录</div>\n" +
        "                            <div class=\"btn action_btn\">短信记录</div>\n" +
        "                            <div class=\"btn action_btn\">车辆信息</div>\n" +
        "                        </td>\n" +
        "                        <td></td>\n" +
        "                    </tr>\n" +
        "                    <tr class=\"h_xl c_lightGray\"><td><div class=\"s_headWrap\" ></div><span>"+orderNumber+"</span> </td><td></td></tr>\n" +
        "                </tbody>\n" +
        "            </table>\n" +
        "            <table>\n" +
        "                <thead class=\"c_gray t_c\">\n" +
        "                    <tr class=\"h_l f_w\">\n" +
        "                        <td>使用网点</td>\n" +
        "                        <td>揽件网点</td>\n" +
        "                        <td>首次发件网点</td>\n" +
        "                        <td>当前OP</td>\n" +
        "                        <td>当前OP网点</td>\n" +
        "                        <td>当前OP时间</td>\n" +
        "                        <td>当前所在地</td>\n" +
        "                        <td>出港中心</td>\n" +
        "                        <td>进港中心</td>\n" +
        "                    </tr>\n" +
        "                </thead>\n" +
        "                <tbody>\n" +
        "                    <tr class=\"h_l t_c\">\n" +
        "                        <td >"+parseData.UseSiteName+"</td>\n" +
        "                        <td >"+parseData.UseSiteName+"</td>\n" +
        "                        <td >"+parseData.FirstSendSite+"</td>\n" +
        "                        <td></td>\n" +
        "                        <td >"+parseData.CurrentOpSiteName+"</td>\n" +
        "                        <td >"+parseData.CurrentOpTime+"</td>\n" +
        "                        <td></td>\n" +
        "                        <td></td>\n" +
        "                        <td></td>\n" +
        "                    </tr>\n" +
        "                </tbody>\n" +
        "            </table>\n" +
        "            <table>\n" +
        "                <thead class=\"c_lightGray\">\n" +
        "                    <tr class=\"h_xl \">\n" +
        "                        <td><div class=\"s_headWrap\" ></div> <span>"+orderNumber+"</span></td>\n" +
        "                    </tr>\n" +
        "                </thead>\n" +
        "            </table>\n" +
        "            <table>\n" +
        "                <thead class=\"c_gray t_c\">\n" +
        "                <tr class=\"h_l f_w\">\n" +
        "                    <td>扫描时间</td>\n" +
        "                    <td>扫描网店</td>\n" +
        "                    <td>扫描类型</td>\n" +
        "                    <td>跟踪记录</td>\n" +
        "                    <td>用时</td>\n" +
        "                    <td>扫描员</td>\n" +
        "                    <td>重量</td>\n" +
        "                    <td>班次</td>\n" +
        "                    <td>目的地点</td>\n" +
        "                    <td>包号</td>\n" +
        "                    <td>车签号</td>\n" +
        "                    <td>其他</td>\n" +
        "                    <td>入库时间</td>\n" +
        "                    <td>巴枪ID</td>\n" +
        "                </tr>\n" +
        "                </thead>\n" +
        "                <tbody class=\"t_c\">\n" +
                        parseData.records+
        "                </tbody>\n" +
        "            </table>\n" +
        "        </div>";
    $('.right_wrap').append(str_content);
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
            //ajax_search($(this).text());
        });
        $('.content_wrap').remove();
        for (var  i = 0 ; i < orderList.length ; i ++){
            ajax_search(orderList[i], insertRecords);
        }

    })
});