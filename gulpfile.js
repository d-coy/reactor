var gulp = require('gulp'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    watchify = require('watchify'),
    livereload = require('gulp-livereload');


gulp.task('watch', function () {
  var b = watchify(browserify({
    entries: './src/index.jsx',
    debug: true,
    transform: [babelify]
  }));

  b.on('update', function () { gutil.log('Rebundling...'); });
  b.on('time', function (time) { 
    gutil.log('Rebundled in:', gutil.colors.cyan(time + 'ms')); 
  });

  function rebundle () {
    return b.bundle()
      .on('error', function (err) {
        gutil.log(err);
      })
      .pipe(source('./index.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(uglify())
      .pipe(gulp.dest('./build'))
      .pipe(livereload());
  }

  b.on('update', rebundle);

  return rebundle();
});
 

gulp.task('build', function () {
  gulp.src('./src/index.html')
  .pipe(gulp.dest('./build'));
});

gulp.task('default', ['watch', 'build'], function () {
  livereload.listen(8080);
});
