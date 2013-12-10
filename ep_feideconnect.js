var jso = require('jso');

var settings = require('ep_etherpad-lite/node/utils/Settings');
var exp = require('ep_etherpad-lite/node_modules/express');

console.log("Loaded jso", jso);

exports.expressConfigure = function(hook_name, args, cb) {

	console.log("EXPRESS PLUGIN FEIDE CONNECT Talking.. Whos there?", hook_name, args);

	args.app.use(function(req, res, next) {
		if (req.path.match(/^\/(static|javascripts|pluginfw)/)) {
			next();
		} else {

			next();

			// github.orgAccess({
			// 	appId: settings.users.github.appId,
			// 	appSecret: settings.users.github.appSecret,
			// 	callback: settings.users.github.callback
			// }, settings.users.github.org).handle(req, res, next);
		}
	});
}