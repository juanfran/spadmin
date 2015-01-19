// Karma configuration
// Generated on Tue Oct 28 2014 22:23:48 GMT+0100 (CET)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon'],


    // list of files / patterns to load in the browser
    files: [
      {pattern: 'dist/lib/jquery/dist/jquery.js', included: true, served: true, watched: false},
      {pattern: 'dist/lib/lodash/dist/lodash.js', included: true, served: true, watched: false},
      {pattern: 'dist/lib/angular/angular.js', included: true, served: true, watched: false},
      {pattern: 'dist/lib/angular-sanitize/angular-sanitize.js', included: true, served: true, watched: false},
      {pattern: 'dist/lib/angular-animate/angular-animate.js', included: true, served: true, watched: false},
      {pattern: 'dist/lib/angular-ui-router/release/angular-ui-router.js', included: true, served: true, watched: false},
      {pattern: 'dist/lib/angular-bootstrap/ui-bootstrap-tpls.js', included: true, served: true, watched: false},
      {pattern: 'dist/lib/angular-ui-select/dist/select.js', included: true, served: true, watched: false},
      {pattern: 'dist/lib/angular-mocks/angular-mocks.js', included: true, served: true, watched: false},
      {pattern: 'dist/lib/traceur-runtime/traceur-runtime.js', included: true, served: true, watched: false},
      'dist/js/templates.js',
      'dist/js/main.js',
      'test/utils.js',
      'test/**/*.spec.js'
    ],

    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'dist/js/main.js': ['sourcemap']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
