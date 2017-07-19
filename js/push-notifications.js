document.addEventListener( 'deviceready', prepareToRegister, false );

function prepareToRegister() {
	var push = false;
	// from http://phonegappro.com/tutorials/apache-cordova-phonegap-push-notification-tutorial-part-2/
	try {
		push = PushNotification.init(
			{
				"android": {
					"senderID": "720859137196"
				},
				"ios": {
					"alert": "true",
					"badge": "true",
					"sound": "true",
					"clearBadge": "true"
				},
				"windows": {}
			}
		);
	} catch ( error ) {
		alert( error );
	}

	if (push) {
		push.on( 'registration', function (data) {
			$( "#gcm_id" ).html( data.registrationId );
			register(data);
		} );

		push.on( 'notification', function (data) {
			alert( data.title + " Message: " + data.message );
			// data.message,
			// data.title,
			// data.count,
			// data.sound,
			// data.image,
			// data.additionalData
		} );

		push.on( 'error', function (e) {
			console.log( 'Push Error:', e.message );
		} );
	}
}

function register(pushData) {
	var pushRegistrationUrl = 'http://dc711.net/pnfw/register/';

	// Set defaults
	var data = {
		token: 'tokenless_' + Date.now(),
		os: 'iOS',
		lang: 'en'
	};

	// IF we are getting legit registration info, then use it
	if ( pushData && pushData.registrationId ) {
		data.token = pushData.registrationId;
	}
	
	// If we are getting legit device info, use it
	if (device && device.platform) {
		data.os = device.platform;
	}

	// If the OS is not supported (by the WP plugin), then get out.
	if ( data.os != 'iOS' && data.os != 'Android' ) {
		console.log( "Unknown / unsupported OS type:", data.os );
		return;
	}

	// Attempt to make the "registration"
	// Because this is cross-origin, we don't have any success / error handlers.
	$.post( pushRegistrationUrl, data );
}
