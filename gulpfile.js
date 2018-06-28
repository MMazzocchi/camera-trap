var gulp = require("gulp");
var mocha = require("gulp-mocha");
var browserify = require("browserify");
var source = require("vinyl-source-stream");

function buildCamera() {
  return browserify("./client/src/camera.js")
    .bundle()
    .pipe(source("camera.js"))
    .pipe(gulp.dest("./client/dist/"));
};

function buildSlideshow() {
  return browserify("./client/src/slideshow.js")
    .bundle()
    .pipe(source("slideshow.js"))
    .pipe(gulp.dest("./client/dist/"));
};

function test() {
  return gulp.src("./test/**/*.js")
    .pipe(mocha({reporter: "progress"}));
};

gulp.task("build", gulp.parallel(buildCamera, buildSlideshow));
gulp.task("test", test);
gulp.task("default", gulp.series("build"));
