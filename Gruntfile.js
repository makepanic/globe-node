module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        nodeunit: {
            all: ['tests/*.test.js']
        }
    });

    grunt.registerTask('default', ['nodeunit']);

    grunt.registerTask('test', ['nodeunit']);

};