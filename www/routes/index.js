var express = require('express');
var router = express.Router();
var Iconfont = require('../models/iconfont');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('./home/index', { title: 'iconfont'});
});

router.get('/getIconList', function (req, res, next){
    Iconfont.fetch(function (err, result){
        var icons=[];
        if(err){
            console.log(err);
        }
        else{
            icons=result;
        }
        res.json({icons: icons});
    });
});

module.exports = router;
