var fs = require('fs');
var path = require('path');

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')(); // Load all gulp plugins
                                              // automatically and attach
var less = require('gulp-less');
var jade = require('gulp-jade');
var runSequence = require('run-sequence');
var cfg = require('./config.json');
var dirs = cfg['h5bpconfigs'].directories;
var ftpcfg = cfg['ftpconfigs'];
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ftp = require('gulp-ftp-env');
var replace = require('gulp-replace');

gulp.task('concat:js', function() {
  return gulp.src(dirs.src +'/assets/js/**/*')
    .pipe(concat('index.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dirs.dist+'/assets/js'))
});


gulp.task('compile:less', function () {

    //var banner = '/*! template v' +' */\n\n';

    return gulp.src(dirs.src+'/assets/css/*.less')
               .pipe(less())
             //  .pipe(plugins.header(banner))
               .pipe(gulp.dest(dirs.dist+'/assets/css'));

});

gulp.task('copy:img',function(){
    return gulp.src(dirs.src+'/assets/css/img/**/*')
	       .pipe(gulp.dest(dirs.dist+'/assets/css/img/**/*');
});

gulp.task('copy:misc', function () {
    return gulp.src([
    	dirs.src+'/**/*',
      	'!'+dirs.src+'/assets/css/**/*',
	'!'+dirs.src+'/assets/js/**/*'
    ], {
        // Include hidden files by default
        dot: true
    }).pipe(gulp.dest(dirs.dist));
});


gulp.task('jshint', function () {
    return gulp.src([
        'gulpfile.js',
         dirs.src+'assets/js/**/*'
    ]).pipe(plugins.jshint())
      .pipe(plugins.jshint.reporter('jshint-stylish'))
      .pipe(plugins.jshint.reporter('fail'));
});

gulp.task('watch', function () {
    gulp.watch([dirs.src+'/less/*'], ['compile:less']);
});

// -----------------------------------------------------------------------------
// | Main tasks                                                                |
// -----------------------------------------------------------------------------
gulp.task('clean', function (done) {
    require('del')([
        dirs.archive,
        dirs.dist
    ], done);
});

gulp.task('copy', [
	'copy:misc',
	'copy:img'
]);

gulp.task('compile',[
	'compile:less',
	'concat:js'
]);


gulp.task('build', function (done) {
    runSequence(
        ['clean'],
	'compile',
        'copy',
    done);
});

gulp.task('default', ['build']);

gulp.task('beta', function() {
    return gulp.src(dirs.dist + '/**')
      	  .pipe(ftp(ftpcfg.beta))
	
});

gulp.task('product', function() {
    return gulp.src(dirs.dist + '/**')
      	  .pipe(ftp(ftpcfg.beta))
	
});



