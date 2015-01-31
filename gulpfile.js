var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    minifyCSS = require('gulp-minify-css'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    jade = require('gulp-jade'),
    concat = require('gulp-concat');

var env,
    manabeCoffee,
    manabeJs,
    manabeSass,
    manabeHtml,
    sakheKhoroji,
    negareshSass,
    manabeJade,
    commentsSass;

env = process.env.NODE_ENV || 'gostaresh';

if (env === 'gostaresh') {
    sakheKhoroji = 'sakht/gostaresh/';
    negareshSass = 'expanded';
    commentsSass = true;
} else {
    sakheKhoroji = 'sakht/tolid/';
    negareshSass = 'compressed';
    commentsSass = false;
}

// Har chizi ro ba Bower ezafe kardid be manabe ham ezafe konid
manabeCoffee = ['ajza/coffee/**/*.coffee'];
manabeJs = ['ajza/scripts/**/*.js'];
manabeSass = ['ajza/sass/style.scss'];
manabeHtml = ['sakht/gostaresh/**/*.html'];
manabeJade = ['ajza/ghaleb/**/*.jade'];

gulp.task('coffee', function() {
    gulp.src(manabeCoffee)
        .pipe(coffee({
                bare: true
            })
            .on('error', gutil.log))
        .pipe(gulp.dest('ajza/scripts'));
});

gulp.task('js', function() {
    gulp.src(manabeJs)
        .pipe(concat('script.js'))
        .pipe(gulpif(env === 'tolid', uglify()))
        .pipe(gulp.dest(sakheKhoroji + '/js'))
        .pipe(connect.reload());
});

gulp.task('compass', function() {
    gulp.src(manabeSass)
        .pipe(compass({
                sass: 'ajza/sass/',
                image: sakheKhoroji + 'tasvir',
                style: negareshSass,
                comments: commentsSass
            })
            .on('error', gutil.log))
        .pipe(gulp.dest(sakheKhoroji + 'css'))
        .pipe(connect.reload());
});

/*gulp.task('html', function() {
    gulp.src(manabeHtml)
	.pipe(gulpif(env === 'tolid', minifyHTML()))
	.pipe(gulpif(env === 'tolid', gulp.dest(sakheKhoroji)))
	.pipe(connect.reload());
});*/

gulp.task('jade', function() {
    return gulp.src(manabeJade)
        .pipe(jade())
        .pipe(gulp.dest(sakheKhoroji))
        .pipe(connect.reload());
});

gulp.task('tasvir', function() {
    gulp.src('ajza/tasavir/**/*.*')
        .pipe(gulpif(env === 'tolid', imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        })))
        .pipe(gulpif(env === 'tolid', gulp.dest(sakheKhoroji + 'tasavir/')))
        .pipe(connect.reload());
});

gulp.task('negah', function() {
    gulp.watch(manabeCoffee, ['coffee']);
    gulp.watch(manabeJs, ['js']);
    gulp.watch('ajza/sass/**/*.scss', ['compass']);
    gulp.watch(manabeJade, ['jade']);
    gulp.watch('sakht/gostaresh/tasvir/**/*.*', ['tasvir']);
});

gulp.task('connect', function() {
    connect.server({
        root: sakheKhoroji,
        port: 8800,
        livereload: true
    });
});


gulp.task('default', ['coffee', 'js', 'compass', 'jade', 'tasvir', 'negah', 'connect']);
