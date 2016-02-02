var parseSVG = function (){
    var part1 = '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" width="100px" height="100px" viewBox="0 0 1024 1024"><path d="';
    var part2 = '"/></svg>';

    var parseStandardSVG = function (xmlDoc){
        var paths = [];
        var glyphs = xmlDoc.getElementsByTagName('glyph');
        _.each(glyphs, function (glyph){
            var unicode = glyph.getAttribute('unicode');
            var name = glyph.getAttribute('name');
            var d = glyph.getAttribute('d');

            if(name === 'x' || !unicode || !d){
                return false;
            }

            paths.push({
                d: d,
                xml: part1 + d + part2,
                svg: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" width="100px" height="100px" viewBox="0 0 1024 1024"><path d="' + d + '"/></svg>'
            });
        });
        return paths;
    };

    var parseIconSVG = function (xmlDoc){
        var paths = [];
        var path = xmlDoc.getElementsByTagName('path');

        if(path.length){
            path = path[0];
            var d = path.getAttribute('d');
            if(d){
                paths.push({
                    d: d,
                    xml: part1 + d + part2,
                    svg: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" width="100px" height="100px" viewBox="0 0 1024 1024"><path d="' + d + '"/></svg>'
                });
            }
        }

        return paths;
    };

    var parse = function (str){
        var domParser = new DOMParser;
        var xmlDoc = domParser.parseFromString(str, 'text/xml');
        var paths;

        var fontTag = xmlDoc.getElementsByTagName('font');

        // 如果是iconfont文件
        if(fontTag.length){
            paths = parseStandardSVG(xmlDoc);
        }
        else{
            paths = parseIconSVG(xmlDoc);
        }

        return paths;
    };

    return parse;

}();



if(typeof global !== 'undefined'){
    var DOMParser = require('xmldom').DOMParser;
    var fs = require('fs');
    var _ = require('underscore');
    //var file = fs.readFileSync('C:/Users/Lianer/Desktop/test.svg').toString();
    var file = fs.readFileSync('../../source/iconfont.svg').toString();
    var paths = parseSVG(file);

    console.log(paths);
}