module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        nodeunit: {
            all: ['tests/**/*.test.js']
        },
        eslint: {
            options: {
                config: 'eslint.json'
            },
            target: [
                'routes/**/*.js',
                'lib/**/*.js'
            ]
        },

        coverage: {
            options: {
                thresholds: {
                    'statements': 90,
                    'branches': 90,
                    'lines': 90,
                    'functions': 90
                },
                dir: 'coverage',
                root: 'tests'
            }
        }
    });



    grunt.registerTask('cov', ['coverage']);
    grunt.registerTask('default', ['eslint', 'nodeunit']);

    grunt.registerTask('test', ['eslint', 'nodeunit']);

};