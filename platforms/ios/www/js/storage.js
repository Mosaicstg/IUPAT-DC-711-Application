/**
 * Convenience class for implementing / accessing local storage, available
 * in browsers supporting HTML5
 *
 * @type {{get, save, reset, getUpdated, isStale}}
 */
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
		if ( ! localStorage[key] || ! getSaveDate( key ) ) {
			return true;
		}

		if ( localStorage[key] == '[]' ) {
			return true;
		}

		var updated = getSaveDate();
		updated = moment( updated );

		if ( comparison.indexOf( ' ' ) < 0 ) {
			comparison += ' hours';
		}
		comparison = comparison.split( ' ' );
		var compare = moment().subtract( comparison[0], comparison[1] );

		return (updated.isBefore( compare )) ? true : false
	}

	return {
		get: function (key, def) {
			def = def || undefined;
			var data = localStorage[key];
			if ( ! data ) {
				return def;
			}
			data = JSON.parse( data );
			return data;
		},
		save: function (key, data) {
			localStorage[key] = JSON.stringify( data );
			setSaveDate( key );
		},
		reset: function (key) {
			localStorage[key] = '';
		},
		getUpdated: function (key) {
			return getSaveDate( key );
		},
		isStale: function (key, comparison) {
			return isDataStale( key, comparison );
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


/**
 * TESTING AREA FOR PUSH NOTIFICATION REGISTRATIONS
 */

document.addEventListener( 'deviceready', prepareToRegister, false );
function prepareToRegister() {
	var pushRegistrationUrl = 'http://dc711.net/pnfw/register/';

	// Set defaults
	var data = {
		token: 'tokenless_' + Date.now(),
		os: 'iOS',
		lang: 'en'
	};

	//console.log( "temp data", data );

	// IF we are getting legit "device" info, then use it
	if ( device && device.uuid && device.platform ) {
		data.token = device.uuid;
		data.os = device.platform;
	}

	//console.log( "real data", data );

	// If the OS is not supported (by the WP plugin), then get out.
	if ( data.os != 'iOS' && data.os != 'Android' ) {
		console.log( "Unknown / unsupported OS type:", data.os );
		return;
	}

	// Attempt to make the "registration"
	// Because this is cross-origin, we don't have any success / error handlers.
	$.post( pushRegistrationUrl, data );
}

