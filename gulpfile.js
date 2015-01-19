var gulp = require('gulp');
var scss = require('gulp-ruby-sass');
var scsslint = require('gulp-scss-lint');
var traceur = require('gulp-traceur');
var plumber = require('gulp-plumber');
var cache = require('gulp-cached');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var sourcemaps = require('gulp-sourcemaps');
var templateCache = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');
var runSequence = require('run-sequence');

gulp.task('connect', function() {
  connect.server({
    'root': 'dist'
  });
});

gulp.task('html', function() {
  gulp.src([
    'src/index.html'
  ])
    .pipe(gulp.dest('dist/'));
});

gulp.task('sass-compile', function() {
  gulp.src('src/styles/main.scss')
    .pipe(plumber())
    .pipe(scss())
    .pipe(gulp.dest('dist/styles/'));
});

gulp.task('scss', function(cb) {
  runSequence('bourbon', ['scss-lint', 'sass-compile'], cb);
});

gulp.task('scss-lint', function() {
  gulp.src(['src/styles/**/*.scss', '!src/styles/bourbon/**/*.scss'])
    .pipe(cache('scss-lint'))
    .pipe(scsslint({config: "scsslint.yml"}));
});

gulp.task('templates', function () {
    gulp.src('src/partials/**/*.html')
        .pipe(templateCache({standalone: true}))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('traceur', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(traceur({
      blockBinding: true
    }))
    .pipe(concat('main.js'))
    .pipe(ngAnnotate())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('bourbon', function() {
  return gulp.src('dist/lib/bourbon/dist/**/*.*', { base: './dist/lib/bourbon/dist' })
    .pipe(gulp.dest('./src/styles/bourbon'));
})

gulp.task('watch', function () {
  gulp.watch('src/js/**/*.js', ['traceur']);
  gulp.watch('src/partials/**/*.html', ['templates']);
  gulp.watch('src/styles/**/*.scss', ['scss']);
  gulp.watch('src/index.html', ['html']);
});

gulp.task('default', ['scss', 'html', 'traceur', 'templates', 'watch', 'connect'])
