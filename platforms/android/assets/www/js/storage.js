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


