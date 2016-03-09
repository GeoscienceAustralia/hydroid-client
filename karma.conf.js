module.exports = function (config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '.',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'node_modules/jquery/dist/jquery.js',
            'node_modules/angular/angular.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'node_modules/angular-route/angular-route.js',
            'node_modules/karma-read-json/karma-read-json.js',
            'node_modules/phantomjs-function-bind-polyfill/index.js',
            'app/components/**/*.js',
            'app/components/**/*.html',
            {pattern: 'app/data/**/*.json', included: false}
        ],

        // list of files to exclude
        exclude: [],

        coverageReporter: {
            type: 'lcov', // lcov or lcovonly are required for generating lcov.info files
            dir: 'coverage/'
        },

        reporters: [ 'progress', 'coverage'],

        htmlReporter: {
            outputDir: 'target/karma-reports'
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_DEBUG || config.LOG_INFO,

        preprocessors: {
            'app/**/*.html': ['ng-html2js'],
            'app/**/!(*.spec).js': [ 'coverage' ]
        },
        ngHtml2JsPreprocessor: {
            // strip this from the file path
            stripPrefix: 'app/'
        },

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        plugins: ['karma-jasmine', 'karma-chrome-launcher', 'karma-junit-reporter', 'karma-phantomjs-launcher','karma-ng-html2js-preprocessor','karma-coverage']
    });
};
