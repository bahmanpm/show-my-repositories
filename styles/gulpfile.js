var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    connect = require('gulp-connect'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

var jsSources = ['scripts/*.js'],
    sassSources = ['styles/*.scss'],
    htmlSources = ['**/*.html'],
    outputDir = 'assets';

var materialCssTask = function() {
  // Copy Materialize CSS to styles folder
  return gulp.src('./node_modules/materialize-css/dist/css/*.css')
  .pipe(gulp.dest('./styles'));
}

var materialJsTask = function() {
  // Copy Materialize JS to scripts folder
  return gulp.src('./node_modules/materialize-css/dist/js/*.js')
  .pipe(gulp.dest('./scripts'));
}

var jqueryTask = function() {
  // Copy jQuery to scripts folder
  return gulp.src('./node_modules/jquery/dist/jquery.min.js')
  .pipe(gulp.dest('./scripts'));
}

var sassTask = function() {
  return gulp.src(sassSources)
  .pipe(sass({style: 'expanded'}))
    .on('error', gutil.log)
  .pipe(gulp.dest('assets'))
  .pipe(connect.reload())
};

var jsTask = function() {
  return gulp.src(jsSources)
  .pipe(uglify())
  .pipe(concat('script.js'))
  .pipe(gulp.dest(outputDir))
  .pipe(connect.reload())
};

var watchTask = function() {
  gulp.watch(jsSources, gulp.series(jsTask));
  gulp.watch(sassSources, gulp.series(sassTask));
  gulp.watch(htmlSources, gulp.series(htmlTask));
};

var jsHintTask = function() {
  return gulp.src('./scripts/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
};

var connectTask = function() {
  connect.server({
    root: '.',
    livereload: true
  })
};

var htmlTask = function() {
  return gulp.src(htmlSources)
  .pipe(connect.reload())
};

var defaultTasks = gulp.series(htmlTask, materialCssTask, jqueryTask, materialJsTask, sassTask, jsHintTask, jsTask, gulp.parallel(connectTask, watchTask));

exports.default = defaultTasks;