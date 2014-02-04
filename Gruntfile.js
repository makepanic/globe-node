module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        nodeunit: {
            all: ['tests/*.test.js']
        },
        eslint: {
            options: {
                config: 'eslint.json'
            },
            target: [
                'routes/**/*.js',
                'lib/**/*.js'
            ]
        }
    });

    grunt.registerTask('default', ['eslint', 'nodeunit']);

    grunt.registerTask('test', ['eslint', 'nodeunit']);

};