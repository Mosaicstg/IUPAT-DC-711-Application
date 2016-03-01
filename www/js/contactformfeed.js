jQuery(function($) {
	
	$.ajax({
		type: "GET",
		url: 'http://dc711.net/api/get_page/?slug=contact-us',
		dataType: 'jsonp',
		error: function(){
			alert( 'Unable to load feed, Incorrect path or invalid feed' );
		},
		success: function(data) {
			// light validation that there is data, and there are posts in the data
			if ( ! data || ! data.hasOwnProperty('page') ) {
				alert("No data!");
				return;
			}
			var html = '';
			if ( data.page.hasOwnProperty('content') ) {
				html += '<div>' + data.page.content + '</div>';
			}
			$('#contact-form_feed').append(html);
		}
	});
	
});