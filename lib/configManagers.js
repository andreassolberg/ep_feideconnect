
var
    // Local utility classes
    Class = require('./class').Class,
    utils = require('./utils'),

	settings = require('ep_etherpad-lite/node/utils/Settings'),

	fs = require('fs'),
	path = require('path');


var SimpleConfigurationManager = Class.extend({
	"init": function(metadata) {
		this.metadata = metadata;
	},
	"isConfigured": function() { return true; },
	"supportAutoconfiguration": function() { return false; },
	"register": function(metadata) {
		throw new Error("Not supported");
	},

	"get": function() {
		return this.metadata;
	}

});

var EtherpadConfigManager = Class.extend({


	"init": function(config) {

		this.id = 'feideconnect';

		// this.configurationFile = path.resolve(path.dirname(require.main.filename), 'config.js');
		this.configuration = config;

		console.log("Configuration"); console.log(this.configuration);

		this.metadataFile = path.resolve(settings.root, 'var/metadata.js');
		this.metadata = JSON.parse(
		    fs.readFileSync(this.metadataFile)
		);

		// console.log("Metadata"); console.log(this.metadata);

	},

	"delete": function() {
		this.metadata = JSON.parse(
		    fs.readFileSync(this.metadataFile)
		);
		delete this.metadata[this.id];

		console.log("Metadata dleted"); console.log(this.metadata);

		fs.writeFileSync(this.metadataFile, JSON.stringify(this.metadata));
		return true;
	},

	"isConfigured": function() {
		return (this.configuration.hasOwnProperty(this.id) && this.metadata.hasOwnProperty(this.id));
	},

	"supportAutoconfiguration": function() {

		var config = this.getConfig(this.id);
		return (config.hasOwnProperty('autoconfigure') && config.autoconfigure);

	},

	"register": function(metadata) {

		this.metadata = JSON.parse(
		    fs.readFileSync(this.metadataFile)
		);
		this.metadata[this.id] = metadata;
		fs.writeFileSync(this.metadataFile, JSON.stringify(this.metadata));


		return this.get(this.id);
	},

	"getConfig": function() {


		console.log("Configuration"); console.log(this.configuration);
		if (this.configuration.hasOwnProperty(this.id)) {
			return this.configuration[this.id];
		} else {
			throw new Error('Could not find config for ' + this.id);
		}

	},

	"getPublicConfig": function() {
		var res = {};
		var config = this.getConfig(this.id);

		for(var key in config) {
			if (config.hasOwnProperty(key)) {
				res[key] = config[key];
			}
		}

		if (this.isConfigured()) {
			console.log("Is configured ", this.configuration);
			console.log("Is metadata ", this.metadata);

			var metadata = this.getMetadata(this.id);
			if (metadata['client_id']) {
				res['client_id'] = metadata['client_id'];	
			}
			if (metadata['uwap-userid']) {
				res['uwap-userid'] = metadata['uwap-userid'];	
			}
			res['isConfigured'] = true;
		}
		res.providerID = this.id;
		return res;
	},

	"getMetadata": function() {
		if (this.metadata.hasOwnProperty(this.id)) {
			return this.metadata[this.id];
		} else {
			throw new Error('Could not find config for ' + this.id);
		}
	},

	"get": function() {

		var res = {};
		var config = this.getConfig(this.id);
		var metadata = this.getMetadata(this.id);

		for(var key in config) {
			if (config.hasOwnProperty(key)) {
				res[key] = config[key];
			}
		}
		for(var key in metadata) {
			if (metadata.hasOwnProperty(key)) {
				res[key] = metadata[key];
			}
		}
		res.providerID = this.id;
		return res;

	}

});




var ConfigurationManager = Class.extend({


	"init": function(id) {

		this.id = id;



		this.configurationFile = path.resolve(path.dirname(require.main.filename), 'config.js');
		this.configuration = JSON.parse(
		    fs.readFileSync(this.configurationFile)
		);

		// console.log("Configuration"); console.log(this.configuration);

		this.metadataFile = path.resolve(path.dirname(require.main.filename), 'var/metadata.js');
		this.metadata = JSON.parse(
		    fs.readFileSync(this.metadataFile)
		);

		// console.log("Metadata"); console.log(this.metadata);

	},

	"delete": function() {
		this.metadata = JSON.parse(
		    fs.readFileSync(this.metadataFile)
		);
		delete this.metadata[this.id];

		console.log("Metadata dleted"); console.log(this.metadata);

		fs.writeFileSync(this.metadataFile, JSON.stringify(this.metadata));
		return true;
	},

	"isConfigured": function() {
		return (this.configuration.hasOwnProperty(this.id) && this.metadata.hasOwnProperty(this.id));
	},

	"supportAutoconfiguration": function() {

		var config = this.getConfig(this.id);
		return (config.hasOwnProperty('autoconfigure') && config.autoconfigure);

	},

	"register": function(metadata) {

		this.metadata = JSON.parse(
		    fs.readFileSync(this.metadataFile)
		);
		this.metadata[this.id] = metadata;
		fs.writeFileSync(this.metadataFile, JSON.stringify(this.metadata));


		return this.get(this.id);
	},

	"getConfig": function() {
		if (this.configuration.hasOwnProperty(this.id)) {
			return this.configuration[this.id];
		} else {
			throw new Error('Could not find config for ' + this.id);
		}

	},

	"getPublicConfig": function() {
		var res = {};
		var config = this.getConfig(this.id);

		for(var key in config) {
			if (config.hasOwnProperty(key)) {
				res[key] = config[key];
			}
		}

		if (this.isConfigured()) {
			console.log("Is configured ", this.configuration);
			console.log("Is metadata ", this.metadata);

			var metadata = this.getMetadata(this.id);
			if (metadata['client_id']) {
				res['client_id'] = metadata['client_id'];	
			}
			if (metadata['uwap-userid']) {
				res['uwap-userid'] = metadata['uwap-userid'];	
			}
			res['isConfigured'] = true;
		}
		res.providerID = this.id;
		return res;
	},

	"getMetadata": function() {
		if (this.metadata.hasOwnProperty(this.id)) {
			return this.metadata[this.id];
		} else {
			throw new Error('Could not find config for ' + this.id);
		}
	},

	"get": function() {

		var res = {};
		var config = this.getConfig(this.id);
		var metadata = this.getMetadata(this.id);

		for(var key in config) {
			if (config.hasOwnProperty(key)) {
				res[key] = config[key];
			}
		}
		for(var key in metadata) {
			if (metadata.hasOwnProperty(key)) {
				res[key] = metadata[key];
			}
		}
		res.providerID = this.id;
		return res;

	}

});

exports.EtherpadConfigManager = EtherpadConfigManager;
exports.ConfigurationManager = ConfigurationManager;
exports.SimpleConfigurationManager = SimpleConfigurationManager;