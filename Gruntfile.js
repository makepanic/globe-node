module.exports = function(grunt) {
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
                    output: 'coverage.html'
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
            scripts: {
                files: ['src/**/*.js', 'test/**/*.test.js'],
                tasks: ['eslint', 'mochacov:dev'],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.registerTask('default', ['eslint', 'mochacov:report']);
    grunt.registerTask('dev', ['eslint', 'mochacov:dev', 'watch']);
    grunt.registerTask('test', ['eslint', 'mochacov:ci']);

};