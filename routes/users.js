var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/woyouyizhixiaolaohu', function(req, res, next) {
    res.render('print', { title: 'Express' });
});

module.exports = router;
