var mongoose = require('mongoose');

// 构造模式
var schema = new mongoose.Schema({
    name: String,  // 名称，可重复
    unicode: String,  // unicode编码，唯一
    svg: String,
    group: String,  // 分组，为后期项目分组做准备
    meta: {
        createAt: {
            type: Date,
            default: Date.now()  // mongodb中储存的是utc+0时间，取出后node会对其自动的进行转换成utc+8
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

// pre必须带next参数
schema.pre('save', function (next) {
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }
    else{
        this.meta.updateAt = Date.now();
    }
    next()
});

schema.statics = {
    $count: function (cb) {
        return this.count({}, cb);
    },
    fetch: function (cb) {
        return this.find({}).sort('meta.updateAt').exec(cb);
    },
    findById: function (id, cb) {
        return this.findOne({_id: id}).exec(cb);
    }
};


// 创建模型
var Iconfont = mongoose.model('iconfont', schema);

module.exports = Iconfont;





return
// 单元测试
setTimeout(function () {
    process.exit()
}, 2000);

mongoose.connect('mongodb://localhost/iconfont');

//mongoose.connection.on('open', function (next) {
//    // 插入函数
//    var list = [
//        {
//            name: '1',
//            unicode: '',
//            svg: ''
//        },
//        {
//            name: '2',
//                unicode: '',
//            svg: ''
//        }
//    ];
//
//    Iconfont.create(list, function (err, res){
//        console.log(err || res);
//    });
//
//    //var iconfont = new Iconfont(list);
//    //iconfont.save(function (err, res){
//    //    console.log(err || res);
//    //});
//
//    // 内置统计函数
//    //Iconfont.$count(function (err, res) {
//    //    if(err){
//    //        console.log(err)
//    //    }
//    //    else{
//    //        console.log(res)
//    //    }
//    //})
//
//    // 查找函数
//    // var iconfont = Iconfont.findOne({}, function (err, res) {
//    //     if(err){
//    //         console.log(err)
//    //     }
//    //     else{
//    //         console.log(res)
//    //     }
//    // })
//
//
//    // var iconfont = new Iconfont({
//    //     name: 'love',
//    //     svg: '<svg></svg>'
//    // })
//
//    // iconfont.save(function (err) {
//    //     if(err){
//    //         console.log(err)
//    //     }
//    //     else{
//    //         console.log('save success')
//    //     }
//    // })
//});

