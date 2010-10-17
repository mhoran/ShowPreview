var HORAN = "http://10.10.11.27:3000/artists/";
var PREFIX = "artist"
var JSON_PATH = "http://localhost:8888/ShowPlannr/public/test.json"
var baseUrl = "http://api.songkick.com/api/3.0/events.json?apikey=musichackdayboston&artists=";

$(document).ready(function() {
	
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
	var url = baseUrl + name + "&min_date=" + getPaddedDate() + "&max_date=" + getPaddedDate() + "&jsoncallback=?";
	
	// add in geolocation
	$("#info").html("<p>Searching <img src='images/loading_bar.gif' style='margin-left: 10px;'/></p>");
	
	$.getJSON(url,
	  function(data) {
		
		$("#info").html("");
		$("#headline").html("");
		$("#support").html("");
		
		if (!getTonightsShow(data)) {
			return;
		}
		
		getOpeners(data);
		
	  });
}

function getTonightsShow(data) {
	// get the first event (assuming that artist will not perform more than once per night)
	var e = data.resultsPage.results.event;
	
	if (!e) {
		$("<p>No shows tonight!</p>").appendTo("#info");
		return false;
	}
	
	$("<p>Link: <a href='" + this.uri + "' target='_blank'>" + e[0].displayName + "</a></p>").appendTo("#info");
	
	return true;
}

function getOpeners(data) {
	var openers = new Array();
	var e = data.resultsPage.results.event[0];
	
	$("<p><h3>Support Acts:</h3></p>").appendTo("#support");
	$("<p><h3>Headlining Acts:</h3></p>").appendTo("#headline");
	
	$(e.performance).each(function(index) {
		var pid = PREFIX + index;
		var str = "<p id=" + pid + "><span class='title'>" + this.artist.displayName + "</span>";
		
		if (this.artist.identifier[0]) {
			var mbid = this.artist.identifier[0].mbid;
			
			getAudio(mbid, pid);
		} else {
			str += " -- No Musicbrainz ID. Sorry.";
		}
		
		str += "</p>";
		
		if (this.billing == "support") {
			$(str).appendTo("#support");
		} else {
			$(str).appendTo("#headline");
		}
	});
	
	// pass musicbrainz artist id
}

// music brainz id and paragraph id to append to
function getAudio(mbid, pid) {
	//var url = HORAN + mbid;
	var url = JSON_PATH;
	
	$.getJSON(url,
	  function(data) {
		var html = "<ul>";
		
		$(data).each(function(index) {
			html += "<li><a href='#' onClick='javascript: playAudio(\"" + this.url + "\")'>" + this.title + "</a></li>";
		});
		
		html += "</ul>";
		
		$(html).insertAfter("#"+pid);
	  });
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