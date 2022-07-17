const gulp = require('gulp'); 
const { series, watch } = gulp;
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const include = require('gulp-include');
const minifycss = require('gulp-minify-css');
const ts = require('gulp-typescript');
const notify = require('gulp-notify');
const uglify = require('gulp-uglify');
const cssprefix = require('gulp-autoprefixer');
const image = require('gulp-imagemin');


const ASSET_PATH = 'app/Assets/**/';
const JS_PATH = `${ASSET_PATH}*.js`;
const TS_PATH = `${ASSET_PATH}*.ts`;
const CSS_PATH = `${ASSET_PATH}*.css`;
const SCSS_PATH = `${ASSET_PATH}*.scss`;
const IMG_PATH = `${ASSET_PATH}img/*`;

function errorNotify(error){
    notify.onError({title: "Gulp Error", message: "", sound: "Sosumi"})(error); 
    this.emit("end");
};

function compressIMG() {
	return gulp.src(IMG_PATH, {
		sourcemaps: true
	})
	.pipe(image())
	.pipe(gulp.dest('public/core/'));
}

function styleCSS() {
	return gulp.src(CSS_PATH, {
		sourcemaps: true
	})
	.pipe(include())
	.pipe(plumber({ errorHandler: errorNotify }))
	.pipe(cssprefix())
	.pipe(minifycss())
	.pipe(gulp.dest('public/core/'));
}
function styleSCSS() {
	return gulp.src(SCSS_PATH, {
		sourcemaps: true
	})
	.pipe(include())
	.pipe(plumber({ errorHandler: errorNotify }))
	.pipe(sass({ style: "compressed", noCache: true }))
	.pipe(cssprefix())
	.pipe(minifycss())
	.pipe(gulp.dest('public/core/'));
}

function scriptJS() {
	return gulp.src(JS_PATH, {
		sourcemaps: true
	})
	.pipe(include())
	.pipe(plumber({ errorHandler: errorNotify }))
	.pipe(uglify())
	.pipe(gulp.dest('public/core/'));
}
function scriptTS() {
	return gulp.src(TS_PATH, {
		sourcemaps: true
	})
	.pipe(include())
	.pipe(plumber({ errorHandler: errorNotify }))
	.pipe(ts())
	.pipe(uglify())
	.pipe(gulp.dest('public/core/'));
}

function watcher() {
	watch([CSS_PATH], styleCSS);
	watch([SCSS_PATH], styleSCSS);
	watch([JS_PATH], scriptJS);
	watch([TS_PATH], scriptTS);
	watch([IMG_PATH], compressIMG);
}

exports.default = series(scriptTS, scriptJS, styleCSS, styleSCSS, compressIMG);
exports.watch = series(watcher);