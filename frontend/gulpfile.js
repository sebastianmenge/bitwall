var gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    less = require('gulp-less'),
    historyApiFallback = require('connect-history-api-fallback'),
    gutil = require('gulp-util'),
    rimraf = require('gulp-rimraf'),
    replace = require('gulp-replace'),
    rename = require('gulp-rename'),
    uglifyify = require('uglifyify'),
    revall = require('gulp-rev-all'),
    envify = require('envify'),
    deamdify = require('deamdify'),
    runSequence = require('run-sequence'),
    plumber = require('gulp-plumber'),
    watchify = require('watchify'),
    browserify = require('browserify'),
    replaceify = require('replace-string-transform'),
    // CONFIG = require('./config').CONFIG,
    _ = require('underscore'),
    merge = require('merge-stream');

require('check-dependencies')({
    install: false,
}, function(res) {
  if (!res.depsWereOk) {
    gutil.log(gutil.colors.red("DEPENDENCY ISSUE:"));
    res.error.map(console.log);
  }
});

gulp.task('watchify', function() {
  var bundler = watchify('./jsx/app.jsx');

  var bundle = function(ids){
    return bundler
      .bundle({debug: true})
      .on("error", function(error) {
        gutil.log(gutil.colors.red("Error: "), error);
      })
      .on("end", function() {
        gutil.log("Created:", gutil.colors.blue('frontend.js'), (ids||[]).join(", "));
      })
      .pipe(source('frontend.js'))
      .pipe(gulp.dest('../app/assets/javascripts'))
  };

  bundler.on("update", bundle).
          on("log", function(message) {
            gutil.log(gutil.colors.cyan("Watchify: "),message);
          });

  return bundle();
});

// gulp.task("less", function(){
//   return gulp.src(_.pluck(APPS, 'lessEntry'))
//     .pipe(plumber())
//     .pipe(less())
//     .pipe(gulp.dest('./build'));
// });

gulp.task('clean', function () {
  return gulp.src(CONFIG.build, {read: false}).pipe(rimraf());
});

// gulp.task("watch", function(){
//   gulp.watch('./jsx/**/*.less', ["less"]);
// });

// gulp.task("install", ["less", "html-to-rails-dev",  "assets"]);

gulp.task("default", ["watchify"]);
