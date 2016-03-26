// General
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var flatten = require('gulp-flatten');
var header = require('gulp-header');
var rename = require('gulp-rename');
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');
var package = require('./package.json');

// Styles
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var minify = require('gulp-cssnano');

var paths = {
  input: 'src/**/*',
  output: 'dist/',
  styles: {
    input: 'src/scss/**/*.{scss,sass}',
    output: 'dist/css/'
  },
  static: {
    input: 'src/static/*',
    output: 'dist/'
  }
};

var banner = {
    full :
        '/*!\n' +
        ' * <%= package.name %> v<%= package.version %>: <%= package.description %>\n' +
        ' * (c) ' + new Date().getFullYear() + ' <%= package.author.name %>\n' +
        ' * MIT License\n' +
        ' * <%= package.repository.url %>\n' +
        ' */\n\n',
    min :
        '/*!' +
        ' <%= package.name %> v<%= package.version %>' +
        ' | (c) ' + new Date().getFullYear() + ' <%= package.author.name %>' +
        ' | MIT License' +
        ' | <%= package.repository.url %>' +
        ' */\n'
};

// Process, lint, and minify Sass files
gulp.task('build:styles', [], function() {
  return gulp.src(paths.styles.input)
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'expanded',
      sourceComments: true
    }))
    .pipe(flatten())
    .pipe(prefix({
      browsers: ['last 2 version', '> 1%'],
      cascade: true,
      remove: true
    }))
    .pipe(header(banner.full, { package : package }))
    .pipe(gulp.dest(paths.styles.output))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minify({
      discardComments: {
        removeAll: true
      }
    }))
    .pipe(header(banner.min, { package : package }))
    .pipe(gulp.dest(paths.styles.output));
});

// Spin up livereload server and listen for file changes
gulp.task('listen', function () {
  livereload.listen();
  gulp.watch(paths.input).on('change', function(file) {
    gulp.start('default');
    gulp.start('refresh');
  });
});

// Run livereload after file change
gulp.task('refresh', ['compile'], function () {
    livereload.changed();
});

// Compile files
gulp.task('compile', [
    'build:styles'
]);

// Compile files and generate docs (default)
gulp.task('default', [
    'compile'
]);

// Compile files and generate docs when something changes
gulp.task('watch', [
    'listen',
    'default'
]);
