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

##Gulp

Gulp is used as the build system for globe. It builds all static assets (compress, concat, ...) and runs some tests.

__default__ (`gulp`)

- run tests, lint code, generate code coverage
- build all assets

__dev__ (`gulp dev`)

- watch for code changes and rerun:
- build all assets

__test__ (`gulp test`, `gulp test-no-db`)

- run tests, lint code, generate code coverage
- `test-no-db` won't run tests that are tagged with `@db` (useful if you don't have `mongod` running)
