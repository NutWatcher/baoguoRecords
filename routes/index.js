var express = require('express');
var router = express.Router();
var orderHttp = require('../servies/http');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('print', { title: 'Express' });
    //res.render('index', { title: 'Express' });
});
router.post('/order', function(req, res, next) {
    var orders = req.body.orders;
    console.log(orders);
    var orderList = orders.split(',');
    var order = orderList[0];
    orderHttp(order, function (code , resMsg) {
        console.log(code);
        console.log(resMsg);
        if (code == 200){
            res.json({
                code:code,
                res:resMsg
            });
        }
        else {
            res.json({
                code:4004,
                res:resMsg
            });
        }
    });
});
module.exports = router;
