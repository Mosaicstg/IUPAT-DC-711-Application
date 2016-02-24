"use strict";
function Calendar() {
}

Calendar.prototype.createCalendar = function (calendarName, successCallback, errorCallback) {
	cordova.exec( successCallback, errorCallback, "Calendar", "createCalendar", [calendarName] );
};

Calendar.prototype.deleteCalendar = function (calendarName, successCallback, errorCallback) {
	cordova.exec( successCallback, errorCallback, "Calendar", "deleteCalendar", [calendarName] );
};

Calendar.prototype.createEvent = function (title, location, notes, startDate, endDate, successCallback, errorCallback) {
	cordova.exec( successCallback, errorCallback, "Calendar", "createEvent", [title, location, notes, startDate.getTime(), endDate.getTime()] );
};

Calendar.prototype.createEventInNamedCalendar = function (title, location, notes, startDate, endDate, calendarName, successCallback, errorCallback) {
	cordova.exec( successCallback, errorCallback, "Calendar", "createEventInNamedCalendar", [title, location, notes, startDate.getTime(), endDate.getTime(), calendarName] );
};

Calendar.prototype.deleteEvent = function (title, location, notes, startDate, endDate, successCallback, errorCallback) {
	cordova.exec( successCallback, errorCallback, "Calendar", "deleteEvent", [title, location, notes, startDate.getTime(), endDate.getTime()] );
};

Calendar.prototype.deleteEventFromNamedCalendar = function (title, location, notes, startDate, endDate, calendarName, successCallback, errorCallback) {
	cordova.exec( successCallback, errorCallback, "Calendar", "deleteEventFromNamedCalendar", [title, location, notes, startDate.getTime(), endDate.getTime(), calendarName] );
};

Calendar.prototype.findEvent = function (title, location, notes, startDate, endDate, successCallback, errorCallback) {
	cordova.exec( successCallback, errorCallback, "Calendar", "findEvent", [title, location, notes, startDate.getTime(), endDate.getTime()] );
};

Calendar.prototype.findAllEventsInNamedCalendar = function (calendarName, successCallback, errorCallback) {
	cordova.exec( successCallback, errorCallback, "Calendar", "findAllEventsInNamedCalendar", [calendarName] );
};

Calendar.prototype.modifyEvent = function (title, location, notes, startDate, endDate, newTitle, newLocation, newNotes, newStartDate, newEndDate, successCallback, errorCallback) {
	cordova.exec( successCallback, errorCallback, "Calendar", "modifyEvent", [title, location, notes, startDate.getTime(), endDate.getTime(), newTitle, newLocation, newNotes, newStartDate.getTime(), newEndDate.getTime()] );
};

Calendar.prototype.modifyEventInNamedCalendar = function (title, location, notes, startDate, endDate, newTitle, newLocation, newNotes, newStartDate, newEndDate, calendarName, successCallback, errorCallback) {
	cordova.exec( successCallback, errorCallback, "Calendar", "modifyEventInNamedCalendar", [title, location, notes, startDate.getTime(), endDate.getTime(), newTitle, newLocation, newNotes, newStartDate.getTime(), newEndDate.getTime(), calendarName] );
};

Calendar.install = function () {
	if ( ! window.plugins ) {
		window.plugins = {};
	}

	window.plugins.calendar = new Calendar();
	return window.plugins.calendar;
};

cordova.addConstructor( Calendar.install );

var DEBUG_MODE = '#page';

var localCalendarData = {};


var DATE_FORMAT_GOOGLE = 'YYYY-MM-DD';
var DATE_FORMAT_FULL = 'MM/DD/YY hh:mm';
var DATE_FORMAT_NO_TIME = 'MM/DD/YY';
var DATE_FORMAT_TIME_ONLY = 'hh:mm';

function updateCalendar(force) {

	// The
	var calendarUrl = 'https://www.googleapis.com/calendar/v3/calendars/';
	var apiKey = 'AIzaSyBkHBzqdml1_-nwXw0Axq-c1XM9ukmJCD8';
	/**
	 * List of all calendars that should be loaded.
	 * Structure as follows:
	 *
	 * calendars = {
	 *     // name = the "arbitrary" name / identifier of the calendar, internal use only
	 *     name: {
	 *      id: 'the-google-id-of-the-calendar-to-load',
	 *      elem: 'the css / jQuery selector of the element to load the data into'
	 *      },
	 *     // additional calendars, following structure above
	 * }
	 */
	var calendars = {
		core: {
			id: 'core@dc711.net',
			elem: '#core [data-role="content"]'
		},
		picket: {
			id: 'picket@dc711.net',
			elem: '#picket [data-role="content"]'
		},
		training: {
			id: 'calendar@dc711.net',
			elem: '#training [data-role="content"]'
		}
	};

	var getData = {
		key: apiKey,
		// This ensures future-dated items only
		timeMin: new Date().toISOString(),
		// This is how many to view in the app TOTAL
		maxResults: 15
	};

	var calendarCallback = function(elem, key) {
		return function(data) {
			var calendarKey = 'calendar:' + key;
			storage.save(calendarKey, data.items);
			outputCalendarEvents( data.items, elem, key );
		}
	}

	for ( var key in calendars ) {
		var calendarKey = 'calendar:' + key;
		var elem = calendars[key].elem;
		if ( force || storage.isStale( calendarKey, '2 hours' ) ) {
			var url = calendarUrl + calendars[key].id + '/events';
			$.ajax( {
				type: "GET",
				data: getData,
				url: url,
				error: function (jqXHR, textStatus, errorThrown) {
					doLog( jqXHR );
					doLog( textStatus );
					doLog( errorThrown );
				},
				success: calendarCallback(elem, key)
			} );
		} else {
			var data = storage.get(calendarKey);
			outputCalendarEvents( storage.get( calendarKey ), elem, key );
		}
	}
}


function outputCalendarEvents(data, elem, key) {
	data = data.items || data;
	elem = $( elem );
	// Remove all existing items from the DOM
	elem.find('p[data-event-id]' ).remove();
	// Loop over the refreshed / new items to display
	$.each( data, function (k, n) {
		console.log(k, n);
		var start = n.start;
		var end = n.end;
		var dateDisplay = formatDates(start, end);
		start = moment( getDate(start), DATE_FORMAT_GOOGLE );
		end = moment( getDate(end), DATE_FORMAT_GOOGLE );
		var html = '<div data-event-id="' + k + '" data-event-key="' + key + '">' +
				'<span class="date">' + dateDisplay + '</span>' +
				'<span class="display-name">' + (n.displayName || n.summary) + '</span>' +
				'<p class="details">' +
						'<span class="start-date">' + start.format(DATE_FORMAT_FULL) + '</span>' +
						'<span class="end-date">' + end.format(DATE_FORMAT_FULL) + '</span>' +
						'<span class="summary">' + n.summary + '</span>' +
						'<a href="javascript:void(0);" class="add_calendar_event">+ Add Event</a></div>';
				'</p>' +
		elem.append( html );
	} );
}

function getDate(d) {
	return (d.hasOwnProperty('date')) ? d.date : d.dateTime;
}

function formatDates(start, end) {
	var dateDisplay;
	// These are "all day" events. Should end up like "01/01/2016" or "01/01/2016 - 01/03/2016"
	if ( start.hasOwnProperty( 'date' ) ) {
		start = moment( start.date, DATE_FORMAT_GOOGLE );
		end = moment( end.date, DATE_FORMAT_GOOGLE );
		dateDisplay = start.format( DATE_FORMAT_NO_TIME ) + ' - ' + end.format( DATE_FORMAT_NO_TIME );
		if ( ! end.isAfter( start, 'day' ) ) {
			dateDisplay = start.format( DATE_FORMAT_NO_TIME );
		}
		// These are events with the specific times.  Should end up like "01/01/2016 12:30-1:30" or "01/01/2016 12:30-01/02/2016 6:30"
	} else if ( start.hasOwnProperty( 'dateTime' ) ) {
		start = moment( start.dateTime );
		end = moment( end.dateTime );

		if ( end.isAfter( start, 'day' ) ) {
			dateDisplay = start.format( DATE_FORMAT_FULL ) + ' - ' + end.format( DATE_FORMAT_FULL );
		} else {
			dateDisplay = start.format( DATE_FORMAT_FULL ) + ' - ' + end.format( DATE_FORMAT_TIME_ONLY );
		}
	}

	return dateDisplay;
}

function addEvent(elem) {
	/**
	 * SAMPLE EVENT OBJECT:
	 *
	 * Object
	 created: "2015-07-09T15:16:03.000Z"
	 creator: Object
	 displayName: "Picket Duty"
	 email: "picket@dc711.net"
	 self: true
	 __proto__: Object
	 end: Object
	 date: "2015-07-06"
	 __proto__: Object
	 etag: ""2872909926392000""
	 htmlLink: "https://www.google.com/calendar/event?eid=N3JmZG12dDFrNGNndDMxazkxcGU0b20waXMgcGlja2V0QGRjNzExLm5ldA"
	 iCalUID: "7rfdmvt1k4cgt31k91pe4om0is@google.com"
	 id: "7rfdmvt1k4cgt31k91pe4om0is"
	 kind: "calendar#event"
	 organizer: Object
	 displayName: "Picket Duty"
	 email: "picket@dc711.net"
	 self: true
	 __proto__: Object
	 sequence: 0
	 start: Object
	 date: "2015-07-05"
	 __proto__: Object
	 status: "confirmed"
	 summary: "Week 27"
	 transparency: "transparent"
	 updated: "2015-07-09T15:16:03.196Z"
	 */
	var event = elem.closest( '[data-event-id]' );
	var id = event.data( 'event-id' );
	var key = event.data( 'event-key' );
	var events = localCalendarData[key];
	var event = events[id];

	var startDate = getDateFromEvent( event.start );
	startDate = new Date( startDate );
	var endDate = getDateFromEvent( event.end );
	endDate = new Date( endDate );

	console.log( "Adding", event.displayName, '', event.summary, startDate, endDate );

	window.plugins.calendar.createEvent( event.displayName, '', event.summary, startDate, endDate, addEventSuccess, addEventError );
}

function getDateFromEvent(date) {
	return (date.hasOwnProperty( 'date' )) ? date.date : date.dateTime;
}


function addEventSuccess(message) {
	alert( message );
}

function addEventError(message) {
	alert( message );
}

var storage = (function () {

	function updatedKey(key) {
		return 'update:' + key;
	}

	function setSaveDate(key) {
		localStorage[updatedKey( key )] = new Date();
	}

	function getSaveDate(key) {
		return localStorage[updatedKey( key )];
	}

	function isDataStale(key, comparison) {
		if ( ! localStorage[key] || ! getSaveDate(key)) {
			return true;
		}

		if (localStorage[key] == '[]') {
			return true;
		}

		var updated = getSaveDate();
		updated = moment(updated);

		if (comparison.indexOf(' ') < 0) {
			comparison+= ' hours';
		}
		comparison = comparison.split(' ');
		var compare = moment().subtract(comparison[0], comparison[1]);

		return (updated.isBefore(compare)) ? true : false
	}

	return {
		get: function (key, def) {
			def = def || undefined;
			var data = localStorage[key];
			if ( ! data) {
				return def;
			}
			data = JSON.parse(data);
			return data;
		},
		save: function (key, data) {
			localStorage[key] = JSON.stringify(data);
			setSaveDate( key );
		},
		reset: function(key) {
			localStorage[key] = '';
		},
		getUpdated: function (key) {
			return getSaveDate( key );
		},
		isStale: function (key, comparison) {
			return isDataStale(key, comparison);
		}
	}
})();

function doLog(string) {
	if ( typeof string == 'object' ) {
		string = JSON.stringify( string, null, '   ' );
	}

	if ( DEBUG_MODE ) {
		if ( DEBUG_MODE !== true ) {
			$( DEBUG_MODE ).append( '<pre>' + string + '</pre>' );
		} else {
			console.log( string );
		}
	}
}


(function ($) {
	$( document ).on( 'click touchstart', 'a.add_calendar_event', function () {
		addEvent( $( this ) );
	} );

	$(document ).on('click touchstart', 'a.refresh_calendar', function() {
		updateCalendar(true);
	});

	$(document ).on('click touchstart', 'div[data-event-id]', function() {
		$(this ).find('.details' ).slideToggle();
	});

	updateCalendar();

})( jQuery );


