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
                return gulp.src('node_modules/bootstrap/dist/fonts/**/*')
                    .pipe(gulp.dest(outputPath + 'lib/fonts'));
            },
            'copy-images': function () {
                return gulp.src('app/img/**/*')
                    .pipe(gulp.dest(outputPath + 'img'));
            },
            'copy-data': function () {
                return gulp.src('app/data/**/*')
                    .pipe(gulp.dest(outputPath + 'data'));
            }
        },
        ngtemplates: {
            app: {
                cwd: 'app',
                options: {
                    append: true,
                    module: 'hydroidApp'
                },
                src: 'components/**/*.html',
                dest: outputPath + 'js/app.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-gulp');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.registerTask('build', ['gulp:bundle', 'gulp:copy-bootstrap-fonts', 'gulp:copy-images', 'gulp:copy-data','ngtemplates']);
    grunt.registerTask('default', ['build']);
};