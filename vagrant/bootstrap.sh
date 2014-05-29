#!/bin/sh

# enable backports
echo "deb http://ftp.de.debian.org/debian/ wheezy-backports main" >> /etc/apt/sources.list

apt-get update
apt-get -y -t wheezy-backports install nodejs g++ mongodb
apt-get -y -t wheezy-backports install nodejs-legacy

# TODO: find a way to handle dependencies without installing npm via install.sh
# via https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager#backports
curl https://www.npmjs.org/install.sh | sudo clean=no sh

# install nodemon for re/starting the app
#npm install -g nodemon

# install node inspector for debugging
npm install -g node-inspector grunt-cli

# cd into the app dir
cd /vagrant/

# install app dependencies
npm install

# start app via nodemon
#nodemon --watch /vagrant app.js

# start app with node debugger attached
#node-inspector & node --debug app.js -n

# start app without syncing db
#node app.js --nosync