#!/bin/sh

# enable backports
echo "deb http://ftp.de.debian.org/debian/ wheezy-backports main" >> /etc/apt/sources.list

apt-get update
sudo apt-get -y -t wheezy-backports install nodejs