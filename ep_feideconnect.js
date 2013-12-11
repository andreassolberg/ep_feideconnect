var 
	express = require('express'),
	jso = require('jso')
	;

var settings = require('/Users/andreas/wc/etherpad-lite/src/node/utils/Settings');
// var settings = require('../../src/node/utils/Settings');

console.log("Loaded jso", jso);

var sessionConfig = { 
	// path: '/', 
	// httpOnly: true, 
	// maxAge: null,
	"secret": "slksdf89sd8ftsdjhfgsduytf",
	"store": store,
	"cookie": { 
		path: '/', 
		httpOnly: true, 
		maxAge: 1000*24*60*60*1000 // , // 10000 days.
		// secure: true
	}
};
exports.expressConfigure = function(hook_name, args, cb) {

	console.log(" >>>> EXPRESS PLUGIN FEIDE CONNECT Talking.. Whos there?");
	var options = settings.ep_feideconnect;
	console.log(options);

	var fc = new jso.FeideConnect(options.oauth);

	args.app.use(function(req, res, next) {
		if (req.path.match(/^\/(static|javascripts|pluginfw)/)) {
			next();
		} else {

			var app = args.app;

			app.use(express.cookieParser());
			app.use(express.session(sessionConfig));

			app.use('/callback', fc.getAuthenticationMiddleware().callback().authenticate() );

			// app.use('/', o.getAuthenticationMiddleware() );
			app.use('/test', fc.getAuthenticationMiddleware()
				.requireScopes(['userinfo'])

			);
			app.use('/', fc.getAuthenticationMiddleware());
			app.use(app.router);

			next();

			// github.orgAccess({
			// 	appId: settings.users.github.appId,
			// 	appSecret: settings.users.github.appSecret,
			// 	callback: settings.users.github.callback
			// }, settings.users.github.org).handle(req, res, next);
		}
	});
}