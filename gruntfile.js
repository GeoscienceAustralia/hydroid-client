module.exports = function (grunt) {
    var gulp = require('gulp');
    var useref = require('gulp-useref');
    var gulpif = require('gulp-if');
    var uglify = require('gulp-uglify');
    var minifyCss = require('gulp-minify-css');
    var outputPath = grunt.option('bundle_output_path') || 'build/webapp/';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        gulp: {
            'bundle': function () {
                return gulp.src('app/index.html')
                    .pipe(useref())
                    .pipe(gulpif('*.js', uglify()))
                    .pipe(gulpif('*.css', minifyCss()))
                    .pipe(gulp.dest(outputPath));
            },
            'copy-bootstrap-fonts': function () {
                return gulp.src('bower_components/bootstrap/dist/fonts/**/*')
                    .pipe(gulp.dest(outputPath + 'lib/fonts'));
            },
            'copy-images': function () {
                return gulp.src('app/img/**/*')
                    .pipe(gulp.dest(outputPath + 'img'));
            }
        }
    });

    grunt.loadNpmTasks('grunt-gulp');
    grunt.registerTask('build', ['gulp:bundle', 'gulp:copy-bootstrap-fonts', 'gulp:copy-images']);
    grunt.registerTask('default',['build']);
};