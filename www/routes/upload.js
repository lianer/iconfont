var path = require('path');
var fs = require('fs');
var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var Iconfont = require('../models/iconfont');
var buildIcon = require('../build-icon');
var _ = require('underscore');
var crypto = require('crypto');

var fileStack = [];
var iconfntCacheDir = 'd:/temp/iconfont';

var md5 = function (str){
    return crypto.createHash('md5').update(str).digest('hex');
};

/* GET home page. */
router.post('/', function (req, res, next){
    var form = new formidable.IncomingForm();
    // 设置上传路径
    form.uploadDir = './upload';
    // 保留扩展名
    form.keepExtensions = true;
    // 文件大小限制
    form.maxFieldsSize = 10 * 1024;

    // 解析req
    form.parse(req);

    // 接收成功
    form.on('file', function (name, file) {
        var svgs = buildIcon.parse(file.path);

        var length = svgs.length, finished = 0;
        _.each(svgs, function(svg) {
            var filename = md5(svg.svg + Math.random()) + '.svg';
            svg.id = filename;
            fs.writeFile(path.join(iconfntCacheDir, filename), svg.xml, function () {
                if(++finished === length){
                    res.json({
                        err: 0,
                        data: svgs
                    });
                }
            });
        });
    });

});

router.post('/save', function (req, res, next){
    var list = req.body;
    var data = [];

    list.forEach(function (item){
        data.push({
            name: item.name,
            svg: item.svg,
            xml: item.xml
        });
    });
    Iconfont.create(data, function (err, result){
        if(err){
            res.json({
                err: 1,
                message: "服务器错误"
            });
            return false;
        }

        var iconfontBuffer = buildIcon.merge(result);

        res.json({
            err: 0,
            message: "操作成功",
            data: result
        });
    });
});

module.exports = router;