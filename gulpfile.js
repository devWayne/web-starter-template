var gulp = require('gulp');
var less = require('gulp-less');
var del = require('del');
var runSequence   = require('run-sequence');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');


gulp.task('compress-js', function() {
  return gulp.src('app/js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});
    
gulp.task('concat-css', function() {
  gulp.src('app/css/**/*.css')
    .pipe(gulp.dest('dist/css'))
});


// Copy All Files At The Root Level (app)
gulp.task('copyhtml', function () {
  return gulp.src(['app/html/*'], {dot: true})
    .pipe(gulp.dest('dist/html/'))
});

// Copy all static images
gulp.task('copyimage', function() {
  return gulp.src('app/images/**/*')
    .pipe(gulp.dest('dist/images'));
});

//Compile less
gulp.task('build-less', function () {
  gulp.src('app/less/**/*.less')
     .pipe(less())
    .pipe(gulp.dest('app/css'));
});


// Clean Output Directory
gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

// Watch Files For Changes & Reload
gulp.task('serve', function () {
  gulp.watch(['app/less/**/*.less'], ['build-less']);
});

// Build Production Files, the Default Task
gulp.task('default', ['clean'], function (cb) {
  runSequence(['build-less','concat-css','compress-js','copyhtml','copyimage'], cb);
});
