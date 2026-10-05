const gulp = require('gulp');
const notify = require('gulp-notify');
const stylus = require('gulp-stylus');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const gcmq = require('gulp-group-css-media-queries');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('gulp-cssnano');
const rename = require("gulp-rename");
const path = require('path');

module.exports = (browserSync) => () => {
	return gulp.src([
        'app/fonts.styl',
		'app/reset.styl',
		'app/common.styl',
		'app/sections/section.styl',
		'app/sections/*/*.styl',
		'app/blocks/*/*.styl',
	])
	.pipe(concat('common.styl'))
	.pipe(stylus({
		'include css': true,
		// 'compress': production,
	}))
	.on('error', notify.onError("Error: <%= error.message %>"))
	.pipe(autoprefixer({
		browsers: ['last 30 versions'],
		cascade: false,
	}))
	.pipe(gcmq())
	.pipe(cssnano())
	.pipe(gulp.dest('dist/css'))
	.pipe(browserSync.reload({ stream: true }))
};
