'use strict';

const gulp = require('gulp');
// const stylus = require('gulp-stylus');
const browserSync = require('browser-sync');
// const merge = require('gulp-merge');
// const notify = require('gulp-notify');
// const concat = require('gulp-concat');
const foreach = require('gulp-foreach');
// const autoprefixer = require('gulp-autoprefixer');
// const gcmq = require('gulp-group-css-media-queries');
// const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');
// const cssnano = require('gulp-cssnano');
const fs = require('fs');

const tasks = {
  compilePage: require('./gulp-tasks/compile-page')(browserSync),
  compileAllPages: require('./gulp-tasks/compile-all-pages')(browserSync),
  compileStyle: require('./gulp-tasks/compile-style')(browserSync),
  compileAllStyles: require('./gulp-tasks/compile-all-styles')(browserSync),
  compileScript: require('./gulp-tasks/compile-script')(browserSync),
  compileAllScripts: require('./gulp-tasks/compile-all-scripts')(browserSync),
};

gulp.task('compile-styles', function() {
  return gulp.src('app/pages/*/*.styl')
    .pipe(foreach(function(stream, file) {
      tasks.compileStyle('app/pages/*/' + file.basename);
      return stream;
    }))
});

gulp.task('compile-scripts', function() {
  return gulp.src('app/pages/*/*.js')
    .pipe(foreach(function(stream, file) {
      tasks.compileScript('app/pages/*/' + file.basename);
      return stream;
    }))
});

gulp.task('move-images', function() {
  return gulp.src(['app/images/**/*', '!app/images/project_3', '!app/images/project_3/**'])
    .pipe(gulp.dest('dist/images'))
});

gulp.task('move-fonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
});

gulp.task('move-libs', function() {
  return gulp.src('app/libs/**/*')
    .pipe(gulp.dest('dist/libs'))
});

gulp.task('move-root', function() {
  return gulp.src('app/root/**/*')
    .pipe(gulp.dest('dist'))
});

gulp.task('move-policy', function() {
    return gulp.src('app/pages/policy/*.html')
        .pipe(gulp.dest('dist'))
});

gulp.task('clean:dist', function(done) {
  if (fs.existsSync('./dist')) {
    return gulp.src('dist', { read: false })
      .pipe(clean())
  }

  done();
});

gulp.task('build', gulp.series('clean:dist', gulp.parallel(
  tasks.compileAllPages,
  'compile-styles',
  tasks.compileAllStyles,
  'compile-scripts',
  tasks.compileAllScripts,
  'move-images',
  'move-fonts',
  'move-libs',
  'move-root',
  'move-policy',
)));

gulp.task('default', gulp.series('clean:dist', gulp.parallel(
  tasks.compileAllPages,
  'compile-styles',
  tasks.compileAllStyles,
  'compile-scripts',
  tasks.compileAllScripts,
  'move-images',
  'move-fonts',
  'move-libs',
  'move-root',
  'move-policy',
), function server() {

    browserSync({
      proxy: '127.0.0.1:8080',
      notify: false,
      open: false,
    });

    gulp.watch([
      'app/layout.pug',
      'app/blocks/*/*.pug',
      'app/sections/*/*.pug',
    ], tasks.compileAllPages);

    gulp.watch([
      'app/fonts.styl',
      'app/reset.styl',
      'app/common.styl',
      'app/sections/section.styl',
      'app/sections/*/*.styl',
      'app/blocks/*/*.styl',
    ], tasks.compileAllStyles);

    gulp.watch([
      'app/sections/*/*.js',
      'app/blocks/*/*.js',
    ], tasks.compileAllScripts);

    gulp.watch([
        'app/pages/*/*.pug',
        'app/pages/*/*.php'
    ])
      .on('add', tasks.compilePage)
      .on('change', tasks.compilePage);

    gulp.watch('app/pages/*/*.styl')
      .on('add', tasks.compileStyle)
      .on('change', tasks.compileStyle);

    gulp.watch('app/pages/*/*.js')
      .on('add', tasks.compileScript)
      .on('change', tasks.compileScript);

    gulp.watch('app/images/**/*', '!app/images/project_3/**', gulp.series('move-images'));
    gulp.watch('app/fonts/**/*', gulp.series('move-fonts'));
    gulp.watch('app/libs/**/*', gulp.series('move-libs'));
    gulp.watch('app/root/**/*', gulp.series('move-root'));
}));
