var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");

function build() {
  return browserify("./client/src/main.js")
    .bundle()
    .pipe(source("main.js"))
    .pipe(gulp.dest("./client/dist/"));
};

gulp.task("build", build);
gulp.task("default", gulp.series("build"));
