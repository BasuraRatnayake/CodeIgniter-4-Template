const GULP = require('gulp'); 
const { series, watch } = GULP;
const SASS = require('gulp-sass')(require('sass'));
const PLUMBER = require('gulp-plumber');
const INCLUDE = require('gulp-include');
const MINIFY_CSS = require('gulp-minify-css');
const TS = require('gulp-typescript');
const NOTIFY = require('gulp-notify');
const UGLIFY = require('gulp-uglify');
const CSS_PREFIX = require('gulp-autoprefixer');
const IMAGE = require('gulp-imagemin');

const ASSET_PATH = 'app/Assets/**/';
const JS_PATH = `${ASSET_PATH}*.js`;
const TS_PATH = `${ASSET_PATH}*.ts`;
const CSS_PATH = `${ASSET_PATH}*.css`;
const SCSS_PATH = `${ASSET_PATH}*.scss`;
const FONT_PATH = `${ASSET_PATH}fonts/*.*`;
const IMG_PATH = `${ASSET_PATH}img/**/*.*`;
const DEST = 'public/core/';

function errorNotify(error){
    NOTIFY.onError({title: "Gulp Error", message: "", sound: "Sosumi"})(error); 
    this.emit("end");
};

function compressIMG() {
	return GULP.src(IMG_PATH, {
		sourcemaps: true
	})
	.pipe(IMAGE())
	.pipe(GULP.dest(DEST));
}

function styleCSS() {
	return GULP.src(CSS_PATH, {
		sourcemaps: true
	})
	.pipe(INCLUDE())
	.pipe(PLUMBER({ errorHandler: errorNotify }))
	.pipe(CSS_PREFIX())
	.pipe(MINIFY_CSS())
	.pipe(GULP.dest(DEST));
}
function styleSCSS() {
	return GULP.src(SCSS_PATH, {
		sourcemaps: true
	})
	.pipe(INCLUDE())
	.pipe(PLUMBER({ errorHandler: errorNotify }))
	.pipe(SASS({ style: "compressed", noCache: true }))
	.pipe(CSS_PREFIX())
	.pipe(MINIFY_CSS())
	.pipe(GULP.dest(DEST));
}
function makeFonts() {
	return GULP.src(FONT_PATH)
	.pipe(GULP.dest(DEST));
}

function scriptJS() {
	return GULP.src(JS_PATH, {
		sourcemaps: true
	})
	.pipe(INCLUDE())
	.pipe(PLUMBER({ errorHandler: errorNotify }))
	.pipe(UGLIFY())
	.pipe(GULP.dest(DEST));
}
function scriptTS() {
	return GULP.src(TS_PATH, {
		sourcemaps: true
	})
	.pipe(INCLUDE())
	.pipe(PLUMBER({ errorHandler: errorNotify }))
	.pipe(TS())
	.pipe(UGLIFY())
	.pipe(GULP.dest(DEST));
}

function watcher() {
	watch([CSS_PATH], makeFonts);
	watch([CSS_PATH], styleCSS);
	watch([SCSS_PATH], styleSCSS);
	watch([JS_PATH], scriptJS);
	watch([TS_PATH], scriptTS);
	watch([IMG_PATH], compressIMG);
}

exports.default = series(scriptTS, scriptJS, makeFonts, styleCSS, styleSCSS, compressIMG, watcher);