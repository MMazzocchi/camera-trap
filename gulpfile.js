var gulp = require("gulp");
var mocha = require("gulp-mocha");
var browserify = require("browserify");
var source = require("vinyl-source-stream");

function build() {
  return browserify("./client/src/main.js")
    .bundle()
    .pipe(source("main.js"))
    .pipe(gulp.dest("./client/dist/"));
};

function test() {
  return gulp.src("./test/**/*.js")
    .pipe(mocha({reporter: "progress"}));
};

gulp.task("build", build);
gulp.task("test", test);
gulp.task("default", gulp.series("build"));
