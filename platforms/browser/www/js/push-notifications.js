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
