var gulp=require("gulp");
var less=require("gulp-less");
var cssmin=require("gulp-cssmin");
var plumber=require("gulp-plumber");
var gutil=require("gulp-util");
var livereload=require("gulp-livereload");


var errorHandler=function (e){
    gutil.beep();
    gutil.log(e);
};


gulp.task("build", function () {
    gulp.src(["less/*.less"])
        .pipe(less())
        .pipe(cssmin())
        .pipe(gulp.dest("css"));

    gulp.src(["less/*.css"])
        .pipe(gulp.dest("css"));
});


gulp.task("watch", function () {
    gulp.watch(["less/*.less"], function (file) {
        // gulp.src(file.path)
        gulp.src([file.path])
            .pipe(plumber({errorHandler: errorHandler}))
            .pipe(less())
            .pipe(gulp.dest("css"));
    });

    livereload.listen();

    gulp.watch(["css/*.css", "js/*.js", "view/*.php"]).on('change', livereload.changed);
});

gulp.task("default", ["build", "watch"]);


