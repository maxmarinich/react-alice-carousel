const { resolve } = require('path')
const babel = require('gulp-babel')
const gulp = require('gulp')
const rename = require('gulp-rename')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const strip = require('gulp-strip-comments')

const rootPath = resolve(__dirname, '../..')
const libPath = resolve(rootPath, 'src/lib')
const outputPath = resolve(rootPath, 'lib')

const babelOptions = {
  plugins: ['transform-object-assign'],
  presets: ['env', 'react', 'stage-2'],
}

gulp.task('sass', function() {
  gulp
    .src(resolve(libPath, 'scss/alice-carousel.scss'))
    .pipe(sass())
    .pipe(
      autoprefixer({
        browsers: ['last 5 versions'],
      }),
    )
    .pipe(rename('alice-carousel.css'))
    .pipe(gulp.dest(outputPath))
})

gulp.task('source-js', function() {
  return gulp
    .src([resolve(libPath, '**/*.js')])
    .pipe(babel(babelOptions))
    .pipe(strip())
    .pipe(gulp.dest(outputPath))
})

gulp.task('scss', function() {
  return gulp.src(resolve(libPath, 'scss/**/*.scss')).pipe(gulp.dest(resolve(outputPath, 'scss')))
})

gulp.task('types', function() {
  return gulp.src(resolve(libPath, 'types/**/*.ts')).pipe(gulp.dest(resolve(outputPath, 'types')))
})

gulp.task('default', ['source-js', 'sass', 'scss', 'types'])
