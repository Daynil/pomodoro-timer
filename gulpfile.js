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
	gulp.watch(['*.html', '*.js'], browserSync.reload);
	gulp.watch(['*.ts'], ['ts-watch']);
	
	// Watches for changes in css files, grabs the files, pipes them to browsersync stream
	// This injects the css into the page without a reload
	gulp.watch('*.css', function() {
		gulp.src('*.css')
			.pipe(browserSync.stream());
	});
});

// Make sure the compile-ts task completes before reloading browsers
gulp.task('ts-watch', ['compile-ts'], browserSync.reload);

gulp.task('compile-ts', function() {
	var sourceTsFiles = [
		config.allTs,
		config.typings
	];
	
	var tsResult = gulp
		.src(sourceTsFiles)
		.pipe(sourcemaps.init())
		.pipe(tsc(tsProject));
	
	return tsResult
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(config.tsOutputPath));
});