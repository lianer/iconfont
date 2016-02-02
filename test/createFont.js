var fs=require("fs");
var fontCarrier=require("font-carrier");

// 创建空白字体对象
var font=fontCarrier.create();

// 从其他字体解析
// var transFont=fontCarrier.transfert("./test.ttf");


// 获取svg
var fontSvg=fs.readFileSync("./test.svg").toString();

// 可以设置某个字对应的形状（编号），当然unicode也是支持的
// font.setSvg("我", fontSvg);

// 也可以使用setGlyph可以设置更多信息
font.setGlyph("我", {
    glyphName: "我", 
    horizAdvX: "1024", // 设置这个字形的画布大小为1024
    svg: fontSvg
});

// 也可以先拿到对应的字形对象，再到处对应的svg
// var glyph=transFont.getGlyph("我");
// glyph.toSvg();


// 导出字体，默认会导出svg,ttf,eot,woff四种字体，不传path会返回一个包含四个字体的buffer对象
font.output({
    path: "./iconfont"
});




