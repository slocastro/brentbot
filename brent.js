var jerk = require('jerk');
var twss = require('twss');
var request_builder = require('../common/request_builder').request_builder;
var options = require('./data').options;
var ms_api = require('./data').ms_api;
var ms_site = require('./data').ms_site;

//twss.algo = 'knn';
//twss.threshold = 0.3;

var last_photo_id = 0;

jerk(function(bot) {
	//bot.watch_for(/.*/, isThatWhatSheSaid);
	bot.watch_for(/.*brent.*/i, randomMobileSushiComment);
	
	bot.watch_for(/^!context.*/i, getContext);
}).connect(options);

function isThatWhatSheSaid(message) {
	if (twss.is(message.text.toString()))
		message.say("That's what she said!");
}

function randomMobileSushiComment(message) {
	var random_comment_options = { host: ms_api.host, path: ms_api.random_path, port: 80, headers: { 'accept-encoding': 'gzip,deflate' } };
	//console.log(random_comment_options);

	request_builder(random_comment_options, function(response) {
		console.log(response);
		var random_comment_results = JSON.parse(response);

		if (random_comment_results[0].comment != null) {
			message.say(random_comment_results[0].comment);
			last_photo_id = random_comment_results[0].photo_id;
		}

	}).end();
}

function getContext(message) {
	if (last_photo_id > 0)
		message.say(ms_site.photo_base_url + last_photo_id);
}
