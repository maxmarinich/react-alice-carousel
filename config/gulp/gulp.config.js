const { resolve } = require('path');
const gulp = require('gulp');
const babel = require('gulp-babel');
const dartSass = require('sass');
const gulpSass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const typescript = require('gulp-typescript');

const sass = gulpSass(dartSass);
const rootPath = resolve(__dirname, '../..');
const libPath = resolve(rootPath, 'src/lib');
const outputPath = resolve(rootPath, 'lib');
const babelConfig = require(rootPath + '/.babelrc.json');
const tsProject = typescript.createProject(rootPath + '/tsconfig.json');

function ts() {
	return tsProject
		.src()
		.pipe(tsProject())
		.js.pipe(babel(babelConfig))
		.pipe(uglify())
		.pipe(gulp.dest(outputPath));
}

function css() {
	return gulp
		.src(resolve(libPath, 'scss/alice-carousel.scss'))
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(gulp.dest(outputPath));
}

function scss() {
	return gulp.src(resolve(libPath, 'scss/**/*.scss')).pipe(gulp.dest(resolve(outputPath, 'scss')));
}

exports.default = gulp.series(ts, css, scss);
