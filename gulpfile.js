var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var tsc = require('gulp-typescript');
var tsProject = tsc.createProject('tsconfig.json');
var config = require('./gulp.config')();
var browserSync = require('browser-sync').create();

// Start a local server in base directory after compile-ts runs
gulp.task('serve', ['compile-ts'], function() {
	browserSync.init({
		server: {
			baseDir: './'
		}
	});
	
	// Watch for changes in html and ts files in base directory, reload if they occur
	gulp.watch(['*.html', '*.css'], browserSync.reload);
	gulp.watch(['*.ts'], ['ts-watch']);
	
});

// Make sure the compile-ts task completes before reloading browsers
gulp.task('ts-watch', ['compile-ts', 'reload']);

gulp.task('reload', ['compile-ts'], function() {
	browserSync.reload();
});

gulp.task('compile-ts', function() {
	var sourceTsFiles = [
		config.allTs,
		config.typings
	];
	
	var tsResult = gulp
		.src(sourceTsFiles)
		.pipe(sourcemaps.init())
		.pipe(tsc(tsProject));
	
	var stream = tsResult
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(config.tsOutputPath));
		
	return stream;
});