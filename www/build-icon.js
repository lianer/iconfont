/**
 * 解析ttf、svg
 * var transfer=require("iconfont-transfer");
 *     transfer.parse(filepath); => 返回svg的数组集合
 *     transfer.merge(svg, filepath); => 合并svg，返回buffer，
 *         如果有filepath，则输出svg、ttf、woff、eot文件
 */

var fs = require("fs");
var path = require("path");
var fontCarrier = require("font-carrier");
var DOMParser = require('xmldom').DOMParser;
var _ = require('underscore');


/**
 * 生成unicode编号
 * @return {string} unicode编号
 */
var generateUnicode = function (index) {
    // &#x78;为保留字符，对应字母x，对应10进制120，
    // xp系统缺少它会蓝屏
    if (index === 120) {
        index++;
    }
    var unicode = "&#x" + index.toString(16) + ";";
    index++;
    return unicode;
};


module.exports = {};


/**
 * 解析ttf,svg
 * @param  {string} filepath   文件路径
 * @param  {number} startIndex 开始的字符编号，通常从数据库中已存在的条数n+1开始
 * @return {array}             返回svg集合
 *                             [{unicode: "&#x1;", svg: "<svg>...</svg>"}, ...]
 */
module.exports.parse = function (filepath) {
    var transferFont, allGlyph, name, svg, svgBuffer, svgString, doc, fontTag,
        res = [],
        font = fontCarrier.create(),
        index = 1,
        ext = path.extname(filepath);

    var parseTTF = function () {
        // fontCarrier.transfer 解析ttf或font类svg
        // font类svg是指该svg不是一个普通的图形，而是一个字符集，
        // 通过判断存不存在<font>标签来区分
        transferFont = fontCarrier.transfer(filepath);
        allGlyph = transferFont.allGlyph();

        for (name in allGlyph) {
            svg = allGlyph[name].toSvg();
            font.setGlyph(generateUnicode(index++), svg);
        }
    };

    var parseSVG = function () {
        svgBuffer = fs.readFileSync(filepath);
        svgString = svgBuffer.toString();
        // 使用DOMParser解析xml，判断该svg是否是字符集
        doc = new DOMParser().parseFromString(svgString, "application/xml");
        fontTag = doc.getElementsByTagName("font");

        // iconfont的svg（字符集）
        if (fontTag.length) {
            allGlyph  = fontCarrier.transfer(svgBuffer).allGlyph();
            _.each(allGlyph, function (glyph) {
                var name = glyph.options.name;
                if(name === 'nonmarkingreturn' || name === 'x' ){
                    return false;
                }
                font.setGlyph(generateUnicode(index++), glyph.toSvg());
            });
        }
        // 一个普通的svg
        else {
            font.setGlyph(generateUnicode(index++), svgBuffer);
        }
    };

    // 解析ttf为svg
    if (ext === ".ttf") parseTTF();
    // 解析svg
    else if (ext === ".svg") parseSVG();

    // 序列化所有svg
    allGlyph = font.allGlyph();
    _.each(allGlyph, function (glyph) {
        var svgString = glyph.options.svg, doc;
        if (svgString) {
            doc = new DOMParser().parseFromString(svgString, "application/xml");
            doc = doc.getElementsByTagName("svg");
            doc.length && res.push({
                xml: svgString,
                svg: doc[0].toString()
            });
        }
    });

    return res;
};


/**
 * 合并svg
 * @param  {array}  svgs     svg集合，通常从数据库取出
 *                           [{unicode: "&#x1;", svg: "<svg>...</svg>"}, ...]
 * @param  {string} filepath 输出路径，如果没有这个选项，则仅仅返回字符集的buffer
 * @return {object}          返回字符集buffer
 *                           {svg: <buffer>, ttf: <buffer>, woff: <buffer>, eot: <buffer>}
 */
module.exports.merge = function (svgs, filepath) {
    // 创建用于合并的空白字符面板
    var font = fontCarrier.create();

    svgs.forEach(function (svg) {
        // 逐条写入到字符面板中
        font.setGlyph(svg.unicode, svg.xml);
    });

    // 返回buffer，如果有filepath则同时输出4个字符集文件
    return font.output(filepath && {
            path: filepath
        });
};


return;
// 单元测试
var filepath = 'source/iconfont.svg';
var svg = module.exports.parse(filepath);
