var $, jQuery;
var $ = require('ep_etherpad-lite/static/js/rjquery').$;
// var _ = require('ep_etherpad-lite/static/js/underscore');
// var alignClass = 'align';
// var cssFiles = ['ep_align/static/css/editor.css'];

// // All our tags are block elements, so we just return them.
// var tags = ['left', 'center', 'right', 'justify'];
// var aceRegisterBlockElements = function(){
//   return tags;
// }


var postAceInit = function(hook_name, context){

	$(document).ready(function() {

		$("#chaticon").hide();
		$("#titlecross").hide();
		$("#titlesticky").hide();

		$("#users").show();

		var t = '<div id="poweredByConnect"><span class="pbcd"></span>Powered by <strong>Feide / Connect</strong></div>';
		// var t2 = '<div id="poweredByConnect2"><img style="height: 32px; float:" src="http://developers.feideconnect.no/bower_components/uninett-theme/images/UNINETT_logo.svg" /></div>';

		$("ul.menu_left").append(t); // .append(t2);


	});


}




exports.postAceInit = postAceInit;




