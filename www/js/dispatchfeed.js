jQuery(function($) {
	
	$.ajax({
		type: "GET",
		url: 'http://dc711.net/api/get_page/?slug=drywall-finishers-dispatch-list',
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
			$('#drywall-finishers-dispatch-list_feed').append(html);
		}
	});
	
	$.ajax({
		type: "GET",
		url: 'http://dc711.net/api/get_page/?slug=glaziers-dispatch-list',
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
			$('#glaziers-dispatch-list_feed').append(html);
		}
	});
	
	$.ajax({
		type: "GET",
		url: 'http://dc711.net/api/get_page/?slug=commercial-painters-dispatch-list',
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
			$('#commercial-painters-dispatch-list_feed').append(html);
		}
	});
	
	$.ajax({
		type: "GET",
		url: 'http://dc711.net/api/get_page/?slug=industrial-painters-dispatch-list',
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
			$('#industrial-painters-dispatch-list_feed').append(html);
		}
	});
	
});