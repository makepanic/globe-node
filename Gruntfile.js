module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        eslint: {
            options: {
                config: 'eslint.json'
            },
            all: [
                'src/**/*.js',
                '!src/**/vendor/*.js',
                'test/**/*.js',
                'app.js'
            ]
        },
        mochacov: {
            options: {
                files: 'test/**/*.test.js',
                ui: 'bdd'
            },
            report: {
                options: {
                    reporter: 'html-cov',
                    output: 'src/public/coverage.html'
                }
            },
            ciNoDb: {
                options: {
                    reporter: 'tap',

                    // without db tests
                    grep: '@db',
                    invert: true
                }
            },
            ci: {
                options: {
                    reporter: 'tap'
                }
            },
            dev: {
                options: {
                    reporter: 'dot'
                }
            }
        },
        watch: {
            reload: {
                files: ['src/views/**/*.jade', 'src/public/stylesheets/**/*.scss'],
                options: {
                    livereload: true
                }
            },
            scripts: {
                files: ['src/**/*.js', 'test/**/*.test.js'],
                tasks: ['eslint', 'mochacov:dev'],
                options: {
                    spawn: false,
                    livereload: true
                }
            }
        }
    });

    grunt.registerTask('default', ['eslint', 'mochacov:report']);
    grunt.registerTask('dev', ['eslint', 'mochacov:dev', 'watch']);
    grunt.registerTask('test', ['eslint', 'mochacov:ci']);
    grunt.registerTask('test-no-db', ['eslint', 'mochacov:ciNoDb']);

};