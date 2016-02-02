var mongoose = require('mongoose')

setTimeout(function () {
    process.exit();
}, 1000);


/**
 * 方式一：
 * var db=mongoose.createConnection('localhost', 'test')
 * 
 *
 * 方式二：
 * mongoose.connect('mongodb://localhost/test')
 * var db=mongoose.connection;
 */

// 创建连接
// var testDB = mongoose.createConnection('mongodb://localhost/test')

var testDB = mongoose.connect('mongodb://localhost/test').connection

var ActorSchema = new mongoose.Schema({
    name: String,
    age: Number
})

testDB.on('error', function () {
    console.log('连接错误')
})

testDB.once('open', function () {
    console.log('db connected')

    var ActorModel = mongoose.model('actor', ActorSchema)

    var actors = ActorModel.find({}, function (err, res) {
        console.log(err || res);
    })


    // var will = new ActorModel({
    //     name: 'Will Hunting',
    //     age: 46
    // })

    // will.save(function (err) {
    //     console.log(err||"save success");
    // });

})


return


var testEntity = new TestModel({
    name: 'lianer',
    password: '123'
})

testEntity.save(function (err) {
    if(err){
        console.log(err)
        return
    }
    console.log('save success')
})

console.log(testEntity)


// mongoose.connect('localhost');











