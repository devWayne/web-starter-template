var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var less = require('gulp-less');
var del = require('del');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');



var $ = require('gulp-load-plugins')();


// Lint JavaScript
gulp.task('jshint', function () {
  return gulp.src('app/js/**/*.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

gulp.task('compress-js', function() {
  gulp.src('app/js/**/*.js')
    .pipe(uglify())
     .pipe(concat('all.min.js'))
        .pipe(gulp.dest('dist/js'));
});
    
gulp.task('concat-css', function() {
  gulp.src('app/css/**/*.css')
    .pipe(concat('all.css'))
    .pipe(gulp.dest('dist/css'))
});


// Copy All Files At The Root Level (app)
gulp.task('copy', function () {
  return gulp.src(['app/*'], {dot: true})
    .pipe(gulp.dest('dist/'))
    .pipe($.size({title: 'copy'}));
});

// Optimize Images
gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size({title: 'images'}));
});


//Compile less
gulp.task('build-less', function () {
  gulp.src('app/less/**/*.less')
     .pipe(less())
    .pipe(gulp.dest('app/css'));
});


// Clean Output Directory
gulp.task('clean', del.bind(null, ['.tmp', 'dist']));


gulp.task('serve:dist', ['default'], function() {
	browserSync({
		notify: false,
		server: {
			baseDir: 'dist'
		}
	});
});

// Watch Files For Changes & Reload
gulp.task('serve', function () {
  browserSync({
    notify: false,
    server: {
      baseDir: ['app/']
    }
  });

  gulp.watch(['app/**/*.html'], reload);
  gulp.watch(['app/less/**/*.less'], ['build-less']);
  gulp.watch(['app/css/**/*.css'], reload);
  gulp.watch(['app/js/**/*.js'], reload);
  gulp.watch(['app/images/**/*'], reload);
});

// Build Production Files, the Default Task
gulp.task('default', ['clean'], function (cb) {
  runSequence(['images','concat-css','compress-js','copy'], cb);
});
