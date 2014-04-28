#!/bin/sh

# enable backports
echo "deb http://ftp.de.debian.org/debian/ wheezy-backports main" >> /etc/apt/sources.list

apt-get update
apt-get -y -t wheezy-backports install nodejs g++
apt-get -y -t wheezy-backports install nodejs-legacy

# TODO: find a way to handle dependencies without installing npm via install.sh
# via https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager#backports
curl https://www.npmjs.org/install.sh | sudo clean=no sh