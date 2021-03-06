var 
	express = require('express'),
	jso = require('jso'),
	async = require('async'),

	EtherpadConfigManager = require('./lib/configManagers').EtherpadConfigManager,

	EAPI = require('./lib/EAPI'),
	session = require('express-session'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser')
	;

// var settings = require('/Users/andreas/wcn/etherpad-lite/src/node/utils/Settings');
// var settings = require('../../src/node/utils/Settings');
var settings = require('ep_etherpad-lite/node/utils/Settings');
// var API = require('/Users/andreas/wcn/etherpad-lite/src/node/db/API');
var API = require('ep_etherpad-lite/node/db/API');


var store = new session.MemoryStore();
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



// console.log("ROOT", settings.root);

var options = settings.ep_feideconnect;
// var fc = new jso.FeideConnect(options.oauth);


exports.authenticate = function(hook_name, args, cb) {

	console.log("   >>>>> EXPRESS HOOK authenticate");
	console.log();

	args.res.writeHead(200, {"Content-Type": "text/plain"});
	args.res.end("No access.");

	// fc.getMiddleware().handle(args.req, args.res, args.next);

}


exports.authorize = function(hook_name, args, cb) {

	console.log("   >>>>> EXPRESS HOOK authorize");
	// console.log(args);
// 
	for(var key in args) {
		console.log("ARG " + key);
	}
	console.log("Resource " + args.resource )

	return cb([true]);

	// fc.getMiddleware().handle(args.req, args.res, args.next);

}

exports.dummy = function(hook_name, args, cb) {
	console.log(" >>>> EXPRESS DUMMY " + hook_name);
	
}

// exports.expressCreateServer = function(hook_name, args, cb) {

// 	console.log(" >>>> EXPRESS expressCreateServer " + hook_name);
// }

exports.expressCreateServer = function(hook_name, args, cb) {


	var app = args.app;

	console.log(" >>>> EXPRESS PLUGIN FEIDE CONNECT Talking.. Whos there?");
	// console.log(options);	

	app.use(cookieParser());
	app.use(bodyParser());
	app.use(session(sessionConfig));

	// app.use('/callback/FeideConnect', 
	// 	fc.getMiddleware()
	// 		.callback()
	// 		.authenticate() 
	// );

	// app.use('/', o.getAuthenticationMiddleware() );
	// app.use('/p/', 
	// 	fc.getMiddleware()
	// 		.requireScopes(['userinfo'])
	// );
	// app.use('/dashboard/', 
	// 	fc.getMiddleware()
	// 		.requireScopes(['userinfo'])
	// );

	var providerID = 'feideconnect';
	var cm = new EtherpadConfigManager(options.oauth);
	var o = new jso.FeideConnect(cm);

	var x = o.getMiddleware().callback().authenticate().create() ;
	console.log("Got middleware:");
	console.log(x);
	console.log(x.handle);

	app.use('/callback/FeideConnect', 
		o.getMiddleware().callback().authenticate().create()
	);
	app.use('/p/', o.getMiddleware().requireScopes(['userinfo']).create() );
	app.use('/dashboard/', o.getMiddleware().requireScopes(['userinfo']).create() );


	app.use('/logout', function(req, res, next) {

		res.clearCookie('express_sid',  { path: '/' }); 
		return res.redirect('https://auth.feideconnect.no/logout');

	});


	// o.setupMiddleware('/_feideconnect', app);

	app.use('/', function(req, res, next) {
		console.log("Checking for redirect on path " + req.url);

		if (req.url !== '/') { return next(); }
		res.redirect('/dashboard/');
		// next();
	});

	app.use('/dashboard/',  function(req, res, next) {

		console.log("Middleware to do session handling");

		var maxAge = 3600*24*365;
		var until =  (new Date()).getTime() + maxAge;
		if (!req.cookies.sessionID) {

			console.log("Session cookie is not set, obtaining new session.");

			EAPI.getSession(req.session.user, function(data) {
				var sessionID = data.join(',');
				console.log("Setting session ID ", sessionID);
				res.cookie('sessionID', sessionID, { "maxAge": maxAge, "httpOnly": false });
				next();
			});
		} else {
			next();
		}

	});
	app.use('/p/',  function(req, res, next) {

		var maxAge = 3600*24*365;
		var until =  (new Date).getTime() + (maxAge);

		console.log("Middleware to do session handling");

		if (!req.cookies['sessionID']) {

			console.log("Session cookie is not set, obtaining new session.");


			EAPI.getSession(req.session.user, function(data) {
				var sessionID = data.join(',');
				console.log("Setting session ID ", sessionID);
				res.cookie('sessionID', sessionID, { "maxAge": maxAge, "httpOnly": false });
				next();
			});
		} else {
			console.log("Session cookie is set");
			next();
		}

	});


	// app.use('/', fc.getMiddleware());

	app.use('/p/', function(req, res, next) {

		console.log("About to present session");
		console.log(req.session);

		next();
	});

	// app.use('/static', express.static('//Users/andreas/wcn/ep_feideconnect/webapp'));
	app.use('/dashboard/', express.static(__dirname + '/webapp/'));

	app.use(bodyParser());
	// app.use(app.router);


	app.get(/^\/$/, function(req, res, next) {
		res.redirect('/dashboard/');
	});

	app.get('/dashboard-api/setupSession', function(req, res, next) {

		var maxAge = 3600*24*365;
		var until =  (new Date).getTime() + (maxAge);
		var body = "Creating session\n\n";

		EAPI.getSession(req.session.user, function(data) {

			var sessionID = data.join(',');

			body += 'Setting session identifier in sessionID Cookie: ' + sessionID + "\n";


			res.cookie('sessionID', sessionID, { "maxAge": maxAge, "httpOnly": false });

			res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
			res.end(body);	

		});

	});


	app.get('/dashboard-api/session', function(req, res, next) {


		EAPI.getSession(req.session.user, function(data) {

			var body = '';
			body += "\n\nSession data: \n" + JSON.stringify(data, undefined, 2);


			body += "\nGroups:\n" + JSON.stringify(req.session.user.groups, undefined, 2);
			res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
			res.end(body);	

		});


	});

	app.get('/dashboard-api/padshtml', function(req, res, next) {
		// q.session.user,
		EAPI.listPads(req.session.user, function(data) {
			res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});

			var body = '';
			body += '<h2>List of pads</h2>';
			body += '<ul>';
			for(var i =0; i < data.length; i++) {
				body += '<li><a target="_blank" href="/p/' + data[i].padID + '">' + data[i].padID + '</a>' + 
					'<pre>' + JSON.stringify(data[i], undefined, 2) + '</pre>' +
					'</li>';
			}
			if (data.length === 0) {
				body += '<li style="color: #ccc">No pads available</li>';
			}

			body += '</ul>';


			res.end(body);	
		});

	});

	app.get('/dashboard-api/userinfo', function(req, res, next) {

		res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
		res.end(JSON.stringify(req.session.user, undefined, 2));	
		

	});


	app.get('/dashboard-api/pads', function(req, res, next) {
		// q.session.user,
		EAPI.listPads(req.session.user, function(data) {
			res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
			res.end(JSON.stringify(data, undefined, 2));	
		});

	});


	app.post('/dashboard-api/pad/create', function(req, res, next) {

		// // createPad = function(name, fcgroupid, callback
		// var fcgroupid = 'uwap:grp:uninett:org:orgunit:AVD-U2';
		// fcgroupid = 'uwap:grp:uninett:org:orgunit:SEK-U23';


		console.log("BODY: ", req.body);
		var newObject = req.body;
		console.log("Creating new Object.", newObject);

		// 	res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
		// 	res.end(JSON.stringify(newObject, undefined, 2));	
		// return;

		EAPI.createPad(newObject.name, newObject.groupid, function(data) {
			res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
			res.end(JSON.stringify(data, undefined, 2));	

			// res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
			// res.end("Created pad in group [" + newObject.groupid + "]: \n" + JSON.stringify(data, undefined, 2));	
		});

	});




	app.get('/dashboard_', function(req, res, next) {

		var body = 'Hello:';


		console.log("Session user", req.session);
		API.createAuthorIfNotExistsFor(req.session.user.userid, req.session.user.name, function(err, author) {


			var memberOfGroups = req.session.user.groups.getOwnPropertyNames();
			console.log("member of groups", memberOfGroups);

			// async.map(['file1','file2','file3'], function(el, callback) {
			// 	callback(null, el);

			// }, function(err, results){
			// 	// results is now an array of stats for each file
			// 	console.log("Results, async: ", results);

			// });


			API.createGroupIfNotExistsFor('uwap:grp:uninett:org:orgunit:AVD-U2', function(err, group) {

				// groupID, padName, text, callback

				console.log("Creatting for group " + group.groupID);
				// API.createGroupPad(group.groupID, 'SharedSFUPad', 'This pad is shared with the SFU group.', function(res) {


				API.listPads('g.PrKhjZ545lu5AolA', function(err, list) {



					API.createGroupPad('g.PrKhjZ545lu5AolA', 'testtwo', 'start', function(err, data) {

						var maxAge = 3600*24*365;
						var until =  (new Date).getTime() + (maxAge);
						API.createSession('g.PrKhjZ545lu5AolA', 'a.l8wNXHWtXeongVrW', until, function(err, sess) {


							res.cookie('sessionID',sess.sessionID, { "maxAge": maxAge, "httpOnly": false });

							body += "\n\nURL http://localhost:3000/p/" + list.padIDs[0];
							body += "\n\nsession: " + JSON.stringify(sess, undefined, 2);
							body += "\n\nlist: " + JSON.stringify(list, undefined, 2);
							body += "\n\nPAD CREATED: " + err + " " + JSON.stringify(data, undefined, 2);
							body += "\n\nAuthor: " + JSON.stringify(author, undefined, 2);
							body += "\n\nGroup: " + JSON.stringify(group, undefined, 2);
							body += "\n\nUser object" + JSON.stringify(req.session.user, undefined, 2);

							res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
							res.end(body);

						});



					});



				});



			});


		});

		// var l = API.listAllPads(function(err, l) {
		// 	// body += "\n\n" + JSON.stringify(l, undefined, 2);
		// });

	});



}