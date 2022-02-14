const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const uglify = require("gulp-uglify");

const paths = {
  sass: "./src/sass/**/*.scss",
  css: "./public/css",
  js: "./src/js/**/*.js",
  jsPublic: "./public/js",
  html: "./*.html",
  rootPublic: "./public/",
};

function compileSass() {
  return src("./src/sass/**/*.scss", { sourcemaps: true })
    .pipe(
      sass({
        outputStyle: "compressed",
      })
    )
    .pipe(dest("./public/css", { sourcemaps: "." }));
}

function watchSass() {
  watch(paths.sass, compileSass);
}

function compileJs() {
  return src(paths.js, { sourcemaps: true })
    .pipe(uglify())
    .pipe(dest(paths.jsPublic, { sourcemaps: "." }));
}

function watchJs() {
  watch(paths.js, compileJs);
}

exports.compileSass = compileSass; // not necessary to run, 'watchSass' function will run this one
exports.watchSass = watchSass; // run 'gulp' to start this one

exports.compileJs = compileJs;
exports.watchJs = watchJs;

exports.default = series(watchSass);
