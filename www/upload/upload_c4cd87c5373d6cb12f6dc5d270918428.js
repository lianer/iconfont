// var tools={
//     fs: require("fs"),
//     childProcess: require("child_process")
// };

// var express=require("express");
// var router=express.Router();

// var app=express();

// router.get("/", function (req, res, next) {
//     res.status(200).sendFile("mock.js", {
//         root: "D:/dev/nodejs/node_modules/mockjs/dist/"
//     });
// });

// var server=app.listen(3000, function () {
//     var address=server.address();
//     console.log(address.port);
// });


// (function (data) {
//     data=$.parseJSON(data);

//     var hospitalSelect=$("#hospitalSelect");
//     var deptSelect=$("#deptSelect");

//     renderDeptSelect(hospitalSelect, data);

//     hospitalSelect.on("change", function () {
//         var hospitalId=hospitalSelect.val();
//         var data=findDeptByHospitalId(hospitalId);
//         renderDeptSelect(deptSelect, data);
//     });

//     function findDeptByHospitalId(hospitalId) {
//         for (var i = data.length - 1; i >= 0; i--) {
//             if(data[i].hospitalId==hospitalId){
//                 return data[i].hospDeptReferralList;
//             }
//         };
//         return [];
//     }

//     function renderDeptSelect(wrap, data) {
//         wrap.html("");
//         $.each(data, function (i, item) {
//             var option=$('<option>');
//             option.val(item.hospDeptId)
//                 .text(item.hospDeptName)
//                 .appendTo(wrap);
//         });
//     }

//     function renderHospitalSelect(wrap, data) {
//         wrap.html("");
//         $.each(data, function (i, item) {
//             var option=$('<option>');
//             option.val(item.hospitalId)
//                 .text(item.hospitalName)
//                 .appendTo(wrap);
//         });
//     }
// })('[{"hospDeptReferralList":[{"hospDeptId":"125617817919923000","hospDeptName":"神经外科"}],"hospitalId":"125336754304601000","hospitalName":"复旦大学附属华山医院"},{"hospDeptReferralList":[{"hospDeptId":"125617817919923000","hospDeptName":"神经外科"}],"hospitalId":"125336754304601000","hospitalName":"复旦大学附属华山医院"}]');
// 
// 
// 





var s="a\nb";

console.log(s);

var r=/ab/m.test(s);

console.log(r)