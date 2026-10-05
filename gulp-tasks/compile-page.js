const gulp = require('gulp');
const pug = require('gulp-pug');
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const path = require('path');

module.exports = (browserSync) => (pathFile) => {
	let filename = pathFile.split(path.sep).pop().split('.');
	filename.pop();
	filename = filename.join();

	return gulp.src(pathFile)
		.pipe(pug({
			basedir: 'app',
			locals: {
				filename,
			},
		}))
		.pipe(rename({
			dirname: '',
            extname: '.php',
		}))
		.on('error', notify.onError("Error: <%= error.message %>"))
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.reload({ stream: true }))
};
