Etherpad Lite Plugin: Feide Connect
===============

Etherpad Lite Plugin for Feide Connect Authentication and Authorization




# Installation

This setup is for development.


Download etherpad-lite:

	git clone https://github.com/ether/etherpad-lite.git


Download plugins:

	git clone git@github.com:andreassolberg/ep_feideconnect.git
	git clone git@github.com:andreassolberg/jso-node.git


Configure references and install dependencies.

	cd jso-node
	npm install
	npm link

	cd ../ep_feideconnect
	npm link jso
	npm install
	npm link

	cd ../etherpad-lite
	npm link ep_feideconnect
	cd src
	npm link
	cd ..

	cd ../ep_feideconnect
	npm link ep_etherpad-lite

	cd ../etherpad-lite

Then setup `settings.json`, the configuration file. And then run etherpad:

	bin/run.sh






