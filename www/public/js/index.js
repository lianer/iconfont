

require("#upload-btn", function (context) {
    var elem={
        btn: context,
        container: $("#upload-container"),
        wrap: $("#upload-wrap"),
        file: $("#upload-file"),
        queue: $("#upload-queue"),
        tip: $("#upload-tip"),
        tmpl: $("#upload-queue-tmpl"),
        submit: $("#upload-submit"),
        iconList: $("#icon-list"),
        iconListTmpl: $("#icon-list-tmpl")
    }, state={
        stack: []
    };

    // 更新上传提示
    var uploadTip={
        tips: {
            start: "<label for=\"upload-file\" style=\"text-decoration: underline;cursor: pointer;\">点击上传</label><br>或将文件 (.ttf, .svg) 拖拽到此上传",
            upload: "上传中，请稍等",
            submit: "提交中，请稍等"
        },
        elem: elem.tip,
        show: function (message) {
            elem.tip.html(message).show();
        },
        hide: function () {
            elem.tip.html("").hide();
        }
    };

    // 获取图标
    var getIconList=function(){
        $.ajax({
            url: "/getIconList",
            data: {
                rows: 10,
                page: 0
            },
            success: function(res){
                if(!res || res.code){
                    alert(res.message);
                    return false;
                }
                $.tmpl(elem.iconListTmpl, res.icons).appendTo(elem.iconList);
            },
            error: function(err){
                alert(err);
            }
        });
    };

    getIconList();

    var fileUpload=new FileUpload();

    // 上传成功，返回list [{id: "文件id", "svg": "svg标签", "xml": "xml标签"}...]
    fileUpload.on("success", function (res) {
        var list=res.data;
        state.stack=state.stack.concat(list);
        $.tmpl(elem.tmpl, list).appendTo(elem.queue);

        uploadTip.hide();
    });

    // 点击弹窗
    elem.btn.on("click", function () {
        elem.container.show();
        uploadTip.show(uploadTip.tips.start);
    });

    // 点击上传
    elem.file.on("change", function (e) {
        // 自己解析svg出来的图标是倒的，不知道是什么原因
        //var fileReader = new FileReader();
        //
        //fileReader.addEventListener("load", function () {
        //    var icons = parseSVG(this.result);
        //    state.stack=state.stack.concat(icons);
        //    $.tmpl(elem.tmpl, icons).appendTo(elem.queue);
        //});
        //
        //fileReader.readAsText(this.files[0]);

         fileUpload.upload(this.files);
         uploadTip.show(uploadTip.tips.upload);
    });

    // 点击提交命名，检查state.stack.name
    elem.submit.on("click", function (e){
        var finished = true;
        state.stack.forEach(function (item){
            var li = elem.queue.find("[data-id=\"" + item.id + "\"]");
            item.name = li.find("input").val().trim();
            if(!item.name){
                li.addClass("error");
                if(finished){
                    finished = false;
                }
            }
            else{
                li.removeClass("error");
            }
        });
        if(finished){
            //submit
            $.ajax({
                url: elem.submit.data("action"),
                type: "post",
                contentType: 'application/json',
                data: JSON.stringify(state.stack),
                success: function (res){
                    if(!res || res.err){
                        alert(res.message || "服务器错误");
                        return false;
                    }
                    elem.container.hide();
                    observer.publish("iconfont-upload-success", res.data);
                },
                error: function (){
                    alert("网络连接失败");
                }
            })
        }
    });

    // 命名修改，实时映射到state.stack
    elem.queue.on("keyup", "input", function (e){
        var input = $(this);
        li.removeClass("error");
    });

    // 拖拽上传
    elem.container.on("dragenter, dragover", function (e) {
        e.stopPropagation();  
        e.preventDefault();
    });
    elem.container.on("drop", function (e) {
        e=e.originalEvent;
        e.stopPropagation();
        e.preventDefault();
        var files=e.dataTransfer.files;
        fileUpload.upload(files);

        uploadTip.show(uploadTip.tips.upload);
    });


    //elem.btn.trigger("click");

    observer.subscribe("iconfont-upload-success", function (data){
        getIconList();
    });

});