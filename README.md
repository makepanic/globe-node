#globe-node
[![Build Status](https://travis-ci.org/makepanic/globe-node.png?branch=master)](https://travis-ci.org/makepanic/globe-node)
[![Dependency Status](https://david-dm.org/makepanic/globe-node.svg)](https://david-dm.org/makepanic/globe-node)
[![Code Climate](https://codeclimate.com/github/makepanic/globe-node.png)](https://codeclimate.com/github/makepanic/globe-node)

Node.js application to explore and use the Tor onionoo API.

Latest version is available on [globe-node.herokuapp.com](https://globe-node.herokuapp.com/).

##CLI

`app.js` has some argument values that allow you to modify the behavior of the server.
See `node app.js --help` for more information.

__nosync__ (`-n` or `--nosync`)

*default is `false`*

Disables clearing the database and reloading the onionoo dump.

__dev__ (`-d` or `--dev`)

*default is `false`*

If true, enables some development features like livereload.

__port__ (`-p 3000` or `--port 3000`)

*default is `3000`*

Sets the port where the application server should listen for requests

__database url__ (`-db mongodb://localhost:27017/onionoo` or `--dburl mongodb://localhost:27017/onionoo`)

*default is `mongodb://localhost:27017/onionoo`* 

Sets the mongodb database url.

##Grunt

__default__ (`grunt`)

- runs tests, linting and generates coverage

__dev__ (`grunt dev`)

like `default`

- tests using [`dot` reporter](https://visionmedia.github.io/mocha/#dot-matrix-reporter)
- watches for code changes and reruns linting, tests and uses livereload to refresh the browser

__test__ (`grunt test`)

like `default`

- tests using [TAP](https://en.wikipedia.org/wiki/Test_Anything_Protocol) reporter

__test (no database)__ (`grunt test-no-db`)

like `test`

- skips test tagged with `@db`