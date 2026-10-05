const gulp = require('gulp');
const pug = require('gulp-pug');
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const foreach = require('gulp-foreach');
const concat = require('gulp-concat');
const path = require('path');

module.exports = (browserSync) => (done) => {
	return gulp.src('app/pages/*/*.pug')
		.pipe(foreach((stream, file) => {

			let filename = file.basename.split(path.sep).pop().split('.');
			filename.pop();
			filename = filename.join();
			
			return stream
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

		}))
		.pipe(concat('all-pages'))
		.pipe(browserSync.reload({ stream: true }))
};
