define(function(require) {

	var prettydate = require('js/pretty.js');

	var groups = {};


	var loadUserinfo = function() {
		$.getJSON('/dashboard-api/userinfo', function(user) {

			$("span.dataUsername").empty().append(user.name);

			// groups = user.groups;

			for(var i = 0; i < user.groups.length; i++) {
				groups[user.groups[i].id] = user.groups[i];
			}

			console.log(user.groups);
			var gs = $("select.selectGroup");
			gs.empty();
			gs.append('<option value="_blank" disabled="disabled" selected="selected">Velg en gruppe</option>');
			for(var key in groups) {
				gs.append('<option value="' + key + '">' + groups[key].displayName + '</option>');
			}

			loadPadlist();
		});
		
	}

	var loadPadlist = function() {

		$.getJSON('/dashboard-api/pads', function(data) {
			console.log("Response"); console.log(data);


			var container = $("table#padlist tbody");
			container.empty();
			for(var i = 0; i < data.length; i++) {

				var gname = data[i].groupid;
				if (groups[data[i].groupid]) {
					gname = groups[data[i].groupid].displayName;
				}
				container.append('<tr>' + 
					'<td><a target="_blank" href="/p/' + data[i].padid + '">' + data[i].name + '</a></td>' + 
					'<td>' + gname + '</td>' + 
					'<td><span class="ts" data-ts="' + data[i].lastEdited + '"></span></td>' + 
					'<td>' + data[i].revisions + '</td></tr>');

			}
			$("span.ts").prettyDate(); 

		});

	}

	var storeNewDocument = function(data) {

		$.ajax('/dashboard-api/pad/create', {
			data : JSON.stringify(data),
			contentType : 'application/json',
			type : 'POST',
			success: function(response) {

				console.log("Successfully stored new document", response);
				loadPadlist();

			}
		});

	}


	var createNewDocument = function() {

		var post = {};

		post['name']    = $("#documentName").val();
		post['groupid'] = $("#documentGroup").val();
		post['public']  = $("#documentPublic").is(':checked');

		console.log("Posting group", post);
		storeNewDocument(post);

	}

	function removeItem(sKey, sPath, sDomain) {
	    document.cookie = encodeURIComponent(sKey) + 
	                  "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" +  
	                  (sPath ? "; path=" + sPath : "");
	}



	$(document).ready(function() {
		
		var now = (new Date());
		console.log("Time now", now);

		setInterval(function(){ 
			$("span.ts").prettyDate(); 
		}, 8000);

		loadUserinfo();

		setInterval(function(){ 
			loadPadlist();
		}, 8000);



		$("#btnStoreNewDocument").on('click', function() {

			createNewDocument();
			$("#modalCreateNew").modal('hide');

		});

		$("a.btnCreateNew").on('click', function() {

			console.log("Create new");
			$("#modalCreateNew").modal();
			$("#documentName").focus();



		});


		$("a#logout").on('click', function(e) {

			e.preventDefault(); e.stopPropagation();

			removeItem("sessionID", '/', 'samskrive.uninett.no');
			removeItem("express_sid", '/', 'samskrive.uninett.no');
			removeItem("token", '/', 'samskrive.uninett.no');
			console.error("Logging out");

			setTimeout(function() {
				window.location.href = 'https://auth.feideconnect.no/logout';
			}, 100);
			


		});



	});


	



	//Return the module value
	return function () {};
});