var http = require('http');
var crypto = require('crypto');
var querystring = require('querystring');
var moment = require('moment');
var config = require('../config');
var buffertools = require('buffertools');

buffertools.extend();
var getWeight = function (order, cb) {
    try {
        var post_data = {
            "name": config.baoguoName,
            "secret": config.baoguoSecret,
            "orderInfo": JSON.stringify([order])
        }
        console.log("postData finish");
        post_data = querystring.stringify(post_data);
        console.log("报文内容");
        //console.log(post_data);
        var options = {
            host: config.baoguoHost,
            port: config.baoguoPort,
            path: config.baoguoUrl,
            method: 'POST',
            headers: {
                'Content-Type': "application/x-www-form-urlencoded",
                "Content-Length": post_data.length
            }
        };
        var chunks = new Buffer('');
        var req = http.request(options, function(res) {
            console.log('STATUS: ' + res.statusCode);
            //console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                chunks = chunks.concat(chunk);
            });
            res.on('end',  function () {
                cb(res.statusCode, chunks.toString());
            });
        });

        //130秒超时处理
        req.setTimeout(13000, function() {
            console.log("超时");
            if (req.res) {
                req.res.emit("abort");
            }
            req.abort();
            cb(4004, "超时");
        });
        req.on('error', function(e) {
            console.log('uploadOrder problem with request: ' + e.message);
            cb(4004, e.stack);
        });
        req.write(post_data);
        req.end();
    }
    catch(e) {
        console.log("uploadOrder error");
        console.log(e.stack);
        cb(4004, e.stack);
    }
};
var getRecords = function getOrderStatus(order, cb) {
    try {
        var appKey = config.appKey;
        var appId = config.appId;
        var ts = new Date().getTime();
        var str = appId + "/" + appKey + "/" + ts + "/GetByBillCode" ;
        console.log("签名字串");
        console.log(str);
        var md5 = crypto.createHash('md5');
        md5.update(new Buffer(str).toString("binary"));/////要转换成2进制，不然加密出来结果不一样
        var secret_md5 = md5.digest('hex');
        console.log("签名加密");
        console.log(secret_md5);
        var post_data = {
            "appId": appId,
            "ts": ts,
            "Sign":secret_md5,
            "BillCode": order
        };
        post_data = querystring.stringify(post_data);
        console.log("报文内容");
        //console.log(post_data);
        var options = {
            host:config.host,
            port:config.port,
            path:config.path,
            method: 'get',
            headers: {
                'Content-Type':"application/x-www-form-urlencoded;charset=utf-8",
                "Content-Length": post_data.length
            }
        };
        var chunks = new Buffer('');
        var req = http.request(options, function(res) {
            console.log('STATUS: ' + res.statusCode);
            //console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                chunks = chunks.concat(chunk);
            });
            res.on('end',  function () {
                cb(res.statusCode, chunks.toString());
            });
        });

        //130秒超时处理
        req.setTimeout(13000, function() {
            console.log("超时");
            if (req.res) {
                req.res.emit("abort");
            }
            req.abort();
            cb(4004, "超时");
        });
        req.on('error', function(e) {
            console.log('uploadOrder problem with request: ' + e.message);
            cb(4004, e.stack);
        });
        req.write(post_data);
        req.end();
    }
    catch(e) {
        console.log("uploadOrder error");
        console.log(e.stack);
        cb(4004, e.stack);
    }
};
module.exports={
    getRecords:getRecords,
    getWeight:getWeight
}