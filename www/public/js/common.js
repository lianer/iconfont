function require(selector, fn) {
    selector=$(selector);
    if(selector.length){
        fn(selector);
    }
}

var FileUpload=function () {
    var FU=function (params) {
        var fu=this;
        fu.params={
            ext: "",
            size: "",
            number: 0
        };
        fu.stack={};
        fu.lastIndex=0;
        fu.events={};
    };
    FU.prototype.on=function (e, fn) {
        var fu=this, events=fu.events;
        if(!events[e]){
            events[e]=[];
        }
        events[e].push(fn);
    };
    FU.prototype.publish=function (e) {
        var fu=this, events=fu.events,
            _arguments=arguments;
        if(events[e]){
            events[e].forEach(function (fn) {
                fn.apply(fu, [].slice.call(_arguments, 1));
            });
        }
    };
    FU.prototype.upload=function (files) {
        var fu=this;
        [].slice.call(files).forEach(function (file) {
            var item=fu.stack[fu.lastIndex]={
                id: fu.lastIndex,
                file: file,
                loaded: false,
                data: null
            }
            fu.startUpload(item);
            fu.lastIndex++;
        });
    };
    FU.prototype.startUpload=function (item) {
        var fu=this;
        var form=new FormData();
        form.append("file", item.file);
        $.ajax({
            url: "/upload",
            data: form,
            type: "post",
            processData: false,
            contentType: false,
            success: function (res) {
                if(res.code){
                    alert(res.message);
                    return;
                }
                // success
                fu.publish("success", res);
            },
            error: function (err) {
                alert("网络连接失败");
            }
        });
    };
    return FU;
}();

var observer=function(){
    var O=function(){
        this.stack={};
    };
    O.prototype.subscribe=function(name, fn){
        var o=this, stack= o.stack;
        if(!o[name]){
            o[name]=[];
        }
        o[name].push(fn);
    };
    O.prototype.publish=function(name){
        var o=this, stack= o.stack,
            args=[].slice.call(arguments, 1);
        if(!o[name]){
            return false;
        }
        o[name].forEach(function(fn){
            fn.apply(null, args);
        });
    }
    return new O;
}();
