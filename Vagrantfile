# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  config.vm.box = "wheezy64"
  config.vm.provision :shell, :path => "vagrant/bootstrap.sh"

  # boxes from https://github.com/ffuenf/vagrant-boxes
  # or https://wiki.debian.org/Veewee
  config.vm.box_url = "http://basebox.libera.cc/debian-wheezy-64.box"

  # app port
  config.vm.network :forwarded_port, guest: 3000, host: 3000
  # node debugger port
  config.vm.network :forwarded_port, guest: 8080, host: 8080
end