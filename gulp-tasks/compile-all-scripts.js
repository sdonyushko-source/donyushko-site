const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');

module.exports = (browserSync) => () => {
	return gulp.src([
			'app/sections/*/*.js',
			'app/blocks/*/*.js',
		])
		.pipe(concat('common.js'))
		.pipe(gulp.dest('dist/js'))
		.pipe(browserSync.reload({ stream: true }))
};
