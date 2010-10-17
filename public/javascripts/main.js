var PREFIX = "artist";
var LINK_PREFIX = "link";
var EVENT_URL = "http://api.songkick.com/api/3.0/events.json?apikey=musichackdayboston&artists="; // swap this out
var isMobile; // mobile or web?
var position = new Object(); // holds the current location
var positionAquired = false;
var SORRY_MSG = "Sorry, no songs available for this artist";

$(document).ready(function(){
	isMobile = isMobileBrowser();
	
	$("#info").text("Aquiring location. Please wait...");
	
	getLocation();
});

function getPaddedDate() {
	var d = new Date();
	var month = zeroPad(d.getMonth() + 1 + "");
	var day = zeroPad(d.getDate() + "");
	
	var year = d.getFullYear();
	
	return year + "-" + month + "-" + day;
}

function zeroPad(numStr) {
	if (numStr.length < 2) {
		numStr = "0" + numStr;
	}
	
	return numStr;
}

function getShows() {
	var name = escape( $("#bandName").val() );
	//var url = EVENT_URL + name + "&min_date=" + getPaddedDate() + "&max_date=" + getPaddedDate() + "&jsoncallback=?";
	var url = "/shows/search?artist_name=" + name + "&latitude=" + position.latitude + "&longitude=" + position.longitude;
	
	if (!positionAquired) {
		return;
	}
	
	if (position.latitude == undefined ||
		position.longitude == undefined) {
			$("#info").html("<p>Can't detect location. Please allow your browser to send your location.</p>");
			return;
		}
	
	if (!name) {
		$("#info").html("<p>Who are you searching for? Please enter an artist!</p>");
		return;
	}
	
	
	// position.latitude, position.longitude
	
	
	$("#searching").html("<p>Searching <img src='images/loading_bar.gif' style='margin-left: 10px;'/></p>");
	
	$("#info").html("");
	$("#headline").html("");
	$("#support").html("");
	$("#showDate").text("");
	
	$('#info').ajaxError(function() {
		$(this).text('Search failed. Please try again later.');
		$("#searching").html("");
		
	});
	
	$.getJSON(url,
	  function(data) {
		
		if (!getTonightsShow(data)) {
			$("<p>No " + $("#bandName").val() + " shows tonight!</p>").appendTo("#info");
			return;
		}
		
		getArtists(data);
		
	  });
}

function getTonightsShow(data) {
	//console.log(data);
//	return;
	
	//var e = data.resultsPage.results.event;
	var e = data;
	
	if( e["start"].date !== getPaddedDate() ) {
		$("#showDate").text("No show in your area tonight! The next performance in your area is " + getPaddedDate());
	}
	
	// get the first event (assuming that artist will not perform more than once per night)
	if (e == undefined) {
		return false;
	}
	
	//var e = e[0];
	
	$("<p>Link: <a href='" + e.uri + "' target='_blank'>" + e.displayName + "</a></p>").appendTo("#info");
	
	return true;
}

function getArtists(data) {
	var openers = new Array();
	//var e = data.resultsPage.results.event[0];
	var e = data;
	
	$("<p><h3>Support Acts:</h3></p>").appendTo("#support");
	$("<p><h3>Headlining Acts:</h3></p>").appendTo("#headline");
	
	$(e.performance).each(function(index) {
		var pid = PREFIX + index;
		var str = "<p id=" + pid + "><span class='title'>" + this.artist.displayName + "</span>";
		
		if (this.artist.identifier[0]) {
			var mbid = this.artist.identifier[0].mbid;
			getAudio(mbid, pid);
			
			str += "<img id='loadingBar' src='images/loading_circle.gif'/>";
		} else {
			str += "<ul><li>" + SORRY_MSG + "</li></ul>";
		}
		
		str += "</p>";
		
		if (this.billing == "support") {
			$(str).appendTo("#support");
		} else {
			$(str).appendTo("#headline");
		}
	});
	
	$("#searching").html("");
}

// music brainz id and paragraph id to append to
function getAudio(mbid, pid) {
	var AUDIO_URL = '/artists/' + mbid + '/songs.json';
	
	// todo: add error checking to request
	
	$.getJSON(AUDIO_URL,
	  function(data) {
		var html = "<ul>";
		
		$(data).each(function(index) {
			var id = LINK_PREFIX + pid + index;
			
			if(isMobile) {
				html += "<li id='" + id + "'><a href='" + this.tracks[0].preview_url + "')\">" + this.title + "</a></li>";
			} else {
				html += "<li id='" + id + "'><a href='#' onClick=\"javascript: addPlayerTo('" + id + "','" + this.tracks[0].preview_url + "')\">" + this.title + "</a></li>";
			}
			
		});
		
		// check for no songs
		if (data.length == 0) {
			html += "<li>" + SORRY_MSG + "</li>";
		}
		
		html += "</ul>";
		
		$(html).insertAfter("#"+pid);
		
		$("#loadingBar").remove();
	  });
}

function isMobileBrowser() {
	var uagent = navigator.userAgent.toLowerCase();
	var mobiles = ["iphone", "ipad", "android", "windows ce", "blackberry", "symbian", "palm"];
	
	for (var i = 0; i < mobiles.length; i++) {
		if(uagent.indexOf(mobiles[i]) > -1) {
			return true;
		}
	}
	
	return false;
}

function playAudio(url) {	
	var player = "<p><audio controls preload='auto' autobuffer><source src='" + url + "'/></audio>";
	var close = "<a href='#' onClick='javascript: closePlayer()'>X</a></p>"
	
	$("#audioPlayer").html(player + close);
	
	//console.log("playing " + url + "...");
}

function closePlayer() {
	$("#audioPlayer").html("");
}

var jp = "<div id='playerContainer'><div id='jquery_jplayer'></div><div class='jp-single-player'><div class='jp-interface'><ul class='jp-controls'><li><a href='#' id='jplayer_play' class='jp-play' tabindex='1'>play</a></li><li><a href='#' id='jplayer_pause' class='jp-pause' tabindex='1'>pause</a></li><li><a href='#' id='jplayer_stop' class='jp-stop' tabindex='1'>stop</a></li><li><a href='#' id='jplayer_volume_min' class='jp-volume-min' tabindex='1'>min volume</a></li><li><a href='#' id='jplayer_volume_max' class='jp-volume-max' tabindex='1'>max volume</a></li></ul><div class='jp-progress'><div id='jplayer_load_bar' class='jp-load-bar'><div id='jplayer_play_bar' class='jp-play-bar'></div></div></div><div id='jplayer_volume_bar' class='jp-volume-bar'><div id='jplayer_volume_bar_value' class='jp-volume-bar-value'></div></div><div id='jplayer_play_time' class='jp-play-time'></div><div id='jplayer_total_time' class='jp-total-time'></div></div></div></div>";

function addPlayerTo(elemId, url) {
	// delete the player from the current element if it exists
	if ($("#playerContainer")) {
		$("#playerContainer").remove();
	}
	
	// Add jPlayer after link
	$(jp).appendTo("#"+elemId);
	
	
	// Local copy of jQuery selectors, for performance.
	var jpPlayTime = $("#jplayer_play_time");
	var jpTotalTime = $("#jplayer_total_time");

	$("#jquery_jplayer").jPlayer({
		ready: function () {
			this.element.jPlayer("setFile", url).jPlayer("play");
		},
		volume: 50
	})
	.jPlayer("onProgressChange", function(loadPercent, playedPercentRelative, playedPercentAbsolute, playedTime, totalTime) {
		jpPlayTime.text($.jPlayer.convertTime(playedTime));
		jpTotalTime.text($.jPlayer.convertTime(totalTime));
	})
	.jPlayer("onSoundComplete", function() {
		this.element.jPlayer("play");
	});
}

// geo location shit
function getLocation() {
	if(geo_position_js.init()){
		geo_position_js.getCurrentPosition(success_callback,error_callback,{enableHighAccuracy:true,options:5000});
	}
	else{
		console.log("Functionality not available");
	}
}

function success_callback(p) {
	position.latitude = p.coords.latitude.toFixed(2);
	position.longitude = p.coords.longitude.toFixed(2);
	positionAquired = true;
	
	$("#info").text("");
}

function error_callback(p) {
	console.log('error='+p.message);
}
