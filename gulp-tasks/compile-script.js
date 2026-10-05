const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const rename = require("gulp-rename");

module.exports = (browserSync) => (pathFile) => {
	return gulp.src(pathFile)
		.pipe(rename({
			dirname: '',
		}))
		.pipe(gulp.dest('dist/js'))
		.pipe(browserSync.reload({ stream: true }))
};
