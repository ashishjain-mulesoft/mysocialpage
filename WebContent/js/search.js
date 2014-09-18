function handleAPILoaded() {
	$('#search-button').attr('disabled', false);
}

// Search for a specified string.
function search() {

	var q = $('#query').val();

	jQuery
			.ajax({
				type : "GET",
				url : "/myfirstmashup/search?keyword=" + q,
				async : false,
				dataType : 'json',
				success : function(response) {
					var content = '<div class="row">';
					var i;
					for (i = 1; i <= response.length; i++) {
						var c = i - 1;
						content = content
								+ '<div class="col-xs-3"><div class="panel panel-primary">'
						content = content
								+ '<div class="panel-heading"><h3 class="panel-title">'
								+ response[c].title + '</h3></div>'
						content = content + '<div class="panel-body">';
						content = content + '<img src="' + response[c].url
								+ '"> &nbsp;';
						content = content+'<div class="btn-group-vertical">';
						content = content
								+ '<a href="#" class="btn btn-primary btn-xs"  onclick=openVideo("'
								+ response[c].videoId
								+ '")>Launch video</a>'
						content = content
								+ '<a href="#" class="btn btn-primary btn-xs"  onclick=tweetthis("'
								+ response[c].videoId
								+ '")>Tweet This</a>';
						content = content
								+ '<a href="#" class="btn btn-primary btn-xs"  onclick=setMainSmsUrl("'
								+ response[c].videoId
								+ '")>SMS</a>';
						
						content = content
								+ '</div></div></div></div>';
						if (i % 4 == 0) {
							content = content + '</div>';
							content = content + '<div class="row">';
						}
					}
					content = content + '</div>';
					jQuery('#content').html(content);
				},
				error : function(response) {

				}
			});
}

function openVideo(id) {
	jQuery('#ytapiplayer').html();
	jQuery('#myModal').modal('show');
	var videoUrl = 'http://www.youtube.com/v/' + id
			+ '?enablejsapi=1&playerapiid=ytplayer&version=3';
	var vidWidth = 560; // default
	var vidHeight = 315; // default
	if ($(this).attr('data-width')) {
		vidWidth = parseInt($(this).attr('data-width'));
	}
	if ($(this).attr('data-height')) {
		vidHeight = parseInt($(this).attr('data-height'));
	}
	var iFrameCode = '<iframe width="'
			+ vidWidth
			+ '" height="'
			+ vidHeight
			+ '" scrolling="no" allowtransparency="true" allowfullscreen="true" src="'
			+ videoUrl + '" frameborder="0"></iframe>';

	// Replace Modal HTML with iFrame Embed
	$('#mediaModal .modal-body').html(iFrameCode);
	// Set new width of modal window, based on dynamic video content
	$('#mediaModal').on(
			'show.bs.modal',
			function() {
				// Add video width to left and right padding, to get new width
				// of modal window
				var modalBody = $(this).find('.modal-body');
				var modalDialog = $(this).find('.modal-dialog');
				var newModalWidth = vidWidth
						+ parseInt(modalBody.css("padding-left"))
						+ parseInt(modalBody.css("padding-right"));
				newModalWidth += parseInt(modalDialog.css("padding-left"))
						+ parseInt(modalDialog.css("padding-right"));
				newModalWidth += 'px';
				// Set width of modal (Bootstrap 3.0)
				$(this).find('.modal-dialog').css('width', newModalWidth);
			});

	// Open Modal
	$('#mediaModal').modal();
	swfobject.embedSWF(videoUrl, "ytapiplayer", "425", "356", "8", null, null,
			params, atts);
}

function tweetthis(id) {
	var videoUrl = 'http://www.youtube.com/v/' + id
			+ '?enablejsapi=1&playerapiid=ytplayer&version=3';
	jQuery.ajax({
		type : "POST",
		url : "/myfirstmashup/tweetvideo",
		async : false,
		data : {
			url : videoUrl
		},
		dataType : 'json',
		success : function(response) {

		},
		error : function(response) {

		}
	});
}
var mainSmsUrl;

function setMainSmsUrl(id) {
	jQuery('#smsModal').modal('show');
	mainSmsUrl = 'http://www.youtube.com/v/' + id
			+ '?enablejsapi=1&playerapiid=ytplayer&version=3';
}
function smsvideo() {

	var smsnumber = jQuery('#smsnumber').val();
	jQuery.ajax({
		type : "POST",
		url : "/myfirstmashup/smsvideo",
		async : false,
		data : {
			url : mainSmsUrl,
			number : smsnumber
		},
		dataType : 'json',
		success : function(response) {

		},
		error : function(response) {

		}
	});

	$("#smsDialog").dialog({
		modal : true,
		title : "SMS Video",
		width : 'auto',
		height : '300',
		buttons : {
			"Send" : function() {
			},
			"Cancel" : function() {
				$(this).dialog("close");
			}
		}
	});
}