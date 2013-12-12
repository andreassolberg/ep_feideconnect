var 
	express = require('express'),
	jso = require('jso')
	;

var settings = require('/Users/andreas/wcn/etherpad-lite/src/node/utils/Settings');
// var settings = require('../../src/node/utils/Settings');

console.log("Loaded jso", jso);
var store = new express.session.MemoryStore();
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

	var options = settings.ep_feideconnect;
	var fc = new jso.FeideConnect(options.oauth);
	var app = args.app;

	console.log(" >>>> EXPRESS PLUGIN FEIDE CONNECT Talking.. Whos there?");
	console.log(options);	

	app.use(express.cookieParser());
	app.use(express.session(sessionConfig));

	app.use('/callback/FeideConnect', 
		fc.getMiddleware()
			.callback()
			.authenticate() 
	);

	// app.use('/', o.getAuthenticationMiddleware() );
	app.use('/p/', 
		fc.getMiddleware()
			.requireScopes(['userinfo'])
	);
	// app.use('/', fc.getMiddleware());

	app.use('/p/', function(req, res, next) {

		console.log("About to present session");
		console.log(req.session);

		next();
	});


	app.use(app.router);






	// args.app.use(function(req, res, next) {
	// 	if (req.path.match(/^\/(static|javascripts|pluginfw)/)) {
	// 		next();
	// 	} else {

			



	// 		// github.orgAccess({
	// 		// 	appId: settings.users.github.appId,
	// 		// 	appSecret: settings.users.github.appSecret,
	// 		// 	callback: settings.users.github.callback
	// 		// }, settings.users.github.org).handle(req, res, next);
	// 	}
	// });
}