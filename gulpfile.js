var gulp = require('gulp');

var concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
//    imagemin = require('gulp-imagemin'),
    sourcemaps = require('gulp-sourcemaps'),
    livereload = require('gulp-livereload'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    del = require('del'),
    istanbul = require('gulp-istanbul'),
    mocha = require('gulp-mocha'),
    eslint = require('gulp-eslint'),
    minifyCSS = require('gulp-minify-css');

var paths = {
    styles: ['src/public/stylesheets/vendor/**/*.scss', 'src/public/stylesheets/app/**/*.scss'],
    scripts: ['src/public/javascripts/vendor/**/*.js', 'src/public/javascripts/app/**/*.js'],
    images: 'src/public/images/**/*'
};

gulp.task('clean', function (cb) {
    del(['build', 'debug'], cb);
});

// lint code
gulp.task('lint', function () {
    return gulp.src(['src/**/*.js', '!src/**/vendor/*.js', 'test/**/*.js', 'app.js'])
        .pipe(eslint(require('./eslint.json')))
        .pipe(eslint.format());
});

// copy fonts
gulp.task('copy', ['clean'], function () {
    return gulp.src('src/public/fonts/*')
        .pipe(gulp.dest('build/fonts'));
});

// test using mocha and generate coverage
gulp.task('cover', function (cb) {
    gulp.src(['app.js', 'src/**/*.js'])
        .pipe(istanbul())
        .on('finish', function () {
            gulp.src(['test/**/*.test.js'])
                .pipe(mocha({
                    // 5 min (in the vagrant image it can take a long time)
                    timeout: 5 * 60 * 1000,
                    ui: 'bdd',
                    bail: true,
                    reporter: 'spec'
                }))
                .pipe(istanbul.writeReports({
                    dir: 'build'
                }))
                .on('end', cb);
        });
});


// test using mocha and generate coverage
gulp.task('cover-no-db', function (cb) {
    gulp.src(['app.js', 'src/**/*.js'])
        .pipe(istanbul())
        .on('finish', function () {
            gulp.src(['test/**/*.test.js'])
                .pipe(mocha({
                    // 5 min (in the vagrant image it can take a long time)
                    timeout: 5 * 60 * 1000,
                    ui: 'bdd',
                    bail: true,
                    reporter: 'spec',
                    grep: '@db',
                    invert: true
                }))
                .pipe(istanbul.writeReports({
                    dir: 'build'
                }))
                .on('end', cb);
        });
});

// minify scripts
gulp.task('scripts', ['clean'], function () {
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('globe-node-additionals.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/js'))
        .pipe(livereload({auto: false}));
});

// Copy all static images
gulp.task('images', ['clean'], function () {
    return gulp.src(paths.images)
        // Pass in options to the task
//        .pipe(imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest('build/img'));
});

// Compile scss files
gulp.task('sass', ['clean'], function () {
    return gulp.src(paths.styles)
        .pipe(sass())
        .pipe(concat('style.min.css'))
        .pipe(minifyCSS())
        // see https://github.com/postcss/autoprefixer#browsers
        .pipe(prefix('> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1'))
        .pipe(gulp.dest('build/css'))
        .pipe(livereload({auto: false}));
});

// rerun tasks on file changes
gulp.task('watch', function () {
    livereload.listen();
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.images, ['images']);
    gulp.watch(paths.styles, ['sass']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['lint', 'cover', 'copy', 'sass', 'scripts', 'images']);
gulp.task('test', ['lint', 'cover']);
gulp.task('test-no-db', ['lint', 'cover-no-db']);
gulp.task('dev', ['copy', 'sass', 'scripts', 'images', 'watch']);
