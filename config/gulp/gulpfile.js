const { resolve } = require('path');
const babel = require('gulp-babel');
const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const strip = require('gulp-strip-comments');
const uglify = require('gulp-uglify');
const ts = require('gulp-typescript');

const rootPath = resolve(__dirname, '../..');
const libPath = resolve(rootPath, 'src/lib');
const outputPath = resolve(rootPath, 'lib');
const babelConfig = require(rootPath + '/.babelrc.json');
const tsProject = ts.createProject(rootPath + '/tsconfig.json');

gulp.task('ts', function () {
	return tsProject
		.src()
		.pipe(tsProject())
		.js.pipe(babel(babelConfig))
		.pipe(strip())
		.pipe(uglify())
		.pipe(gulp.dest(outputPath));
});

gulp.task('css', function () {
	sass.compiler = require('node-sass');

	return gulp
		.src(resolve(libPath, 'scss/alice-carousel.scss'))
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(gulp.dest(outputPath));
});

gulp.task('scss', function () {
	return gulp.src(resolve(libPath, 'scss/**/*.scss')).pipe(gulp.dest(resolve(outputPath, 'scss')));
});

gulp.task('default', gulp.series('ts', 'css', 'scss'));
