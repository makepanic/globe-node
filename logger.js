var name = require('./package.json').name,
    bunyan = require('bunyan');

module.exports = bunyan.createLogger({name: name});
